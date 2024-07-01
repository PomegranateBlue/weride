import React, { useState, useEffect } from "react";

const TimeModal = ({ availTime, onClose, selectTime }) => {
  const [availMin, setAvailMin] = useState([]);
  useEffect(() => {
    if (availTime) {
      const TimeObj = new Date();
      const minutes = TimeObj.getMinutes();
      const currentTime = Math.ceil(minutes / 15) * 15;
      const baseTime = new Date(TimeObj.getTime());

      baseTime.setMinutes(currentTime);
      baseTime.setSeconds(0);

      const TimeTable = [];
      for (let i = 0; i < 4; i++) {
        const userTime = new Date(baseTime.getTime() + i * 15 * 60000);
        if ((userTime - TimeObj) / 60000 >= 5) {
          const minutestoString = `${String(userTime.getHours()).padStart(
            2,
            "0"
          )}:${String(userTime.getMinutes()).padStart(2, "0")}`;
          TimeTable.push(minutestoString);
        }
      }
      setAvailMin(TimeTable);
    }
  }, [availTime]);

  if (!availTime) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>합승 시간 선택</h2>
        <select onChange={(e) => selectTime(e.target.value)}>
          <option value="">Select Time</option>
          {availMin.map((timeOption) => (
            <option key={timeOption} value={timeOption}>
              {timeOption}
            </option>
          ))}
        </select>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TimeModal;
