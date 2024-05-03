import React, { useEffect, useState } from "react";
import "./App.css";
import { ref, set } from "firebase/database";
import { uid } from "uid";
import { db } from "./firebase";
const App = () => {
  const [todo, setTodo] = useState("");

  const handleTodo = (e) => {
    setTodo(e.target.value);
  };

  const writeData = () => {
    const uuid = uid();

    set(ref(db, "test/" + uuid), {
      todo,
      uuid,
    });
    setTodo("");
  };

  return (
    <div className="container">
      <div className="NavBar-container">
        <div id="Nav">Navbar</div>
      </div>
      <div className="logo-container">
        <div id="logo">WERIDE</div>
      </div>
      <div className="introduce-container">
        <p>
          택시 합승을 위한 스케줄링 서비스입니다.
          <br />
          <br />
          오른쪽 메뉴에서 실시간 합승자 모집과 일자별 모집을 통해
          <br />
          <br />
          택시 합승 일정을 잡아보세요
        </p>
      </div>
      <div className="info">footer</div>
      <div className="firebaseTest">
        <input type="text" value={todo} onChange={handleTodo}></input>
        <button onClick={writeData}>Submit</button>
      </div>
    </div>
  );
};

export default App;
