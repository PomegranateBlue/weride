import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReserveModal from "./ReserveModal";
const DayTimeComponent = () => {
  const [selectDay, setSelectDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="daytime-container">
      <h2>원하는 예약 날짜와 조건을 설정하세요.</h2>
      <DatePicker
        selected={selectDay}
        onChange={(date) => {
          setSelectDay(date);
          openModal();
        }}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
        className="datePicker-custom"
        calendarClassName="custom-calendar"
      ></DatePicker>
      {isModalOpen && (
        <ReserveModal
          mode="date"
          selectDay={selectDay}
          closeModal={closeModal}
        ></ReserveModal>
      )}
    </div>
  );
};

export default DayTimeComponent;
