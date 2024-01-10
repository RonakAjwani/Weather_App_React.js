import React, { useState, useEffect } from 'react';
import './WeatherApp.css'; // Import the CSS file for styling
import clearSkyImage from './clear-sky-background.jpg';
import cloudyImage from './cloudy-background.jpg';
import rainyImage from './rainy-background.jpg';
import defaultImage from './default-background.jpg';
import logo from './logo1.jpeg';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(defaultImage);
  const [cityNotFound, setCityNotFound] = useState(false);

  const API_KEY = '973f4f6e8656b1e2247f33a008e5c235';

  const fetchWeatherByLocation = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${API_KEY}&units=metric`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setBackgroundImage(getBackgroundImage());
        setCityNotFound(false);
      } else {
        setWeatherData(null);
        setCityNotFound(true);
        setBackgroundImage(defaultImage);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      setCityNotFound(true);
      setBackgroundImage(defaultImage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userLocation !== '') {
      fetchWeatherByLocation();
    }
  };

  const getBackgroundImage = () => {
    if (!weatherData) return defaultImage;

    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    switch (weatherCondition) {
      case 'clear':
        return clearSkyImage;
      case 'clouds':
        return cloudyImage;
      case 'rain':
        return rainyImage;
      default:
        return defaultImage;
    }
  };

  return (
    <div
      className="weather-app"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="app-title">
        <img src={logo} alt="App Logo" className="app-logo" />
        <h1>Weather App</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter location"
          value={userLocation}
          onChange={(e) => setUserLocation(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Get Weather
        </button>
      </form>
      {cityNotFound && (
        <p className="city-not-found">Location not found. Please try again.</p>
      )}
      {weatherData && (
        <div className="weather-info">
          <h2 className="weather-city">{weatherData.name}</h2>
          <p className="weather-temp">Temperature: {weatherData.main.temp}°C</p>
          <p className="weather-desc">
            Description: {weatherData.weather[0].description}
          </p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          {weatherData.weather[0].icon && (
            <img
              src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              alt="weather-icon"
              className="weather-icon"
            />
          )}
        </div>
      )}
      <footer className="company-name">
        Made by Ronak &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default WeatherApp;