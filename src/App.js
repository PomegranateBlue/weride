import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import RealTime from "./components/RealTime";
import Profile from "./components/Profile";
import DateTime from "./components/DayTime";

const App = () => {
  return (
    <Router>
      <div className="pageNav">
        <Link to="/Profile">사용자 정보</Link>
        <Link to="/RealTime">실시간 합승</Link>
        <Link to="/DateTime">일자별 합승</Link>
      </div>
      <Routes>
        <Route path="/Profile" element={<Profile />} />
        <Route path="/RealTime" element={<RealTime />} />
        <Route path="/DateTime" element={<DateTime />} />
      </Routes>
    </Router>
  );
};

export default App;
