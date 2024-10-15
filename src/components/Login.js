import React, { useState } from "react";
import { auth, realTimeDB } from "../firebase.js";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { ref, set } from "firebase/database";
//import { v4 as uuidv4 } from "uuid";
//import Button from "@mui/material/Button";
import "../styles/Login.css";
import { useForm } from "react-hook-form";

const LoginComponent = () => {
  //const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };
  return (
    <div>
      <h1 id="title">WERIDE</h1>
      <p id="welcome_line">
        WERIDE를 이용해주셔서 감사합니다<br></br>
        택시 동승 서비스를 이용해보세요<br></br>
        함께 편안한 출퇴근길이 되길 바랍니다
      </p>
      <div className="login-container">
        <div className="login-form">
          <label>이메일</label>
          <input className="email-form" placeholder="email@email.com"></input>
          <label>비밀번호</label>
          <input
            className="password-form"
            placeholder="비밀번호를 입력하세요"
          ></input>
          <button id="loginBtn">로그인</button>
          <div className="signInInfo">
            <label>회원등록 후 이용가능합니다</label>
            <button id="signInBtn">회원가입</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
