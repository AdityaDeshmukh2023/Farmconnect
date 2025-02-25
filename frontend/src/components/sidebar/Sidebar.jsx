import './sidebar.css';
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import { FaCloudSun, FaNewspaper, FaLeaf, FaVideo, FaUsers, FaUserTie, FaChartLine, FaSeedling, FaTachometerAlt, FaUser, FaChartPie } from "react-icons/fa";

export default function Sidebar({ toggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItem = [
    { path: "profile-view", name: "My Profile", icon: <FaUser /> },
    { path: "weather", name: "Weather Forecasting", icon: <FaCloudSun /> },
    { path: "dashboard", name: "My Farm Dashboard", icon: <FaTachometerAlt /> },
    { path: "news", name: "News & Schemes", icon: <FaNewspaper /> },
    { path: "greenscan", name: "GreenScan Diagnostics", icon: <FaLeaf /> },
    { path: "crop-prediction", name: "Crop Prediction", icon: <FaSeedling /> },
    { path: "market", name: "Market Analysis", icon: <FaChartLine /> },
    { path: "guidance", name: "Dairy & Poultry Guidance", icon: <FaChartPie /> },
    { path: "agriloop", name: "AgriLoop (Reel)", icon: <FaVideo /> },
    { path: "community", name: "Community Sharing", icon: <FaUsers /> },
    { path: "expert", name: "Expert Connections", icon: <FaUserTie /> },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (toggleSidebar) toggleSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div style={{ width: isOpen ? "250px" : "80px" }} className="sidebarr">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            <Link to="land">
              <img src="/assets/logo.png" alt="Farm Connect Logo" style={{ width: "150px", height: "auto" }} />
            </Link>
          </h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={handleToggle} />
          </div>
        </div>
        <div className="sidebarLinkContainer">
        <div className="sidebarLinks">
          {menuItem.map((item, index) => (
            <NavLink 
              to={item.path} 
              className={({ isActive }) => `link ${isActive ? 'active' : ''}`} 
              key={index}
            >
              <div className="icon">{item.icon}</div>
              <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
            </NavLink>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
