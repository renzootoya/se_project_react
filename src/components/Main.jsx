import React from 'react';
import ItemCard from './ItemCard';
import WeatherCard from './WeatherCard';
import './Main.css';

const Main = ({ isLoggedIn, clothingItems, onCardLike, weatherData, isCelsius }) => {
  const filteredItems = weatherData?.type
    ? clothingItems.filter((item) => {
        const weatherArr = Array.isArray(item.weather) ? item.weather : [item.weather];
        return weatherArr.map((w) => w.toLowerCase()).includes(weatherData.type.toLowerCase());
      })
    : clothingItems;

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} isCelsius={isCelsius} />
      <section className="main__clothes">
        <div className="main__section-header">
          <h2 className="main__section-title">
            Today is {weatherData?.type || 'nice'}, you may want to wear:
          </h2>
        </div>
        {filteredItems.length === 0 ? (
          <p className="main__empty">No clothing items for this weather yet.</p>
        ) : (
          <div className="main__cards">
            {filteredItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isLoggedIn={isLoggedIn}
                onCardLike={onCardLike}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Main;
