import React, { useState } from "react";

const ReserveModal = ({ mode, selectDay, closeModal }) => {
  const [dataForm, setDataForm] = useState({
    time: "",
    destination: "",
    passenger: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let reservationData = {
      ...dataForm,
      createdAt: new Date().toISOString(),
    };

    if (mode === "date") {
      reservationData = {
        ...reservationData,
        date: selectDay.toISOString(),
      };
    }

    console.log(
      `${mode === "date" ? "일자별" : "실시간"} 예약 정보`,
      reservationData
    );

    closeModal();
  };

  return (
    <div className="modal-container" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === "date" ? "일자별 예약" : "실시간 예약"}</h3>
        {mode === "date" && (
          <p>선택된 날짜: {selectDay?.toLocaleDateString()}</p>
        )}
        <form onSubmit={handleSubmit}>
          <label>시간</label>
          <input
            type="time"
            name="time"
            value={dataForm.time}
            onChange={handleChange}
          />
          <label>도착지</label>
          <select
            name="destination"
            value={dataForm.destination}
            onChange={handleChange}
          >
            <option value="">목적지를 선택하세요</option>
            <option value="대신관 앞">대신관 앞</option>
            <option value="학교 운동장">학교 운동장</option>
          </select>
          <label>인원 수</label>
          <input
            type="number"
            name="passenger"
            min="1"
            max="4"
            value={dataForm.passenger}
            onChange={handleChange}
          />
          <button type="submit">예약</button>
        </form>
        <button onClick={closeModal}>닫기</button>
      </div>
    </div>
  );
};

export default ReserveModal;
