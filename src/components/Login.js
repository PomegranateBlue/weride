import React, { useState } from "react";
//import { auth, realTimeDB } from "../firebase.js";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from "../firebase";
//import { ref, set } from "firebase/database";
//import { v4 as uuidv4 } from "uuid";
//import Button from "@mui/material/Button";
import "../styles/Login.css";
//import { useForm } from "react-hook-form";
import SignUpModal from "./SignUpModal";

const LoginComponent = () => {
  //const { register, handleSubmit } = useForm();
  //const onSubmit = (data) => console.log(data);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력하세요");
      return;
    }
    //console.log(email, password);
    setErrorMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("로그인 성공");
    } catch (error) {
      if (error.code === "auth/wrong-email") {
        setErrorMessage("형식에 맞는 이메일을 입력해주세요");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("해당하는 이용자가 없습니다. 회원가입 후 시도해주세요");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("비밀번호가 틀렸습니다. 다시 시도하세요");
      } else {
        setErrorMessage("로그인 문제 발생, 문의바랍니다.");
      }
    }
  };

  const modalOpen = () => {
    setModalOpen(true);
  };

  const modalClose = () => {
    setModalOpen(false);
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
          <form>
            <div className="userInput">
              {" "}
              <label>이메일</label>
              <input
                className="email-form"
                placeholder="email@email.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
              <label>비밀번호</label>
              <input
                className="password-form"
                placeholder="비밀번호를 입력하세요"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
            </div>

            {errorMessage && (
              <p style={{ color: "red", fontWeight: "800" }}>{errorMessage}</p>
            )}
            <button id="loginBtn" onClick={handleSubmit}>
              로그인
            </button>
            <div className="signInInfo">
              <div className="signInfo">회원등록 후 이용가능합니다</div>
              <button id="signInBtn" onClick={modalOpen}>
                회원가입
              </button>
              {isModalOpen && (
                <SignUpModal
                  isModalOpen={isModalOpen}
                  modalClose={modalClose}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
