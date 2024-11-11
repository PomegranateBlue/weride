import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import ReserveModal from "./ReserveModal";
import "../styles/dayTime.css";
const DayTimeComponent = () => {
  const [modalSelectDay, setModalSelectDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const CustomDatepicker = forwardRef(({ value, onClick, className }, ref) => (
    <button className="custom-datePicker" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
          ></DatePicker>
        </div>
        <div className="user-reservation"></div>
        {isModalOpen && (
          <ReserveModal
            mode="date"
            selectDay={modalSelectDay}
            closeModal={closeModal}
          ></ReserveModal>
        )}
      </div>
    </div>
  );
};

export default DayTimeComponent;
