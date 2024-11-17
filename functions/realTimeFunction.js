const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.matchRealTimeRequests = functions.firestore
  .document("realTimeRequest/{docId}")
  .onCreate(async (snap, context) => {
    try {
      // Step 1: 새로 추가된 요청 데이터 가져오기
      const newRequest = snap.data();
      console.log("New real-time request added:", newRequest);

      // Step 2: 동일한 조건의 기존 요청 데이터 가져오기
      const snapshot = await db.collection("realTimeRequest").get();
      const requests = snapshot.docs.map(doc => ({
        id: doc.id, // 문서 ID
        ...doc.data(),
      }));

      // Step 3: 조건 일치 확인 및 매칭 로직
      const matchedGroup = [newRequest];
      for (const request of requests) {
        if (
          request.destination === newRequest.destination &&
          request.reservationTime === newRequest.reservationTime &&
          matchedGroup.reduce((sum, req) => sum + req.groupSize, 0) + request.groupSize <= 4
        ) {
          matchedGroup.push(request);
        }
      }

      // Step 4: 매칭된 그룹이 조건을 충족하면 schedule에 추가
      if (matchedGroup.length > 1) {
        const scheduleData = {
          reservationTime: newRequest.reservationTime,
          destination: newRequest.destination,
          groupSize: matchedGroup.reduce((sum, req) => sum + req.groupSize, 0),
          userUIDs: matchedGroup.map(req => req.uid),
        };

        // Schedule 컬렉션에 저장
        await db.collection("schedule").add(scheduleData);

        // 매칭된 요청 삭제
        for (const req of matchedGroup) {
          await db.collection("realTimeRequest").doc(req.id).delete();
        }
        console.log("Matching completed and schedule saved:", scheduleData);
      } else {
        console.log("Not enough matching requests to form a group.");
      }
    } catch (error) {
      console.error("Error during matching process:", error);
    }
  });
