import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import RealTimeComponent from "./components/RealTime";
import LoginComponent from "./components/Login";
import DateTimeComponent from "./components/DayTime";
import ProfileComponent from "./components/Profile";
import UserAuthComponent from "./components/UserAuth";
const NotFound = () => {
  return <h2>404:Page Not Found</h2>;
};

const App = () => {
  return (
    <Router basename="/weride2">
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<LoginComponent />} />
        <Route path="/SignUp" element={<UserAuthComponent />} />
        <Route path="/realtime" element={<RealTimeComponent />} />
        <Route path="/datetime" element={<DateTimeComponent />} />
        <Route path="/profile" element={<ProfileComponent />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
export default App;
