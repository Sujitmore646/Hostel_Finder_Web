// Store leave applications in localStorage
let leaveApplications = JSON.parse(localStorage.getItem('leaveApplications')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;
    
    // Set up file input preview
    const attachmentInput = document.getElementById('attachment');
    attachmentInput.addEventListener('change', handleFilePreview);
    
    // Load leave history
    updateLeaveHistory();
});

// Handle file preview
function handleFilePreview(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('attachment-preview');
    previewContainer.innerHTML = '';

    if (file) {
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '100%';
            previewContainer.appendChild(img);
        } else {
            const fileInfo = document.createElement('div');
            fileInfo.textContent = `File selected: ${file.name}`;
            previewContainer.appendChild(fileInfo);
        }
    }
}

// Submit leave application
async function submitLeaveApplication(event) {
    event.preventDefault();
    
    const roomNumber = document.getElementById('room-number').value;
    const leaveType = document.getElementById('leave-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const reason = document.getElementById('reason').value;
    const attachment = document.getElementById('attachment').files[0];

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
        notificationSystem.addNotification('error', 'End date cannot be before start date');
        return;
    }

    // Get student details
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.roomNumber === roomNumber);
    
    if (!booking) {
        notificationSystem.addNotification('error', 'Room number not found');
        return;
    }

    // Create leave application object
    const leaveApplication = {
        id: Date.now(),
        studentName: booking.name,
        roomNumber: roomNumber,
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
        status: 'pending',
        appliedOn: new Date().toISOString(),
        attachmentName: attachment ? attachment.name : null
    };

    // Store leave application
    leaveApplications.unshift(leaveApplication);
    localStorage.setItem('leaveApplications', JSON.stringify(leaveApplications));

    // Send notification
    notificationSystem.addNotification('success', 'Leave application submitted successfully');
    
    // Send email notification to admin
    await notificationSystem.sendEmailNotification(
        'admin@hostel.com',
        'New Leave Application',
        `New leave application received from ${booking.name} (Room ${roomNumber})`
    );

    // Reset form
    event.target.reset();
    document.getElementById('attachment-preview').innerHTML = '';
    
    // Update leave history display
    updateLeaveHistory();
}

// Update leave history display
function updateLeaveHistory() {
    const container = document.getElementById('leave-history-container');
    const roomNumber = document.getElementById('room-number').value;
    
    // Filter applications for current student if room number is entered
    let applications = leaveApplications;
    if (roomNumber) {
        applications = applications.filter(app => app.roomNumber === roomNumber);
    }

    container.innerHTML = applications.map(application => `
        <div class="leave-card ${application.status}">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3>${application.leaveType} Leave</h3>
                    <p><strong>Duration:</strong> ${formatDate(application.startDate)} to ${formatDate(application.endDate)}</p>
                    <p><strong>Reason:</strong> ${application.reason}</p>
                    ${application.attachmentName ? 
                        `<p><strong>Attachment:</strong> ${application.attachmentName}</p>` : ''}
                    <p><strong>Applied on:</strong> ${formatDate(application.appliedOn)}</p>
                </div>
                <span class="leave-status status-${application.status}">
                    ${application.status.toUpperCase()}
                </span>
            </div>
        </div>
    `).join('');
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Calculate leave duration in days
function calculateLeaveDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Auto-fill student details when room number is entered
document.getElementById('room-number').addEventListener('change', (event) => {
    const roomNumber = event.target.value;
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.roomNumber === roomNumber);
    
    if (booking) {
        updateLeaveHistory();
    }
});
