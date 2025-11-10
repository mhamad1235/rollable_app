import { NavLink } from "react-router-dom";

export default function Sidebar({ role }) {
    console.log("Sidebar role:", role);
  const menu = {
    hotel: [
      { title: "Dashboard", path: "/hotel/dashboard" },
      { title: "Reservations", path: "/hotel/reservations" },
      { title: "Scan QR", path: "/scan" },
       { title: "Log out", path: "/" },
    ],
    security: [
      { title: "Dashboard", path: "/security/dashboard" },
      { title: "Log out", path: "/" },
    ],
  };

  return (
    <div style={container}>
      <div style={brand}>System Panel</div>

      <div style={{ marginTop: 20 }}>
        {menu[role].map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            style={({ isActive }) => ({
              ...linkStyle,
              background: isActive ? "#000" : "transparent",
              color: isActive ? "#fff" : "#333",
            })}
          >
            {item.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

const container = {
  width: 230,
  background: "#ffffff",
  height: "100vh",
  borderRight: "1px solid #e6e6e6",
  padding: "26px 18px",
  position: "fixed",
  left: 0,
  top: 0,
  display: "flex",
  flexDirection: "column"
};

const brand = {
  fontSize: 22,
  fontWeight: 700
};

const linkStyle = {
  display: "block",
  textDecoration: "none",
  fontSize: 15,
  padding: "12px 14px",
  borderRadius: 10,
  marginBottom: 6,
  fontWeight: 500
};
