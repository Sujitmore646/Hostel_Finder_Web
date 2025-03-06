// Activity Logger
class ActivityLogger {
    constructor() {
        this.activities = JSON.parse(localStorage.getItem('userActivities')) || {};
    }

    // Log an activity
    logActivity(userId, type, details) {
        if (!this.activities[userId]) {
            this.activities[userId] = [];
        }

        const activity = {
            type,
            details,
            timestamp: new Date().toISOString(),
            deviceInfo: this.getDeviceInfo()
        };

        this.activities[userId].unshift(activity);
        
        // Keep only last 100 activities per user
        if (this.activities[userId].length > 100) {
            this.activities[userId] = this.activities[userId].slice(0, 100);
        }

        this.saveActivities();
        this.notifyActivity(activity);
    }

    // Get device information
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`
        };
    }

    // Save activities to localStorage
    saveActivities() {
        localStorage.setItem('userActivities', JSON.stringify(this.activities));
    }

    // Get user activities
    getUserActivities(userId, limit = 10) {
        return (this.activities[userId] || []).slice(0, limit);
    }

    // Get activities by type
    getActivitiesByType(userId, type) {
        return (this.activities[userId] || []).filter(activity => activity.type === type);
    }

    // Get activities in date range
    getActivitiesInRange(userId, startDate, endDate) {
        return (this.activities[userId] || []).filter(activity => {
            const activityDate = new Date(activity.timestamp);
            return activityDate >= startDate && activityDate <= endDate;
        });
    }

    // Notify about new activity
    notifyActivity(activity) {
        const event = new CustomEvent('newActivity', { detail: activity });
        document.dispatchEvent(event);
    }

    // Generate activity report
    generateReport(userId, startDate, endDate) {
        const activities = this.getActivitiesInRange(userId, startDate, endDate);
        const report = {
            totalActivities: activities.length,
            byType: {},
            timeDistribution: this.getTimeDistribution(activities),
            mostActiveHours: this.getMostActiveHours(activities)
        };

        // Count activities by type
        activities.forEach(activity => {
            report.byType[activity.type] = (report.byType[activity.type] || 0) + 1;
        });

        return report;
    }

    // Get time distribution of activities
    getTimeDistribution(activities) {
        const distribution = {
            morning: 0,   // 6 AM - 12 PM
            afternoon: 0, // 12 PM - 5 PM
            evening: 0,   // 5 PM - 9 PM
            night: 0      // 9 PM - 6 AM
        };

        activities.forEach(activity => {
            const hour = new Date(activity.timestamp).getHours();
            if (hour >= 6 && hour < 12) distribution.morning++;
            else if (hour >= 12 && hour < 17) distribution.afternoon++;
            else if (hour >= 17 && hour < 21) distribution.evening++;
            else distribution.night++;
        });

        return distribution;
    }

    // Get most active hours
    getMostActiveHours(activities) {
        const hourCounts = new Array(24).fill(0);
        activities.forEach(activity => {
            const hour = new Date(activity.timestamp).getHours();
            hourCounts[hour]++;
        });

        return hourCounts;
    }
}

// Initialize activity logger
const activityLogger = new ActivityLogger();

// Activity tracking middleware
function trackActivity(userId, type, details) {
    activityLogger.logActivity(userId, type, details);
}

// Export activity logger
window.activityLogger = activityLogger;
window.trackActivity = trackActivity;
