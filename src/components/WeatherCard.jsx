import React from 'react';
import { toCelsius } from '../utils/weatherApi';
import './WeatherCard.css';

const WeatherCard = ({ weatherData, isCelsius }) => {
  const { temp, type, city } = weatherData || {};

  const displayTemp =
    temp != null ? (isCelsius ? `${toCelsius(temp)}°C` : `${temp}°F`) : '...';

  const getWeatherIcon = (t) => {
    if (t === 'Hot') return '☀️';
    if (t === 'Warm') return '🌤️';
    return '❄️';
  };

  return (
    <div className="weather-card">
      <div className="weather-card__left">
        <p className="weather-card__temp">{displayTemp}</p>
        <p className="weather-card__city">{city || 'Loading...'}</p>
      </div>
      <div className="weather-card__right">
        <span className="weather-card__icon">{getWeatherIcon(type)}</span>
      </div>
    </div>
  );
};

export default WeatherCard;
