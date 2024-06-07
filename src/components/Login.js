import React, { useState } from "react";
import { auth, realTimeDB } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import Button from "@mui/material/Button";
import "../styles/profile.css";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userUniqueId = uuidv4();

      await set(ref(realTimeDB, "users/" + userUniqueId), {
        email: email,
        phonenumber: phonenumber,
        userUniqueId: userUniqueId,
      });

      console.log("SignUp success");
    } catch (error) {
      console.error("error1", error);
    }
  };
  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      ></input>
      <input
        type="password"
        value="{password}"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      ></input>
      <input
        type="text"
        value={phonenumber}
        onChange={(e) => setPhonenumber(e.target.value)}
        placeholder="PhoneNumber"
      ></input>
      <button type="submit">SignUp</button>
    </form>
  );
};

export default LoginComponent;
