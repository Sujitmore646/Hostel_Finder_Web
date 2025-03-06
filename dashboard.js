// Dashboard functionality
class Dashboard {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.initializeCharts();
        this.loadStats();
        this.loadRecentActivity();
        this.loadNotifications();
        this.setupMessaging();
        this.setupEventListeners();
    }

    // Initialize charts
    initializeCharts() {
        const ctx = document.getElementById('activity-chart').getContext('2d');
        this.activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: window.i18n.getTranslation('dailyActivity'),
                    data: [],
                    borderColor: '#4CAF50',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Load user statistics
    loadStats() {
        if (!this.currentUser) return;

        const activities = window.activityLogger.getUserActivities(this.currentUser.email);
        const stats = this.calculateStats(activities);

        document.getElementById('total-activities').textContent = stats.totalActivities;
        document.getElementById('active-days').textContent = stats.activeDays;
        document.getElementById('attendance-rate').textContent = `${stats.attendanceRate}%`;

        this.updateActivityChart(stats.dailyActivity);
    }

    // Calculate statistics
    calculateStats(activities) {
        const stats = {
            totalActivities: activities.length,
            activeDays: new Set(activities.map(a => a.timestamp.split('T')[0])).size,
            attendanceRate: 0,
            dailyActivity: {}
        };

        // Calculate attendance rate
        const attendanceActivities = activities.filter(a => a.type === 'attendance_marked');
        const totalDays = Math.ceil((Date.now() - new Date(activities[0]?.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24));
        stats.attendanceRate = Math.round((attendanceActivities.length / totalDays) * 100);

        // Calculate daily activity
        activities.forEach(activity => {
            const date = activity.timestamp.split('T')[0];
            stats.dailyActivity[date] = (stats.dailyActivity[date] || 0) + 1;
        });

        return stats;
    }

    // Update activity chart
    updateActivityChart(dailyActivity) {
        const dates = Object.keys(dailyActivity).sort();
        const counts = dates.map(date => dailyActivity[date]);

        this.activityChart.data.labels = dates;
        this.activityChart.data.datasets[0].data = counts;
        this.activityChart.update();
    }

    // Load recent activity
    loadRecentActivity() {
        if (!this.currentUser) return;

        const activities = window.activityLogger.getUserActivities(this.currentUser.email, 20);
        const container = document.getElementById('activity-list');
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-details">
                    <div>${this.getActivityDescription(activity)}</div>
                    <div class="activity-time">${this.formatTimestamp(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    // Get activity icon
    getActivityIcon(type) {
        const icons = {
            page_visit: '🔍',
            attendance_marked: '📍',
            leave_requested: '📅',
            feedback_submitted: '💭',
            profile_updated: '👤',
            message_sent: '💬',
            default: '📌'
        };
        return icons[type] || icons.default;
    }

    // Get activity description
    getActivityDescription(activity) {
        const descriptions = {
            page_visit: `Visited ${activity.details.page} page`,
            attendance_marked: 'Marked attendance',
            leave_requested: 'Requested leave',
            feedback_submitted: `Submitted ${activity.details.type} feedback`,
            profile_updated: 'Updated profile information',
            message_sent: 'Sent a message',
            default: 'Performed an action'
        };
        return descriptions[activity.type] || descriptions.default;
    }

    // Format timestamp
    formatTimestamp(timestamp) {
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

    // Load notifications
    loadNotifications() {
        if (!this.currentUser) return;

        const notifications = this.getNotifications();
        const container = document.getElementById('notifications-list');

        container.innerHTML = notifications.map(notification => `
            <div class="notification-item">
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-content">
                    <div>${notification.message}</div>
                    <div class="notification-time">${this.formatTimestamp(notification.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    // Get notifications
    getNotifications() {
        // Simulated notifications - in a real app, these would come from a backend
        return [
            {
                icon: '📍',
                message: 'Remember to mark your attendance today',
                timestamp: new Date().toISOString()
            },
            {
                icon: '📅',
                message: 'Your leave request was approved',
                timestamp: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    // Setup messaging
    setupMessaging() {
        this.loadContacts();
        this.setupMessageHandlers();
    }

    // Load contacts
    loadContacts() {
        const container = document.getElementById('contacts-list');
        // Simulated contacts - in a real app, these would come from a backend
        const contacts = [
            { id: 1, name: 'Hostel Admin', status: 'online' },
            { id: 2, name: 'Room Service', status: 'offline' },
            { id: 3, name: 'Maintenance', status: 'online' }
        ];

        container.innerHTML = contacts.map(contact => `
            <div class="contact-item" data-id="${contact.id}">
                <div>${contact.name}</div>
                <div class="contact-status ${contact.status}">${contact.status}</div>
            </div>
        `).join('');
    }

    // Setup message handlers
    setupMessageHandlers() {
        const messageInput = document.getElementById('message-input');
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // Send message
    sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if (!message) return;

        const container = document.getElementById('chat-messages');
        container.innerHTML += `
            <div class="message sent">
                ${message}
            </div>
        `;

        input.value = '';
        container.scrollTop = container.scrollHeight;

        // Track message sent
        window.trackActivity(this.currentUser.email, 'message_sent', {
            timestamp: new Date().toISOString()
        });

        // Simulate response
        setTimeout(() => {
            container.innerHTML += `
                <div class="message received">
                    Thanks for your message. We'll get back to you soon.
                </div>
            `;
            container.scrollTop = container.scrollHeight;
        }, 1000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for new activities
        document.addEventListener('newActivity', () => {
            this.loadStats();
            this.loadRecentActivity();
        });

        // Listen for theme changes
        document.addEventListener('themeChanged', () => {
            this.activityChart.update();
        });
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!protectUserRoute()) return;
    new Dashboard();
});
