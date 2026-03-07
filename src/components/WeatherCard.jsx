import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weather, temperature }) => {
  const getWeatherIcon = (w) => {
    const weatherMap = {
      Hot: '☀️',
      Warm: '🌤️',
      Cool: '🌥️',
      Cold: '❄️',
    };
    return weatherMap[w] || '🌡️';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="weather-card">
      <div className="weather-card__info">
        <p className="weather-card__temp">
          {temperature ? `${temperature}°F` : '—'}
        </p>
        <p className="weather-card__description">
          {weather ? `It's ${weather.toLowerCase()} today` : currentDate}
        </p>
      </div>
      <div className="weather-card__image-container">
        <p className="weather-card__icon">{getWeatherIcon(weather)}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
