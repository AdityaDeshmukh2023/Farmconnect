import './dashboard.css';
import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun, faSeedling, faGlobe, faWater, faChartLine } from "@fortawesome/free-solid-svg-icons";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [weather, setWeather] = useState({
    temperature: "Loading...",
    condition: "Loading...",
    wind: "Loading...",
    humidity: "Loading...",
    icon: faCloudSun,
  });

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

        // Check if weatherData and weatherData.main are available
        if (data && data.main) {
          setWeather({
            temperature: Math.floor(data.main.temp - 273.15) + "°C",
            condition: data.weather[0].main,
            wind: data.wind.speed + "m/s",
            humidity: data.main.humidity + "%",
            icon: faCloudSun,
          });
        }
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

  const cropData = {
    labels: ["Wheat", "Rice", "Corn", "Barley", "Soybean"],
    datasets: [
      {
        label: "Crop Yield (tons)",
        data: [30, 45, 25, 15, 20],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const marketData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Crop Prices (USD)",
        data: [120, 130, 125, 140, 135],
        borderColor: "rgba(255, 99, 132, 0.8)",
        fill: false,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <section id="weather" className="dashboard-card weather-card">
        <h2>
          <FontAwesomeIcon icon={weather.icon} /> Weather Updates
        </h2>
        <div className="weather-details">
          <p><strong>Temperature:</strong> {weather.temperature}</p>
          <p><strong>Condition:</strong> {weather.condition}</p>
          <p><strong>Wind:</strong> {weather.wind}</p>
          <p><strong>Humidity:</strong> {weather.humidity}</p>
        </div>
      </section>

      <section id="crop-monitoring" className="dashboard-card crop-monitoring-card">
        <h2>
          <FontAwesomeIcon icon={faSeedling} /> Crop Monitoring
        </h2>
        <div className="chart-container">
          <Bar data={cropData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </section>

      <section id="soil-health" className="dashboard-card soil-health-card">
        <h2>
          <FontAwesomeIcon icon={faGlobe} /> Soil Health
        </h2>
        <p><strong>Moisture Level:</strong> Adequate</p>
        <p><strong>Nutrients:</strong> Nitrogen, Phosphorus, Potassium</p>
      </section>

      <section id="irrigation" className="dashboard-card irrigation-card">
        <h2>
          <FontAwesomeIcon icon={faWater} /> Irrigation Management
        </h2>
        <p><strong>Schedule:</strong> Morning, 6 AM - 9 AM</p>
        <p><strong>Efficiency:</strong> 90%</p>
      </section>

      <section id="market" className="dashboard-card market-analysis-card">
        <h2>
          <FontAwesomeIcon icon={faChartLine} /> Market Analysis
        </h2>
        <div className="chart-container">
          <Line data={marketData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </section>
    </div>
  );
}
