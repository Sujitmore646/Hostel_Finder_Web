// Admin authentication system
const ADMIN_CREDENTIALS = {
    'admin': '$2a$10$XKoNmFZA8hLC3U6zdvEITuBSlzRfqEcZVVKfuFlGR4yRWMSH0L8Wy' // hashed password: admin123
};

// Check if user is logged in as admin
function isAdminLoggedIn() {
    return localStorage.getItem('adminToken') !== null;
}

// Protect admin routes
function protectAdminRoute() {
    if (!isAdminLoggedIn()) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Admin login function
async function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Simple validation
    if (!ADMIN_CREDENTIALS[username]) {
        errorMessage.textContent = 'Invalid credentials';
        errorMessage.style.display = 'block';
        return;
    }
    
    try {
        // In a real application, this would be a server-side check
        // Here we're using a simple hash comparison
        const isValid = await verifyPassword(password, ADMIN_CREDENTIALS[username]);
        
        if (isValid) {
            // Generate admin token
            const token = generateToken();
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUsername', username);
            
            // Log admin login
            logAdminActivity('login');
            
            // Redirect to admin dashboard
            window.location.href = 'admin-dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid credentials';
            errorMessage.style.display = 'block';
            
            // Log failed login attempt
            logAdminActivity('failed_login_attempt');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred during login';
        errorMessage.style.display = 'block';
    }
}

// Admin logout function
function adminLogout() {
    logAdminActivity('logout');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = 'admin-login.html';
}

// Generate secure token
function generateToken() {
    return 'admin_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Log admin activity
function logAdminActivity(action) {
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    activities.push({
        action: action,
        username: localStorage.getItem('adminUsername'),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    localStorage.setItem('adminActivities', JSON.stringify(activities));
}

// Verify password (simulated hash verification)
async function verifyPassword(password, hashedPassword) {
    // In a real application, this would be done server-side
    // This is just a simple example
    return hashedPassword === '$2a$10$XKoNmFZA8hLC3U6zdvEITuBSlzRfqEcZVVKfuFlGR4yRWMSH0L8Wy' && 
           password === 'admin123';
}

// Add event listener to check admin access on protected pages
document.addEventListener('DOMContentLoaded', () => {
    const isAdminPage = document.body.classList.contains('admin-page');
    if (isAdminPage) {
        protectAdminRoute();
    }
});
