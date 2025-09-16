// MindEase Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {

    // Get DOM elements
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // State management
    let currentUser = null;
    
    // Load user data (optional - no authentication required)
    loadUserData();

    // Temporary: Show profile icon for testing
    // document.getElementById('profilePic').style.display = 'flex';
    
    // Navigation link interactions
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Simulate navigation (you can replace this with actual routing)
            const pageName = this.textContent.toLowerCase();
            console.log(`Navigating to: ${pageName}`);
            
            // Update page content based on navigation
            updatePageContent(pageName);
        });
    });
    
    // Toggle and Focus mode functions removed - will be added to footer later
    
    // Page Content Updates
    function updatePageContent(pageName) {
        const mainContent = document.querySelector('.main-content');
        
        const contentMap = {
            'meditations': {
                title: 'Meditations',
                description: 'Find your inner peace with guided meditation sessions designed to reduce stress and improve mindfulness.'
            },
            'pomodoro': {
                title: 'Pomodoro Timer',
                description: 'Boost your productivity with the Pomodoro Technique. Work in focused 25-minute intervals with short breaks.'
            },
            'analytics': {
                title: 'Analytics',
                description: 'Track your progress and gain insights into your meditation and productivity habits over time.'
            }
        };
        
        const content = contentMap[pageName] || {
            title: 'Welcome to MindEase',
            description: 'Your personal mindfulness and productivity companion.'
        };
        
        mainContent.innerHTML = `
            <h1>${content.title}</h1>
            <p>${content.description}</p>
        `;
    }
    
    // Local Storage Functions - simplified for user data only
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + L for logout
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            logout();
        }
    });
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Authentication Functions (optional - no redirect)
    function checkAuthentication() {
        const user = localStorage.getItem('MindEase_user');
        const token = localStorage.getItem('MindEase_auth_token');
        const loginTime = localStorage.getItem('MindEase_login_time');
        
        if (!user || !token || !loginTime) {
            return false;
        }
        
        // Check if token is still valid (24 hours)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff >= 24) {
            // Clear expired auth
            clearAuthentication();
            return false;
        }
        
        return true;
    }
    
    function loadUserData() {
        if (checkAuthentication()) {
            const userData = localStorage.getItem('MindEase_user');
            if (userData) {
                currentUser = JSON.parse(userData);
                updateUserInterface();
            }
        } else {
            currentUser = null;
        }
        updateAuthButtons();
    }
    
    function updateUserInterface() {
        const welcomeElement = document.querySelector('.main-content h1');
        
        if (currentUser) {
            // Update welcome message for logged in user
            if (welcomeElement) {
                welcomeElement.textContent = `Welcome back, ${currentUser.name}!`;
            }
            
            // Add user info to console
            console.log('%c👤 Logged in as:', 'color: #8B5CF6; font-size: 14px; font-weight: bold;');
            console.log(`Name: ${currentUser.name}`);
            console.log(`Email: ${currentUser.email || 'Not provided'}`);
            console.log(`Phone: ${currentUser.mobile || 'Not provided'}`);
            console.log(`Login Method: ${currentUser.loginMethod}`);
        } else {
            // Update welcome message for guest user
            if (welcomeElement) {
                welcomeElement.textContent = 'Welcome to MindEase';
            }
        }
    }
    
    function updateAuthButtons() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const profilePic = document.getElementById('profilePic');

        if (currentUser) {
            // User is logged in - show profile pic
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (profilePic) profilePic.style.display = 'flex';
        } else {
            // User is not logged in - show login button
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (profilePic) profilePic.style.display = 'none';
        }
    }
    
    function goToLogin() { window.location.href = 'auth.html?tab=login'; }
    function goToRegister() { window.location.href = 'auth.html?tab=signup'; }
    
    function clearAuthentication() {
        localStorage.removeItem('MindEase_user');
        localStorage.removeItem('MindEase_auth_token');
        localStorage.removeItem('MindEase_login_time');
    }
    
    function logout() {
        clearAuthentication();
        currentUser = null;
        updateAuthButtons();
        updateUserInterface();
        // Optionally redirect to auth page
        // window.location.href = 'auth.html';
    }

    // Profile popout functionality
    const profilePic = document.getElementById('profilePic');
    const profilePopout = document.getElementById('profilePopout');

    function toggleProfilePopout() {
        if (profilePopout.style.display === 'none' || profilePopout.style.display === '') {
            populateProfilePopout();
            profilePopout.style.display = 'block';
        } else {
            profilePopout.style.display = 'none';
        }
    }

    function populateProfilePopout() {
        if (currentUser) {
            const userNameElem = document.getElementById('userName');
            const userEmailElem = document.getElementById('userEmail');
            const userPhoneElem = document.getElementById('userPhone');
            const userLoginMethodElem = document.getElementById('userLoginMethod');

            if (userNameElem) userNameElem.textContent = currentUser.name || 'N/A';
            if (userEmailElem) userEmailElem.textContent = currentUser.email || 'Not provided';
            if (userPhoneElem) userPhoneElem.textContent = currentUser.mobile || 'Not provided';
            if (userLoginMethodElem) userLoginMethodElem.textContent = currentUser.loginMethod || 'N/A';
        }
    }

    function hideProfilePopout() {
        if (profilePopout) profilePopout.style.display = 'none';
    }

    // Hide popout when clicking outside
    document.addEventListener('click', function(e) {
        if (profilePopout && profilePopout.style.display === 'block' &&
            !profilePic.contains(e.target) && !profilePopout.contains(e.target)) {
            hideProfilePopout();
        }
    });

    // Reset password functionality
    const resetPasswordLink = document.getElementById('resetPasswordLink');
    function handleResetPassword(e) {
        e.preventDefault();
        alert('Reset password functionality is not implemented yet. Please contact support.');
        // Alternatively, redirect to auth page or open a modal
        // window.location.href = 'auth.html';
    }

    // Add event listeners for auth buttons
    if (loginBtn) loginBtn.addEventListener('click', goToLogin);
    if (registerBtn) registerBtn.addEventListener('click', goToRegister);
if (logoutBtn) logoutBtn.addEventListener('click', function() {
    logout();
    // Close the profile popup after logout
    const profilePopout = document.getElementById('profilePopout');
    if (profilePopout) {
        profilePopout.style.display = 'none';
    }
});
    if (profilePic) profilePic.addEventListener('click', toggleProfilePopout);
    if (resetPasswordLink) resetPasswordLink.addEventListener('click', handleResetPassword);

    // Keyboard shortcuts - cleaned up

    // Console welcome message
    console.log('%c🧘 MindEase', 'color: #8B5CF6; font-size: 20px; font-weight: bold;');
    console.log('%cWelcome to your mindfulness journey!', 'color: #06B6D4; font-size: 14px;');
    console.log('%cKeyboard shortcuts: Ctrl+L (Logout)', 'color: #6b7280; font-size: 12px;');
});
