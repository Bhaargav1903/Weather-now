import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherNow() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [locationLabel, setLocationLabel] = useState('');

  // Get weather by coordinates
const fetchWeather = async (latitude, longitude, locationLabel = '') => {
  setLoading(true);
  setError('');
  setWeather(null);

  try {
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    // If locationLabel is "Current Location", try to fetch the city name using reverse geocoding
    let displayLabel = locationLabel;
    if (locationLabel === "Current Location") {
      try {
        const reverseRes = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`
        );
        const cityName = reverseRes.data.results?.[0]?.name;
        if (cityName) {
          displayLabel = `Current Location (${cityName})`;
        }
      } catch {
        // ignore reverse lookup failure, keep default label
      }
    }

    setWeather(weatherRes.data.current_weather);
    setCoords({ latitude, longitude });
    setLocationLabel(displayLabel);
    setCity(displayLabel === "Current Location" ? "" : displayLabel);
  } catch (e) {
    setError('Could not fetch weather data');
  }

  setLoading(false);
};

  // Suggest cities as user types
  const handleCityInput = async (e) => {
    const inputValue = e.target.value;
    setCity(inputValue);
    setLocationLabel('');
    if (inputValue.length >= 3) {
      try {
        const res = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputValue)}&count=5`
        );
        setSuggestions(res.data.results || []);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Set selected city from suggestions
  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setSuggestions([]);
    fetchWeather(suggestion.latitude, suggestion.longitude, suggestion.name);
    setShowMap(true);
  };

  // Manual search (fallback to first match)
  const handleSearch = async () => {
    setError('');
    setWeather(null);
    setSuggestions([]);
    setLocationLabel('');
    try {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        setError('City not found');
        return;
      }
      const { latitude, longitude, name } = geoRes.data.results[0];
      fetchWeather(latitude, longitude, name);
      setShowMap(true);
    } catch {
      setError('Could not fetch weather data');
    }
  };

  // Ask for current location on page load
  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, "Current Location");
          setShowMap(true);
        },
        () => {
          // User denied or location unavailable; fallback to manual search
        }
      );
    }
  }, []);

  // Create a Google Maps embed URL if coordinates available
  const mapUrl = coords
    ? `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&z=13&output=embed`
    : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50">
  {showMap && mapUrl && (
    <iframe
      title="Current Location Map"
      src={mapUrl}
      className="fixed top-0 left-0 w-screen h-screen z-0 border-none filter brightness-70 blur-sm"
      aria-hidden="true"
      tabIndex="-1"
    />
  )}

  <div
    className={`relative z-10 max-w-md mx-auto p-8 ${
      showMap ? "bg-white/90 backdrop-blur-md" : "bg-white"
    } rounded-2xl shadow-2xl mt-24 border border-gray-100`}
  >
    <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
      🌤 Weather Now
    </h2>

    {/* Search Box */}
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <input
        type="text"
        value={city}
        placeholder="Enter city name"
        onChange={handleCityInput}
        autoComplete="off"
        className="flex-grow w-full sm:w-auto p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className={`px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Loading..." : "Check"}
      </button>
    </div>

    {/* Suggestions Dropdown */}
    {suggestions.length > 0 && (
      <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition"
            onClick={() => handleSuggestionClick(s)}
          >
            {s.name}, {s.country}
          </div>
        ))}
      </div>
    )}

    {/* Error Message */}
    {error && <div className="text-red-600 mt-4 text-center">{error}</div>}

    {/* Weather Details */}
    {weather && (
      <div className="mt-8 text-lg text-gray-800">
        <h4 className="font-semibold text-xl text-blue-700 mb-3 text-center">
          Weather in {locationLabel || city}
        </h4>
        <div className="space-y-1 text-center">
          <div>🌡 Temperature: <span className="font-medium">{weather.temperature}°C</span></div>
          <div>💨 Wind Speed: <span className="font-medium">{weather.windspeed} km/h</span></div>
          <div>☁️ Weather Code: <span className="font-medium">{weather.weathercode}</span></div>
          {coords && (
            <div className="mt-2 text-sm text-gray-500">
              📍 Lat: {coords.latitude.toFixed(4)}, Lon: {coords.longitude.toFixed(4)}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

  );
}

export default WeatherNow;
