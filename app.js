document.addEventListener('DOMContentLoaded', function () {
    const dateEl = document.getElementById('date');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const meridiemEl = document.getElementById('meridiem');
    const timezoneEl = document.getElementById('timezone');
    const selectedCitiesListEl = document.getElementById('selected-cities-list');
    const fullCitiesListEl = document.getElementById('full-cities-list');
    const citySelectionModal = document.getElementById('city-selection-modal');
    const worldCitySearch = document.getElementById('world-city-search');
    const btnAddCity = document.getElementById('btn-add-city');
    const citySelectionCancel = document.getElementById('city-selection-cancel');

    const allCities = [
        { name: "Abidjan", timezone: "Africa/Abidjan", lat: 5.3364, lon: -4.0311, temp: "--" },
        { name: "Abu Dhabi", timezone: "Asia/Abu_Dhabi", lat: 24.4539, lon: 54.3773, temp: "--" },
        { name: "Accra", timezone: "Africa/Accra", lat: 5.6037, lon: -0.187, temp: "--" },
        { name: "Addis Ababa", timezone: "Africa/Addis_Ababa", lat: 9.03, lon: 38.74, temp: "--" },
        { name: "Adelaide", timezone: "Australia/Adelaide", lat: -34.9285, lon: 138.6007, temp: "--" },
        { name: "Algiers", timezone: "Africa/Algiers", lat: 36.7538, lon: 3.0588, temp: "--" },
        { name: "Amsterdam", timezone: "Europe/Amsterdam", lat: 52.3676, lon: 4.9041, temp: "--" },
        { name: "Ankara", timezone: "Europe/Istanbul", lat: 39.9334, lon: 32.8597, temp: "--" },
        { name: "Athens", timezone: "Europe/Athens", lat: 37.9838, lon: 23.7275, temp: "--" },
        { name: "Auckland", timezone: "Pacific/Auckland", lat: -36.8485, lon: 174.7633, temp: "--" },
        { name: "Baghdad", timezone: "Asia/Baghdad", lat: 33.3128, lon: 44.3615, temp: "--" },
        { name: "Bangkok", timezone: "Asia/Bangkok", lat: 13.7563, lon: 100.5018, temp: "--" },
        { name: "Beijing", timezone: "Asia/Shanghai", lat: 39.9042, lon: 116.4074, temp: "--" },
        { name: "Beirut", timezone: "Asia/Beirut", lat: 33.8938, lon: 35.5018, temp: "--" },
        { name: "Berlin", timezone: "Europe/Berlin", lat: 52.52, lon: 13.405, temp: "--" },
        { name: "Bogota", timezone: "America/Bogota", lat: 4.711, lon: -74.0721, temp: "--" },
        { name: "Brussels", timezone: "Europe/Brussels", lat: 50.8503, lon: 4.3517, temp: "--" },
        { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", lat: -34.6037, lon: -58.3816, temp: "--" },
        { name: "Cairo", timezone: "Africa/Cairo", lat: 30.0444, lon: 31.2357, temp: "--" },
        { name: "Cape Town", timezone: "Africa/Johannesburg", lat: -33.9249, lon: 18.4241, temp: "--" },
        { name: "Caracas", timezone: "America/Caracas", lat: 10.4806, lon: -66.9036, temp: "--" },
        { name: "Casablanca", timezone: "Africa/Casablanca", lat: 33.5731, lon: -7.5898, temp: "--" },
        { name: "Chicago", timezone: "America/Chicago", lat: 41.8781, lon: -87.6298, temp: "--" },
        { name: "Copenhagen", timezone: "Europe/Copenhagen", lat: 55.6761, lon: 12.5683, temp: "--" },
        { name: "Dakar", timezone: "Africa/Dakar", lat: 14.7167, lon: -17.4677, temp: "--" },
        { name: "Dallas", timezone: "America/Chicago", lat: 32.7767, lon: -96.797, temp: "--" },
        { name: "Damascus", timezone: "Asia/Damascus", lat: 33.5138, lon: 36.2765, temp: "--" },
        { name: "Denver", timezone: "America/Denver", lat: 39.7392, lon: -104.9903, temp: "--" },
        { name: "Dhaka", timezone: "Asia/Dhaka", lat: 23.8103, lon: 90.4125, temp: "--" },
        { name: "Dubai", timezone: "Asia/Dubai", lat: 25.2048, lon: 55.2708, temp: "--" },
        { name: "Dublin", timezone: "Europe/Dublin", lat: 53.3498, lon: -6.2603, temp: "--" },
        { name: "Frankfurt", timezone: "Europe/Berlin", lat: 50.1109, lon: 8.6821, temp: "--" },
        { name: "Geneva", timezone: "Europe/Zurich", lat: 46.2044, lon: 6.1432, temp: "--" },
        { name: "Hanoi", timezone: "Asia/Ho_Chi_Minh", lat: 21.0285, lon: 105.8542, temp: "--" },
        { name: "Havana", timezone: "America/Havana", lat: 23.1136, lon: -82.3666, temp: "--" },
        { name: "Helsinki", timezone: "Europe/Helsinki", lat: 60.1695, lon: 24.9354, temp: "--" },
        { name: "Hong Kong", timezone: "Asia/Hong_Kong", lat: 22.3193, lon: 114.1694, temp: "--" },
        { name: "Honolulu", timezone: "Pacific/Honolulu", lat: 21.3069, lon: -157.8583, temp: "--" },
        { name: "Istanbul", timezone: "Europe/Istanbul", lat: 41.0082, lon: 28.9784, temp: "--" },
        { name: "Jakarta", timezone: "Asia/Jakarta", lat: -6.2088, lon: 106.8456, temp: "--" },
        { name: "Jerusalem", timezone: "Asia/Jerusalem", lat: 31.7683, lon: 35.2137, temp: "--" },
        { name: "Johannesburg", timezone: "Africa/Johannesburg", lat: -26.2041, lon: 28.0473, temp: "--" },
        { name: "Karachi", timezone: "Asia/Karachi", lat: 24.8607, lon: 67.0011, temp: "--" },
        { name: "Kathmandu", timezone: "Asia/Kathmandu", lat: 27.7172, lon: 85.324, temp: "--" },
        { name: "Kiev", timezone: "Europe/Kiev", lat: 50.4501, lon: 30.5234, temp: "--" },
        { name: "Lagos", timezone: "Africa/Lagos", lat: 6.5244, lon: 3.3792, temp: "--" },
        { name: "Lima", timezone: "America/Lima", lat: -12.0464, lon: -77.0428, temp: "--" },
        { name: "Lisbon", timezone: "Europe/Lisbon", lat: 38.7223, lon: -9.1393, temp: "--" },
        { name: "London", timezone: "Europe/London", lat: 51.5074, lon: -0.1278, temp: "--" },
        { name: "Los Angeles", timezone: "America/Los_Angeles", lat: 34.0522, lon: -118.2437, temp: "--" },
        { name: "Madrid", timezone: "Europe/Madrid", lat: 40.4168, lon: -3.7038, temp: "--" },
        { name: "Manila", timezone: "Asia/Manila", lat: 14.5995, lon: 120.9842, temp: "--" },
        { name: "Mexico City", timezone: "America/Mexico_City", lat: 19.4326, lon: -99.1332, temp: "--" },
        { name: "Miami", timezone: "America/New_York", lat: 25.7617, lon: -80.1918, temp: "--" },
        { name: "Moscow", timezone: "Europe/Moscow", lat: 55.7558, lon: 37.6173, temp: "--" },
        { name: "Mumbai", timezone: "Asia/Kolkata", lat: 19.076, lon: 72.8777, temp: "--" },
        { name: "Nairobi", timezone: "Africa/Nairobi", lat: -1.2921, lon: 36.8219, temp: "--" },
        { name: "New Delhi", timezone: "Asia/Kolkata", lat: 28.6139, lon: 77.209, temp: "--" },
        { name: "New York", timezone: "America/New_York", lat: 40.7128, lon: -74.006, temp: "--" },
        { name: "Oslo", timezone: "Europe/Oslo", lat: 59.9139, lon: 10.7522, temp: "--" },
        { name: "Paris", timezone: "Europe/Paris", lat: 48.8566, lon: 2.3522, temp: "--" },
        { name: "Prague", timezone: "Europe/Prague", lat: 50.0755, lon: 14.4378, temp: "--" },
        { name: "Rio de Janeiro", timezone: "America/Sao_Paulo", lat: -22.9068, lon: -43.1729, temp: "--" },
        { name: "Riyadh", timezone: "Asia/Riyadh", lat: 24.7136, lon: 46.6753, temp: "--" },
        { name: "Rome", timezone: "Europe/Rome", lat: 41.9028, lon: 12.4964, temp: "--" },
        { name: "San Francisco", timezone: "America/Los_Angeles", lat: 37.7749, lon: -122.4194, temp: "--" },
        { name: "Santiago", timezone: "America/Santiago", lat: -33.4489, lon: -70.6693, temp: "--" },
        { name: "Sao Paulo", timezone: "America/Sao_Paulo", lat: -23.5505, lon: -46.6333, temp: "--" },
        { name: "Seoul", timezone: "Asia/Seoul", lat: 37.5665, lon: 126.978, temp: "--" },
        { name: "Shanghai", timezone: "Asia/Shanghai", lat: 31.2304, lon: 121.4737, temp: "--" },
        { name: "Singapore", timezone: "Asia/Singapore", lat: 1.3521, lon: 103.8198, temp: "--" },
        { name: "Stockholm", timezone: "Europe/Stockholm", lat: 59.3293, lon: 18.0686, temp: "--" },
        { name: "Sydney", timezone: "Australia/Sydney", lat: -33.8688, lon: 151.2093, temp: "--" },
        { name: "Taipei", timezone: "Asia/Taipei", lat: 25.033, lon: 121.5654, temp: "--" },
        { name: "Tokyo", timezone: "Asia/Tokyo", lat: 35.6762, lon: 139.6503, temp: "--" },
        { name: "Toronto", timezone: "America/Toronto", lat: 43.6532, lon: -79.3832, temp: "--" },
        { name: "Vancouver", timezone: "America/Vancouver", lat: 49.2827, lon: -123.1207, temp: "--" },
        { name: "Vienna", timezone: "Europe/Vienna", lat: 48.2082, lon: 16.3738, temp: "--" },
        { name: "Warsaw", timezone: "Europe/Warsaw", lat: 52.2297, lon: 21.0122, temp: "--" },
        { name: "Washington DC", timezone: "America/New_York", lat: 38.9072, lon: -77.0369, temp: "--" },
        { name: "Zurich", timezone: "Europe/Zurich", lat: 47.3769, lon: 8.5417, temp: "--" }
    ];

    let selectedCities = JSON.parse(localStorage.getItem('selectedCities')) || [];
    let currentFilter = "";

    function setupWorldClock() {
        const now = new Date();

        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const displayHours = h % 12 || 12;
        const ampm = h >= 12 ? 'PM' : 'AM';

        if (dateEl) dateEl.innerText = now.toDateString();
        if (hoursEl) hoursEl.innerText = String(displayHours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(m).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(s).padStart(2, '0');
        if (meridiemEl) meridiemEl.innerText = ampm;

        if (timezoneEl) {
            try {
                const parts = new Intl.DateTimeFormat('en-PH', {
                    timeZoneName: 'short'
                }).formatToParts(now);
                const tzPart = parts.find(part => part.type === 'timeZoneName');
                timezoneEl.innerText = tzPart ? tzPart.value : '';
            } catch (e) {
                console.error("Timezone formatting error:", e);
                timezoneEl.innerText = "";
            }
        }

        renderSelectedCities();
    }

    async function fetchAllWeather() {
        if (selectedCities.length === 0) return;
        const lats = selectedCities.map(c => c.lat).join(',');
        const lons = selectedCities.map(c => c.lon).join(',');
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`);
            const data = await res.json();
            const results = Array.isArray(data) ? data : [data];
            results.forEach((result, index) => {
                if (result.current_weather) {
                    selectedCities[index].temp = Math.round(result.current_weather.temperature);
                }
            });
            localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
        } catch (e) {
            console.error("Weather error:", e);
        }
        renderSelectedCities();
    }

    function renderSelectedCities() {
        if (!selectedCitiesListEl) return;
        
        selectedCitiesListEl.innerHTML = selectedCities.map(city => {
            const now = new Date();
            let cityTime;
            try {
                cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
            } catch (e) {
                cityTime = now;
            }
            
            const diffMs = cityTime - now;
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            const diffStr = diffHours === 0 ? 'Same time' : (diffHours > 0 ? `${diffHours} hours ahead` : `${Math.abs(diffHours)} hours behind`);

            const h = cityTime.getHours();
            const m = cityTime.getMinutes();
            const displayHours = h % 12 || 12;
            const ampm = h >= 12 ? 'PM' : 'AM';
            const timeStr = `${String(displayHours).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;

            return `
                <div class="selected-city-text">
                    <span class="city-name">${city.name}</span>
                    <span class="city-time">${timeStr}</span>
                    <span class="city-info">${city.temp}°C • ${diffStr}</span>
                    <button class="btn-remove-city" onclick="removeCity('${city.name}')">×</button>
                </div>
            `;
        }).join('');
    }

    function renderFullCitiesList() {
        if (!fullCitiesListEl) return;
        const filtered = allCities.filter(c => c.name.toLowerCase().includes(currentFilter.toLowerCase()));
        
        fullCitiesListEl.innerHTML = filtered.map(city => {
            const isSelected = selectedCities.some(sc => sc.name === city.name);
            return `
                <div class="selection-item ${isSelected ? 'selected' : ''}" onclick="toggleCitySelection('${city.name}')">
                    <span>${city.name}</span>
                    ${isSelected ? '<i class="fas fa-check"></i>' : ''}
                </div>
            `;
        }).join('');
    }

    window.toggleCitySelection = function(cityName) {
        const city = allCities.find(c => c.name === cityName);
        const index = selectedCities.findIndex(sc => sc.name === cityName);
        
        if (index === -1) {
            selectedCities.push(city);
        } else {
            selectedCities.splice(index, 1);
        }
        
        localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
        renderFullCitiesList();
        renderSelectedCities();
        fetchAllWeather();
    };

    window.removeCity = function(cityName) {
        selectedCities = selectedCities.filter(sc => sc.name !== cityName);
        localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
        renderSelectedCities();
    };

    btnAddCity.addEventListener('click', () => {
        citySelectionModal.classList.remove('hidden');
        renderFullCitiesList();
    });

    citySelectionCancel.addEventListener('click', () => {
        citySelectionModal.classList.add('hidden');
    });

    worldCitySearch.addEventListener('input', (e) => {
        currentFilter = e.target.value;
        renderFullCitiesList();
    });

    // Initial fetch
    fetchAllWeather();
    setInterval(setupWorldClock, 1000);
    setupWorldClock();

    // --- 2. MODE SWITCHING ---
    const controlButtons = document.querySelectorAll('.controls .btn');
    const modes = document.querySelectorAll('.mode');

    function setActiveMode(targetMode) {
        controlButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-mode') === targetMode);
        });

        modes.forEach(mode => {
            mode.classList.toggle('hidden', !mode.classList.contains(targetMode));
        });

        sessionStorage.setItem('activeClockMode', targetMode);

        if (targetMode === 'weather') {
            getWeather();
        } else if (targetMode === 'google-map') {
            initMap();
        }
    }

    // --- 5. WEATHER LOGIC ---
    const weatherLocationEl = document.getElementById('weather-location');
    const weatherTempEl = document.getElementById('weather-temp');
    const weatherDescEl = document.getElementById('weather-desc');
    const weatherIconEl = document.getElementById('weather-icon');
    const weatherHumidityEl = document.getElementById('weather-humidity');
    const weatherWindEl = document.getElementById('weather-wind');
    const weatherFeelsEl = document.getElementById('weather-feels');
    const forecastListEl = document.getElementById('forecast-list');

    function getWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Get city name using reverse geocoding (OpenStreetMap Nominatim)
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.village || "Your Location";
                    updateWeather(lat, lon, city);
                } catch (e) {
                    console.error("Reverse geocoding error:", e);
                    updateWeather(lat, lon, "Your Location");
                }
            }, () => {
                weatherLocationEl.innerText = "Geolocation not supported or denied";
            });
        } else {
            weatherLocationEl.innerText = "Geolocation not supported";
        }
    }

    // --- 6. GOOGLE MAP LOGIC ---
    let mapInitialized = false;

    function initMap() {
        if (mapInitialized) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Get city name using reverse geocoding
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.village || "Your Location";
                    updateMap(lat, lon, city);
                } catch (e) {
                    updateMap(lat, lon, "Your Location");
                }
            }, () => {
                handleLocationError(true);
            });
        } else {
            handleLocationError(false);
        }
    }

    function handleLocationError(browserHasGeolocation) {
        console.error(browserHasGeolocation ?
            "Error: The Geolocation service failed." :
            "Error: Your browser doesn't support geolocation.");
        document.getElementById('map').innerText = browserHasGeolocation ? 
            "Error: The Geolocation service failed." : 
            "Error: Your browser doesn't support geolocation.";
    }

    // --- 7. FULLSCREEN CLOSE LOGIC ---
    document.querySelector('.btn-close-map').addEventListener('click', () => {
        setActiveMode('world-clock');
    });

    document.querySelector('.btn-locate-me').addEventListener('click', () => {
        mapInitialized = false; // Allow map re-initialization to current location
        initMap();
    });

    document.querySelector('.btn-close-fullscreen').addEventListener('click', () => {
        setActiveMode('world-clock');
    });

    // --- 8. SEARCH LOGIC ---
    async function searchLocation(query, type) {
        if (!query) return;
        
        const searchBtn = document.getElementById('map-search-btn');
        const searchIcon = searchBtn?.querySelector('.search-icon');
        const loadingIcon = searchBtn?.querySelector('.loading-icon');

        // Show loading state
        if (searchIcon) searchIcon.classList.add('hidden');
        if (loadingIcon) loadingIcon.classList.remove('hidden');

        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const lat = result.latitude;
                const lon = result.longitude;
                const name = result.name;

                if (type === 'weather') {
                    updateWeather(lat, lon, name);
                } else if (type === 'map') {
                    updateMap(lat, lon, name);
                }
            } else {
                // If geocoding fails, fallback to direct query for the map
                if (type === 'map') {
                    updateMap(null, null, query);
                } else {
                    alert("Location not found.");
                }
            }
        } catch (error) {
            console.error("Search error:", error);
            // Even if the API fails, try direct query for the map
            if (type === 'map') {
                updateMap(null, null, query);
            } else {
                alert("Error searching for location.");
            }
        } finally {
            // Restore search icon
            if (searchIcon) searchIcon.classList.remove('hidden');
            if (loadingIcon) loadingIcon.classList.add('hidden');
        }
    }

    function updateWeather(lat, lon, name) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=weathercode,temperature_2m,relativehumidity_2m,apparent_temperature,windspeed_10m&timezone=auto`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const current = data.current_weather;
                const hourly = data.hourly;
                
                const currentHourIndex = data.hourly.time.findIndex(t => {
                    const hourTime = new Date(t);
                    const now = new Date();
                    return hourTime >= now;
                });
                
                weatherLocationEl.innerText = name;
                weatherTempEl.innerText = `${Math.round(current.temperature)}°C`;
                weatherDescEl.innerText = getWeatherInfo(current.weathercode).desc;
                weatherIconEl.className = `fas ${getWeatherInfo(current.weathercode).icon}`;
                
                weatherHumidityEl.innerText = `${hourly.relativehumidity_2m[currentHourIndex]}%`;
                weatherWindEl.innerText = `${current.windspeed || hourly.windspeed_10m[currentHourIndex]} km/h`;
                weatherFeelsEl.innerText = `${Math.round(hourly.apparent_temperature[currentHourIndex])}°C`;
                
                renderForecast(hourly, currentHourIndex);
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                weatherLocationEl.innerText = "Error fetching weather";
            });
    }

    function renderForecast(hourly, startIndex) {
        forecastListEl.innerHTML = '';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 0; i < 72; i++) {
            const idx = startIndex + i;
            if (idx >= hourly.time.length) break;
            
            const date = new Date(hourly.time[idx]);
            const dayName = i === 0 ? 'Now' : days[date.getDay()];
            const timeStr = i === 0 ? '' : date.getHours() + ':00';
            const weatherInfo = getWeatherInfo(hourly.weathercode[idx]);
            const temp = Math.round(hourly.temperature_2m[idx]);
            
            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
                <span class="forecast-day">${dayName}</span>
                ${timeStr ? `<span class="forecast-time">${timeStr}</span>` : ''}
                <i class="fas ${weatherInfo.icon} forecast-icon"></i>
                <span class="forecast-temp">${temp}°C</span>
            `;
            forecastListEl.appendChild(item);
        }
    }

    function getWeatherInfo(code) {
        const codes = {
            0: { desc: 'Clear sky', icon: 'fa-sun' },
            1: { desc: 'Mainly clear', icon: 'fa-cloud-sun' },
            2: { desc: 'Partly cloudy', icon: 'fa-cloud-sun' },
            3: { desc: 'Overcast', icon: 'fa-cloud' },
            45: { desc: 'Fog', icon: 'fa-smog' },
            48: { desc: 'Fog', icon: 'fa-smog' },
            51: { desc: 'Light drizzle', icon: 'fa-cloud-rain' },
            53: { desc: 'Moderate drizzle', icon: 'fa-cloud-rain' },
            55: { desc: 'Dense drizzle', icon: 'fa-cloud-showers-heavy' },
            61: { desc: 'Slight rain', icon: 'fa-cloud-rain' },
            63: { desc: 'Moderate rain', icon: 'fa-cloud-rain' },
            65: { desc: 'Heavy rain', icon: 'fa-cloud-showers-heavy' },
            71: { desc: 'Slight snow', icon: 'fa-snowflake' },
            73: { desc: 'Moderate snow', icon: 'fa-snowflake' },
            75: { desc: 'Heavy snow', icon: 'fa-snowflake' },
            95: { desc: 'Thunderstorm', icon: 'fa-bolt' }
        };
        return codes[code] || { desc: 'Cloudy', icon: 'fa-cloud' };
    }

    function updateMap(lat, lon, name) {
        const mapEl = document.getElementById('map');
        if (!mapEl) return;

        // Use the iframe method as suggested by the user for searches
        mapEl.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border:0"
                src="https://maps.google.com/maps?q=${encodeURIComponent(name || (lat + ',' + lon))}&hl=en&z=15&output=embed"
                allowfullscreen>
            </iframe>
        `;
        mapInitialized = true; // Mark as initialized so initMap() doesn't overwrite it easily
    }

    // Event listeners for search
    const mapSearchInput = document.getElementById('map-search');
    const mapClearBtn = document.getElementById('map-clear-btn');

    mapSearchInput.addEventListener('input', (e) => {
        if (e.target.value.length > 0) {
            mapClearBtn.classList.remove('hidden');
        } else {
            mapClearBtn.classList.add('hidden');
        }
    });

    mapClearBtn.addEventListener('click', () => {
        mapSearchInput.value = '';
        mapClearBtn.classList.add('hidden');
        mapSearchInput.focus();
    });

    document.getElementById('map-search-btn').addEventListener('click', () => {
        const query = mapSearchInput.value;
        searchLocation(query, 'map');
    });

    mapSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocation(e.target.value, 'map');
        }
    });

    controlButtons.forEach(button => {
        button.addEventListener('click', () => setActiveMode(button.getAttribute('data-mode')));
    });

    const savedMode = sessionStorage.getItem('activeClockMode') || 'world-clock';
    setActiveMode(savedMode);

    // --- 3. TIMER LOGIC ---
    let timerInterval = null;
    const t_h = document.getElementById('timer-hours');
    const t_m = document.getElementById('timer-minutes');
    const t_s = document.getElementById('timer-seconds');

    function startTimer() {
        if (timerInterval) return;

        let totalSeconds = (parseInt(t_h.value) * 3600) + (parseInt(t_m.value) * 60) + parseInt(t_s.value);
        if (totalSeconds <= 0) return;

        timerInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Time is up!");
                return;
            }
            totalSeconds--;
            t_h.value = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            t_m.value = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            t_s.value = String(totalSeconds % 60).padStart(2, '0');
        }, 1000);
    }

    // Timer Event Listeners
    document.querySelector('.timer .btn-start').addEventListener('click', startTimer);
    document.querySelector('.timer .btn-pause').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });
    document.querySelector('.timer .btn-restart').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        t_h.value = '00'; t_m.value = '00'; t_s.value = '00';
    });

    // --- 4. STOPWATCH LOGIC ---
    let sw_startTime;
    let sw_elapsed = 0;
    let sw_interval = null;
    const sw_m = document.getElementById('sw-minutes');
    const sw_s = document.getElementById('sw-seconds');
    const sw_ms = document.getElementById('sw-ms');

    function updateStopwatch() {
        const m = Math.floor(sw_elapsed / 60000);
        const s = Math.floor((sw_elapsed % 60000) / 1000);
        const ms = Math.floor((sw_elapsed % 1000) / 10);
        sw_m.value = String(m).padStart(2, '0');
        sw_s.value = String(s).padStart(2, '0');
        sw_ms.value = String(ms).padStart(2, '0');
    }

    document.querySelector('.stopwatch .btn-start').addEventListener('click', () => {
        if (sw_interval) return;
        sw_startTime = Date.now() - sw_elapsed;
        sw_interval = setInterval(() => {
            sw_elapsed = Date.now() - sw_startTime;
            updateStopwatch();
        }, 30);
    });

    document.querySelector('.stopwatch .btn-pause').addEventListener('click', () => {
        clearInterval(sw_interval);
        sw_interval = null;
    });

    document.querySelector('.stopwatch .btn-restart').addEventListener('click', () => {
        clearInterval(sw_interval);
        sw_interval = null;
        sw_elapsed = 0;
        document.getElementById('laps-list').innerHTML = '';
        updateStopwatch();
    });

    let laps = []; // Array to store lap times
    const lapsList = document.getElementById('laps-list'); // The <ul> or <div> for display

    function recordLap(){
        if (sw_elapsed === 0) return; // Don't record if not started

        // 1. Calculate the current lap time
        const currentLapTime = sw_elapsed;

        // 2. Calculate the difference from the last lap (optional)
        const lastLapTime = laps.length > 0 ? laps[laps.length - 1] : 0;
        const lapDifference = currentLapTime - lastLapTime;

        // 3. Store it
        laps.push(currentLapTime);

        // 4. Update the UI
        const li = document.createElement('li');
        li.innerHTML = `
        <span>Lap ${laps.length}</span>
        <span>${formatTime(lapDifference)}</span>
        <span style="color: gray;">Total: ${formatTime(currentLapTime)}</span>
    `;
        lapsList.prepend(li); // Put newest lap at the top
    }

    // Helper function to format ms into 00:00:00
    function formatTime(ms) {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const mil = Math.floor((ms % 1000) / 10);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(mil).padStart(2, '0')}`;
    }

    document.querySelector('.stopwatch .btn-lapse').addEventListener('click', recordLap);

    // --- 5. ALARM LOGIC ---
    let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    let editingAlarmId = null;
    let ringingAlarmId = null;
    let ringingInterval = null;

    const alarmsList = document.getElementById('alarms-list');
    const alarmModal = document.getElementById('alarm-modal');
    const alarmRinging = document.getElementById('alarm-ringing');
    const ringingTime = document.getElementById('ringing-time');

    const alarmHourInput = document.getElementById('alarm-hour');
    const alarmMinuteInput = document.getElementById('alarm-minute');
    const alarmAmpmInput = document.getElementById('alarm-ampm');

    function saveAlarms() {
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }

    function formatAlarmTime(hour, minute, ampm) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} <small>${ampm}</small>`;
    }

    function renderAlarms() {
        if (alarms.length === 0) {
            alarmsList.innerHTML = '<p class="no-alarms">No alarms set. Click + to add one.</p>';
            return;
        }

        alarmsList.innerHTML = alarms.map(alarm => `
            <div class="alarm-card ${alarm.enabled ? '' : 'disabled'} ${alarm.isSnooze ? 'snooze-card' : ''}" data-id="${alarm.id}">
                <div class="alarm-info">
                    <h1>${formatAlarmTime(alarm.hour, alarm.minute, alarm.ampm)}</h1>
                    <p>${alarm.isSnooze ? 'Snooze' : (alarm.enabled ? 'Alarm on' : 'Alarm off')}</p>
                </div>
                <div class="alarm-actions">
                    <button class="btn-delete" onclick="deleteAlarm(${alarm.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <label class="switch">
                        <input type="checkbox" ${alarm.enabled ? 'checked' : ''} onchange="toggleAlarm(${alarm.id}, this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `).join('');
    }

    window.toggleAlarm = function(id, enabled) {
        const alarm = alarms.find(a => a.id === id);
        if (alarm) {
            alarm.enabled = enabled;
            saveAlarms();
            renderAlarms();
        }
    };

    window.deleteAlarm = function(id) {
        alarms = alarms.filter(a => a.id !== id);
        saveAlarms();
        renderAlarms();
    };

    document.querySelector('.btn-add-alarm').addEventListener('click', () => {
        editingAlarmId = null;
        const now = new Date();
        let hour = now.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        alarmHourInput.value = String(hour).padStart(2, '0');
        alarmMinuteInput.value = String(now.getMinutes()).padStart(2, '0');
        alarmAmpmInput.value = ampm;
        alarmModal.classList.remove('hidden');
    });

    document.getElementById('alarm-cancel').addEventListener('click', () => {
        alarmModal.classList.add('hidden');
    });

    document.getElementById('alarm-save').addEventListener('click', () => {
        const hour = parseInt(alarmHourInput.value);
        const minute = parseInt(alarmMinuteInput.value);
        const ampm = alarmAmpmInput.value.toUpperCase();

        if (isNaN(hour) || isNaN(minute) || !ampm) return;

        if (editingAlarmId) {
            const alarm = alarms.find(a => a.id === editingAlarmId);
            if (alarm) {
                alarm.hour = hour;
                alarm.minute = minute;
                alarm.ampm = ampm;
            }
        } else {
            const newAlarm = {
                id: Date.now(),
                hour: hour,
                minute: minute,
                ampm: ampm,
                enabled: true
            };
            alarms.push(newAlarm);
        }

        saveAlarms();
        renderAlarms();
        alarmModal.classList.add('hidden');
    });

    const alarmSound = document.getElementById('alarm-sound');

    function triggerAlarm(alarm) {
        ringingAlarmId = alarm.id;
        ringingTime.innerHTML = formatAlarmTime(alarm.hour, alarm.minute, alarm.ampm);
        alarmRinging.classList.remove('hidden');
        alarmSound.currentTime = 0;
        alarmSound.play().catch(() => {});
    }

    document.getElementById('alarm-dismiss').addEventListener('click', () => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmRinging.classList.add('hidden');
        if (ringingAlarmId) {
            const alarmIndex = alarms.findIndex(a => a.id === ringingAlarmId);
            if (alarmIndex !== -1) {
                const alarm = alarms[alarmIndex];
                if (alarm.isSnooze) {
                    // Remove snooze alarm once dismissed
                    alarms.splice(alarmIndex, 1);
                } else {
                    // Just disable regular alarm
                    alarm.enabled = false;
                }
                saveAlarms();
                renderAlarms();
            }
            ringingAlarmId = null;
        }
    });

    document.getElementById('alarm-snooze').addEventListener('click', () => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmRinging.classList.add('hidden');
        
        // Disable or remove the original alarm that just rang
        if (ringingAlarmId) {
            const alarmIndex = alarms.findIndex(a => a.id === ringingAlarmId);
            if (alarmIndex !== -1) {
                const originalAlarm = alarms[alarmIndex];
                if (originalAlarm.isSnooze) {
                    alarms.splice(alarmIndex, 1);
                } else {
                    originalAlarm.enabled = false;
                }
            }
        }

        const now = new Date();
        const snoozeTime = new Date(now.getTime() + 5 * 60 * 1000);
        let hour = snoozeTime.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        
        const snoozeAlarm = {
            id: Date.now(),
            hour: hour,
            minute: snoozeTime.getMinutes(),
            ampm: ampm,
            enabled: true,
            isSnooze: true
        };
        alarms.push(snoozeAlarm);
        saveAlarms();
        renderAlarms();
        ringingAlarmId = null;
    });

    function checkAlarms() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;

        alarms.forEach(alarm => {
            if (alarm.enabled && alarm.hour === displayHour && 
                alarm.minute === minutes && alarm.ampm === ampm) {
                if (ringingAlarmId !== alarm.id) {
                    triggerAlarm(alarm);
                }
            }
        });
    }

    renderAlarms();
    setInterval(checkAlarms, 1000);
});