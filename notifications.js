class NotificationSystem {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    }

    // Add a new notification
    addNotification(type, message, studentId = null) {
        const notification = {
            id: Date.now(),
            type: type, // 'absence', 'late', 'warning', 'info'
            message: message,
            studentId: studentId,
            timestamp: new Date().toISOString(),
            read: false
        };
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.showNotification(notification);
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    // Get unread notifications
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    // Save notifications to localStorage
    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.updateNotificationBadge();
    }

    // Show notification in UI
    showNotification(notification) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification ${notification.type}`;
        notificationDiv.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${notification.message}</span>
                <span class="notification-time">${this.formatTime(notification.timestamp)}</span>
            </div>
            <button class="notification-close" onclick="notificationSystem.markAsRead(${notification.id})">×</button>
        `;
        
        document.getElementById('notification-container')?.appendChild(notificationDiv);
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            notificationDiv.style.opacity = '0';
            setTimeout(() => notificationDiv.remove(), 500);
        }, 5000);
    }

    // Update notification badge count
    updateNotificationBadge() {
        const unreadCount = this.getUnreadNotifications().length;
        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    // Format timestamp
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    // Send email notification (mock function)
    async sendEmailNotification(email, subject, message) {
        // In a real implementation, this would connect to an email service
        console.log(`Email sent to ${email}: ${subject} - ${message}`);
        return true;
    }

    // Handle absent student notifications
    async handleAbsentStudent(studentName, email) {
        const message = `${studentName} has been marked absent today`;
        this.addNotification('absence', message);
        
        // Send email notification
        const emailSubject = 'Absence Notification';
        const emailMessage = `Dear ${studentName},\n\nThis is to inform you that you have been marked absent today. If this is a mistake, please contact the hostel administration.\n\nBest regards,\nHostel Management`;
        
        await this.sendEmailNotification(email, emailSubject, emailMessage);
    }

    // Handle late check-in notifications
    handleLateCheckIn(studentName) {
        const message = `${studentName} checked in late today`;
        this.addNotification('late', message);
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();
