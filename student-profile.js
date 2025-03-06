// Initialize data from localStorage
let currentUser = null;
const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
const leaveApplications = JSON.parse(localStorage.getItem('leaveApplications')) || [];

// Load student profile on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get current user session
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    loadStudentProfile();
    loadStatistics();
    loadAttendanceHistory();
    loadLeaveHistory();
    generateQRCode();
});

// Load student profile information
function loadStudentProfile() {
    if (!currentUser) return;

    // Get student booking info
    const booking = bookings.find(b => b.roomNumber === currentUser.roomNumber);

    // Update profile information
    document.getElementById('student-name').textContent = currentUser.name;
    document.getElementById('room-number').textContent = currentUser.roomNumber || 'Not Assigned';
    document.getElementById('email').textContent = currentUser.email;
    
    if (booking) {
        document.getElementById('phone').textContent = booking.phone || 'Not Available';
        document.getElementById('check-in-date').textContent = formatDate(booking.checkIn);
    }
}

// Calculate and load statistics
function loadStatistics() {
    if (!currentUser || !currentUser.roomNumber) return;

    const today = new Date();
    const studentRecords = attendanceRecords.filter(r => r.roomNumber === currentUser.roomNumber);
    const studentLeaves = leaveApplications.filter(l => l.roomNumber === currentUser.roomNumber && l.status === 'approved');

    // Find student's booking
    const booking = bookings.find(b => b.roomNumber === currentUser.roomNumber);
    if (!booking) return;

    // Calculate attendance rate
    const checkInDate = new Date(booking.checkIn);
    const totalDays = Math.ceil((today - checkInDate) / (1000 * 60 * 60 * 24));
    const presentDays = studentRecords.filter(r => r.status === 'Present').length;
    const leaveDays = studentLeaves.reduce((total, leave) => {
        return total + calculateLeaveDuration(leave.startDate, leave.endDate);
    }, 0);

    const attendanceRate = totalDays > 0 ? Math.round((presentDays / (totalDays - leaveDays)) * 100) : 0;

    document.getElementById('attendance-rate').textContent = `${attendanceRate}%`;
    document.getElementById('days-present').textContent = presentDays;
    document.getElementById('leave-days').textContent = leaveDays;
}

// Load attendance history
function loadAttendanceHistory() {
    if (!currentUser || !currentUser.roomNumber) return;

    const container = document.getElementById('attendance-timeline');
    const studentRecords = attendanceRecords
        .filter(r => r.roomNumber === currentUser.roomNumber)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (container) {
        container.innerHTML = studentRecords.length > 0 ? 
            studentRecords.map(record => `
                <div class="timeline-item">
                    <h4>${formatDate(record.date)}</h4>
                    <p>Status: <strong>${record.status}</strong></p>
                    ${record.checkIn ? `<p>Check-in: ${record.checkIn}</p>` : ''}
                    ${record.checkOut ? `<p>Check-out: ${record.checkOut}</p>` : ''}
                </div>
            `).join('') :
            '<div class="timeline-item">No attendance records found</div>';
    }
}

// Load leave history
function loadLeaveHistory() {
    if (!currentUser || !currentUser.roomNumber) return;

    const container = document.getElementById('leave-timeline');
    const studentLeaves = leaveApplications
        .filter(l => l.roomNumber === currentUser.roomNumber)
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));

    if (container) {
        container.innerHTML = studentLeaves.length > 0 ?
            studentLeaves.map(leave => `
                <div class="timeline-item">
                    <h4>${leave.leaveType} Leave</h4>
                    <p>Duration: ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)}</p>
                    <p>Status: <strong>${leave.status.toUpperCase()}</strong></p>
                    <p>Reason: ${leave.reason}</p>
                    <p>Applied on: ${formatDate(leave.appliedOn)}</p>
                </div>
            `).join('') :
            '<div class="timeline-item">No leave history found</div>';
    }
}

// Generate QR code for attendance
function generateQRCode() {
    if (!currentUser || !currentUser.roomNumber) return;

    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;

    const qrData = {
        type: 'attendance',
        roomNumber: currentUser.roomNumber,
        userId: currentUser.userId,
        action: 'check-in'
    };

    // Clear previous QR code if any
    qrContainer.innerHTML = '';

    // Generate new QR code
    new QRCode(qrContainer, {
        text: JSON.stringify(qrData),
        width: 200,
        height: 200
    });
}

// Helper function to calculate leave duration
function calculateLeaveDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show selected tab content
function showTab(tabName) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content and activate button
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}
