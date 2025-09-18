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
        if (running) {
            running = false;
            clearInterval(timerId);
        } else {
            running = true;
            timerId = setInterval(tick, 1000);
        }
        updatePlayPauseButton();
    }

    function reset() {
        running = false;
        clearInterval(timerId);
        remaining = total;
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

    // Event listeners for control buttons
    if (playPauseBtn) playPauseBtn.addEventListener('click', startPause);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    // Initialize
    updatePlayPauseButton();
    render();
});



