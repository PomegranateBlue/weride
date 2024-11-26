const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
//const { sendFcmNotification } = require("../src/components/fcmToken.js");
admin.initializeApp();
const db = admin.firestore();

// 날짜 비교 함수
const isSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// 매칭된 사용자 그룹 생성 로직 (기본 Greedy 알고리즘)
function createMatchingGroups(requests, type) {
  const groups = [];
  const groupedUsers = new Set();

  requests.forEach((request) => {
    if (groupedUsers.has(request.uid)) return;

    const matchedGroup = [request];
    requests.forEach((otherRequest) => {
      // 시간 비교 함수
      const isTimeMatch = (time1, time2) => {
        const t1 = new Date(time1);
        const t2 = new Date(time2);
        return (
          t1.getHours() === t2.getHours() && t1.getMinutes() === t2.getMinutes()
        );
      };

      const isDateMatch =
        type === "dateSpecific"
          ? isSameDate(request.date, otherRequest.date)
          : true;

      if (
        otherRequest.uid !== request.uid &&
        !groupedUsers.has(otherRequest.uid) &&
        otherRequest.destination === request.destination &&
        parseInt(otherRequest.groupSize, 10) ===
          parseInt(request.groupSize, 10) &&
        isTimeMatch(request.time, otherRequest.time) &&
        isDateMatch &&
        matchedGroup.length < parseInt(request.groupSize, 10)
      ) {
        matchedGroup.push(otherRequest);
      }
    });

    if (matchedGroup.length === parseInt(request.groupSize, 10)) {
      groups.push(matchedGroup);
      matchedGroup.forEach((user) => groupedUsers.add(user.uid));
    }
  });

  return groups;
}

// 거리 계산 함수 (클러스터 기반 매칭용)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// 클러스터 기반 매칭 알고리즘
function clusterByLocation(requests, eps, minPts) {
  const clusters = [];
  const visited = new Set();

  requests.forEach((request, idx) => {
    if (visited.has(idx)) return;

    const neighbors = findNeighbors(request, requests, eps);
    if (neighbors.length < minPts) {
      visited.add(idx); // 노이즈 처리
      return;
    }

    const cluster = [];
    expandCluster(idx, neighbors, requests, cluster, eps, minPts, visited);
    clusters.push(cluster);
  });

  return clusters;
}

// 이웃 찾기
function findNeighbors(request, requests, eps) {
  return requests.filter((otherRequest) => {
    const distance = calculateDistance(
      request.latitude,
      request.longitude,
      otherRequest.latitude,
      otherRequest.longitude
    );
    return distance <= eps && request.uid !== otherRequest.uid;
  });
}

// 클러스터 확장
function expandCluster(
  requestIdx,
  neighbors,
  requests,
  cluster,
  eps,
  minPts,
  visited
) {
  const queue = [...neighbors];
  visited.add(requestIdx);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!visited.has(current.uid)) {
      visited.add(current.uid);
      const newNeighbors = findNeighbors(current, requests, eps);

      if (newNeighbors.length >= minPts) {
        queue.push(...newNeighbors);
      }
    }

    if (!cluster.some((user) => user.uid === current.uid)) {
      cluster.push(current);
    }
  }
}

// 매칭된 그룹 저장 및 요청 삭제
async function saveMatchedGroups(groups, type) {
  const matchingRef = db.collection("matchingSchedule");

  for (const group of groups) {
    const groupId = uuidv4();
    const groupData = {
      groupId,
      destination: group[0].destination,
      groupSize: parseInt(group[0].groupSize, 10),
      time: group[0].time,
      type: group[0].type,
      users: group.map((user) => user.uid),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (type === "dateSpecific") {
      groupData.date = group[0].date; // 일자별 예약의 경우 날짜 추가
    }

    try {
      await matchingRef.doc(groupId).set(groupData);
      const deletePromises = group.map((user) =>
        db.collection("userRequest").doc(user.uid).delete()
      );
      await Promise.all(deletePromises);
      await sendFcmNotification(group);
    } catch (error) {
      console.error(`[${type}] Error saving group ${groupId}:`, error);
    }
  }
}

// 실시간 예약 처리 함수
async function processRealTimeMatching() {
  const requestsSnapshot = await db.collection("userRequest").get();
  const requests = [];
  requestsSnapshot.forEach((doc) => {
    requests.push({ uid: doc.id, ...doc.data() });
  });

  if (requests.length === 0) return;

  let groups;
  if (requests.length <= 50) {
    // 요청이 50개 이하이면 기존 Greedy 알고리즘 사용
    groups = createMatchingGroups(requests, "realTime");
  } else {
    // 요청이 50개 초과이면 클러스터 기반 알고리즘 사용
    groups = clusterByLocation(requests, 500, 3); // 500m 거리, 최소 3명
  }

  await saveMatchedGroups(groups, "realTime");
}

// 일자별 예약 처리 함수
async function processDateSpecificMatching() {
  const requestsSnapshot = await db.collection("userRequest").get();
  const requests = [];
  requestsSnapshot.forEach((doc) => {
    requests.push({ uid: doc.id, ...doc.data() });
  });

  const groups = createMatchingGroups(requests, "dateSpecific");
  await saveMatchedGroups(groups, "dateSpecific");
}

// Cloud Function 트리거
exports.matchUsers = functions.firestore.onDocumentWritten(
  "userRequest/{userId}",
  async (event) => {
    const afterData = event.data?.after?.data();

    if (!afterData) {
      console.log("Request deleted.");
      return;
    }

    try {
      const type = afterData.type;

      if (type === "1") {
        await processRealTimeMatching();
      } else if (type === "2") {
        await processDateSpecificMatching();
      }
    } catch (error) {
      console.error("Error during matching process:", error);
    }
  }
);
