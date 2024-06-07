import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DayTimeComponent = () => {
  const [selectDate, setSelectDate] = useState(null);
  const [time, setTime] = useState("");
  const [destination, setDestination] = useState("A");
  const [groupsize, setGroupsize] = useState(0);
  const handleDateChange = (date) => {
    setSelectDate(date);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Date: ${selectDate.toDateString()}, Time:${time}, Destination: ${destination}`
    );
  };

  const handleGroupsize = (e) => {
    setGroupsize(e.target.value);
  };

  return (
    <div className="daytime-container">
      <h2>일자를 선택하세요</h2>
      <DatePicker
        selected={selectDate}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        isClearable
        placeholder="일자를 선택하세요"
      />
      {selectDate && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Time:</label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              required
            ></input>
          </div>
          <div>
            <label>Destination:</label>
            <select value={destination} onChange={handleDestinationChange}>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
            <br />
            <label>GroupSize</label>
            <select value={groupsize} onChange={handleGroupsize}>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <button type="submit">제출하기</button>
        </form>
      )}
    </div>
  );
};

export default DayTimeComponent;
