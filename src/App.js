import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

//import Profile from "./components/Profile";
import { AuthProvider, useAuth } from "./components/AuthContext";
import RealTimeComponent from "./components/RealTime";
import LoginComponent from "./components/Login";
import DateTimeComponent from "./components/DayTime";
import ProfileComponent from "./components/Profile";
import UserAuthComponent from "./components/UserAuth";
import LogOutComponent from "./components/Logout";
import ReserveCheckComponent from "./components/ReserveConfirm";
import NavbarComponent from "./components/NavBar";
const NotFound = () => {
  return <h2>404:Page Not Found</h2>;
};

const HandleUserState = () => {
  const { currentUser } = useAuth();
  const currentLocation = useLocation();

  if (!currentUser || currentLocation.pathname == "/Login") {
    return null;
  }
  return currentUser ? (
    <footer className="after-login-component">
      <LogOutComponent />
      <NavbarComponent />
    </footer>
  ) : null;
};

const AnimateRoute = () => {
  const animelocation = useLocation();
};

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/weride">
        <div className="fade-in">
          <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<LoginComponent />} />
            <Route path="/SignUp" element={<UserAuthComponent />} />
            <Route path="/realtime" element={<RealTimeComponent />} />
            <Route path="/datetime" element={<DateTimeComponent />} />
            <Route path="/profile" element={<ProfileComponent />} />
            <Route path="/reserve" element={<ReserveCheckComponent />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
        <HandleUserState />
      </Router>
    </AuthProvider>
  );
};
export default App;
