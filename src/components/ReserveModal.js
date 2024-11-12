import React, { useState, useEffect } from "react";
import "../styles/reserveModal.css";
const ReserveModal = ({ mode, selectDay, closeModal }) => {
  const [dataForm, setDataForm] = useState({
    time: "",
    destination: "",
    passenger: 2,
  });
  const [timeOption, setTimeOption] = useState([]);
  useEffect(() => {
    timeCustom();
  }, []);

  const timeCustom = () => {
    const nowTime = new Date();
    nowTime.setMinutes(nowTime.getMinutes() + 10);
    nowTime.setSeconds(0);
    nowTime.setMilliseconds(0);

    const timeSetting = [];
    for (let i = 0; i < 4; i++) {
      const parseTime = new Date(nowTime);
      parseTime.setMinutes(Math.ceil(parseTime.getMinutes() / 15) * 15);
      timeSetting.push(new Date(parseTime));
      nowTime.setMinutes(nowTime.getMinutes() + 15);
    }
    setTimeOption(timeSetting);
  };
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
          <select
            name="time"
            value={dataForm.time}
            onChange={handleChange}
            className="time-table"
          >
            <option value="">시간을 선택하세요</option>
            {timeOption.map((time, index) => (
              <option key={index} value={time.toISOString()}>
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </option>
            ))}
          </select>
          <label>도착지</label>
          <select
            name="destination"
            value={dataForm.destination}
            onChange={handleChange}
            className="destinationSelect"
          >
            <option value="">목적지를 선택하세요</option>
            <option value="대신관 앞">대신관 앞</option>
            <option value="학교 운동장">학교 운동장</option>
          </select>
          <label>인원 수</label>
          <input
            type="number"
            name="passenger"
            min="2"
            max="4"
            value={dataForm.passenger}
            onChange={handleChange}
            className="passengerNum"
          />
          <div className="modalBtn-container">
            <button type="submit" className="reservBtn">
              예약
            </button>
            <button onClick={closeModal} className="closeBtn">
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReserveModal;