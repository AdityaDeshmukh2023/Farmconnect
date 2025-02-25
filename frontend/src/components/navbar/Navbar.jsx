import './navbar.css';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../../services/LocalStorageService';
import { useGetLoggedUserQuery } from '../../services/userAuthApi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, unSetUserInfo } from '../../features/userSlice';
import { unSetUserToekn } from '../../features/authSlice';

export default function Navbar(props) {
  const { Handle } = props;
  const { access_token } = getToken();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mydata = useSelector((state) => state.user_info);
  // console.log(data);
  const [userData, setUserData] = useState({
    email: '',
    name: '',
  });

  useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        email: data.email,
        name: data.name,
      });
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(
        setUserInfo({
          email: data.email,
          name: data.name,
        })
      );
    }
  }, [data, isSuccess, dispatch]);

  // Logout Handler
  const handleLogout = async () => {
    removeToken();
    dispatch(unSetUserToekn());
    dispatch(unSetUserInfo());
    navigate('/auth', { replace: true });
  };

  return (
    <header>
      <div className='landing-page'>
        <div className="navbar">
          <Link to="land">
            <div className="nav-logo border">
              <div className="mainlogo"></div>
            </div>
          </Link>

          <div className="nav-address border">
            <div className="add-icon">
              <pre>
                <i className="fa-solid fa-location-dot"></i>
                <p className="add-sec">{props.city}</p>
              </pre>
            </div>
          </div>

          <div className="nav-search">
            <select className="search-select">
              <option value="">All</option>
            </select>
            <input
              type="text"
              placeholder="Search Farm-Connect"
              className="search-input"
            />
            <div className="search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>

          {/* Nav Sign-in Section with Dropdown */}
          <div className="nav-signin border" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <p>
              <span className='signInClick'>Hello,</span>
            </p>
            <p className='signInClick'>
              {mydata['name'] || 'User'}
            </p>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li><i>Hii, {mydata['name'] || 'User'}</i></li> {/* Centered Name */}
                  <li onClick={() => navigate('/application/profile-view')}>
                    <i className="fa-solid fa-user"></i> View Profile
                  </li>
                  <li onClick={() => navigate('/application/change-password')}>
                    <i className="fa-solid fa-key"></i> Change Password
                  </li>
                  <li onClick={handleLogout}>
                    <i className="fa-solid fa-sign-out-alt"></i> Logout
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  city: PropTypes.string,
  signInfo: PropTypes.string,
  name: PropTypes.string,
  Handle: PropTypes.func,
};
