import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axiosClient from "../api/axiosClient";
import "../index.css";
export default function QRScanner() {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    console.log("Camera active:", loading);
    let codeReader = new BrowserMultiFormatReader();

    if (cameraActive) {
      codeReader
        .decodeFromVideoDevice(null, videoRef.current, async (result, err) => {
          if (result) {
            codeReader.reset();
            setCameraActive(false);
            handleScan(result.getText());
          }
        })
        .catch((err) => {
          setError("Camera permission issue or camera not found.");
          setCameraActive(false);
        });
    }

    return () => codeReader.reset();
  }, [cameraActive]);

  async function handleScan(text) {
    try {
      setScanResult(text);
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axiosClient.get(`/v1/hotel/bookings/${text}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHotelData(response.data.booking);
    } catch (e) {
      setError("Invalid QR in system. Try again");
      setScanResult(null);
      setCameraActive(true);
    } finally {
      setLoading(false);
    }
  }

  function resetScanner() {
    setScanResult(null);
    setHotelData(null);
    setError(null);
    setCameraActive(true);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Scan QR Code</h2>

     {cameraActive && (
  <div style={{ position: "relative", width: "100%", maxWidth: "400px", margin: "auto" }}>
    <video
      ref={videoRef}
      style={{
        width: "100%",
        borderRadius: "10px",
        border: "2px solid #007bff",
      }}
    />

    {/* scanner moving line */}
    <div
      className="scan-line"
      style={{
        position: "absolute",
        top: "0px",
        left: 0,
        width: "100%",
        height: "2px",
        background: "rgba(0,255,0,0.7)",
        animation: "scanMove 2.1s linear infinite"
      }}
    />
  </div>
)}


      {error && <p style={{ color: "red" }}>{error}</p>}
      {scanResult && <p>QR: {scanResult}</p>}
      
   {hotelData && (
  <div
    style={{
      marginTop: "25px",
      padding: "20px",
      border: "1px solid #dce2ec",
      borderRadius: "14px",
      maxWidth: "500px",
      margin: "25px auto",
      background: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
    }}
  >
    <h3 style={{ marginBottom: "10px" }}>{hotelData.hotel.name}</h3>

    <p><b>Room:</b> {hotelData.room.name}</p>
    <p><b>Amount:</b> ${hotelData.amount}</p>
    <p><b>Payment:</b> {hotelData.payment_status}</p>
    <p><b>Check-in:</b> {hotelData.start_time}</p>
    <p><b>Check-out:</b> {hotelData.end_time}</p>

    <h4 style={{ marginTop: "15px", marginBottom: "8px" }}>Units</h4>
    {hotelData.units.map((u) => (
      <div
        key={u.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          marginBottom: "6px",
          background: "#f9fafc",
          borderRadius: "8px",
          border: "1px solid #e7edf4"
        }}
      >
        <span><b>Room #{u.room_number}</b></span>
        <span style={{ 
          color: u.is_available === 1 ? "green" : "red",
          fontWeight: 600
        }}>
          {u.is_available === 1 ? "Available" : "Not Available"}
        </span>
      </div>
    ))}

    <h4 style={{ marginTop: "20px" }}>Guests</h4>
    {hotelData.guests.map((g) => (
      <div key={g.id} style={{ marginBottom: "10px" }}>
        <p>{g.name}</p>
        {g.image?.path && (
          <img
            src={g.image.path}
            alt={g.name}
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "10px"
            }}
          />
        )}
      </div>
    ))}

    <button
      onClick={resetScanner}
      style={{
        marginTop: "18px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        width: "100%"
      }}
    >
      Scan Another
    </button>
  </div>
)}


      {!cameraActive && !hotelData && (
        <button onClick={resetScanner}>Retry Scan</button>
      )}
    </div>
  );
}
