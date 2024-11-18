const functions = require("firebase-functions/v2"); // v2 버전
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid"); // UUID 사용을 위해 추가 설치 필요: npm install uuid

// Firebase Admin 초기화
admin.initializeApp();
const db = admin.firestore();

// 일자별 예약 처리 함수
exports.handleDayTimeRequest = functions.firestore.onDocumentWritten(
  "dayTimeRequest/{docId}",
  async (event) => {
    const docId = event.params.docId; // 변경된 문서 ID
    const beforeData = event.data.before?.data(); // 이전 데이터
    const afterData = event.data.after?.data(); // 이후 데이터

    // 문서 삭제 처리
    if (!afterData) {
      console.log(`Document ${docId} was deleted.`);
      return;
    }

    // 문서 추가 또는 수정 처리
    if (!beforeData) {
      console.log(`New document added: ${docId}`);
    } else {
      console.log(`Document modified: ${docId}`);
    }

    try {
      // 매칭 로직 실행
      await matchDayUsers();
    } catch (error) {
      console.error("Error in matching day users:", error);
    }
  }
);

// 일자별 사용자 매칭 함수
async function matchDayUsers() {
  const dayTimeRequestRef = db.collection("dayTimeRequest");
  const snapshot = await dayTimeRequestRef.get();

  const requests = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    requests.push({ id: doc.id, ...data });
  });

  console.log("Fetched day requests:", requests);

  const groups = createDayMatchingGroups(requests);
  console.log("Matched day groups:", groups);

  await saveDayMatchedGroups(groups);
}

// 매칭 조건을 기반으로 그룹 생성
function createDayMatchingGroups(requests) {
  const groups = [];
  const groupedUsers = new Set();

  requests.forEach((request) => {
    console.log("Processing day request:", request);

    if (groupedUsers.has(request.id)) return;

    const matchedGroup = [request];
    requests.forEach((otherRequest) => {
      // 날짜와 시간 비교를 보완
      const requestDate = request.date;
      const otherRequestDate = otherRequest.date;

      const requestTime = new Date(request.time).getTime();
      const otherRequestTime = new Date(otherRequest.time).getTime();

      if (
        otherRequest.id !== request.id &&
        !groupedUsers.has(otherRequest.id) &&
        otherRequest.destination === request.destination &&
        requestDate === otherRequestDate && // 날짜 비교
        requestTime === otherRequestTime && // 시간 비교
        matchedGroup.length < parseInt(request.groupSize, 10)
      ) {
        matchedGroup.push(otherRequest);
      }
    });

    if (matchedGroup.length === parseInt(request.groupSize, 10)) {
      groups.push(matchedGroup);
      matchedGroup.forEach((user) => groupedUsers.add(user.id));
    }
  });

  console.log("Created day matching groups:", groups);
  return groups;
}

// 매칭된 그룹 Firestore에 저장 및 요청 삭제
async function saveDayMatchedGroups(groups) {
  const scheduleRef = db.collection("schedule");
  const dayTimeRequestRef = db.collection("dayTimeRequest");

  for (const group of groups) {
    const groupId = uuidv4(); // 고유 ID 생성

    const groupData = {
      groupId: groupId, // 그룹 ID
      users: group.map((user) => user.id), // 매칭된 사용자 UID
      destination: group[0].destination, // 목적지
      date: group[0].date, // 예약 날짜
      time: group[0].time, // 합승 시간
      groupSize: group.length, // 그룹 크기
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // 생성 시간
    };

    try {
      // 디버깅: Firestore에 저장하기 전에 데이터 출력
      console.log("Saving day groupData:", groupData);

      // Firestore에 그룹 데이터 저장
      await scheduleRef.doc(groupId).set(groupData);
      console.log(`Saved day group with ID ${groupId}:`, groupData);

      // 매칭된 사용자의 요청 삭제
      for (const user of group) {
        await dayTimeRequestRef.doc(user.id).delete();
        console.log(`Deleted day request for user ${user.id}`);
      }
    } catch (error) {
      console.error("Error saving day group or deleting day requests:", error);
    }
  }
}
