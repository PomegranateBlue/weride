const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// Firebase Admin SDK 초기화
admin.initializeApp();
const db = admin.firestore();

exports.matchRealTimeRequests = onDocumentCreated(
  "realTimeRequest/{docId}",
  async (event) => {
    try {
      const newRequest = event.data.data(); // 새로 추가된 데이터 가져오기
      console.log("New real-time request added:", newRequest);

      // Step 1: 모든 요청 데이터 가져오기
      const snapshot = await db.collection("realTimeRequest").get();
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Step 2: 매칭 로직
      const matchedGroup = [newRequest];
      for (const request of requests) {
        if (
          request.destination === newRequest.destination &&
          request.reservationTime === newRequest.reservationTime &&
          matchedGroup.reduce((sum, req) => sum + req.groupSize, 0) +
            request.groupSize <=
            4
        ) {
          matchedGroup.push(request);
        }
      }

      // Step 3: 매칭된 그룹 저장
      if (matchedGroup.length > 1) {
        const scheduleData = {
          reservationTime: newRequest.reservationTime,
          destination: newRequest.destination,
          groupSize: matchedGroup.reduce((sum, req) => sum + req.groupSize, 0),
          userUIDs: matchedGroup.map((req) => req.uid),
        };

        // Schedule 컬렉션에 저장
        const scheduleDocRef = db.collection("schedule").doc();
        await scheduleDocRef.set(scheduleData);

        // 매칭된 요청 삭제
        for (const req of matchedGroup) {
          await db.collection("realTimeRequest").doc(req.id).delete();
        }

        console.log("Matching completed and schedule saved:", scheduleData);
      } else {
        console.log("No sufficient matches found.");
      }
    } catch (error) {
      console.error("Error during matching process:", error);
    }
  }
);
