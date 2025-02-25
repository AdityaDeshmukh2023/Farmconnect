import Navbar from '../navbar/Navbar';
import './layout.css';
import Sidebar from '../../components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes  from 'prop-types'

export default function Layout(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="layoutLeft">
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>
        <div className="layoutRight">
          <Navbar name={"Yash Maske"} city={props.city}/>
          <Outlet/>
        </div>
      </div>
    </>
  );
}

Layout.propTypes = {
    city : PropTypes.string,
    name : PropTypes.string,

  }