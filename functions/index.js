const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp();
const db = admin.firestore();

// 날짜 비교 함수: 연, 월, 일이 동일한지 확인
const isSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// 매칭된 사용자 그룹 생성 로직
function createMatchingGroups(requests, type) {
  const groups = [];
  const groupedUsers = new Set();

  requests.forEach((request) => {
    if (groupedUsers.has(request.uid)) return;

    const matchedGroup = [request];
    requests.forEach((otherRequest) => {
      // 시간 비교 함수: 시와 분만 일치 여부 확인
      const isTimeMatch = (time1, time2) => {
        const t1 = new Date(time1);
        const t2 = new Date(time2);
        return (
          t1.getHours() === t2.getHours() && t1.getMinutes() === t2.getMinutes()
        );
      };

      const isDateMatch =
        type === "dateSpecific"
          ? isSameDate(request.date, otherRequest.date) // 일자별 예약의 경우 날짜 확인
          : true;

      if (
        otherRequest.uid !== request.uid &&
        !groupedUsers.has(otherRequest.uid) &&
        otherRequest.destination === request.destination &&
        parseInt(otherRequest.groupSize, 10) ===
          parseInt(request.groupSize, 10) &&
        isTimeMatch(request.time, otherRequest.time) && // 시와 분만 비교
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

  console.log(`[${type}] Created matching groups:`, groups);
  return groups;
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
      console.log(`[${type}] Group ${groupId} saved to matchingSchedule.`);
      const deletePromises = group.map((user) =>
        db.collection("userRequest").doc(user.uid).delete()
      );
      await Promise.all(deletePromises);
      console.log(`[${type}] Requests for group ${groupId} deleted.`);
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

  console.log("[Real-Time] Fetched user requests:", requests);

  const groups = createMatchingGroups(requests, "realTime");
  await saveMatchedGroups(groups, "realTime");
}

// 일자별 예약 처리 함수
async function processDateSpecificMatching() {
  const requestsSnapshot = await db.collection("userRequest").get();
  const requests = [];
  requestsSnapshot.forEach((doc) => {
    requests.push({ uid: doc.id, ...doc.data() });
  });

  console.log("[Date-Specific] Fetched user requests:", requests);

  const groups = createMatchingGroups(requests, "dateSpecific");
  await saveMatchedGroups(groups, "dateSpecific");
}

// Cloud Function 트리거
exports.matchUsers = functions.firestore.onDocumentWritten(
  "userRequest/{userId}",
  async (event) => {
    const userId = event.params.userId;
    const afterData = event.data?.after?.data();

    if (!afterData) {
      console.log(`Request deleted for user: ${userId}`);
      return;
    }

    console.log(`New or updated request for user: ${userId}`, afterData);

    try {
      const type = afterData.type;

      if (type === "1") {
        console.log("Processing real-time reservation.");
        await processRealTimeMatching();
      } else if (type === "2") {
        console.log("Processing date-specific reservation.");
        await processDateSpecificMatching();
      } else {
        console.log(`Unknown type: ${type}`);
      }
    } catch (error) {
      console.error("Error during matching process:", error);
    }
  }
);
