import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import HotelDashboard from "./pages/hotel/Dashboard";
import SecurityDashboard from "./pages/security/Dashboard";
import HotelReservations from "./pages/hotel/HotelReservation";
import Login from "./pages/Login";
import HotelDetail from "./pages/security/HotelDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/hotel/reservations" element={<HotelReservations />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/hotel/dashboard" element={<HotelDashboard />} />
          <Route path="/security/dashboard" element={<SecurityDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
