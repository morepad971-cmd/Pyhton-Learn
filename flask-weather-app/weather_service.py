import requests
from datetime import datetime

# Liberian counties with their geographic coordinates (center points)
LIBERIAN_COUNTIES = {
    'Bomi': {'lat': 6.75, 'lon': -11.23},
    'Bong': {'lat': 7.17, 'lon': -9.53},
    'Gbarpolu': {'lat': 7.41, 'lon': -9.95},
    'Grand Bassa': {'lat': 5.87, 'lon': -9.70},
    'Grand Cape Mount': {'lat': 7.30, 'lon': -11.37},
    'Grand Gedeh': {'lat': 4.43, 'lon': -8.44},
    'Grand Kru': {'lat': 4.08, 'lon': -8.15},
    'Lofa': {'lat': 8.41, 'lon': -10.13},
    'Margibi': {'lat': 6.30, 'lon': -10.18},
    'Maryland': {'lat': 4.69, 'lon': -7.58},
    'Montserrado': {'lat': 6.31, 'lon': -10.81},
    'Nimba': {'lat': 7.63, 'lon': -8.82},
    'River Cess': {'lat': 5.34, 'lon': -9.13},
    'River Gee': {'lat': 4.80, 'lon': -8.71},
    'Sinoe': {'lat': 5.00, 'lon': -10.91}
}

OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast"

# Weather code descriptions (WMO code interpretation)
WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

def get_weather(county):
    """
    Fetch current weather for a Liberian county.
    
    Args:
        county (str): Name of the county in Liberia
        
    Returns:
        dict: Weather data including temperature, conditions, wind_speed, or error dict
    """
    if county not in LIBERIAN_COUNTIES:
        return {'error': f"County '{county}' not found. Please select a valid county."}
    
    coords = LIBERIAN_COUNTIES[county]
    
    try:
        params = {
            'latitude': coords['lat'],
            'longitude': coords['lon'],
            'current': 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
            'timezone': 'Africa/Monrovia'
        }
        
        response = requests.get(OPEN_METEO_API_URL, params=params, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        current = data['current']
        
        weather_code = current.get('weather_code', 0)
        conditions = WEATHER_CODES.get(weather_code, "Unknown conditions")
        
        return {
            'error': None,
            'county': county,
            'temperature': current.get('temperature_2m'),
            'conditions': conditions,
            'humidity': current.get('relative_humidity_2m'),
            'wind_speed': current.get('wind_speed_10m'),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    except requests.exceptions.RequestException as e:
        return {'error': f"Failed to fetch weather data: {str(e)}"}
    except (KeyError, ValueError) as e:
        return {'error': f"Error processing weather data: {str(e)}"}

def get_all_counties():
    """Return list of all available Liberian counties."""
    return sorted(list(LIBERIAN_COUNTIES.keys()))
