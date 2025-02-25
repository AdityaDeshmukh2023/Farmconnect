import './weather.css';
import { useEffect, useState } from 'react';


export default function Weather() {
  const [error, setError] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);

  const [city, setCity] = useState("Pune"); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_END_POINT = `https://api.opencagedata.com/geocode/v1/json`;
  const API_KEY = `69625b2257bc4e5db5ebbfe09b4c2953`;
  const API_KEY_I = "8a4d960a43d4327a1fb9e1dff652d519";

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
        const resolvedCity =
          result.components.city || result.components.town || result.components.village;

        setAddress({
          formatted: result.formatted,
          city: resolvedCity,
          state: result.components.state,
          country: result.components.country,
          postcode: result.components.postcode,
        });

        // console.log(address);
        if (resolvedCity) {
          setCity(resolvedCity); // Update city only if resolved
        }
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

  const fetchWeatherData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_I}`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError(data.message);
        setWeatherData(null);
      } else {
        setWeatherData(data);
      }
    } catch (err) {
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]); // Re-fetch data when the city changes

  const handleOnChange = (event) => {
    setCity(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getWeatherIconUrl = (main) => {
    switch (main) {
      case "Clouds":
        return '/assets/weather/thunder.png';
      case "Rain":
        return '/assets/weather/rain_with_cloud.webp';
      case "Mist":
        return '/assets/weather/Tornado.png';
      case "Haze":
        return '/assets/weather/sun.png';
      default:
        return '/assets/weather/sun.png';
    }
  };

  return (
    <div>
      <div className="weather-app">
        <div className="container">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : weatherData ? (
            <>
              <h1 className="container_date">{formattedDate}</h1>
              <div className="weather_data">
                <h2 className="container_city">{weatherData.name}</h2>
                <p>Coordinates: [{weatherData.coord.lat}, {weatherData.coord.lon}]</p>
                <img
                  src={getWeatherIconUrl(weatherData.weather[0].main)}
                  alt="Weather Icon"
                  className="container_img"
                  width="180px"
                />
                <h2 className="container_degree">
                  {Math.floor(weatherData.main.temp - 273.15)}°C
                </h2>
                <p className="count_par">{weatherData.weather[0].description}</p>
                <div className="extra-details row">
                  <div className="column1">
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                    <p>Wind Direction: {weatherData.wind.deg}°</p>
                    <p>Pressure: {weatherData.main.pressure} hPa</p>
                    <p>Visibility: {weatherData.visibility / 1000} km</p>
                    <p>Cloudiness: {weatherData.clouds.all}%</p>
                  </div>
                  <div className="column2">
                    <p>Weather Condition Code: {weatherData.weather[0].id}</p>
                    <p>Feels Like: {Math.floor(weatherData.main.feels_like - 273.15)}°C</p>
                    <p>Min Temperature: {Math.floor(weatherData.main.temp_min - 273.15)}°C</p>
                    <p>Max Temperature: {Math.floor(weatherData.main.temp_max - 273.15)}°C</p>
                    <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                    <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                    <p>Country: {weatherData.sys.country}</p>
                  </div>
                </div>

                <form className="form" onSubmit={handleOnSubmit}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter City Name"
                    onChange={handleOnChange}
                  />
                  <button type="submit">Search</button>
                </form>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

