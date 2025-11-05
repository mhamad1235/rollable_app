import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";
import "../../SecurityDashboard.css"; // 👈 import CSS

export default function SecurityDashboard() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axiosClient.get("/v1/hotel-list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHotels(response.data.hotels || []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <div className="loading">Loading hotels...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="security-dashboard">
      <header className="dashboard-header">
        <h1>Security Dashboard</h1>
        <p>Welcome, security account!</p>
      </header>

      <section className="hotel-section">
        <h2>Assigned Hotels</h2>
        {hotels.length === 0 ? (
          <p className="no-hotels">No hotels found.</p>
        ) : (
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <Link to={`/hotel/${hotel.id}`} key={hotel.id} className="hotel-card">
                <div className="hotel-card-content">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-description">{hotel.description}</p>
                  <div className="hotel-info">
                    <p><strong>Phone:</strong> {hotel.phone}</p>
                    <p>
                      <strong>Lat:</strong> {hotel.latitude} | <strong>Lng:</strong> {hotel.longitude}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
