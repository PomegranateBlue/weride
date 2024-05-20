import React, { useState } from "react";
import { firestoreDB } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function TestFB() {
  const [name, setName] = useState("");

  const handleAddData = async () => {
    try {
      // Firestore에 데이터 추가
      await addDoc(collection(firestoreDB, "your-collection-name"), {
        name: name,
      });

      // 데이터 추가 후 입력 필드 초기화
      setName("");

      // 사용자에게 성공 메시지 표시
      alert("데이터가 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("Error adding document: ", error);
      // 에러 메시지를 사용자에게 표시할 수도 있습니다.
      alert("데이터 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {/* 데이터 입력 폼 */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
      />
      <button onClick={handleAddData}>데이터 추가</button>
    </div>
  );
}

export default TestFB;
