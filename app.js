document.addEventListener('DOMContentLoaded', function () {
    // --- 1. WORLD CLOCK LOGIC ---
    const dateEl = document.getElementById('date');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const meridiemEl = document.getElementById('meridiem');
    const timezoneEl = document.getElementById('timezone');

    function setupWorldClock() {
        const now = new Date();

        // Manual formatting is more reliable than .split(' ') for cross-browser
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const displayHours = h % 12 || 12;
        const ampm = h >= 12 ? 'PM' : 'AM';

        dateEl.innerText = now.toDateString();
        hoursEl.innerText = String(displayHours).padStart(2, '0');
        minutesEl.innerText = String(m).padStart(2, '0');
        secondsEl.innerText = String(s).padStart(2, '0');
        meridiemEl.innerText = ampm;

        const timezoneName = new Intl.DateTimeFormat('en-US', {
            timeZoneName: 'short'
        }).formatToParts(now).find(part => part.type === 'timeZoneName').value;
        timezoneEl.innerText = timezoneName;
    }
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=relativehumidity_2m,apparent_temperature,windspeed_10m&timezone=auto`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const current = data.current_weather;
                const hourly = data.hourly;
                const daily = data.daily;
                
                // Current weather
                weatherLocationEl.innerText = name;
                weatherTempEl.innerText = `${Math.round(current.temperature)}°C`;
                weatherDescEl.innerText = getWeatherInfo(current.weathercode).desc;
                weatherIconEl.className = `fas ${getWeatherInfo(current.weathercode).icon}`;
                
                // Extra details (using first index of hourly for simplicity)
                weatherHumidityEl.innerText = `${hourly.relativehumidity_2m[0]}%`;
                weatherWindEl.innerText = `${current.windspeed || hourly.windspeed_10m[0]} km/h`;
                weatherFeelsEl.innerText = `${Math.round(hourly.apparent_temperature[0])}°C`;
                
                // Forecast
                renderForecast(daily);
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                weatherLocationEl.innerText = "Error fetching weather";
            });
    }

    function renderForecast(daily) {
        forecastListEl.innerHTML = '';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Today' : days[date.getDay()];
            const weatherInfo = getWeatherInfo(daily.weathercode[i]);
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            
            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
                <span class="forecast-day">${dayName}</span>
                <i class="fas ${weatherInfo.icon} forecast-icon"></i>
                <span class="forecast-temp">${maxTemp}°C</span>
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

        let totalSeconds = (parseInt(t_h.innerText) * 3600) + (parseInt(t_m.innerText) * 60) + parseInt(t_s.innerText);
        if (totalSeconds <= 0) return;

        timerInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Time is up!");
                return;
            }
            totalSeconds--;
            t_h.innerText = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            t_m.innerText = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            t_s.innerText = String(totalSeconds % 60).padStart(2, '0');
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
        t_h.innerText = '00'; t_m.innerText = '00'; t_s.innerText = '00';
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
        sw_m.innerText = String(m).padStart(2, '0');
        sw_s.innerText = String(s).padStart(2, '0');
        sw_ms.innerText = String(ms).padStart(2, '0');
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

    const hourSelect = document.getElementById('alarm-hour');
    const minuteSelect = document.getElementById('alarm-minute');
    const ampmSelect = document.getElementById('alarm-ampm');

    for (let i = 1; i <= 12; i++) {
        hourSelect.innerHTML += `<option value="${i}">${String(i).padStart(2, '0')}</option>`;
    }
    for (let i = 0; i < 60; i++) {
        minuteSelect.innerHTML += `<option value="${i}">${String(i).padStart(2, '0')}</option>`;
    }

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
            <div class="alarm-card ${alarm.enabled ? '' : 'disabled'}" data-id="${alarm.id}">
                <div class="alarm-info">
                    <h1>${formatAlarmTime(alarm.hour, alarm.minute, alarm.ampm)}</h1>
                    <p>${alarm.enabled ? 'Alarm on' : 'Alarm off'}</p>
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
        hourSelect.value = hour;
        minuteSelect.value = 0;
        ampmSelect.value = ampm;
        alarmModal.classList.remove('hidden');
    });

    document.getElementById('alarm-cancel').addEventListener('click', () => {
        alarmModal.classList.add('hidden');
    });

    document.getElementById('alarm-save').addEventListener('click', () => {
        const hour = parseInt(hourSelect.value);
        const minute = parseInt(minuteSelect.value);
        const ampm = ampmSelect.value;

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

    function triggerAlarm(alarm) {
        ringingAlarmId = alarm.id;
        ringingTime.innerHTML = formatAlarmTime(alarm.hour, alarm.minute, alarm.ampm);
        alarmRinging.classList.remove('hidden');
    }

    document.getElementById('alarm-dismiss').addEventListener('click', () => {
        alarmRinging.classList.add('hidden');
        if (ringingAlarmId) {
            const alarm = alarms.find(a => a.id === ringingAlarmId);
            if (alarm) {
                alarm.enabled = false;
                saveAlarms();
                renderAlarms();
            }
            ringingAlarmId = null;
        }
    });

    document.getElementById('alarm-snooze').addEventListener('click', () => {
        alarmRinging.classList.add('hidden');
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