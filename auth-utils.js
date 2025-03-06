// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('adminToken') !== null;
}

// Protect user routes
function protectUserRoute() {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Update navigation based on login status
function updateNavigation() {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    const registerLink = document.querySelector('nav a[href="register.html"]');
    const adminLink = document.querySelector('nav a[href="admin-login.html"]');
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.getElementById('profile-menu');
    
    if (isUserLoggedIn()) {
        // Hide login/register links when user is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        
        // Show profile button with user name
        if (profileBtn) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            profileBtn.textContent = currentUser.name || 'Profile';
            profileBtn.style.display = 'block';
        }
    } else {
        // Show login/register links when user is not logged in
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'inline-block';
        
        // Hide profile button and menu
        if (profileBtn) profileBtn.style.display = 'none';
        if (profileMenu) profileMenu.style.display = 'none';
    }
    
    // Handle admin link visibility
    if (adminLink) {
        if (isAdminLoggedIn()) {
            adminLink.href = 'admin-dashboard.html';
            adminLink.textContent = 'Admin Dashboard';
        } else {
            adminLink.href = 'admin-login.html';
            adminLink.textContent = 'Admin Access';
        }
    }
}

// Protect routes that require authentication
document.addEventListener('DOMContentLoaded', () => {
    const protectedPages = [
        'attendance.html',
        'leave-management.html',
        'room-management.html',
        'feedback.html',
        'student-profile.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
        protectUserRoute();
    }
    
    updateNavigation();
});

// Update navigation when storage changes (login/logout events)
window.addEventListener('storage', updateNavigation);
