// AJAX Weather Form Handler & Feature Management
document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weatherForm');
    const tempToggle = document.getElementById('tempToggle');
    const exportBtn = document.getElementById('exportBtn');
    const themeToggle = document.getElementById('themeToggle');
    const countySearch = document.getElementById('countySearch');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const clearPinned = document.getElementById('clearPinned');
    
    // Initialize theme from localStorage
    initializeTheme();
    
    // Initialize temperature unit from localStorage
    initializeTempUnit();
    
    // Initialize pinned counties
    loadPinnedCounties();
    
    // Uncomment below to enable AJAX mode (disable page refresh)
    // weatherForm.addEventListener('submit', handleFormSubmitAJAX);
    
    // Temperature toggle listener
    if (tempToggle) {
        tempToggle.addEventListener('change', handleTempToggle);
    }
    
    // Export CSV listener
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExportCSV);
    }
    
    // Theme toggle listener
    if (themeToggle) {
        themeToggle.addEventListener('click', handleThemeToggle);
    }
    
    // Clear pinned button listener
    if (clearPinned) {
        clearPinned.addEventListener('click', clearAllPinned);
    }
    
    // Search autocomplete listeners
    if (countySearch) {
        countySearch.addEventListener('input', handleCountySearch);
        countySearch.addEventListener('keydown', handleSearchKeydown);
        document.addEventListener('click', function(e) {
            if (e.target !== countySearch && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.add('hidden');
            }
        });
    }
    
    // Description toggle listener
    const detailedToggle = document.getElementById('detailedToggle');
    if (detailedToggle) {
        detailedToggle.addEventListener('change', handleDescriptionToggle);
    }
    
    // Auto-load description if weather is already displayed
    const weatherSection = document.querySelector('.weather-display-section');
    if (weatherSection) {
        const countyHeading = weatherSection.querySelector('h2');
        if (countyHeading) {
            const countyMatch = countyHeading.textContent.match(/in (.+)$/);
            if (countyMatch) {
                const county = countyMatch[1].trim();
                loadWeatherDescription(county);
            }
        }
    }
});

/**
 * Initialize theme from localStorage or system preference
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

/**
 * Set theme and update DOM
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Handle theme toggle
 */
function handleThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * Handle county search with autocomplete
 */
function handleCountySearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const searchSuggestions = document.getElementById('searchSuggestions');
    const counties = getCountyList();
    
    if (searchTerm.length === 0) {
        searchSuggestions.classList.add('hidden');
        return;
    }
    
    const matches = counties.filter(county => 
        county.toLowerCase().includes(searchTerm)
    );
    
    if (matches.length === 0) {
        searchSuggestions.classList.add('hidden');
        return;
    }
    
    searchSuggestions.innerHTML = matches
        .map((county, index) => `
            <div class="suggestion-item" data-county="${county}" data-index="${index}">
                <i class="fas fa-map-marker-alt"></i> ${county}
            </div>
        `)
        .join('');
    
    searchSuggestions.classList.remove('hidden');
    
    // Add click handlers to suggestions
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            selectCountyFromSearch(this.dataset.county);
        });
    });
}

/**
 * Handle search keyboard navigation
 */
function handleSearchKeydown(event) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    let activeIndex = Array.from(suggestions).findIndex(s => s.classList.contains('active'));
    
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % suggestions.length;
        updateActiveSuggestion(suggestions, activeIndex);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1;
        updateActiveSuggestion(suggestions, activeIndex);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (activeIndex >= 0) {
            selectCountyFromSearch(suggestions[activeIndex].dataset.county);
        }
    } else if (event.key === 'Escape') {
        document.getElementById('searchSuggestions').classList.add('hidden');
    }
}

/**
 * Update active suggestion highlight
 */
function updateActiveSuggestion(suggestions, index) {
    suggestions.forEach(s => s.classList.remove('active'));
    if (suggestions[index]) {
        suggestions[index].classList.add('active');
    }
}

/**
 * Select county from search and submit form
 */
function selectCountyFromSearch(county) {
    document.getElementById('county').value = county;
    document.getElementById('countySearch').value = county;
    document.getElementById('searchSuggestions').classList.add('hidden');
    document.getElementById('weatherForm').submit();
}

/**
 * Get list of all counties (from select options)
 */
function getCountyList() {
    const select = document.getElementById('county');
    return Array.from(select.options)
        .map(option => option.value)
        .filter(value => value !== '');
}

/**
 * Load and display pinned counties
 */
function loadPinnedCounties() {
    const pinnedCounties = JSON.parse(localStorage.getItem('pinnedCounties') || '{}');
    const pinnedSection = document.getElementById('pinnedSection');
    const pinnedGrid = document.getElementById('pinnedCounties');
    
    if (Object.keys(pinnedCounties).length === 0) {
        pinnedSection.classList.add('hidden');
        return;
    }
    
    pinnedSection.classList.remove('hidden');
    pinnedGrid.innerHTML = Object.entries(pinnedCounties)
        .map(([county, data]) => `
            <div class="pinned-card" onclick="selectCountyFromSearch('${county}')">
                <button class="pin-remove" onclick="event.stopPropagation(); unpinCounty('${county}')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="pinned-card-name">${county}</div>
                <div class="pinned-card-temp">${data.temp}<span class="unit-symbol">°C</span></div>
            </div>
        `)
        .join('');
}

/**
 * Pin a county for quick access
 */
function pinCounty(county, temp) {
    let pinnedCounties = JSON.parse(localStorage.getItem('pinnedCounties') || '{}');
    pinnedCounties[county] = { temp: temp.toFixed(1) };
    localStorage.setItem('pinnedCounties', JSON.stringify(pinnedCounties));
    loadPinnedCounties();
}

/**
 * Unpin a county
 */
function unpinCounty(county) {
    let pinnedCounties = JSON.parse(localStorage.getItem('pinnedCounties') || '{}');
    delete pinnedCounties[county];
    localStorage.setItem('pinnedCounties', JSON.stringify(pinnedCounties));
    loadPinnedCounties();
}

/**
 * Clear all pinned counties
 */
function clearAllPinned() {
    localStorage.setItem('pinnedCounties', '{}');
    loadPinnedCounties();
}

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

/**
 * Initialize temperature unit from localStorage and apply it
 */
function initializeTempUnit() {
    const isFahrenheit = localStorage.getItem('useFahrenheit') === 'true';
    const toggle = document.getElementById('tempToggle');
    
    if (toggle) {
        toggle.checked = isFahrenheit;
    }
    
    if (isFahrenheit) {
        convertAllTemperatures(true);
    }
}

/**
 * Handle temperature unit toggle
 */
function handleTempToggle(event) {
    const isFahrenheit = event.target.checked;
    localStorage.setItem('useFahrenheit', isFahrenheit.toString());
    convertAllTemperatures(isFahrenheit);
}

/**
 * Convert all temperatures on page between Celsius and Fahrenheit
 */
function convertAllTemperatures(toFahrenheit) {
    // Update unit symbols
    const unitSymbols = document.querySelectorAll('.unit-symbol');
    unitSymbols.forEach(symbol => {
        symbol.textContent = toFahrenheit ? 'F' : 'C';
    });
    
    // Update current weather display
    const tempValue = document.querySelector('.temp-value');
    if (tempValue) {
        const rawTemp = parseFloat(document.querySelector('.temp-display-raw')?.textContent || tempValue.textContent);
        if (!isNaN(rawTemp)) {
            const converted = toFahrenheit ? celsiusToFahrenheit(rawTemp) : rawTemp;
            tempValue.textContent = converted.toFixed(1) + '°' + (toFahrenheit ? 'F' : 'C');
        }
    }
    
    // Update forecast temperatures
    const forecastHighValues = document.querySelectorAll('.forecast-high-value');
    const forecastLowValues = document.querySelectorAll('.forecast-low-value');
    
    forecastHighValues.forEach(elem => {
        const celsius = parseFloat(elem.textContent);
        if (!isNaN(celsius)) {
            const converted = toFahrenheit ? celsiusToFahrenheit(celsius) : celsius;
            elem.textContent = converted.toFixed(0) + '°';
        }
    });
    
    forecastLowValues.forEach(elem => {
        const celsius = parseFloat(elem.textContent);
        if (!isNaN(celsius)) {
            const converted = toFahrenheit ? celsiusToFahrenheit(celsius) : celsius;
            elem.textContent = converted.toFixed(0) + '°';
        }
    });
    
    // Update table temperatures
    const tempCells = document.querySelectorAll('.temp-cell');
    tempCells.forEach(cell => {
        const celsius = parseFloat(cell.textContent);
        if (!isNaN(celsius)) {
            const converted = toFahrenheit ? celsiusToFahrenheit(celsius) : celsius;
            cell.textContent = converted.toFixed(1);
        }
    });
}

/**
 * Convert Celsius to Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

/**
 * Handle CSV export of weather history
 */
function handleExportCSV() {
    try {
        // Use the server endpoint to download CSV
        const link = document.createElement('a');
        link.href = '/export-csv';
        link.download = `liberia-weather-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showAlert('Weather history export started!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showAlert('Failed to export CSV. Please try again.', 'error');
    }
}

/**
 * Handle description toggle (Brief ↔ Detailed)
 */
function handleDescriptionToggle(event) {
    const toggle = event.target;
    const isDetailed = toggle.checked;
    
    // Get county name from page heading
    const countyHeading = document.querySelector('.weather-display-section h2');
    if (!countyHeading) return;
    
    const countyMatch = countyHeading.textContent.match(/in (.+)$/);
    if (!countyMatch) return;
    
    const county = countyMatch[1].trim();
    
    // Fetch new description
    fetchCountyDescription(county, !isDetailed);  // !isDetailed because checked=true means detailed
}

/**
 * Fetch county description from API
 */
async function fetchCountyDescription(county, brief = true) {
    const descriptionContent = document.getElementById('descriptionContent');
    const skeletonLoader = document.querySelector('.skeleton-loader');
    
    try {
        // Show skeleton loader
        if (skeletonLoader) skeletonLoader.classList.remove('hidden');
        if (descriptionContent) descriptionContent.classList.add('fade-out');
        
        const response = await fetch('/api/county-description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ county: county, brief: brief })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Display the description after short delay for better UX
            setTimeout(() => {
                if (descriptionContent) {
                    descriptionContent.textContent = data.description;
                    descriptionContent.classList.remove('fade-out');
                }
                if (skeletonLoader) skeletonLoader.classList.add('hidden');
            }, 300);
        } else {
            throw new Error(data.error || 'Failed to fetch description');
        }
    } catch (error) {
        console.error('Error fetching description:', error);
        if (descriptionContent) {
            descriptionContent.textContent = 'Unable to load description. Please try again.';
            descriptionContent.classList.remove('fade-out');
        }
        if (skeletonLoader) skeletonLoader.classList.add('hidden');
    }
}

/**
 * Load description on weather display (called automatically when weather is shown)
 */
function loadWeatherDescription(county) {
    const descriptionSection = document.getElementById('descriptionSection');
    if (!descriptionSection || descriptionSection.classList.contains('hidden')) {
        return;  // Don't load if section is hidden
    }
    
    // Load brief description by default
    fetchCountyDescription(county, true);
}
