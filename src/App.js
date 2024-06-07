import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import RealTimeComponent from "./components/RealTime";
import LoginComponent from "./components/Login";
import DateTimeComponent from "./components/DayTime";
import TestFB from "./components/testComponent";
import ProfileComponent from "./components/Profile";

const App = () => {
  return (
    <Router>
      <div className="pageNav">
        <Link to="/Login">로그인</Link>
        <Link to="/RealTime">실시간 합승</Link>
        <Link to="/DateTime">일자별 합승</Link>
        <Link to="/Profile">사용자 정보</Link>
        <Link to="/TestFB">테스트 페이지</Link>
      </div>
      <Routes>
        <Route path="/Login" element={<LoginComponent />} />
        <Route path="/RealTime" element={<RealTimeComponent />} />
        <Route path="/DateTime" element={<DateTimeComponent />} />
        <Route path="/Profile" element={<ProfileComponent />}></Route>
        <Route path="/TestFB" element={<TestFB />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
