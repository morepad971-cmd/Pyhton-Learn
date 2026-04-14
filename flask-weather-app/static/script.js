// AJAX Weather Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weatherForm');
    
    // Uncomment below to enable AJAX mode (disable page refresh)
    // weatherForm.addEventListener('submit', handleFormSubmitAJAX);
});

/**
 * Handle form submission with AJAX (no page refresh)
 * Uncomment the event listener above to enable this
 */
function handleFormSubmitAJAX(event) {
    event.preventDefault();
    
    const county = document.getElementById('county').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!county) {
        showAlert('Please select a county.', 'error');
        return;
    }
    
    // Disable submit button during request
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
    
    fetch('/api/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ county: county })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showAlert(data.error, 'error');
        } else {
            displayWeather(data);
            updateRecentSearches();
            showAlert(`Weather fetched for ${data.county}!`, 'success');
        }
    })
    .catch(error => {
        showAlert('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Weather';
    });
}

/**
 * Display weather data on the page
 */
function displayWeather(weatherData) {
    const weatherDisplay = document.querySelector('.weather-display-section');
    
    if (!weatherDisplay) {
        // Create weather section if it doesn't exist
        createWeatherSection(weatherData);
    } else {
        // Update existing weather section
        updateWeatherDisplay(weatherData);
    }
}

/**
 * Create weather display section if it doesn't exist
 */
function createWeatherSection(data) {
    const mainElement = document.querySelector('main');
    const weatherHTML = `
        <section class="weather-display-section">
            <h2>Current Weather in ${data.county}</h2>
            <div class="weather-card">
                <div class="weather-main">
                    <div class="temperature">
                        <span class="temp-value">${data.temperature.toFixed(1)}°C</span>
                    </div>
                    <div class="weather-details">
                        <p class="conditions"><strong>Conditions:</strong> ${data.conditions}</p>
                        <p class="humidity"><strong>Humidity:</strong> ${data.humidity}%</p>
                        <p class="wind"><strong>Wind Speed:</strong> ${data.wind_speed.toFixed(1)} km/h</p>
                        <p class="timestamp"><small>${data.timestamp}</small></p>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Insert after form section
    const formSection = document.querySelector('.weather-form-section');
    formSection.insertAdjacentHTML('afterend', weatherHTML);
}

/**
 * Update existing weather display
 */
function updateWeatherDisplay(data) {
    const tempValue = document.querySelector('.temp-value');
    const conditions = document.querySelector('.conditions');
    const humidity = document.querySelector('.humidity');
    const wind = document.querySelector('.wind');
    const timestamp = document.querySelector('.timestamp');
    const weatherH2 = document.querySelector('.weather-display-section h2');
    
    if (tempValue) tempValue.textContent = `${data.temperature.toFixed(1)}°C`;
    if (conditions) conditions.innerHTML = `<strong>Conditions:</strong> ${data.conditions}`;
    if (humidity) humidity.innerHTML = `<strong>Humidity:</strong> ${data.humidity}%`;
    if (wind) wind.innerHTML = `<strong>Wind Speed:</strong> ${data.wind_speed.toFixed(1)} km/h`;
    if (timestamp) timestamp.innerHTML = `<small>${data.timestamp}</small>`;
    if (weatherH2) weatherH2.textContent = `Current Weather in ${data.county}`;
}

/**
 * Update recent searches table via AJAX
 */
function updateRecentSearches() {
    fetch('/api/recent-searches', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(searches => {
        const searchesBody = document.getElementById('searchesBody');
        
        if (searchesBody && searches.length > 0) {
            searchesBody.innerHTML = searches.map(search => `
                <tr>
                    <td>${search.county}</td>
                    <td>${search.temperature.toFixed(1)}°C</td>
                    <td>${search.conditions}</td>
                    <td>${search.wind_speed.toFixed(1)} km/h</td>
                    <td><small>${search.timestamp}</small></td>
                </tr>
            `).join('');
        }
    })
    .catch(error => {
        console.error('Error updating recent searches:', error);
    });
}

/**
 * Show alert messages
 */
function showAlert(message, type = 'error') {
    const mainElement = document.querySelector('main');
    const existingAlert = mainElement.querySelector('.alert');
    
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertHTML = `
        <div class="alert alert-${type}">
            <strong>${type === 'error' ? 'Error' : 'Success'}:</strong> ${message}
        </div>
    `;
    
    mainElement.insertAdjacentHTML('afterbegin', alertHTML);
    
    // Auto-remove success alerts after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            const alert = mainElement.querySelector('.alert-success');
            if (alert) alert.remove();
        }, 5000);
    }
}
