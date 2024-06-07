import React, { useState } from "react";
import { firestoreDB } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const RealTimeComponent = () => {
  const [dataForm, setDataForm] = useState({
    groupSize: "",
    destination: "",
    time: "",
  });

  return (
    <div className="firebaseTest">
      <p>This page is for RealTime</p>
      <form></form>
    </div>
  );
};

export default RealTimeComponent;
