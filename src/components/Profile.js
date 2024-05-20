import React from "react";
import Button from "@mui/material/Button";
import "../styles/profile.css";
const Profile = () => {
  return (
    <div className="loginPage">
      <div className="notice">이메일과 비밀번호를 입력해주세요.</div>
      <div className="Container">
        <div className="serviceTitle">WERIDE</div>
        <div className="notice">
          이메일과 비밀번호를 입력하세요
          <br />
          계정이 없으시다면 가입을 해주세요
        </div>
        <div className="emailForm">
          <input required type="text" placeholder="email@email.com"></input>
        </div>
        <div className="passwdForm">
          <input
            required
            type="text"
            placeholder="영문,숫자,특수문자를 포함한 8자 이상"
          ></input>
        </div>
        <div className="BtnContainer">
          <div className="submitBtn">
            <Button variant="contained">로그인</Button>
          </div>
          <div className="AuthBtn">
            <Button variant="contained">회원가입</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
