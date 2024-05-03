import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("https://pqpuuzpdmzabgmwyitrt.supabase.co/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcHV1enBkbXphYmdtd3lpdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NTQzNDUsImV4cCI6MjAzMDIzMDM0NX0.Zbu9RinGiMzpM-GQf5RNv41r0R4OUOmM4mIAvSninJU",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcHV1enBkbXphYmdtd3lpdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NTQzNDUsImV4cCI6MjAzMDIzMDM0NX0.Zbu9RinGiMzpM-GQf5RNv41r0R4OUOmM4mIAvSninJU",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("auth", JSON.stringify(data));
      navigate("/");
    } else {
      alert("Login failed!");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" bg="gray.100" p={2} borderRadius="md" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" bg="gray.100" p={2} borderRadius="md" />
        <button type="submit" style={{ backgroundColor: "teal", color: "white", padding: "10px 20px", borderRadius: "5px" }}>
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;
