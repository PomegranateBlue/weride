import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/Login.css";
import SignUpModal from "./SignUpModal";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력하세요");
      return;
    }
    //console.log(email, password);
    setErrorMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Login success");

      setCurrentUser(userCredential.user);
      navigate("../profile");
      setEmail("");
      setPassword("");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("등록되지 않은 이메일입니다");
          break;
        case "auth/wrong-password":
          setErrorMessage("비밀번호가 틀립니다");
          break;
        case "auth/invalid-email":
          setErrorMessage("유효하지 않은 이메일 형식입니다");
          break;
        default:
          setErrorMessage("로그인에 실패했습니다. 다시 시도하세요");
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
      <div id="title">WERIDE</div>
      <p id="greetingMessage">
        WERIDE를 이용해주셔서 감사합니다
        <br />
        택시 동승을 통해 택시비 절약과 함께 편안히 출퇴근 길을 이용해보세요{" "}
        <br />
      </p>
      <div className="login-container">
        <div className="login-content">
          <form className="form-container" onSubmit={handleSubmit}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>

            <div className="errorMessage">
              <p>{errorMessage}</p>
            </div>
            <div className="button-container">
              <button type="submit" className="loginBtn">
                로그인
              </button>
              <button type="button" onClick={modalOpen} className="signUpBtn">
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
      {isModalOpen && <SignUpModal modalClose={modalClose} />}
    </div>
  );
};

export default LoginComponent;
