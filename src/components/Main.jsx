import React from 'react';
import ItemCard from './ItemCard';
import WeatherCard from './WeatherCard';
import './Main.css';

const Main = ({ isLoggedIn, clothingItems, onCardLike, weatherData, isCelsius }) => {
  // Filter items to only show those matching the current weather type
  const filteredItems = weatherData?.type
    ? clothingItems.filter((item) =>
        Array.isArray(item.weather) && item.weather.includes(weatherData.type)
      )
    : clothingItems;

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} isCelsius={isCelsius} />
      <section className="main__clothes">
        {filteredItems.length === 0 ? (
          <p className="main__empty">
            {clothingItems.length === 0
              ? 'No clothing items yet. Add some!'
              : `No ${weatherData?.type?.toLowerCase() || ''} weather items yet.`}
          </p>
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
