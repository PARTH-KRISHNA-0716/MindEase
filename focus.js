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

    // Pomodoro timer
    const modes = {
        pomodoro: 25 * 60,
        short: 5 * 60,
        long: 15 * 60
    };
    let currentMode = 'pomodoro';
    let remaining = modes[currentMode];
    let total = modes[currentMode];
    let timerId = null;
    let running = false;

    const display = document.getElementById('timerDisplay');
    const bar = document.getElementById('timerProgressBar');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.timer-controls [data-mode]');

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function render() {
        if (display) display.textContent = formatTime(remaining);
        if (bar) {
            const pct = Math.max(0, Math.min(1, 1 - (remaining / total)));
            bar.style.width = `${pct * 100}%`;
        }
    }

    function tick() {
        if (!running) return;
        remaining -= 1;
        if (remaining <= 0) {
            remaining = 0;
            running = false;
            clearInterval(timerId);
            startPauseBtn.textContent = 'Start';
        }
        render();
    }

    function setMode(mode) {
        currentMode = mode;
        total = modes[mode];
        remaining = total;
        running = false;
        clearInterval(timerId);
        startPauseBtn.textContent = 'Start';
        render();
    }

    if (modeButtons) modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            setMode(mode);
        });
    });

    if (startPauseBtn) startPauseBtn.addEventListener('click', function() {
        if (running) {
            running = false;
            clearInterval(timerId);
            startPauseBtn.textContent = 'Start';
        } else {
            running = true;
            startPauseBtn.textContent = 'Pause';
            timerId = setInterval(tick, 1000);
        }
    });

    if (resetBtn) resetBtn.addEventListener('click', function() {
        running = false;
        clearInterval(timerId);
        remaining = total;
        startPauseBtn.textContent = 'Start';
        render();
    });

    render();
});


