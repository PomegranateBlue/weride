import React, { useState, useEffect } from "react";
import { firestoreDB } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";
import "../styles/reserveConfirm.css";

const ReservationCheck = () => {
  const { currentUser } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const matchingRef = collection(firestoreDB, "matchingSchedule");
        const q = query(
          matchingRef,
          where("users", "array-contains", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const fetchedReservations = [];
        querySnapshot.forEach((doc) => {
          fetchedReservations.push({ id: doc.id, ...doc.data() });
        });

        setReservations(fetchedReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [currentUser.uid]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (reservations.length === 0) {
    return <div className="no-reservations">예약 정보가 없습니다.</div>;
  }

  return (
    <div className="reservation-check">
      <h1>예약 확인</h1>
      <div className="reservation-list">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-tag">
              {reservation.type === "1" ? "실시간 예약" : "일자별 예약"}
            </div>
            {reservation.type === "1" ? (
              <RealTimeReservation data={reservation} />
            ) : reservation.type === "2" ? (
              <DateSpecificReservation data={reservation} />
            ) : (
              <div>Unknown reservation type</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const RealTimeReservation = ({ data }) => {
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <div className="realtime-reservation">
      <h2>실시간 예약</h2>
      <p>
        <strong>동승 시간:</strong> {formatTime(data.time)}
      </p>
      <p>
        <strong>목적지:</strong> {data.destination}
      </p>
      <p>
        <strong>인원 수:</strong> {data.groupSize}명
      </p>
    </div>
  );
};

const DateSpecificReservation = ({ data }) => {
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="date-specific-reservation">
      <h2>일자별 예약</h2>
      <p>
        <strong>예약 날짜:</strong> {formatDateTime(data.date)}
      </p>
      <p>
        <strong>동승 시간:</strong> {formatDateTime(data.time)}
      </p>
      <p>
        <strong>목적지:</strong> {data.destination}
      </p>
      <p>
        <strong>인원 수:</strong> {data.groupSize}명
      </p>
    </div>
  );
};

export default ReservationCheck;
