import React, { useState, useEffect } from "react";
import { firestoreDB } from "../firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import TimeModal from "./TimeModal";

const RealTimeComponent = () => {
  const [dataForm, setDataForm] = useState({
    groupSize: "",
    destination: "",
    time: "",
  });
  const [isModal, setModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleTimeSelect = (time) => {
    setDataForm((prevForm) => ({
      ...prevForm,
      time,
    }));
    setModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(
        collection(firestoreDB, "RealTime", "waitingLine", "userdata"),
        {
          ...dataForm,
          timestamp: serverTimestamp(),
        }
      );
      setDataForm({
        groupSize: "",
        destination: "",
        time: "",
      });
      console.log("Success");
    } catch (e) {
      console.error("Error wring on document", e);
    }
  };
  return (
    <div className="firebaseTest">
      <p>This page is for RealTime</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>인원수 (본인포함 2~4명):</label>
          <input
            type="number"
            name="groupSize"
            min="2"
            max="4"
            value={dataForm.groupSize}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>목적지:</label>
          <select
            name="destination"
            value={dataForm.destination}
            onChange={handleChange}
            required
          >
            <option value="">목적지 설정</option>
            <option value="대신관">대신관 앞</option>
            <option value="운동장">운동장</option>
          </select>
        </div>
        <div>
          <label>합승 시간:</label>
          <input
            type="time"
            name="time"
            value={dataForm.time}
            onClick={() => setModal(true)}
            readOnly
            required
          />
        </div>
        <button type="submit">전송하기</button>
      </form>
      <TimeModal
        availTime={isModal}
        onClose={() => setModal(false)}
        selectTime={handleTimeSelect}
      />
    </div>
  );
};

export default RealTimeComponent;
