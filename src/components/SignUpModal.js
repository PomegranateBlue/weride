import React, { useState } from "react";
import "../styles/modal.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUpModal = ({ modalClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("유효한 이메일 형식이 아닙니다.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자리 이상이어야 합니다.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage("회원가입이 완료되었습니다");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("이미 등록된 이메일입니다.");
      } else {
        setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요");
      }
    }
  };
  return (
    <div className="modal-container" onClick={modalClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>회원가입</h2>
        <form className="modal-signUp-content">
          <label>이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
          <label>비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button
            type="button"
            className="modal-signUpBtn"
            onClick={handleSignUp}
          >
            가입하기
          </button>
        </form>
        <button onClick={modalClose} className="modal-closeBtn">
          닫기
        </button>
      </div>
    </div>
  );
};

export default SignUpModal;
