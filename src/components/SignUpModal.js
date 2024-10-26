import React, { useState } from "react";
import "../styles/modal.css";
const SignUpModal = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>회원가입</h2>
        {error && <p className="error-mesg">{error}</p>}
        <form onSubmit={handleSignup}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@email.com"
            required
          ></input>
          <label>비밀번호</label>
          <input
            type="password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          ></input>
          <button type="submit">회원가입</button>
        </form>
        <button onClick={closeModal}>닫기</button>
      </div>
    </div>
  );
};

export default SignUpModal;
