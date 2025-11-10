import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../dashboard.css"; // keep styling theme united

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ phone: "7754812814", password: "password12345" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const role = await login(form);

      if (role === "hotel") {
        navigate("/hotel/dashboard");
      } else if (role === "security") {
        navigate("/security/dashboard");
      } else {
        setErrorMsg("Unauthorized login. You do not have access.");
      }

    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container">
      <div className="auth-card">
        <h1 className="title">Login</h1>

        {errorMsg && <div className="alert error">{errorMsg}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              placeholder="7xx xxx xxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="******"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
