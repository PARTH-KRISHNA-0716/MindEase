// Dashboard logic: 7-day time chart, to-dos, and calendar schedules
document.addEventListener('DOMContentLoaded', function() {

    // Auth guard: redirect to login if not authenticated
    function isAuthenticated() {
        const user = localStorage.getItem('MindEase_user');
        const token = localStorage.getItem('MindEase_auth_token');
        const loginTime = localStorage.getItem('MindEase_login_time');
        if (!user || !token || !loginTime) return false;
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        if (hoursDiff >= 24) {
            localStorage.removeItem('MindEase_user');
            localStorage.removeItem('MindEase_auth_token');
            localStorage.removeItem('MindEase_login_time');
            return false;
        }
        return true;
    }


    // Auth guard: redirect to login if not authenticated
    if (!isAuthenticated()) {
        window.location.href = 'auth.html?tab=login';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('MindEase_user'));

    // Populate welcome message with username
    const welcomeUserNameSpan = document.getElementById('welcomeUserName');
    if (welcomeUserNameSpan && currentUser && currentUser.name) {
        welcomeUserNameSpan.textContent = currentUser.name;
    }

    // Populate header profile
    (function populateProfile() {
        const profilePic = document.getElementById('profilePic');
        const profilePopout = document.getElementById('profilePopout');
        const logoutBtn = document.getElementById('logoutBtn');
        const userNameElem = document.getElementById('userName');
        const userEmailElem = document.getElementById('userEmail');
        const userPhoneElem = document.getElementById('userPhone');
        if (profilePic) profilePic.style.display = 'flex';
        if (userNameElem) userNameElem.textContent = currentUser.name || 'N/A';
        if (userEmailElem) userEmailElem.textContent = currentUser.email || 'Not provided';
        if (userPhoneElem) userPhoneElem.textContent = currentUser.mobile || 'Not provided';
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
        if (logoutBtn) logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('MindEase_user');
            localStorage.removeItem('MindEase_auth_token');
            localStorage.removeItem('MindEase_login_time');
            window.location.href = 'index.html';
        });

        const dashboardResetPasswordLink = document.getElementById('dashboardResetPasswordLink');
        if (dashboardResetPasswordLink) {
            dashboardResetPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'auth.html?tab=login#reset';
            });
        }
    })();

    // Logo/title click redirects to home (dashboard page)
    (function enableLogoHomeNav() {
        const logoSection = document.querySelector('.logo-section');
        if (logoSection) {
            logoSection.style.cursor = 'pointer';
            logoSection.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }
    })();

    // ---------- Time Tracking & Chart ----------
    // We accumulate per-day seconds in localStorage while the user browses any page.
    // Here we just read and plot the last 7 days.

    function formatDateKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function formatDdMm(date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        return `${dd}/${mm}`;
    }

    function getTimeSpentByDay() {
        const key = `MindEase_time_${currentUser.id}`;
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        return data;
    }

    function renderSevenDayChart() {
        const canvas = document.getElementById('timeChart');
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        const tooltip = document.getElementById('chartTooltip');
        const perDay = getTimeSpentByDay();

        const labels = [];
        const dates = [];
        const values = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = formatDateKey(d);
            labels.push(formatDdMm(d));
            dates.push(new Date(d));
            values.push(Math.round((perDay[key] || 0) / 60)); // minutes
        }

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Responsive sizing to CSS width
        const cssWidth = canvas.clientWidth || 900;
        const cssHeight = canvas.clientHeight || 280;
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== Math.floor(cssWidth * dpr) || canvas.height !== Math.floor(cssHeight * dpr)) {
            canvas.width = Math.floor(cssWidth * dpr);
            canvas.height = Math.floor(cssHeight * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Theme colors
        const axisColor = '#94a3b8';
        const barColor = '#10B981';
        const barGradient = ctx.createLinearGradient(0, 0, 0, cssHeight);
        barGradient.addColorStop(0, '#34d399');
        barGradient.addColorStop(1, '#10b981');
        const gridColor = '#e5e7eb';
        const labelColor = '#0b1220';

        // Layout
        const padding = 36;
        const chartW = cssWidth - padding * 2;
        const chartH = cssHeight - padding * 2;
        const maxVal = Math.max(10, ...values);
        const barW = chartW / values.length * 0.6;
        const gap = (chartW - barW * values.length) / (values.length - 1);

        // Axes
        ctx.strokeStyle = axisColor;
        ctx.beginPath();
        ctx.moveTo(padding, cssHeight - padding);
        ctx.lineTo(cssWidth - padding, cssHeight - padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, cssHeight - padding);
        ctx.stroke();

        // Horizontal grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        const steps = 4;
        for (let s = 1; s <= steps; s++) {
            const y = cssHeight - padding - (chartH * s / steps);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(cssWidth - padding, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Bars
        const bars = [];
        ctx.fillStyle = barGradient;
        values.forEach((v, i) => {
            const x = padding + i * (barW + gap);
            const h = (v / maxVal) * chartH;
            const y = cssHeight - padding - h;
            // Rounded bars
            const r = Math.min(8, barW / 2, h);
            ctx.beginPath();
            ctx.moveTo(x, y + h);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.lineTo(x + barW - r, y);
            ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
            ctx.lineTo(x + barW, y + h);
            ctx.closePath();
            ctx.fill();
            bars.push({ x, y, w: barW, h, value: v, label: labels[i], date: dates[i] });
            
            // Display time value above each bar
            ctx.fillStyle = labelColor;
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            const valueText = `${v}m`;
            const textY = Math.max(y - 8, padding + 12); // Ensure text doesn't go above chart area
            ctx.fillText(valueText, x + barW / 2, textY);
            ctx.fillStyle = barGradient; // Reset to bar color for next iteration
        });

        // Labels
        ctx.fillStyle = labelColor;
        ctx.font = '12px sans-serif';
        labels.forEach((lbl, i) => {
            const x = padding + i * (barW + gap) + barW / 2;
            const y = cssHeight - padding + 14;
            ctx.textAlign = 'center';
            ctx.fillText(lbl, x, y);
        });

        // Title note
        ctx.textAlign = 'right';
        ctx.fillText('(minutes)', cssWidth - 8, padding - 10);

        // Remove tooltip functionality - values are now always displayed above bars
    }

    renderSevenDayChart();
    // Live refresh every minute and on visibility/storage changes
    const chartRefreshMs = 60000;
    let chartInterval = setInterval(renderSevenDayChart, chartRefreshMs);
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            renderSevenDayChart();
        }
    });
    window.addEventListener('storage', function(e) {
        if (!e || !e.key) return;
        const expectedKey = `MindEase_time_${currentUser.id}`;
        if (e.key === expectedKey) {
            renderSevenDayChart();
        }
    });
    window.addEventListener('beforeunload', function() { if (chartInterval) clearInterval(chartInterval); });

    // ---------- To‑Do List (per user) ----------
    const todoKey = `MindEase_todos_${currentUser.id}`;
    const todoText = document.getElementById('todoText');
    const addTodo = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');

    function loadTodos() { return JSON.parse(localStorage.getItem(todoKey) || '[]'); }
    function saveTodos(todos) { localStorage.setItem(todoKey, JSON.stringify(todos)); }

    function renderTodos() {
        const todos = loadTodos();
        todoList.innerHTML = '';
        todos.forEach(t => {
            const li = document.createElement('li');
            li.className = 'todo-item' + (t.completed ? ' completed' : '');
            li.dataset.id = t.id;
            li.innerHTML = `
                <div class="todo-left">
                    <input type="checkbox" ${t.completed ? 'checked' : ''}>
                    <span class="todo-text">${t.text}</span>
                </div>
                <button class="btn btn-logout btn-small">Delete</button>
            `;
            const checkbox = li.querySelector('input[type="checkbox"]');
            const delBtn = li.querySelector('button');
            checkbox.addEventListener('change', function() {
                const all = loadTodos();
                const idx = all.findIndex(x => x.id === t.id);
                if (idx >= 0) {
                    all[idx].completed = !!this.checked;
                    saveTodos(all);
                    renderTodos();
                }
            });
            delBtn.addEventListener('click', function() {
                const all = loadTodos().filter(x => x.id !== t.id);
                saveTodos(all);
                renderTodos();
            });
            todoList.appendChild(li);
        });
    }

    if (addTodo) {
        addTodo.addEventListener('click', function() {
            const text = (todoText.value || '').trim();
            if (!text) return;
            const todos = loadTodos();
            todos.push({ id: Date.now().toString(), text, completed: false });
            saveTodos(todos);
            todoText.value = '';
            renderTodos();
        });
    }

    renderTodos();

    // ---------- Calendar & Schedules (per user) ----------
    const schedulesKey = `MindEase_schedules_${currentUser.id}`;
    const calendarGrid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('monthLabel');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    const selectedDateLabel = document.getElementById('selectedDateLabel');
    const scheduleText = document.getElementById('scheduleText');
    const saveSchedule = document.getElementById('saveSchedule');

    let current = new Date();
    let selectedDateKey = null;

    function loadSchedules() { return JSON.parse(localStorage.getItem(schedulesKey) || '{}'); }
    function saveSchedules(s) { localStorage.setItem(schedulesKey, JSON.stringify(s)); }

    function isSameDay(a, b) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    function renderCalendar(date) {
        const y = date.getFullYear();
        const m = date.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);
        const startWeekday = firstDay.getDay(); // 0-6
        const totalDays = lastDay.getDate();
        const today = new Date();
        const schedules = loadSchedules();

        monthLabel.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${y}`;
        calendarGrid.innerHTML = '';

        // Fill leading blanks
        for (let i = 0; i < startWeekday; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell empty';
            calendarGrid.appendChild(cell);
        }

        for (let d = 1; d <= totalDays; d++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            const dt = new Date(y, m, d);
            const key = formatDateKey(dt);
            cell.dataset.key = key;
            if (isSameDay(dt, today)) {
                cell.classList.add('today');
            }
            cell.innerHTML = `<div class="date-number">${d}</div>` + (schedules[key] ? '<div class="dot"></div>' : '');
            cell.addEventListener('click', function() {
                document.querySelectorAll('.calendar-cell.selected').forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
                selectedDateKey = key;
                selectedDateLabel.textContent = `Schedule for ${dt.toDateString()}`;
                scheduleText.value = schedules[key] || '';
            });
            calendarGrid.appendChild(cell);
        }
    }

    if (prevMonth) prevMonth.addEventListener('click', function() { current.setMonth(current.getMonth() - 1); renderCalendar(current); });
    if (nextMonth) nextMonth.addEventListener('click', function() { current.setMonth(current.getMonth() + 1); renderCalendar(current); });
    if (saveSchedule) saveSchedule.addEventListener('click', function() {
        if (!selectedDateKey) return;
        const schedules = loadSchedules();
        const text = scheduleText.value.trim();
        if (text) schedules[selectedDateKey] = text; else delete schedules[selectedDateKey];
        saveSchedules(schedules);
        renderCalendar(current);
    });

    if (todayBtn) todayBtn.addEventListener('click', function() {
        current = new Date();
        renderCalendar(current);
        const key = formatDateKey(current);
        const todayCell = document.querySelector(`.calendar-cell[data-key="${key}"]`);
        if (todayCell) {
            document.querySelectorAll('.calendar-cell.selected').forEach(c => c.classList.remove('selected'));
            todayCell.classList.add('selected');
            selectedDateKey = key;
            selectedDateLabel.textContent = `Schedule for ${current.toDateString()}`;
            const schedules = loadSchedules();
            scheduleText.value = schedules[key] || '';
        }
    });

    renderCalendar(current);
});


// Populate header profile
(function populateProfile() {
    const profilePic = document.getElementById('profilePic');
    const profilePopout = document.getElementById('profilePopout');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameElem = document.getElementById('userName');
    const userEmailElem = document.getElementById('userEmail');
    const userPhoneElem = document.getElementById('userPhone');
    if (profilePic) profilePic.style.display = 'flex';
    if (userNameElem) userNameElem.textContent = currentUser.name || 'N/A';
    if (userEmailElem) userEmailElem.textContent = currentUser.email || 'Not provided';
    if (userPhoneElem) userPhoneElem.textContent = currentUser.mobile || 'Not provided';
})();

// Add event listeners for auth buttons
if (logoutBtn) logoutBtn.addEventListener('click', function() {
    logout();
    // Close the profile popup after logout
    const profilePopout = document.getElementById('profilePopout');
    if (profilePopout) {
        profilePopout.style.display = 'none';
    }
});


