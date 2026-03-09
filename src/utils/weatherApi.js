const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const getWeatherType = (tempF) => {
  if (tempF >= 86) return 'Hot';
  if (tempF >= 66) return 'Warm';
  return 'Cold';
};

export const toCelsius = (f) => Math.round((f - 32) * (5 / 9));

const getWeatherByCoords = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const temp = Math.round(data.main?.temp ?? 72);
      return {
        temp,
        type: getWeatherType(temp),
        city: data.name || 'Your City',
        description: data.weather?.[0]?.description || '',
      };
    })
    .catch(() => ({
      temp: 72,
      type: 'Warm',
      city: 'New York',
      description: 'clear sky',
    }));
};

export const fetchWeather = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getWeatherByCoords(40.7128, -74.006));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve(getWeatherByCoords(coords.latitude, coords.longitude)),
      () => resolve(getWeatherByCoords(40.7128, -74.006))
    );
  });
