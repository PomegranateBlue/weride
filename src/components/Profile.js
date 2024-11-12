import React from "react";
import "../styles/profile.css";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const renderRealTime = () => {
    navigate("../RealTime");
  };
  const renderDayTime = () => {
    navigate("../datetime");
  };
  const renderProfileEdit = () => {};
  return (
    <div>
      <p className="profile-title">사용자 전용 페이지</p>
      <p className="profile-info">이용할 서비스를 선택하세요</p>
      <div className="profile-menu-container">
        <button onClick={renderRealTime}>실시간 예약</button>
        <button onClick={renderDayTime}>일자별 예약</button>
        <button>사용자 정보 수정</button>
      </div>
      <div className="user-uid">
        {currentUser ? (
          <p>현재 사용자 UID: {currentUser.uid}</p>
        ) : (
          <p>로그인 정보를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent;
