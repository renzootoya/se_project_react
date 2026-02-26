import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weather, temperature, description }) => {
  const getWeatherIcon = (w) => {
    const weatherMap = {
      'Hot': '☀️',
      'Warm': '🌤️',
      'Cool': '🌥️',
      'Cold': '❄️'
    };
    return weatherMap[w] || '🌡️';
  };

  return (
    <div className="weather-card">
      <div className="weather-icon">
        {getWeatherIcon(weather)}
      </div>
      <div className="weather-info">
        <h3>{weather}</h3>
        {temperature && <p className="temperature">{temperature}°</p>}
        {description && <p className="description">{description}</p>}
      </div>
    </div>
  );
};

export default WeatherCard;
