import { useNavigate } from "react-router-dom";
import { LogOut, Image as ImageIcon } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <div className="logo-icon">
            <ImageIcon size={20} />
          </div>
          <span className="logo-text">Iris</span>
        </div>
        
        <div className="navbar-actions">
          <button className="logout-button" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}