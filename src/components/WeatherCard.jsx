import React from 'react';
import { toCelsius } from '../utils/weatherApi';
import './WeatherCard.css';

const WEATHER_ICONS = {
  Hot: '☀️',
  Warm: '🌤️',
  Cold: '❄️',
};

const WeatherCard = ({ weatherData, isCelsius }) => {
  const { temp, type, city } = weatherData || {};

  const displayTemp = temp != null
    ? (isCelsius ? toCelsius(temp) : temp)
    : null;

  const unit = isCelsius ? '°C' : '°F';

  return (
    <div className="weather-card">
      <div className="weather-card__info">
        <p className="weather-card__temp">
          {displayTemp != null ? `${displayTemp}${unit}` : '—'}
        </p>
        <p className="weather-card__description">
          {type
            ? `It's ${type.toLowerCase()} today${city ? ` in ${city}` : ''}`
            : 'Loading weather…'}
        </p>
      </div>
      <div className="weather-card__image-container">
        <span className="weather-card__icon">
          {WEATHER_ICONS[type] || '🌡️'}
        </span>
      </div>
    </div>
  );
};

export default WeatherCard;
