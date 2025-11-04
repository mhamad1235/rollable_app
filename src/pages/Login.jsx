import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const role = await login(form);

    if (role === "hotel") navigate("/hotel/dashboard");
    else if (role === "security") navigate("/security/dashboard");
  };

  return (
    <form onSubmit={submit}>
      <input type="text" placeholder="Phone" onChange={(e)=>setForm({...form, phone:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form, password:e.target.value})}/>
      <button type="submit">Login</button>
    </form>
  );
}
