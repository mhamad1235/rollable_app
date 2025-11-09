// HotelReservation.jsx
import React, { useEffect, useState } from "react";
import "../../dashboard.css";
import axiosClient from "../../api/axiosClient";
import { FaPaperPlane } from "react-icons/fa"; // send icon
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function HotelReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMap, setSendingMap] = useState({}); // { [id]: true/false }
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axiosClient.get("/v1/hotel/reservation", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.result) {
          // expecting response.data.data array
          setReservations(response.data.data || []);
        } else {
          setError("Failed to load reservations.");
        }
      } catch (err) {
        console.error("fetchReservations error:", err);
        setError("Error fetching reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Toggle (send/hide) using same endpoint - optimistic update
  const toggleSendToSecurity = async (id) => {
    // Prevent double clicks while in-flight
    if (sendingMap[id]) return;

    // optimistic update: flip is_security_visible locally
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_security_visible: r.is_security_visible ? 0 : 1 } : r))
    );
    setSendingMap((m) => ({ ...m, [id]: true }));
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const res = await axiosClient.post(`/v1/hotel/send-security/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // if server sends back updated object, merge it (defensive)
      if (res.data?.booking) {
        setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...res.data.booking } : r)));
      } else if (res.data?.success === false) {
        // if server indicates failure -> revert optimistic
        setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, is_security_visible: r.is_security_visible ? 0 : 1 } : r)));
        setError("Server rejected toggle action.");
      } else {
        // assume success — keep optimistic state
      }
    } catch (err) {
      console.error("toggleSendToSecurity error:", err);
      // revert optimistic flip on error
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_security_visible: r.is_security_visible ? 0 : 1 } : r))
      );
      setError("Failed to update security visibility. Try again.");
    } finally {
      // clear sending flag
      setSendingMap((m) => {
        const copy = { ...m };
        delete copy[id];
        return copy;
      });
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading reservations...</div>;
  }

  if (error && reservations.length === 0) {
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

      <div className="reservation-list" style={{ marginTop: 20 }}>
        <h2>Today's Activity</h2>

        {error && reservations.length > 0 && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}

        {reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="reservation-table modern-table" style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Guest</th>
                  <th>Rooms</th>
                  <th>Amount</th>
                  <th>Pay</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Method</th>
                  <th style={{ textAlign: "center" }}>Security</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res, index) => {
                  const isVisible = Number(res.is_security_visible) === 1;
                  const sending = Boolean(sendingMap[res.id]);

                  return (
                    <tr key={res.id}>
                      <td style={{ width: 48 }}>{index + 1}</td>
                      <td style={{ minWidth: 160 }}>{res.user?.name || "N/A"}</td>
                      <td style={{ minWidth: 120 }}>
                        {Array.isArray(res.units) && res.units.length > 0 ? (
                          res.units.map((u) => (
                            <span key={u.id} className="room-tag" style={{ marginRight: 6 }}>
                              {u.room_number}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>${res.amount}</td>
                      <td
                        className={res.payment_status === "paid" ? "status-badge paid" : "status-badge pending"}
                      >
                        {res.payment_status}
                      </td>
                      <td style={{ minWidth: 100 }}>{res.start_time}</td>
                      <td style={{ minWidth: 100 }}>{res.end_time}</td>
                      <td style={{ textTransform: "uppercase" }}>{res.payment_method || "—"}</td>

                      <td style={{ textAlign: "center", minWidth: 110 }}>
                        <button
                          onClick={() => toggleSendToSecurity(res.id)}
                          className="send-btn"
                          disabled={sending}
                          title={isVisible ? "Visible to security — click to hide" : "Send to security"}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "none",
                            cursor: sending ? "wait" : "pointer",
                            transition: "all 180ms ease",
                            background: isVisible ? "linear-gradient(90deg,#20c997,#16a085)" : "#2d79ff",
                            color: "#fff",
                            boxShadow: sending ? "inset 0 0 0 1px rgba(0,0,0,0.02)" : "0 8px 20px rgba(45,121,255,0.12)",
                          }}
                        >
                          {sending ? (
                            <AiOutlineLoading3Quarters className="spin" />
                          ) : (
                            <FaPaperPlane />
                          )}
                          <span style={{ fontWeight: 700, fontSize: 13 }}>
                            {isVisible ? "Visible" : "Send"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelReservation;
