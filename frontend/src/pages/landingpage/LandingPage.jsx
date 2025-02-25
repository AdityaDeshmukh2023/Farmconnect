import NavLand from '../../components/navbarforland/NavLand';
import Footer from '../../components/footer/Footer';
import Land from '../../components/land/Land'
import Auth from '../../pages/auth/Auth'
import PropTypes  from 'prop-types'
import { Routes,Route } from 'react-router-dom';
import { useNavigate,} from 'react-router-dom';
import { useEffect, useState } from "react";





const API_END_POINT = `https://api.opencagedata.com/geocode/v1/json`;
const API_KEY = `69625b2257bc4e5db5ebbfe09b4c2953`;


export default function LandingPage(prop) {
  const [error, setError] = useState('');
 
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);



  console.log(error);
  useEffect(() => {
      if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude } = position.coords;
                  setLatitude(latitude);
                  setLongitude(longitude);
              },
              (err) => {
                  setError('Failed to fetch geolocation. Please allow location access.');
              }
          );
      } else {
          setError('Geolocation is not supported by this browser.');
      }
  }, []);

  const getUserCurrentLocation = async (latitude, longitude) => {
      let query = `${latitude},${longitude}`;
      let apiURL = `${API_END_POINT}?key=${API_KEY}&q=${query}&pretty=1`;

      try {
          const res = await fetch(apiURL);
          const data = await res.json();

          if (data && data.results && data.results.length > 0) {
              const result = data.results[0];
              setAddress({
                  formatted: result.formatted,
                  city: result.components.city,
                  state: result.components.state,
                  country: result.components.country,
                  postcode: result.components.postcode,
                  town: result.components.town,
                  village: result.components.village,
              });
          }
      } catch (error) {
          setError('Failed to fetch address data.');
      }
  };

  useEffect(() => {
      if (latitude && longitude) {
          getUserCurrentLocation(latitude, longitude);
      }
  }, [latitude, longitude]);

  let myCity = address?.town || address?.village || address?.city;

  const HandleSignInClick = () => {
    navigate('/auth');
  };

  const SignIn = () =>{
    return <Auth/>
  }

  const SignOut = (props) =>{
    return (
      <>
      <NavLand city={myCity}  signInfo={props.signInfo} Handle={HandleSignInClick} />
      <Land/>
      <Footer/>
      </>
    )
  }
  return (
   
      <Routes>
        <Route path="/" element={<SignOut city={prop.city} signInfo={prop.signInfo}/>}/> 
        <Route path="auth" element={<SignIn/>}/> 
      </Routes>
   
  )
}


LandingPage.propTypes = {
    city : PropTypes.string,
    name : PropTypes.string,
    signInfo : PropTypes.string,

  }