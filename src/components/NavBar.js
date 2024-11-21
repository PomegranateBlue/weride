import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/navbar.css";
const NavBar = () => {
  const currentLocation = useLocation();
  const { currentUser } = useAuth();

  if (!currentUser || currentLocation.pathname === "/Login") {
    return null;
  }
  return (
    <nav className="navigator-container">
      <ul className="navigator-content">
        <div className="weride-name">WERIDE</div>
        <li>
          <Link to="/profile" className="nav-link">
            내 정보
          </Link>
        </li>
        <li>
          <Link to="/realtime" className="nav-link">
            실시간 예약
          </Link>
        </li>
        <li>
          <Link to="/datetime" className="nav-link">
            일자별 예약
          </Link>
        </li>
        <li>
          <Link to="/reserve" className="nav-link">
            예약 확인
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
