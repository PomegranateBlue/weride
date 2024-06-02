import React, { useState } from "react";
import { firestoreDB } from "../firebase";
import { collection, addDocs, serverTimestamp } from "firebase/firestore";

const RealTime = () => {
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

export default RealTime;
