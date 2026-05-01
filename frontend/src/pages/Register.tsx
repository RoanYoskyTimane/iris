import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import api from "../api/client";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock } from "lucide-react";
import "./Auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(import.meta.env.VITE_REGISTER, { username, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Registration failed. Please try a different username.");
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
          <h1>Create Account</h1>
          <p>Join us and start processing your images</p>
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

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <div className="input-container">
              <Mail className="input-icon" size={18} />
              <input 
                className="input-field" 
                type="text" 
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
            {loading ? "Creating account..." : (
              <>
                <UserPlus size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}