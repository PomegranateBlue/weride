import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import ReserveModal from "./ReserveModal";
import "../styles/dayTime.css";
import { firestoreDB } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";

const DayTimeComponent = () => {
  const { currentUser } = useAuth();
  const [modalSelectDay, setModalSelectDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const CustomDatepicker = forwardRef(({ value, onClick }, ref) => (
    <button className="custom-datePicker" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (reservationData) => {
    try {
      const userDocRef = doc(firestoreDB, "dayTimeRequest", currentUser.uid);

      await setDoc(userDocRef, {
        ...reservationData,
        date: modalSelectDay.toISOString(), // DatePicker로 선택한 날짜
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
        <div className="datePicker-container">
          <DatePicker
            className="datePicker"
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setModalSelectDay(date); // DatePicker에서 선택한 날짜 설정
              openModal();
            }}
            dateFormat="yyyy-MM-dd"
            locale={ko}
            customInput={<CustomDatepicker />}
          />
        </div>
        {isModalOpen && (
          <ReserveModal
            mode="date"
            selectDay={modalSelectDay} // 선택된 날짜 전달
            onSubmit={handleSubmit} // 데이터를 Firestore에 전송
            closeModal={closeModal} // 모달 닫기
          />
        )}
      </div>
    </div>
  );
};

export default DayTimeComponent;
