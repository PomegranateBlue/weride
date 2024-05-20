import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { uid } from "uid";
import { db } from "./firebase";

const RealTime = () => {
  return (
    <div className="firebaseTest">
      <p>This page is for RealTime</p>
    </div>
  );
};

export default RealTime;
