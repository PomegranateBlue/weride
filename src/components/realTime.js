import React, { useState, useEffect } from "react";
import { firestoreDB } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/realTime.css";
const RealTimeComponent = () => {
  const [dataForm, setDataForm] = useState({
    groupSize: "2",
    destination: "",
    time: "",
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
    setDataForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(firestoreDB, "RealTimeReservations"), {
        ...dataForm,
        timestamp: serverTimestamp(),
      });
      setDataForm({
        groupSize: "",
        destination: "",
        time: "",
      });
      console.log("예약이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("예약 저장 중 오류 발생:", error);
    }
  };

  return (
    <div className="realtime-component">
      <h1 className="realtimeTitle">실시간 예약</h1>
      <h3 className="realtime-info">원하시는 조건을 설정해주세요</h3>
      <div className="realtime-container">
        <div className="realtime-content">
          <form className="realtime-form" onSubmit={handleSubmit}>
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
              name="groupSize"
              min="2"
              max="4"
              value={dataForm.groupSize}
              onChange={handleChange}
              className="passengerNum"
            />

            <button type="submit" className="realtime-reserveBtn">
              예약
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RealTimeComponent;
