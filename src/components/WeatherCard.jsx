import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weather, temperature }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const getWeatherLabel = (w) => {
    const labels = {
      Hot: 'Today is hot',
      Warm: 'Today is warm',
      Cool: 'Today is cool',
      Cold: 'Today is cold',
    };
    return labels[w] || 'Browse the collection';
  };

  const getWeatherBg = (w) => {
    const bgs = {
      Hot: 'linear-gradient(135deg, #b34700 0%, #e87722 100%)',
      Warm: 'linear-gradient(135deg, #1a6b3a 0%, #2d9e58 100%)',
      Cool: 'linear-gradient(135deg, #1a4f7a 0%, #2e7eb8 100%)',
      Cold: 'linear-gradient(135deg, #2c3e6b 0%, #4a5f9e 100%)',
    };
    return bgs[w] || 'linear-gradient(135deg, #1f1f1f 0%, #3d3d3d 100%)';
  };

  const getWeatherIcon = (w) => {
    const icons = { Hot: '☀️', Warm: '🌤️', Cool: '🌥️', Cold: '❄️' };
    return icons[w] || '👗';
  };

  return (
    <div className="weather-card" style={{ background: getWeatherBg(weather) }}>
      <div className="weather-card__left">
        <p className="weather-card__date">{dateStr}</p>
        <p className="weather-card__label">{getWeatherLabel(weather)}</p>
        <p className="weather-card__sub">
          {weather
            ? 'Here are the clothes recommended for the weather'
            : 'Find the perfect outfit for any weather'}
        </p>
      </div>
      <div className="weather-card__right">
        {temperature
          ? <p className="weather-card__temp">{temperature}°F</p>
          : <p className="weather-card__icon">{getWeatherIcon(weather)}</p>
        }
      </div>
    </div>
  );
};

export default WeatherCard;
