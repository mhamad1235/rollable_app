import React, { useEffect, useState } from "react";
import "../../dashboard.css";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";
import Sidebar from "../../component/Sidebar";   // <-- add this

function HotelDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("access_token");      
        const response = await axiosClient.get("/v1/hotel/unit",{
             headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.result) {
          setRooms(response.data.data);
        } else {
          setError("Failed to load hotel rooms.");
        }
      } catch (err) {
        setError("Error loading hotel rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div className="dashboard-container">Loading rooms...</div>;
  if (error) return <div className="dashboard-container">{error}</div>;

  return (
    <div style={{ display: "flex" }}>

      <Sidebar role="hotel" />

      <div style={{ marginLeft: 230, padding: 30, width: "100%" }}>

 

     

        {/* rest of dashboard content stays same */}

        <div className="stats-cards">
          <div className="card">
            <h3>Guest Satisfaction Score</h3>
            <p className="highlight">4.7 ⭐</p>
            <span className="small">+0.2 this month</span>
          </div>

          <div className="card">
            <h3>Active Staff Members</h3>
            <p className="highlight">11</p>
          </div>

          <div className="card">
            <h3>Service Issues</h3>
            <p className="highlight red">3</p>
            <span className="small">Urgent: 1, Medium: 2</span>
          </div>
        </div>

        <div className="room-section">
          <h2>Room Status Overview</h2>
          <div className="room-stats">
            <div className="status occupied">Occupied 11</div>
            <div className="status dirty">Dirty 9</div>
            <div className="status ready">Ready 18</div>
            <div className="status out">Out of Order 2</div>
          </div>
        </div>

        <div className="floor-plan">
          <h2>Interactive Floor Plan</h2>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`room-tile ${
                  room.available_today ? "available" : "unavailable"
                }`}
              >
                {room.room_number}
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h2>Today's Activity</h2>
          <div className="activity-grid">
            <div className="activity-item"><p className="blue">Arrival Today</p><span>13</span></div>
            <div className="activity-item"><p className="green">Departure Today</p><span>13</span></div>
            <div className="activity-item"><p className="orange">Walk-ins Today</p><span>13</span></div>
            <div className="activity-item"><p className="red">Cancellation</p><span>13</span></div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default HotelDashboard;
