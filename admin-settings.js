// Initialize settings on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!protectAdminRoute()) return;
    
    loadSettings();
    loadActivityLog();
    startSessionTimer();
});

// Load saved settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    
    // Update UI with saved settings
    document.getElementById('two-factor-auth').checked = settings.twoFactorAuth;
    document.getElementById('login-notification').checked = settings.loginNotification;
    document.getElementById('session-timeout').value = settings.sessionTimeout;
    document.getElementById('maintenance-mode').checked = settings.maintenanceMode;
    document.getElementById('auto-backup').checked = settings.autoBackup;
    document.getElementById('email-notifications').checked = settings.emailNotifications;
}

// Get default settings
function getDefaultSettings() {
    return {
        twoFactorAuth: false,
        loginNotification: true,
        sessionTimeout: 30,
        maintenanceMode: false,
        autoBackup: true,
        emailNotifications: true,
        lastBackup: null
    };
}

// Update setting
function updateSetting(setting, value) {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    settings[setting] = value;
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    
    // Log setting change
    logAdminActivity(`updated_setting_${setting}`);
    
    // Handle special cases
    switch(setting) {
        case 'sessionTimeout':
            startSessionTimer();
            break;
        case 'maintenanceMode':
            handleMaintenanceMode(value);
            break;
        case 'autoBackup':
            if (value) scheduleBackup();
            break;
    }
    
    notificationSystem.addNotification('success', 'Setting updated successfully');
}

// Handle maintenance mode
function handleMaintenanceMode(enabled) {
    if (enabled) {
        // Store current system state
        const systemState = {
            bookings: localStorage.getItem('bookings'),
            rooms: localStorage.getItem('rooms'),
            attendance: localStorage.getItem('attendance'),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('systemState', JSON.stringify(systemState));
    }
}

// Schedule system backup
function scheduleBackup() {
    const settings = JSON.parse(localStorage.getItem('adminSettings'));
    if (!settings.autoBackup) return;
    
    // Create backup of all system data
    const backup = {
        bookings: localStorage.getItem('bookings'),
        rooms: localStorage.getItem('rooms'),
        attendance: localStorage.getItem('attendance'),
        leaveRequests: localStorage.getItem('leaveRequests'),
        feedbackItems: localStorage.getItem('feedbackItems'),
        timestamp: new Date().toISOString()
    };
    
    // Store backup
    const backups = JSON.parse(localStorage.getItem('systemBackups')) || [];
    backups.unshift(backup);
    
    // Keep only last 7 backups
    if (backups.length > 7) backups.pop();
    
    localStorage.setItem('systemBackups', JSON.stringify(backups));
    settings.lastBackup = backup.timestamp;
    localStorage.setItem('adminSettings', JSON.stringify(settings));
}

// Load activity log
function loadActivityLog() {
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    const logContainer = document.getElementById('activity-log');
    
    logContainer.innerHTML = activities.slice(0, 50).map(activity => `
        <div class="log-entry">
            <div class="log-content">
                <strong>${activity.action}</strong> by ${activity.username}
                <div class="log-time">${formatTimestamp(activity.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

// Change admin password
async function changePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
        notificationSystem.addNotification('error', 'New passwords do not match');
        return;
    }
    
    // Validate current password
    const isValid = await verifyPassword(currentPassword, ADMIN_CREDENTIALS['admin']);
    if (!isValid) {
        notificationSystem.addNotification('error', 'Current password is incorrect');
        return;
    }
    
    // Update password
    ADMIN_CREDENTIALS['admin'] = await hashPassword(newPassword);
    
    // Log password change
    logAdminActivity('changed_password');
    
    notificationSystem.addNotification('success', 'Password changed successfully');
    event.target.reset();
}

// Hash password (simulation)
async function hashPassword(password) {
    // In a real application, use proper password hashing
    return `$2a$10$${btoa(password)}`;
}

// Session timer
let sessionTimeout;

function startSessionTimer() {
    clearTimeout(sessionTimeout);
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    const timeoutMinutes = settings.sessionTimeout;
    
    sessionTimeout = setTimeout(() => {
        adminLogout();
        notificationSystem.addNotification('warning', 'Session expired due to inactivity');
    }, timeoutMinutes * 60 * 1000);
}

// Reset session timer on user activity
document.addEventListener('mousemove', startSessionTimer);
document.addEventListener('keypress', startSessionTimer);

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
