import React, { useState } from "react";
import { auth, realTimeDB } from "../firebase.js";
import { signInWithEmailAndPassword,getAuth } from "firebase/auth";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
//import Button from "@mui/material/Button";
import "../styles/profile.css";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      ></input>
      <input
        type="password"
        value="{password}"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      ></input>
      <input
        type="text"
        value={phonenumber}
        onChange={(e) => setPhonenumber(e.target.value)}
        placeholder="전화번호"
      ></input>
      <button type="submit">서비스 가입</button>
    </form>
  );
};

export default LoginComponent;
