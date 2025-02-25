import Navbar from '../navbar/Navbar';
import './layout.css';
import Sidebar from '../../components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function Layout(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  
  const HandleUserClick = () =>{
    navigate('profile-view');
  }
  return (
    <>
      <div className={`layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="layoutLeft">
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>
        <div className="layoutRight">
         
          <div className="layoutRightTop">
            <Navbar signInfo={"Yash Maske"} city={props.city} Handle={HandleUserClick} />
          </div>

         
          <div className="layoutRightBottom">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

Layout.propTypes = {
  city: PropTypes.string,
  name: PropTypes.string,
};
