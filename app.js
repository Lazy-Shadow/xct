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
    }

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