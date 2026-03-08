const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Map temperature (°F) to TripleTen weather type (Hot / Warm / Cold — no Cool)
const getTempType = (tempF) => {
  if (tempF >= 86) return 'Hot';
  if (tempF >= 66) return 'Warm';
  return 'Cold';
};

// Convert Fahrenheit → Celsius
export const toCelsius = (f) => Math.round((f - 32) * (5 / 9));

export const getWeatherByCoords = (lat, lon) => {
  if (!API_KEY) {
    // No API key — return a neutral placeholder so the app still renders
    return Promise.resolve({
      temp: 72,
      type: 'Warm',
      city: 'Your City',
    });
  }

  return fetch(
    `${BASE_URL}?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
    .then((res) => {
      if (!res.ok) throw new Error('Weather fetch failed');
      return res.json();
    })
    .then((data) => ({
      temp: Math.round(data.main.temp),
      type: getTempType(data.main.temp),
      city: data.name,
    }))
    .catch(() => ({
      temp: 72,
      type: 'Warm',
      city: 'Your City',
    }));
};

export const fetchWeather = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getWeatherByCoords(40.7128, -74.006)); // fallback: New York
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(getWeatherByCoords(coords.latitude, coords.longitude)),
      () => resolve(getWeatherByCoords(40.7128, -74.006)) // denied — fallback
    );
  });
