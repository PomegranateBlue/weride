import React, { useState } from "react";
import { firestoreDB } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";
import ReserveModal from "./ReserveModal";
import "../styles/dayTime.css";

const RealTimeComponent = () => {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (reservationData) => {
    try {
      const userDocRef = doc(firestoreDB, "dayTimeRequest", currentUser.uid);

      await setDoc(userDocRef, {
        ...reservationData,
        date: selectedDate.toISOString(),
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
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
