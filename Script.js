// API Configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Users need to add their own OpenWeatherMap API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// Air Quality Classification Table (from the task requirements)
const AQI_CLASSIFICATION = {
    so2: [
        { index: 1, name: 'Good', min: 0, max: 20, color: '#00e676' },
        { index: 2, name: 'Fair', min: 20, max: 80, color: '#ffeb3b' },
        { index: 3, name: 'Moderate', min: 80, max: 250, color: '#ff9800' },
        { index: 4, name: 'Poor', min: 250, max: 350, color: '#f44336' },
        { index: 5, name: 'Very Poor', min: 350, max: Infinity, color: '#9c27b0' }
    ],
    no2: [
        { index: 1, name: 'Good', min: 0, max: 40, color: '#00e676' },
        { index: 2, name: 'Fair', min: 40, max: 70, color: '#ffeb3b' },
        { index: 3, name: 'Moderate', min: 70, max: 150, color: '#ff9800' },
        { index: 4, name: 'Poor', min: 150, max: 200, color: '#f44336' },
        { index: 5, name: 'Very Poor', min: 200, max: Infinity, color: '#9c27b0' }
    ],
    pm10: [
        { index: 1, name: 'Good', min: 0, max: 20, color: '#00e676' },
        { index: 2, name: 'Fair', min: 20, max: 50, color: '#ffeb3b' },
        { index: 3, name: 'Moderate', min: 50, max: 100, color: '#ff9800' },
        { index: 4, name: 'Poor', min: 100, max: 200, color: '#f44336' },
        { index: 5, name: 'Very Poor', min: 200, max: Infinity, color: '#9c27b0' }
    ],
    pm2_5: [
        { index: 1, name: 'Good', min: 0, max: 10, color: '#00e676' },
        { index: 2, name: 'Fair', min: 10, max: 25, color: '#ffeb3b' },
        { index: 3, name: 'Moderate', min: 25, max: 50, color: '#ff9800' },
        { index: 4, name: 'Poor', min: 50, max: 75, color: '#f44336' },
        { index: 5, name: 'Very Poor', min: 75, max: Infinity, color: '#9c27b0' }
    ],
    o3: [
        { index: 1, name: 'Good', min: 0, max: 60, color: '#00e676' },
        { index: 2, name: 'Fair', min: 60, max: 100, color: '#ffeb3b' },
        { index: 3, name: 'Moderate', min: 100, max: 140, color: '#ff9800' },
        { index: 4, name: 'Poor', min: 140, max: 180, color: '#f44336' },
        { index: 5, name: 'Very Poor', min: 180, max: Infinity, color: '#9c27b0' }
    ],
    co: [
        { index: 1, name: 'Good', min: 0, max: 4400, color: '#00e676' },
        { index: 2, name: 'Fair', min: 4400, max: 9400, color: '#ffeb3b' },
        { index: 3, name: 'Moderate', min: 9400, max: 12400, color: '#ff9800' },
        { index: 4, name: 'Poor', min: 12400, max: 15400, color: '#f44336' },
        { index: 5, name: 'Very Poor', min: 15400, max: Infinity, color: '#9c27b0' }
    ]
};

// Health Recommendations
const HEALTH_RECOMMENDATIONS = {
    1: {
        title: 'Excellent Air Quality',
        message: 'Air quality is excellent. Enjoy your outdoor activities! Perfect conditions for exercise, sports, and spending time outside.'
    },
    2: {
        title: 'Good Air Quality',
        message: 'Air quality is acceptable. Most people can enjoy outdoor activities without restrictions. Sensitive individuals should consider reducing prolonged outdoor exertion.'
    },
    3: {
        title: 'Moderate Air Quality',
        message: 'Air quality is moderate. Sensitive groups should consider reducing prolonged or heavy outdoor exertion. General public can continue normal activities.'
    },
    4: {
        title: 'Unhealthy Air Quality',
        message: 'Air quality is unhealthy. Everyone should reduce prolonged or heavy outdoor exertion. Sensitive groups should avoid outdoor activities. Consider staying indoors and using air purifiers.'
    },
    5: {
        title: 'Very Unhealthy Air Quality',
        message: 'Air quality is hazardous! Everyone should avoid all outdoor physical activities. Stay indoors with windows closed. Use air purifiers if available. Consider wearing N95 masks if you must go outside.'
    }
};

// DOM Elements
const elements = {
    locationInput: document.getElementById('locationInput'),
    searchBtn: document.getElementById('searchBtn'),
    geoBtn: document.getElementById('geoBtn'),
    retryBtn: document.getElementById('retryBtn'),
    
    resultsSection: document.getElementById('resultsSection'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    
    cityName: document.getElementById('cityName'),
    coordinates: document.getElementById('coordinates'),
    timestamp: document.getElementById('timestamp'),
    
    aqiValue: document.getElementById('aqiValue'),
    aqiCategory: document.getElementById('aqiCategory'),
    aqiIndicator: document.getElementById('aqiIndicator'),
    
    so2Value: document.getElementById('so2Value'),
    so2Status: document.getElementById('so2Status'),
    so2Fill: document.getElementById('so2Fill'),
    so2Card: document.getElementById('so2Card'),
    
    no2Value: document.getElementById('no2Value'),
    no2Status: document.getElementById('no2Status'),
    no2Fill: document.getElementById('no2Fill'),
    no2Card: document.getElementById('no2Card'),
    
    pm10Value: document.getElementById('pm10Value'),
    pm10Status: document.getElementById('pm10Status'),
    pm10Fill: document.getElementById('pm10Fill'),
    pm10Card: document.getElementById('pm10Card'),
    
    pm25Value: document.getElementById('pm25Value'),
    pm25Status: document.getElementById('pm25Status'),
    pm25Fill: document.getElementById('pm25Fill'),
    pm25Card: document.getElementById('pm25Card'),
    
    o3Value: document.getElementById('o3Value'),
    o3Status: document.getElementById('o3Status'),
    o3Fill: document.getElementById('o3Fill'),
    o3Card: document.getElementById('o3Card'),
    
    coValue: document.getElementById('coValue'),
    coStatus: document.getElementById('coStatus'),
    coFill: document.getElementById('coFill'),
    coCard: document.getElementById('coCard'),
    
    healthMessage: document.getElementById('healthMessage'),
    errorMessage: document.getElementById('errorMessage')
};

// Utility Functions
function showLoading() {
    elements.resultsSection.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.loadingState.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingState.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    elements.resultsSection.classList.add('hidden');
    elements.errorMessage.textContent = message;
    elements.errorState.classList.remove('hidden');
}

function showResults() {
    hideLoading();
    elements.errorState.classList.add('hidden');
    elements.resultsSection.classList.remove('hidden');
}

// Classification Functions
function classifyPollutant(value, pollutantType) {
    const classifications = AQI_CLASSIFICATION[pollutantType];
    for (let classification of classifications) {
        if (value >= classification.min && value < classification.max) {
            return classification;
        }
    }
    return classifications[classifications.length - 1]; // Return worst category if beyond max
}

function calculateOverallAQI(components) {
    // Calculate AQI based on the worst pollutant
    const pollutants = {
        so2: components.so2,
        no2: components.no2,
        pm10: components.pm10,
        pm2_5: components.pm2_5,
        o3: components.o3,
        co: components.co
    };
    
    let worstIndex = 1;
    let worstPollutant = null;
    
    for (let [pollutant, value] of Object.entries(pollutants)) {
        const classification = classifyPollutant(value, pollutant);
        if (classification.index > worstIndex) {
            worstIndex = classification.index;
            worstPollutant = classification;
        }
    }
    
    return worstPollutant || AQI_CLASSIFICATION.so2[0];
}

// Update UI Functions
function updatePollutantCard(pollutant, value, elementPrefix) {
    const classification = classifyPollutant(value, pollutant);
    
    elements[`${elementPrefix}Value`].textContent = `${value.toFixed(2)} μg/m³`;
    elements[`${elementPrefix}Status`].textContent = classification.name;
    elements[`${elementPrefix}Status`].className = `pollutant-status status-${classification.name.toLowerCase().replace(' ', '-')}`;
    
    // Update progress bar
    const maxValue = AQI_CLASSIFICATION[pollutant][AQI_CLASSIFICATION[pollutant].length - 2].max;
    const percentage = Math.min((value / maxValue) * 100, 100);
    elements[`${elementPrefix}Fill`].style.width = `${percentage}%`;
    elements[`${elementPrefix}Fill`].style.backgroundColor = classification.color;
    
    // Add hover effect color to card
    elements[`${elementPrefix}Card`].style.setProperty('--hover-color', classification.color);
}

function updateAQIDisplay(overallAQI) {
    // Update AQI value and category
    const aqiScore = overallAQI.index * 50; // Convert index to score for display
    elements.aqiValue.textContent = aqiScore;
    elements.aqiCategory.textContent = overallAQI.name;
    elements.aqiCategory.style.color = overallAQI.color;
    
    // Update AQI indicator bar
    const percentage = (overallAQI.index / 5) * 100;
    elements.aqiIndicator.style.width = `${percentage}%`;
    elements.aqiIndicator.style.backgroundColor = overallAQI.color;
    
    // Update health recommendations
    const healthInfo = HEALTH_RECOMMENDATIONS[overallAQI.index];
    elements.healthMessage.innerHTML = `
        <strong>${healthInfo.title}</strong><br>
        ${healthInfo.message}
    `;
}

function updateLocationInfo(location, coords) {
    elements.cityName.textContent = location;
    elements.coordinates.textContent = `${coords.lat.toFixed(4)}°, ${coords.lon.toFixed(4)}°`;
    
    const now = new Date();
    elements.timestamp.textContent = `Updated: ${now.toLocaleString()}`;
}

// API Functions
async function getCoordinatesFromCity(cityName) {
    try {
        const response = await fetch(
            `${GEO_API_URL}?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error('Location not found. Please try a different city name.');
        }
        
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name,
            country: data[0].country
        };
    } catch (error) {
        throw error;
    }
}

async function getAirPollutionData(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch air pollution data');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function fetchAndDisplayAirQuality(lat, lon, locationName) {
    try {
        showLoading();
        
        // Fetch air pollution data
        const pollutionData = await getAirPollutionData(lat, lon);
        
        if (!pollutionData || !pollutionData.list || pollutionData.list.length === 0) {
            throw new Error('No air quality data available for this location');
        }
        
        const components = pollutionData.list[0].components;
        
        // Update location info
        updateLocationInfo(locationName, { lat, lon });
        
        // Update individual pollutants
        updatePollutantCard('so2', components.so2, 'so2');
        updatePollutantCard('no2', components.no2, 'no2');
        updatePollutantCard('pm10', components.pm10, 'pm10');
        updatePollutantCard('pm2_5', components.pm2_5, 'pm25');
        updatePollutantCard('o3', components.o3, 'o3');
        updatePollutantCard('co', components.co, 'co');
        
        // Calculate and update overall AQI
        const overallAQI = calculateOverallAQI(components);
        updateAQIDisplay(overallAQI);
        
        // Show results
        showResults();
        
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        showError(error.message || 'An error occurred while fetching air quality data. Please try again.');
    }
}

// Event Handlers
async function handleSearch() {
    const input = elements.locationInput.value.trim();
    
    if (!input) {
        showError('Please enter a city name or coordinates');
        return;
    }
    
    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please add your OpenWeatherMap API key in the script.js file. You can get a free API key at https://openweathermap.org/api');
        return;
    }
    
    try {
        // Check if input is coordinates (lat, lon)
        const coordsMatch = input.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
        
        if (coordsMatch) {
            const lat = parseFloat(coordsMatch[1]);
            const lon = parseFloat(coordsMatch[2]);
            
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                throw new Error('Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.');
            }
            
            await fetchAndDisplayAirQuality(lat, lon, `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
        } else {
            // Treat as city name
            const location = await getCoordinatesFromCity(input);
            await fetchAndDisplayAirQuality(
                location.lat,
                location.lon,
                `${location.name}, ${location.country}`
            );
        }
    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'An error occurred while searching. Please try again.');
    }
}

function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please add your OpenWeatherMap API key in the script.js file. You can get a free API key at https://openweathermap.org/api');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                await fetchAndDisplayAirQuality(lat, lon, 'Your Location');
            } catch (error) {
                console.error('Geolocation error:', error);
                showError(error.message || 'An error occurred while fetching air quality data for your location.');
            }
        },
        (error) => {
            let errorMessage = 'Unable to retrieve your location. ';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please allow location access in your browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
            }
            showError(errorMessage);
        }
    );
}

// Event Listeners
elements.searchBtn.addEventListener('click', handleSearch);
elements.geoBtn.addEventListener('click', handleGeolocation);
elements.retryBtn.addEventListener('click', () => {
    elements.errorState.classList.add('hidden');
});

elements.locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize
console.log('AirWatch initialized');
console.log('Please add your OpenWeatherMap API key to use the application');
console.log('Get your free API key at: https://openweathermap.org/api');
