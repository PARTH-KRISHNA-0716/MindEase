    const resetPasswordLink = document.getElementById('resetPasswordLink');
    function handleResetPassword(e) {
        e.preventDefault();
        alert('Reset password functionality is not implemented yet. Please contact support.');
    }

// Combined Authentication Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    
    // Password toggle elements
    const passwordToggle = document.getElementById('passwordToggle');
    const signupPasswordToggle = document.getElementById('signupPasswordToggle');
    const verifyPasswordToggle = document.getElementById('verifyPasswordToggle');
    const passwordInput = document.getElementById('password');
    const signupPasswordInput = document.getElementById('signupPassword');
    const verifyPasswordInput = document.getElementById('verifyPassword');
    
    // Form validation rules
    const validationRules = {
        fullName: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Name must be 2-50 characters and contain only letters and spaces'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        mobile: {
            required: true,
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Please enter a valid mobile number'
        },
        gender: {
            required: true,
            message: 'Please select your gender'
        },
        age: {
            required: true,
            min: 16,
            max: 99,
            message: 'Age must be between 16 and 99'
        },
        signupPassword: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#._-])[a-z\d@$!%*?&#._-]/,
            message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
        },
        verifyPassword: {
            required: true,
            match: 'signupPassword',
            message: 'Passwords do not match'
        }
    };
    
    // Tab switching functionality
    function switchTab(tab) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    }
    
    // Make switchTab globally available
    window.switchTab = switchTab;

    // Auto-switch based on query/hash
    try {
        const url = new URL(window.location.href);
        const tabParam = url.searchParams.get('tab') || (window.location.hash.replace('#','') || '').toLowerCase();
        if (tabParam === 'signup') {
            switchTab('signup');
        } else if (tabParam === 'login') {
            switchTab('login');
        }
    } catch (_) {}
    
    // Password toggle functionality
    passwordToggle.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, passwordToggle);
    });
    
    signupPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(signupPasswordInput, signupPasswordToggle);
    });
    
    verifyPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(verifyPasswordInput, verifyPasswordToggle);
    });
    
    function togglePasswordVisibility(input, toggle) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        // Update icon
        const icon = toggle.querySelector('svg');
        if (isPassword) {
            icon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            `;
        } else {
            icon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        }
    }
    
    // Real-time validation for signup form
    Object.keys(validationRules).forEach(fieldName => {
        const input = document.getElementById(fieldName);
        if (input) {
            input.addEventListener('blur', function() {
                validateField(fieldName, input.value);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(fieldName);
            });
        }
    });
    
    // Password verification
    verifyPasswordInput.addEventListener('input', function() {
        const password = signupPasswordInput.value;
        const verifyPassword = verifyPasswordInput.value;
        
        if (verifyPassword && password !== verifyPassword) {
            showFieldError('verifyPassword', 'Passwords do not match');
        } else {
            clearFieldError('verifyPassword');
        }
    });


    
    // Login form submission
    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(loginFormElement);
        const emailOrPhone = formData.get('emailOrPhone');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');
        
        // Validate inputs
        if (!emailOrPhone || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        processLogin(emailOrPhone, password, rememberMe);
    });

    
    // Signup form submission
    signupFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const formData = new FormData(signupFormElement);
        const userData = {};
        let isValid = true;
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            userData[key] = value;
        }
        
        // Validate each field
        Object.keys(validationRules).forEach(fieldName => {
            const value = userData[fieldName];
            if (!validateField(fieldName, value)) {
                isValid = false;
            }
        });
        
        // Check terms and conditions
        const termsAccepted = document.getElementById('termsAndConditions').checked;
        if (!termsAccepted) {
            showFieldError('termsAndConditions', 'You must accept the terms and conditions');
            isValid = false;
        }
        
        if (isValid) {
            processSignup(userData);
        } else {
            showError('Please fix the errors above and try again.');
        }
    });
    
    function processLogin(emailOrPhone, password, rememberMe) {
        // Show loading state
        const submitButton = loginFormElement.querySelector('.auth-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');
        
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'block';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            try {
                // Get users from localStorage
                const users = JSON.parse(localStorage.getItem('MindEase_users') || '[]');
                
                // Find user by email or mobile
                const user = users.find(u => 
                    u.email === emailOrPhone || u.mobile === emailOrPhone
                );
                
                if (!user) {
                    throw new Error('No account found with this email or mobile number');
                }
                console.log(user);
                // Check password (in production, this should be hashed)
                if (user.password !== password) {
                    throw new Error('Incorrect password');
                }
                
                // Update last login
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('MindEase_users', JSON.stringify(users));
                
                // Set current user session
                localStorage.setItem('MindEase_user', JSON.stringify(user));
                localStorage.setItem('MindEase_auth_token', generateAuthToken());
                localStorage.setItem('MindEase_login_time', new Date().toISOString());
                
                // Handle remember me
                if (rememberMe) {
                    localStorage.setItem('MindEase_remember_me', 'true');
                } else {
                    localStorage.removeItem('MindEase_remember_me');
                }
                
                // Show success modal
                showSuccessModal('Welcome back!', 'You have successfully signed in. Redirecting to your dashboard...');
                
            } catch (error) {
                console.error('Login error:', error);
                showError(error.message || 'Login failed. Please try again.');
            } finally {
                // Reset button state
                buttonText.style.display = 'block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            }
        }, 1500);
    }
    
    function processSignup(userData) {
        // Show loading state
        const submitButton = signupFormElement.querySelector('.auth-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');
        
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'block';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            try {
                // Check if user already exists
                const existingUsers = JSON.parse(localStorage.getItem('MindEase_users') || '[]');
                const userExists = existingUsers.some(user => 
                    user.email === userData.email || user.mobile === userData.mobile
                );
                
                if (userExists) {
                    throw new Error('An account with this email or mobile number already exists');
                }
                
                // Create new user object
                const newUser = {
                    id: Date.now().toString(),
                    name: userData.fullName,
                    email: userData.email,
                    mobile: userData.mobile,
                    gender: userData.gender,
                    age: parseInt(userData.age),
                    password: userData.signupPassword, // In production, this should be hashed
                    loginMethod: 'manual',
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                };
                
                // Add user to storage
                existingUsers.push(newUser);
                localStorage.setItem('MindEase_users', JSON.stringify(existingUsers));
                
                // Set current user session
                localStorage.setItem('MindEase_user', JSON.stringify(newUser));
                localStorage.setItem('MindEase_auth_token', generateAuthToken());
                localStorage.setItem('MindEase_login_time', new Date().toISOString());
                
                // Show success modal
                showSuccessModal('Account Created Successfully!', 'Welcome to MindEase! Redirecting to your dashboard...');
                
            } catch (error) {
                console.error('Signup error:', error);
                showError(error.message || 'Registration failed. Please try again.');
            } finally {
                // Reset button state
                buttonText.style.display = 'block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            }
        }, 2000);
    }
    
    function generateAuthToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    function showSuccessModal(title, message) {
        successTitle.textContent = title;
        successMessage.textContent = message;
        successModal.classList.add('show');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorModal.classList.add('show');
    }
    
    // Close error modal
    window.closeErrorModal = function() {
        errorModal.classList.remove('show');
    };
    
    // Close modals on outside click
    [successModal, errorModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Form validation functions
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        const input = document.getElementById(fieldName);
        
        if (!rules || !input) return true;
        
        // Clear previous errors
        clearFieldError(fieldName);
        
        // Required validation
        if (rules.required && (!value || value.trim() === '')) {
            showFieldError(fieldName, `${getFieldLabel(fieldName)} is required`);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value || value.trim() === '') {
            return true;
        }
        
        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        // Numeric validation
        if (rules.min !== undefined && parseInt(value) < rules.min) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        if (rules.max !== undefined && parseInt(value) > rules.max) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        // Password match validation
        if (rules.match && value !== document.getElementById(rules.match).value) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        // Show success state
        input.classList.add('success');
        return true;
    }
    
    function showFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        if (!input) return;
        
        input.classList.add('error');
        input.classList.remove('success');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(fieldName) {
        const input = document.getElementById(fieldName);
        if (!input) return;
        
        input.classList.remove('error');
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function getFieldLabel(fieldName) {
        const labels = {
            fullName: 'Full Name',
            email: 'Email Address',
            mobile: 'Mobile Number',
            gender: 'Gender',
            age: 'Age',
            signupPassword: 'Password',
            verifyPassword: 'Verify Password'
        };
        return labels[fieldName] || fieldName;
    }
    
    // Console welcome message
    console.log('%c🧘 MindEase Authentication', 'color: #8B5CF6; font-size: 20px; font-weight: bold;');
    console.log('%cSign in or create your account to start your mindfulness journey!', 'color: #06B6D4; font-size: 14px;');
});

