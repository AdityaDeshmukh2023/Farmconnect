import './navLand.css';
import PropTypes from 'prop-types';
import { Link ,NavLink} from 'react-router-dom';
import {getToken} from '../../services/LocalStorageService'
import {Button} from '@mui/material'
export default function NavLand(props) {
  const { Handle } = props;
  // console.log(Handle)

  const {access_token} = getToken()
  // console.log(access_token);
  return (
    <header>
      <div className='landing-page'>
        <div className="navbar">
          <Link to="/">
            <div className="nav-logo border">
              <div className="mainlogo"></div>
            </div>
          </Link>

          {/* Hamburger icon to open sidebar */}

          {/* Rest of Navbar content remains the same */}
          <div className="nav-address border">
            <div className="add-icon">
              <pre><i className="fa-solid fa-location-dot"></i><p className="add-sec">{props.city}</p></pre>
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

          <div className="nav-signin border">
            {/* <p><span className='signInClick' >{props.signInfo} </span></p>
            <p>{props.name}</p> */}
            {/* <p className="nav-second">Accounts</p> */}
          
            {access_token ?   <Button component={NavLink} to='/application/land' className='signInClick'>Home</Button> :  <Button component={NavLink} to='/auth' className='signInClick'>Login/Register</Button> }
          
          </div>
        </div>
      </div>

      {/* Add the Slidebar component here */}
    </header>
  );
}

NavLand.propTypes = {
  city: PropTypes.string,
  signInfo: PropTypes.string,
  name: PropTypes.string,
  Handle: PropTypes.func,

};
