import React, { useEffect, useState } from "react";
import "../../dashboard.css";
import axiosClient from "../../api/axiosClient";

function HotelReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
             const token = localStorage.getItem("access_token");      
        const response = await axiosClient.get("/v1/hotel/reservation",{
                       headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.result) {
          setReservations(response.data.data);
        } else {
          setError("Failed to load reservations.");
        }
      } catch (err) {
        setError("Error fetching reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <div className="dashboard-container">Loading reservations...</div>;
  }

  if (error) {
    return <div className="dashboard-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Reservations</h1>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Reservations</h3>
          <p className="highlight">{reservations.length}</p>
        </div>
        <div className="card">
          <h3>Paid</h3>
          <p className="highlight green">
            {reservations.filter((r) => r.payment_status === "paid").length}
          </p>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <p className="highlight orange">
            {reservations.filter((r) => r.payment_status !== "paid").length}
          </p>
        </div>
      </div>

      <div className="reservation-list">
        <h2>Today's Activity</h2>

        {reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <table className="reservation-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Room(s)</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Start</th>
                <th>End</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res, index) => (
                <tr key={res.id}>
                  <td>{index + 1}</td>
                  <td>{res.user?.name || "N/A"}</td>
                  <td>
                    {res.units.map((u) => (
                      <span key={u.id} className="room-tag">
                        {u.room_number}
                      </span>
                    ))}
                  </td>
                  <td>${res.amount}</td>
                  <td
                    className={
                      res.payment_status === "paid"
                        ? "status-badge paid"
                        : "status-badge pending"
                    }
                  >
                    {res.payment_status}
                  </td>
                  <td>{res.start_time}</td>
                  <td>{res.end_time}</td>
                  <td>{res.payment_method?.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HotelReservation;
