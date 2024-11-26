const admin = require("firebase-admin");
const db = admin.firestore(); // Use the Firestore instance from initialized admin

// FCM 토큰 조회 함수
async function getFcmTokens(userIds) {
  const tokens = [];
  for (const userId of userIds) {
    const tokenDoc = await db.collection("userTokens").doc(userId).get();
    if (tokenDoc.exists) {
      tokens.push(tokenDoc.data().token);
    }
  }
  return tokens;
}

// FCM 알림 전송 함수
async function sendFcmNotification(group) {
  const tokens = await getFcmTokens(group.users);

  if (tokens.length === 0) {
    console.log("No FCM tokens found for the group.");
    return;
  }

  const message = {
    notification: {
      title: "매칭 완료",
      body: `${group.destination}로 가는 합승이 매칭되었습니다.`,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message); // Use admin.messaging()
    console.log(`Successfully sent notifications:`, response);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

module.exports = { getFcmTokens, sendFcmNotification };
