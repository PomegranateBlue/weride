import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, } from "firebase/auth";

const UserAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="tel"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <hr></hr>
        <div>
          <label>phonenumber:</label>
          <input
            type="number"
            value={phoneNumber}
            placeHolder="-없이 입력하세요"
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          ></input>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>User registered successfully!</p>
      )}
    </div>
  );
};

export default UserAuth;
