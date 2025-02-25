import './application.css'
import Layout from '../../components/layout/Layout'
import PropTypes  from 'prop-types'
import { useEffect, useState } from "react";




const API_END_POINT = `https://api.opencagedata.com/geocode/v1/json`;
const API_KEY = `69625b2257bc4e5db5ebbfe09b4c2953`;

export let myCity = null;


export default function Application(props) {

  const [error, setError] = useState('');
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

  myCity = address?.town || address?.village || address?.city;
  


  return (
    <>
    <Layout city={myCity}/>
    </>
  )
}

Application.propTypes = {
    city : PropTypes.string,
    name : PropTypes.string,

  }