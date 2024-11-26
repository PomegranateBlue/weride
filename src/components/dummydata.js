const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  connectFirestoreEmulator,
} = require("firebase/firestore");

const firebaseConfig = {
  projectId: "demo-project", // Emulator에서 사용할 프로젝트 ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);

const generateDummyData = async () => {
  const destinations = ["대신관 앞", "학교 운동장"];
  const groupSizes = [1, 2, 3, 4];
  const reservationTypes = ["1", "2"]; // 1: Real-Time, 2: Date-Specific
  const fixedDate = "2024-11-25T09:30:00";

  for (let i = 1; i <= 50; i++) {
    const type =
      reservationTypes[Math.floor(Math.random() * reservationTypes.length)];
    const data = {
      uid: `user${i}`,
      groupSize: groupSizes[Math.floor(Math.random() * groupSizes.length)],
      destination:
        destinations[Math.floor(Math.random() * destinations.length)],
      time: fixedDate,
      type,
      ...(type === "2" && { date: "2024-11-25" }), // 일자별 예약은 날짜 포함
    };

    await addDoc(collection(db, "userRequest"), data);
    console.log(`Dummy data ${i} added with type ${type}`);
  }

  console.log("50개의 더미 데이터가 성공적으로 추가되었습니다.");
};

generateDummyData();
