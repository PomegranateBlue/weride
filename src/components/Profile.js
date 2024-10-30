import React, { useState } from "react";
import "../styles/profile.css";
const ProfileComponent = () => {
  return (
    <div>
      <p className="profile-title">사용자 전용 페이지</p>
      <p className="profile-info">이용할 서비스를 선택하세요</p>
      <div className="profile-menu-container">
        <button>실시간 예약</button>
        <button>일자별 예약</button>
        <button>사용자 정보 수정</button>
      </div>
    </div>
  );
};

export default ProfileComponent;
