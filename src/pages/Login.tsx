import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import "./Auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(import.meta.env.VITE_LOGIN, {
        username,
        password,
      });
      const { token, userDto } = response.data;

      localStorage.setItem("token", token);
      console.log("Welcome back: ", userDto.username);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>
        
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="input-container">
              <Mail className="input-icon" size={18} />
              <input 
                className="input-field"  
                placeholder="Email or Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-container">
              <Lock className="input-icon" size={18} />
              <input 
                className="input-field" 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : (
              <>
                <LogIn size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                <span>Sign in</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
}