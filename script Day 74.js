document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.querySelector('.settings-modal');
    const saveSettingsBtn = document.getElementById('saveSettings');
    
    // Timer variables
    let timer;
    let totalSeconds = 25 * 60; // Default: 25 minutes
    let remainingSeconds = totalSeconds;
    let isRunning = false;
    let currentMode = 'pomodoro';
    
    // Settings
    let settings = {
        pomodoroTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15
    };
    
    // Progress circle
    const circle = document.querySelector('.progress-ring__circle-fill');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
    // Initialize
    updateDisplay();
    loadSettings();
    
    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    modeButtons.forEach(button => {
        button.addEventListener('click', () => switchMode(button.dataset.mode));
    });
    
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.toggle('hidden');
        populateSettingsForm();
    });
    
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // Timer functions
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(updateTimer, 1000);
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';
        }
    }
    
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.style.display = 'flex';
        pauseBtn.style.display = 'none';
    }
    
    function resetTimer() {
        pauseTimer();
        remainingSeconds = totalSeconds;
        updateDisplay();
    }
    
    function updateTimer() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
            
            // Update progress circle
            const offset = circumference - (remainingSeconds / totalSeconds) * circumference;
            circle.style.strokeDashoffset = offset;
        } else {
            pauseTimer();
            playAlarm();
            setTimeout(() => {
                switchModeAutomatically();
            }, 1000);
        }
    }
    
    function updateDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Mode functions
    function switchMode(mode) {
        currentMode = mode;
        
        // Update UI
        modeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.mode === mode);
        });
        
        // Set timer based on mode
        switch (mode) {
            case 'pomodoro':
                totalSeconds = settings.pomodoroTime * 60;
                document.body.className = 'pomodoro-mode';
                break;
            case 'shortBreak':
                totalSeconds = settings.shortBreakTime * 60;
                document.body.className = 'shortBreak-mode';
                break;
            case 'longBreak':
                totalSeconds = settings.longBreakTime * 60;
                document.body.className = 'longBreak-mode';
                break;
        }
        
        resetTimer();
    }
    
    function switchModeAutomatically() {
        if (currentMode === 'pomodoro') {
            // Check how many pomodoros completed to decide break type
        
            const lastBreakWasLong = localStorage.getItem('lastBreakWasLong') === 'true';
            
            if (lastBreakWasLong) {
                switchMode('shortBreak');
                localStorage.setItem('lastBreakWasLong', 'false');
            } else {
                switchMode('longBreak');
                localStorage.setItem('lastBreakWasLong', 'true');
            }
        } else {
            switchMode('pomodoro');
        }
    }
    
    // Settings functions
    function populateSettingsForm() {
        document.getElementById('pomodoroTime').value = settings.pomodoroTime;
        document.getElementById('shortBreakTime').value = settings.shortBreakTime;
        document.getElementById('longBreakTime').value = settings.longBreakTime;
    }
    
    function saveSettings() {
        settings.pomodoroTime = parseInt(document.getElementById('pomodoroTime').value);
        settings.shortBreakTime = parseInt(document.getElementById('shortBreakTime').value);
        settings.longBreakTime = parseInt(document.getElementById('longBreakTime').value);
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        settingsModal.classList.add('hidden');
        
        // Update current mode with new settings
        switchMode(currentMode);
    }
    
    function loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    }
    
    // Alarm sound
    function playAlarm() {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
    }
    
    // Initialize UI
    pauseBtn.style.display = 'none';
});
