import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "../../SecurityDashboard.css";
import Sidebar from "../../component/Sidebar";   // <-- add this
export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axiosClient.get(`/v1/national-id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHotel(response.data.hotel);
      } catch (err) {
        console.error("Error fetching hotel detail:", err);
        setError("Failed to load hotel detail");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [id]);

  if (loading) return <p className="page-container">Loading hotel detail...</p>;
  if (error) return <p className="page-container error">{error}</p>;
  if (!hotel) return <p className="page-container">No hotel data found.</p>;

  return (
       <div style={{ display: "flex" }}>
        
              <Sidebar role="security" />
        
              <div style={{ marginLeft: 230, padding: 30, width: "100%" }}>
    <div className="page-container">
      

      <div className="hotel-info">
        <h1>{hotel.name}</h1>
        <p>{hotel.description}</p>
        <p><strong>Phone:</strong> {hotel.phone}</p>
      
      </div>

      <h2>Guest National ID Images</h2>

      {hotel.bookings?.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        hotel.bookings.map((booking) => (
          <div key={booking.id} className="booking-section">
            <h3>Booking #{booking.id}</h3>
            {booking.guests && booking.guests.length > 0 ? (
              <div className="guest-gallery">
                {booking.guests.map((guest) => (
                  <div key={guest.id} className="guest-id-card">
                    <img
                      src={guest.image?.path}
                      alt={guest.name}
                      className="guest-id-image"
                    />
                    <p className="guest-name">{guest.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-guests">No guest images for this booking.</p>
            )}
          </div>
        ))
      )}
    </div>
    </div>
    </div>
  );
}
