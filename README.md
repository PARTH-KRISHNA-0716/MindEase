# MindFree - Mindfulness & Productivity App

A beautiful web application for meditation, productivity, and mindfulness tracking.

## Features

### Authentication System (Optional)
- **Sign Up**: Create new accounts with comprehensive form validation
- **Sign In**: Login with email/phone and password
- **Local Storage**: User data storage and session management
- **Form Validation**: Real-time validation with helpful error messages
- **No Authentication Required**: Main app is accessible without login

### Sign Up Form Fields
- Full Name (required, 2-50 characters)
- Email Address (required, valid email format)
- Mobile Number (required, valid phone format)
- Gender (required, dropdown selection)
- Age (required, 13-120 years)
- Create Password (required, strong password with special characters)
- Verify Password (required, must match)
- Terms & Conditions (required checkbox)

### Pages
- `index.html` - Main dashboard (accessible without authentication)
- `auth.html` - Combined authentication page with login and signup tabs

## Getting Started

1. Open `index.html` in your browser to access the main app directly
2. Or open `auth.html` to sign in with existing credentials or create a new account
3. Use the tabs to switch between "Sign In" and "Sign Up"
4. Fill out the appropriate form with your details
5. After successful authentication, you'll be redirected to the dashboard
6. Use the logout button to sign out (optional)

## Technical Details

### Authentication Flow
1. User fills out signup form with validation
2. Data is stored in localStorage under `mindfree_users`
3. User session is created with auth token
4. Main app checks authentication on load
5. Expired sessions (24+ hours) redirect to login

### Data Storage
- User accounts: `localStorage.mindfree_users`
- Current session: `localStorage.mindfree_user`
- Auth token: `localStorage.mindfree_auth_token`
- Login time: `localStorage.mindfree_login_time`

### Form Validation
- Real-time field validation
- Password strength requirements
- Email format validation
- Phone number format validation
- Age range validation (13-120)
- Terms acceptance requirement

## Browser Compatibility
- Modern browsers with localStorage support
- Responsive design for mobile and desktop
- Dark mode support

## Security Notes
- Passwords are stored in plain text (for demo purposes)
- In production, implement proper password hashing
- Add server-side validation and authentication
- Implement proper session management
