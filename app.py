from flask import Flask, render_template, request, jsonify, make_response
from database import init_db, save_weather_search, get_recent_searches
from weather_service import get_weather, get_all_counties
from claude_service import get_county_description, get_multi_descriptions
import csv
from io import StringIO
from datetime import datetime

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Initialize database on startup
init_db()

@app.route('/')
def index():
    """Main page - display form and recent searches."""
    counties = get_all_counties()
    recent_searches = get_recent_searches(10)
    return render_template('index.html', counties=counties, recent_searches=recent_searches)

@app.route('/get-weather', methods=['POST'])
def get_weather_form():
    """Handle form-based weather request (page refresh)."""
    county = request.form.get('county', '').strip()
    
    if not county:
        counties = get_all_counties()
        recent_searches = get_recent_searches(10)
        return render_template('index.html', 
                             counties=counties, 
                             recent_searches=recent_searches,
                             error="Please select a county.")
    
    weather_data = get_weather(county)
    
    if weather_data.get('error'):
        counties = get_all_counties()
        recent_searches = get_recent_searches(10)
        return render_template('index.html', 
                             counties=counties, 
                             recent_searches=recent_searches,
                             error=weather_data['error'])
    
    # Save to database
    save_weather_search(
        county=weather_data['county'],
        temperature=weather_data['temperature'],
        conditions=weather_data['conditions'],
        wind_speed=weather_data['wind_speed']
    )
    
    # Refresh recent searches
    recent_searches = get_recent_searches(10)
    
    counties = get_all_counties()
    return render_template('index.html', 
                         counties=counties, 
                         weather=weather_data,
                         recent_searches=recent_searches)

@app.route('/api/weather', methods=['POST'])
def get_weather_api():
    """Handle AJAX weather request (returns JSON)."""
    data = request.get_json()
    county = data.get('county', '').strip()
    
    if not county:
        return jsonify({'error': 'Please select a county.'}), 400
    
    weather_data = get_weather(county)
    
    if weather_data.get('error'):
        return jsonify(weather_data), 400
    
    # Save to database
    save_weather_search(
        county=weather_data['county'],
        temperature=weather_data['temperature'],
        conditions=weather_data['conditions'],
        wind_speed=weather_data['wind_speed']
    )
    
    return jsonify(weather_data), 200

@app.route('/api/recent-searches', methods=['GET'])
def api_recent_searches():
    """API endpoint to fetch recent searches as JSON."""
    searches = get_recent_searches(10)
    result = []
    for search in searches:
        result.append({
            'county': search['county'],
            'temperature': search['temperature'],
            'conditions': search['conditions'],
            'wind_speed': search['wind_speed'],
            'timestamp': search['timestamp']
        })
    return jsonify(result), 200

@app.route('/api/county-description', methods=['POST'])
def api_county_description():
    """Fetch AI-generated county description with brief/detailed toggle."""
    try:
        data = request.get_json()
        county = data.get('county', '').strip()
        brief = data.get('brief', True)  # True for brief, False for detailed
        
        if not county:
            return jsonify({'error': 'County name required'}), 400
        
        result = get_county_description(county, brief=brief)
        
        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/county-descriptions', methods=['POST'])
def api_county_descriptions():
    """Fetch both brief and detailed descriptions for a county."""
    try:
        data = request.get_json()
        county = data.get('county', '').strip()
        
        if not county:
            return jsonify({'error': 'County name required'}), 400
        
        result = get_multi_descriptions(county)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/export-csv', methods=['GET'])
def export_csv():
    """Export weather search history as CSV."""
    try:
        searches = get_recent_searches(limit=1000)
        
        if not searches:
            return jsonify({'error': 'No data to export'}), 400
        
        # Create CSV in memory
        si = StringIO()
        writer = csv.writer(si)
        
        # Write header
        writer.writerow(['County', 'Temperature (°C)', 'Conditions', 'Wind Speed (km/h)', 'Timestamp'])
        
        # Write data rows
        for search in searches:
            writer.writerow([
                search['county'],
                round(search['temperature'], 1),
                search['conditions'],
                round(search['wind_speed'], 1),
                search['timestamp']
            ])
        
        # Create response
        output = make_response(si.getvalue())
        timestamp = datetime.now().strftime('%Y-%m-%d')
        output.headers["Content-Disposition"] = f"attachment; filename=liberia-weather-{timestamp}.csv"
        output.headers["Content-type"] = "text/csv"
        
        return output
    except Exception as e:
        return jsonify({'error': f'Export failed: {str(e)}'}), 500

@app.errorhandler(404)
def page_not_found(error):
    """Handle 404 errors."""
    return render_template('index.html', error="Page not found."), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return render_template('index.html', error="Internal server error."), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
