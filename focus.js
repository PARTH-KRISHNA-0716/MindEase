document.addEventListener('DOMContentLoaded', function() {
    // Auth check: show profile + reset link behavior similar to dashboard
    const user = localStorage.getItem('MindEase_user');
    if (user) {
        const profilePic = document.getElementById('profilePic');
        if (profilePic) profilePic.style.display = 'flex';
        const profilePopout = document.getElementById('profilePopout');
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('MindEase_user');
            localStorage.removeItem('MindEase_auth_token');
            localStorage.removeItem('MindEase_login_time');
            window.location.href = 'index.html';
        });
        const resetLink = document.getElementById('dashboardResetPasswordLink');
        if (resetLink) resetLink.addEventListener('click', function(e) { e.preventDefault(); window.location.href = 'auth.html?tab=login#reset'; });
        const userData = JSON.parse(user);
        const userNameElem = document.getElementById('userName');
        const userEmailElem = document.getElementById('userEmail');
        const userPhoneElem = document.getElementById('userPhone');
        if (userNameElem) userNameElem.textContent = userData.name || 'N/A';
        if (userEmailElem) userEmailElem.textContent = userData.email || 'Not provided';
        if (userPhoneElem) userPhoneElem.textContent = userData.mobile || 'Not provided';
        if (profilePic && profilePopout) {
            profilePic.addEventListener('click', function() {
                profilePopout.style.display = (profilePopout.style.display === 'block') ? 'none' : 'block';
            });
            document.addEventListener('click', function(e) {
                if (!profilePic.contains(e.target) && !profilePopout.contains(e.target)) {
                    profilePopout.style.display = 'none';
                }
            });
        }
    }

    // Logo/title click redirects to home
    const logoSection = document.querySelector('.logo-section');
    if (logoSection) {
        logoSection.style.cursor = 'pointer';
        logoSection.addEventListener('click', function() { window.location.href = 'index.html'; });
    }

    // Enhanced Pomodoro Timer
    let studyTime = 25 * 60; // Default 25 minutes
    let breakTime = 5 * 60;  // Default 5 minutes
    let remaining = studyTime;
    let total = studyTime;
    let timerId = null;
    let running = false;
    let isStudyMode = true;

    const display = document.getElementById('timerDisplay');
    const modeDisplay = document.getElementById('timerMode');
    const progressCircle = document.getElementById('progressCircle');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    
    // Timer settings elements
    const studyTimeRadios = document.querySelectorAll('input[name="studyTime"]');
    const breakTimeRadios = document.querySelectorAll('input[name="breakTime"]');
    const customStudyInput = document.getElementById('customStudyTime');
    const customBreakInput = document.getElementById('customBreakTime');

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateProgressCircle() {
        if (progressCircle) {
            const circumference = 2 * Math.PI * 90; // radius = 90
            const progress = (total - remaining) / total;
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    function render() {
        if (display) display.textContent = formatTime(remaining);
        if (modeDisplay) modeDisplay.textContent = isStudyMode ? 'Study Time' : 'Break Time';
        updateProgressCircle();
    }

    function tick() {
        if (!running) return;
        remaining -= 1;
        if (remaining <= 0) {
            remaining = 0;
            running = false;
            clearInterval(timerId);
            updatePlayPauseButton();
            
            // Show alert and play alarm sound
            showTimerAlert();
            
            // Switch between study and break modes
            if (isStudyMode) {
                isStudyMode = false;
                total = breakTime;
                remaining = breakTime;
                modeDisplay.textContent = 'Break Time';
                // Change circle color for break
                progressCircle.style.stroke = '#06B6D4';
            } else {
                isStudyMode = true;
                total = studyTime;
                remaining = studyTime;
                modeDisplay.textContent = 'Study Time';
                // Change circle color for study
                progressCircle.style.stroke = '#10B981';
            }
        }
        render();
    }

    function updatePlayPauseButton() {
        if (running) {
            playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>'; // Pause icon
        } else {
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
        }
    }

    function startPause() {
        if (window.backgroundTimer) {
            if (running) {
                window.backgroundTimer.pauseTimer();
            } else {
                window.backgroundTimer.resumeTimer();
            }
        } else {
            if (running) {
                running = false;
                clearInterval(timerId);
            } else {
                running = true;
                timerId = setInterval(tick, 1000);
            }
        }
        updatePlayPauseButton();
    }

    function reset() {
        if (window.backgroundTimer) {
            window.backgroundTimer.resetTimer();
        } else {
            running = false;
            clearInterval(timerId);
            remaining = total;
        }
        updatePlayPauseButton();
        render();
    }

    function updateStudyTime() {
        const selectedStudy = document.querySelector('input[name="studyTime"]:checked');
        if (selectedStudy) {
            if (selectedStudy.value === 'custom') {
                const customValue = parseInt(customStudyInput.value);
                if (customValue && customValue > 0 && customValue <= 120) {
                    studyTime = customValue * 60;
                }
            } else {
                studyTime = parseInt(selectedStudy.value) * 60;
            }
            
            if (isStudyMode) {
                total = studyTime;
                remaining = studyTime;
                reset();
            }
            
            // Update background timer if it exists
            if (window.backgroundTimer) {
                window.backgroundTimer.studyTime = studyTime;
                window.backgroundTimer.saveTimerState();
            }
        }
    }

    function updateBreakTime() {
        const selectedBreak = document.querySelector('input[name="breakTime"]:checked');
        if (selectedBreak) {
            if (selectedBreak.value === 'custom') {
                const customValue = parseInt(customBreakInput.value);
                if (customValue && customValue > 0 && customValue <= 60) {
                    breakTime = customValue * 60;
                }
            } else {
                breakTime = parseInt(selectedBreak.value) * 60;
            }
            
            if (!isStudyMode) {
                total = breakTime;
                remaining = breakTime;
                reset();
            }
            
            // Update background timer if it exists
            if (window.backgroundTimer) {
                window.backgroundTimer.breakTime = breakTime;
                window.backgroundTimer.saveTimerState();
            }
        }
    }

    // Event listeners for timer settings
    studyTimeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'custom') {
                customStudyInput.style.display = 'block';
            } else {
                customStudyInput.style.display = 'none';
                updateStudyTime();
            }
        });
    });

    breakTimeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'custom') {
                customBreakInput.style.display = 'block';
            } else {
                customBreakInput.style.display = 'none';
                updateBreakTime();
            }
        });
    });

    customStudyInput.addEventListener('input', updateStudyTime);
    customBreakInput.addEventListener('input', updateBreakTime);
    
    // Add Enter key support for custom timer inputs
    customStudyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            updateStudyTime();
            // Hide the input after Enter is pressed
            customStudyInput.style.display = 'none';
            // Select the custom radio button to show it's active
            const customRadio = document.querySelector('input[name="studyTime"][value="custom"]');
            if (customRadio) customRadio.checked = true;
        }
    });
    
    customBreakInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            updateBreakTime();
            // Hide the input after Enter is pressed
            customBreakInput.style.display = 'none';
            // Select the custom radio button to show it's active
            const customRadio = document.querySelector('input[name="breakTime"][value="custom"]');
            if (customRadio) customRadio.checked = true;
        }
    });

    // Event listeners for control buttons
    if (playPauseBtn) playPauseBtn.addEventListener('click', startPause);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    // Sync with background timer
    function syncWithBackgroundTimer() {
        if (window.backgroundTimer) {
            const state = window.backgroundTimer.getTimerState();
            studyTime = state.studyTime;
            breakTime = state.breakTime;
            remaining = state.remainingTime;
            total = state.totalTime;
            isStudyMode = state.isStudyMode;
            running = state.isRunning;
            
            // Update UI
            updatePlayPauseButton();
            render();
            
            // Update progress circle color
            if (progressCircle) {
                progressCircle.style.stroke = isStudyMode ? '#10B981' : '#06B6D4';
            }
        }
    }

    // Sync every second
    setInterval(syncWithBackgroundTimer, 1000);

    // Timer alert functionality
    let alarmAudio = null;
    let alertInterval = null;

    function showTimerAlert() {
        const modeText = isStudyMode ? 'Study' : 'Break';
        const message = `${modeText} time completed! Time for a ${isStudyMode ? 'break' : 'study'} session.`;
        
        // Play alarm sound
        playAlarmSound();
        
        // Show alert with stop button
        const userResponse = confirm(`${message}\n\nClick OK to stop the alarm and continue.`);
        
        if (userResponse) {
            stopAlarmSound();
        }
    }

    function playAlarmSound() {
        try {
            // Create audio element if it doesn't exist
            if (!alarmAudio) {
                alarmAudio = new Audio('alarm.mp3');
                alarmAudio.loop = true; 
                alarmAudio.volume = 1.0;
            }
            
            // Play the alarm sound
            alarmAudio.play().catch(error => {
                console.log('Could not play alarm sound:', error);
                // Fallback: use browser's built-in beep if audio file fails
                playFallbackBeep();
            });
        } catch (error) {
            console.log('Error playing alarm sound:', error);
            playFallbackBeep();
        }
    }

    function stopAlarmSound() {
        if (alarmAudio) {
            alarmAudio.pause();
            alarmAudio.currentTime = 0; // Reset to beginning
        }
        if (alertInterval) {
            clearInterval(alertInterval);
            alertInterval = null;
        }
    }

    function playFallbackBeep() {
        // Fallback beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
            // Repeat the beep every 2 seconds
            alertInterval = setInterval(() => {
                const newOscillator = audioContext.createOscillator();
                const newGainNode = audioContext.createGain();
                
                newOscillator.connect(newGainNode);
                newGainNode.connect(audioContext.destination);
                
                newOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                newOscillator.type = 'square';
                
                newGainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                newGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                newOscillator.start(audioContext.currentTime);
                newOscillator.stop(audioContext.currentTime + 0.5);
            }, 2000);
        } catch (error) {
            console.log('Fallback beep also failed:', error);
        }
    }

    // Initialize
    updatePlayPauseButton();
    render();
    syncWithBackgroundTimer();
});



