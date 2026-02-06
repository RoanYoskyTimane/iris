import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useState, type FormEvent } from "react";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");

    try {
      const response = await api.post(import.meta.env.VITE_LOGIN, {
      username,
      password,
    });
      const {token, userDto} = response.data;

      localStorage.setItem("token", token);
      console.log("Welcome back: ", userDto.username);
      navigate("/dashboard");
    }catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Hey, Enter your details to get sign in <br/> to your account</p>
        
        {error && <p style={{ color: "#FA5C5C", fontWeight: "bold" }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input 
              className="input-field"  
              placeholder="Enter Email or Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <input 
              className="input-field" 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Sign in
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
}