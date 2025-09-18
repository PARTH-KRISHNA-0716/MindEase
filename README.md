# MindEase - Digital Well-Being Companion

A comprehensive web application designed to help you focus deeply, rest intentionally, and feel better every day. MindEase combines productivity tools with mindfulness features to create a holistic approach to digital well-being.

## 🚀 Features

### 🏠 Landing Page (`index.html`)
- **Hero Section**: Compelling call-to-action with "Stop Surviving, Start Thriving" messaging
- **Feature Showcase**: Smart Scheduling, Focus Mode, and Guided Wellness
- **Testimonials**: Real user feedback from students
- **Responsive Design**: Beautiful UI that works on all devices
- **Direct Access**: Main app accessible without authentication

### 🔐 Authentication System (`auth.html`)
- **Dual Tab Interface**: Seamless switching between Sign In and Sign Up
- **Comprehensive Sign Up**: Full user registration with detailed validation
- **Smart Login**: Email or phone number authentication
- **Password Management**: Secure password creation with strength requirements
- **Password Reset**: Self-service password recovery system
- **Session Management**: Persistent login with automatic session handling

#### Sign Up Form Fields
- Full Name (required, 2-50 characters)
- Email Address (required, valid email format)
- Mobile Number (required, 10-digit validation)
- Gender (required, dropdown selection)
- Age (required, 13-120 years)
- Create Password (required, strong password with special characters)
- Verify Password (required, must match)
- Terms & Conditions (required checkbox)

### 📊 Dashboard (`dashboard.html`)
- **Personalized Welcome**: Dynamic greeting with user's name
- **Time Analytics**: Interactive chart showing 7-day activity patterns
- **To-Do List**: Task management with add/complete functionality
- **Calendar Integration**: Monthly calendar with schedule management
- **Schedule Editor**: Add notes and events for specific dates
- **Quick Actions**: Today button for instant date selection

### ⏰ Focus Mode (`focus.html`)
- **Pomodoro Timer**: Customizable study and break sessions
- **Circular Progress**: Visual timer with animated progress ring
- **Flexible Timing**: 
  - Study Time: 25 min, 50 min, or custom (1-120 min)
  - Break Time: 5 min, 10 min, or custom (1-60 min)
- **Timer Controls**: Play/pause and reset functionality
- **Visual Feedback**: Color-coded progress and mode indicators
- **Background Timer**: Continues running across page navigation

### 👥 About Page (`about.html`)
- **Team Information**: Meet the Infinite Loopers team
- **Contact Details**: WhatsApp, Phone, and Email with copy functionality
- **Interactive Contact**: Click-to-copy contact information
- **Professional Design**: Clean, modern layout with team member cards

## 🚀 Getting Started

### Quick Start
1. **Direct Access**: Open `index.html` in your browser to access the main app without authentication
2. **Full Experience**: Open `auth.html` to create an account or sign in with existing credentials
3. **Navigation**: Use the tab interface to switch between "Sign In" and "Sign Up"
4. **Registration**: Fill out the comprehensive signup form with your details
5. **Dashboard**: After authentication, access your personalized dashboard
6. **Focus Mode**: Use the Pomodoro timer for productive work sessions

### User Flow
1. **Landing Page** → Explore features and testimonials
2. **Authentication** → Create account or sign in
3. **Dashboard** → View analytics, manage tasks, and schedule
4. **Focus Mode** → Use Pomodoro timer for focused work
5. **About Page** → Learn about the team and contact information

## 🛠️ Technical Details

### File Structure
```
MindEase/
├── index.html          # Landing page with hero section and features
├── auth.html           # Authentication page (login/signup)
├── dashboard.html      # User dashboard with analytics and tasks
├── focus.html          # Pomodoro timer and focus tools
├── about.html          # Team information and contact details
├── styles.css          # Main stylesheet with responsive design
├── auth.css            # Authentication-specific styles
├── dashboard.css       # Dashboard and focus page styles
├── focus.css           # Focus timer specific styles
├── script.js           # Main application logic
├── auth.js             # Authentication functionality
├── dashboard.js        # Dashboard features and calendar
├── focus.js            # Pomodoro timer implementation
├── background-timer.js # Cross-page timer persistence
├── Logo.png            # MindEase logo
├── banner.png          # Hero section banner image
├── profile.svg         # User profile icon
└── alarm.mp3           # Timer notification sound
```

### Authentication System
- **Storage**: User data stored in `localStorage` for persistence
- **Session Management**: Automatic login state handling
- **Form Validation**: Real-time validation with helpful error messages
- **Password Security**: Strong password requirements with pattern matching
- **Password Reset**: Self-service password recovery functionality

### Data Storage Structure
```javascript
// User accounts storage
localStorage.MindEase_users = [
  {
    name: "User Name",
    email: "user@example.com",
    mobile: "1234567890",
    gender: "male/female/prefer-not-to-say",
    age: 25,
    password: "hashedPassword"
  }
]

// Current session
localStorage.MindEase_user = "currentUserData"
localStorage.MindEase_auth_token = "sessionToken"
localStorage.MindEase_login_time = "timestamp"
```

### Key Features Implementation
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Timer Persistence**: Background timer continues across page navigation
- **Interactive Charts**: Canvas-based analytics visualization
- **Calendar Integration**: Full calendar with date selection and scheduling
- **Task Management**: Local storage-based to-do list functionality
- **Form Validation**: Comprehensive client-side validation

### Browser Compatibility
- ✅ Modern browsers with localStorage support
- ✅ Responsive design for mobile and desktop
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- ✅ Progressive Web App features

## 👥 Team Information

### Infinite Loopers
- **Parth Arora** - Team Leader
- **Aryan Garg** - Team Member  
- **Vivek Choudhary** - Team Member

### Contact Information
- **WhatsApp**: [Direct Link](https://wa.me/8459300702)
- **Phone**: +91 8459300702
- **Email**: Parthom0716+MindEase@gmail.com

## 🔒 Security Notes
- **Development Mode**: Passwords stored in plain text for demo purposes
- **Production Ready**: Implement proper password hashing (bcrypt recommended)
- **Server Integration**: Add server-side validation and authentication
- **Session Security**: Implement proper session management with JWT tokens
- **Data Encryption**: Consider encrypting sensitive user data
