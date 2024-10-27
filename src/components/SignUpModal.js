import React, { useState } from "react";
import "../styles/modal.css"; // 모달 스타일 파일 임포트
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUpModal = ({ isModalOpen, modalClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const modalSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage("회원이 되신 걸 축하드립니다.");
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div
      className="modal-container"
      style={{ display: isModalOpen ? "flex" : "none" }}
    >
      <div className="modal-content">
        <form className="modalSignupform" onSubmit={modalSignUp}>
          <label>이메일</label>
          <input
            className="modal-email-form"
            placeholder="email@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
          <label>비밀번호</label>
          <input
            className="modal-password-form"
            placeholder="비밀번호를 입력하세요"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button className="modal-submitBtn" type="submit">
            제출하기
          </button>
        </form>
        <button className="closeBtn" onClick={modalClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SignUpModal;
