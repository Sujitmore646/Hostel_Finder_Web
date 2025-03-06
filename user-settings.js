// Initialize settings page
document.addEventListener('DOMContentLoaded', () => {
    if (!protectUserRoute()) return;
    
    loadUserProfile();
    loadNotificationSettings();
    loadRecentNotifications();
    setupEventListeners();
});

// Load user profile data
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Set form values
    document.getElementById('display-name').value = currentUser.name || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    
    // Set avatar preview
    updateAvatarPreview(currentUser.avatar);
}

// Update avatar preview
function updateAvatarPreview(avatarUrl) {
    const preview = document.getElementById('avatar-preview');
    if (avatarUrl) {
        preview.innerHTML = `<img src="${avatarUrl}" alt="Profile Picture">`;
    } else {
        const initials = getInitials(JSON.parse(localStorage.getItem('currentUser')).name);
        preview.textContent = initials;
    }
}

// Get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
}

// Load notification settings
function loadNotificationSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || getDefaultSettings();
    
    document.getElementById('email-notifications').checked = settings.emailNotifications;
    document.getElementById('browser-notifications').checked = settings.browserNotifications;
    document.getElementById('attendance-reminders').checked = settings.attendanceReminders;
    document.getElementById('leave-updates').checked = settings.leaveUpdates;
}

// Get default settings
function getDefaultSettings() {
    return {
        emailNotifications: true,
        browserNotifications: false,
        attendanceReminders: true,
        leaveUpdates: true,
        theme: 'light',
        language: 'en'
    };
}

// Load recent notifications
function loadRecentNotifications() {
    const notifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    const container = document.getElementById('notification-list');
    
    if (notifications.length === 0) {
        container.innerHTML = '<p class="text-center">No recent notifications</p>';
        return;
    }
    
    container.innerHTML = notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
        .map(notification => `
            <div class="notification-item">
                <div class="notification-icon">
                    ${getNotificationIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <div class="notification-text">${notification.message}</div>
                    <div class="notification-time">${formatTimestamp(notification.timestamp)}</div>
                </div>
            </div>
        `)
        .join('');
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        attendance: '📍',
        leave: '📅',
        security: '🔒',
        system: '⚙️',
        default: '📌'
    };
    return icons[type] || icons.default;
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Profile form submission
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    
    // Password form submission
    document.getElementById('password-form').addEventListener('submit', handlePasswordChange);
    
    // Avatar upload
    document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);
    
    // Notification settings changes
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', handleSettingChange);
    });
}

// Handle profile update
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const updatedUser = {
        ...currentUser,
        name: document.getElementById('display-name').value,
        phone: document.getElementById('phone').value,
        updatedAt: new Date().toISOString()
    };
    
    // Update user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Show success message
    alert('Profile updated successfully');
}

// Handle password change
async function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) {
        alert('User not found');
        return;
    }
    
    // Validate current password
    if (users[userIndex].password !== currentPassword) {
        alert('Current password is incorrect');
        return;
    }
    
    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear form
    event.target.reset();
    
    // Show success message
    alert('Password changed successfully');
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.avatar = e.target.result;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Handle setting change
function handleSettingChange(event) {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || getDefaultSettings();
    settings[event.target.id] = event.target.checked;
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    if (event.target.id === 'browserNotifications' && event.target.checked) {
        requestNotificationPermission();
    }
}

// Request notification permission
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notifications');
        return;
    }
    
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification('Notifications Enabled', {
                body: 'You will now receive desktop notifications'
            });
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
}
