WeatherNow – React Weather App
WeatherNow is a fast and interactive React app that allows outdoor enthusiasts to check the current weather for any city and their current location. It uses Open-Meteo API for weather and geocoding data, Google Maps for visualization, and Tailwind CSS for a modern UI.

Features
Instant Weather: Check current weather for any city worldwide.

Current Location: Get weather for your device’s location with one click (uses browser geolocation).

Autocomplete City Search: City name suggestions as you type.

Google Maps Background: Visualizes selected/city location as a map background.

Modern UI: Clean design powered by Tailwind CSS.

Demo
<img width="1893" height="943" alt="image" src="https://github.com/user-attachments/assets/facc5c27-fbc1-4a23-8800-99989f945bf5" />


Getting Started
Clone the repository:

bash
git clone https://github.com/yourusername/weathernow.git
cd weathernow
Install dependencies:

bash
npm install
Set up Tailwind CSS:

Follow Tailwind CSS Installation Guide for React.

Ensure your index.css or global styles include Tailwind’s base config.

Run the app:

bash
npm start
Usage Notes
The app fetches weather from Open-Meteo API.

City autocomplete and geocoding work with Open-Meteo’s free endpoints.

Google Maps is shown as a background via an iframe — no API key needed for basic visualization.

Uses browser’s location permissions for current location weather.

All styles use Tailwind utility classes for fast, responsive design.

Technologies
React

Open-Meteo API

Google Maps (Iframe)

Tailwind CSS

Axios
