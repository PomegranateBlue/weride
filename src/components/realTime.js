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
      <h1>실시간 예약</h1>
    </div>
  );
};

export default RealTimeComponent;
