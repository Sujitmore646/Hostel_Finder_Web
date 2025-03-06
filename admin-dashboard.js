// Check admin authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!protectAdminRoute()) return;
    
    // Initialize dashboard
    updateAdminName();
    updateCurrentDate();
    loadStatistics();
    loadRecentActivity();
    
    // Refresh data periodically
    setInterval(loadStatistics, 60000); // Every minute
    setInterval(loadRecentActivity, 30000); // Every 30 seconds
});

// Update admin name in welcome message
function updateAdminName() {
    const adminName = localStorage.getItem('adminUsername');
    document.getElementById('admin-name').textContent = adminName || 'Admin';
}

// Update current date
function updateCurrentDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = currentDate;
}

// Load dashboard statistics
function loadStatistics() {
    // Get data from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || {};
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const feedbackItems = JSON.parse(localStorage.getItem('feedbackItems')) || [];
    
    // Update statistics
    document.getElementById('total-students').textContent = bookings.length;
    document.getElementById('rooms-occupied').textContent = 
        Object.values(rooms).filter(room => room.status === 'occupied').length;
    document.getElementById('pending-leaves').textContent = 
        leaveRequests.filter(req => req.status === 'pending').length;
    document.getElementById('active-complaints').textContent = 
        feedbackItems.filter(item => 
            item.type === 'complaint' && item.status !== 'resolved'
        ).length;
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    
    // Get other relevant activities
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const feedbackItems = JSON.parse(localStorage.getItem('feedbackItems')) || [];
    const maintenanceSchedule = JSON.parse(localStorage.getItem('maintenanceSchedule')) || [];
    
    // Combine all activities
    const allActivities = [
        ...activities.map(activity => ({
            ...activity,
            type: 'admin',
            description: `Admin ${activity.action}`
        })),
        ...leaveRequests.map(leave => ({
            type: 'leave',
            description: `Leave request ${leave.status}`,
            timestamp: leave.submittedAt
        })),
        ...feedbackItems.map(feedback => ({
            type: 'feedback',
            description: `New ${feedback.type} submitted`,
            timestamp: feedback.submittedAt
        })),
        ...maintenanceSchedule.map(maintenance => ({
            type: 'maintenance',
            description: `Maintenance scheduled for Room ${maintenance.roomNumber}`,
            timestamp: maintenance.date
        }))
    ];
    
    // Sort by timestamp
    allActivities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Display recent activities
    activityList.innerHTML = allActivities.slice(0, 10).map(activity => `
        <li class="activity-item">
            <div class="activity-content">
                ${activity.description}
                <span class="activity-time">
                    ${formatTimestamp(activity.timestamp)}
                </span>
            </div>
        </li>
    `).join('');
}

// Format timestamp for display
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
