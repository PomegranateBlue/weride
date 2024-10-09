import React, { useState } from "react";
import { auth, realTimeDB } from "../firebase.js";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { ref, set } from "firebase/database";
//import { v4 as uuidv4 } from "uuid";
//import Button from "@mui/material/Button";
import "../styles/Login.css";
import { useForm } from "react-hook-form";

const LoginComponent = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <div>
      <h1 id="title">WERIDE</h1>
      <p id="welcome_line">
        WERIDE를 이용해주셔서 감사합니다<br></br>
        택시 동승 서비스를 이용해보세요<br></br>
        함께 편안한 출퇴근길이 되길 바랍니다
      </p>
      <div>이곳에 로그인 양식과 회원가입 리디렉션 버튼</div>
    </div>
  );
};

export default LoginComponent;
