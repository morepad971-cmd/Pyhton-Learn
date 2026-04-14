# ⛅ Liberia Weather Finder

A Flask web application that allows users to check current weather conditions for any county in Liberia. Built with Python, Flask, and the free Open-Meteo weather API.

## 🌍 Features

- **County Selection**: Choose from all 15 counties in Liberia via dropdown menu
- **Real-Time Weather**: Get current temperature, conditions, humidity, and wind speed
- **Search History**: Automatic tracking of recent weather searches in SQLite database
- **Responsive Design**: Beautiful gradient UI that works on desktop and mobile
- **No API Key Required**: Uses the free Open-Meteo API with no authentication needed
- **AJAX Ready**: JavaScript included for smooth AJAX updates (can be enabled with one line)

## 📋 Supported Liberian Counties

Bomi, Bong, Gbarpolu, Grand Bassa, Grand Cape Mount, Grand Gedeh, Grand Kru, Lofa, Margibi, Maryland, Montserrado, Nimba, River Cess, River Gee, Sinoe

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation & Setup

1. **Clone or navigate to the project**
   ```bash
   cd flask-weather-app
   ```

2. **Create a virtual environment (optional but recommended)**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   - Navigate to `http://127.0.0.1:5000`
   - Start checking weather!

## 📁 Project Structure

```
flask-weather-app/
├── app.py                 # Main Flask application & routes
├── database.py            # SQLite database setup & queries
├── weather_service.py     # Open-Meteo API integration
├── requirements.txt       # Python dependencies
├── weather.db            # SQLite database (created on first run)
├── README.md             # This file
├── templates/
│   └── index.html        # Main web page template
└── static/
    ├── style.css         # Styling & responsive design
    └── script.js         # AJAX functionality
```

## 🔧 How It Works

### 1. **User Selects County**
   - User chooses a county from the dropdown on the homepage

### 2. **Weather Data Fetched**
   - App converts county name to latitude/longitude coordinates
   - Calls Open-Meteo API with these coordinates
   - Retrieves current weather conditions

### 3. **Data Stored & Displayed**
   - Weather data is saved to SQLite database
   - Results displayed on the page
   - Search history automatically updates

### 4. **View Search History**
   - Recent searches table at the bottom shows past lookups
   - Includes temperature, conditions, wind speed, and timestamp

## ⚡ Enable AJAX Mode (Optional Enhancement)

By default, form submission causes a page refresh. To enable smooth AJAX updates:

1. Open **`static/script.js`**
2. Find line 4: `// weatherForm.addEventListener('submit', handleFormSubmitAJAX);`
3. Uncomment it (remove the `//`)
4. Refresh your browser

Now form submissions will update weather dynamically without page reload!

## 📡 API Details

**Weather Source**: [Open-Meteo](https://open-meteo.com/)

- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Data Retrieved**: Temperature, humidity, weather conditions, wind speed
- **Rate Limit**: Unlimited (generous for hobbyist use)
- **Authentication**: None required

## 💾 Database

**SQLite Table**: `weather_searches`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| county | TEXT | County name |
| temperature | REAL | Temperature in Celsius |
| conditions | TEXT | Weather description |
| wind_speed | REAL | Wind speed in km/h |
| timestamp | DATETIME | When the search was performed |

## 🎨 Customization

### Change Colors
Edit `static/style.css` and modify the gradient colors in the `body` selector:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Weather Data
Edit `weather_service.py` and expand the API parameters or weather codes dictionary.

### Modify County Coordinates
Update the `LIBERIAN_COUNTIES` dictionary in `weather_service.py` with different latitude/longitude values.

## 🐛 Troubleshooting

**Error: `ModuleNotFoundError: No module named 'flask'`**
- Install dependencies: `pip install -r requirements.txt`

**Error: `fatal: no email was given and auto-detection is disabled`**
- Configure git: `git config --global user.email "your@email.com"`

**Port 5000 already in use**
- Edit line in `app.py` from `port=5000` to another port like `port=5001`

**Weather data not loading**
- Check your internet connection
- Verify Open-Meteo API is accessible
- Check browser console for JavaScript errors

## 📦 Dependencies

- **Flask** 2.3.3 - Web framework
- **Requests** 2.31.0 - HTTP library for API calls
- **Werkzeug** 2.3.7 - WSGI utilities

## 🔐 Security Notes

- This is a development application
- Use a production WSGI server (Gunicorn, uWSGI) for deployment
- For production, implement rate limiting and input validation
- Don't commit `.db` files or sensitive data to version control

## 📝 Future Enhancements

- 7-day weather forecast view
- Hourly weather data
- Temperature unit toggle (Celsius/Fahrenheit)
- User authentication for personal weather preferences
- Email notifications for weather alerts
- Weather caching to reduce API calls

## 📄 License

Open source. Feel free to use and modify for learning purposes.

## 👨‍💻 Author

Created as a learning project - Flask Weather Application for Liberian Counties

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

**Enjoy checking the weather in Liberia!** 🌦️
