import React, { useState } from "react";
import { firestoreDB } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";
import ReserveModal from "./ReserveModal";
import "../styles/dayTime.css";

const RealTimeComponent = () => {
  const { currentUser } = useAuth(); // 로그인한 사용자 정보
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [selectedDate, setSelectedDate] = useState(new Date()); // DatePicker로 선택한 날짜

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (reservationData) => {
    try {
      const userDocRef = doc(
        firestoreDB,
        "dayTimeRequest",
        currentUser.uid // UID를 문서 이름으로 사용
      );

      await setDoc(userDocRef, {
        ...reservationData,
        date: selectedDate.toISOString(), // DatePicker에서 선택한 날짜
        uid: currentUser.uid,
        createdAt: serverTimestamp(), // 서버 타임스탬프
      });

      console.log("Daytime reservation saved successfully");
      closeModal();
    } catch (error) {
      console.error("Error saving daytime reservation: ", error);
    }
  };

  return (
    <div className="daytime-container">
      <div className="daytime-content">
        <h1 className="componentTitle">일자별 예약</h1>
        <h2 className="componentInfo">원하는 예약 날짜와 조건을 설정하세요.</h2>
        <button className="openModalBtn" onClick={openModal}>
          예약하기
        </button>

        {isModalOpen && (
          <ReserveModal
            mode="date"
            selectDay={selectedDate}
            onSubmit={handleSubmit}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default RealTimeComponent;
