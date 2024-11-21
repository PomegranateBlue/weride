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
      const userDocRef = doc(firestoreDB, "userRequest", currentUser.uid);

      await setDoc(userDocRef, {
        ...reservationData,
        date: modalSelectDay.toISOString(),
        uid: currentUser.uid,
        type: "2",
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
              setModalSelectDay(date);
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
            selectDay={modalSelectDay}
            onSubmit={handleSubmit}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default DayTimeComponent;
