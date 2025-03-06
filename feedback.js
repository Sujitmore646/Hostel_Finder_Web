// Initialize feedback data
let feedbackItems = JSON.parse(localStorage.getItem('feedbackItems')) || [];
let selectedRating = 0;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupRatingStars();
    filterFeedback();
});

// Setup rating stars functionality
function setupRatingStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('mouseover', () => highlightStars(star.dataset.rating));
        star.addEventListener('mouseout', () => highlightStars(selectedRating));
        star.addEventListener('click', () => setRating(star.dataset.rating));
    });
}

// Highlight stars up to specified rating
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.style.color = star.dataset.rating <= rating ? '#ffd700' : '#ddd';
    });
}

// Set the rating
function setRating(rating) {
    selectedRating = rating;
    highlightStars(rating);
}

// Submit feedback
async function submitFeedback(event) {
    event.preventDefault();
    
    const roomNumber = document.getElementById('room-number').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const priority = document.getElementById('priority').value;
    const description = document.getElementById('description').value;
    const attachment = document.getElementById('attachment').files[0];

    // Get student details
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.roomNumber === roomNumber);
    
    if (!booking) {
        notificationSystem.addNotification('error', 'Room number not found');
        return;
    }

    // Create feedback object
    const feedback = {
        id: Date.now(),
        studentName: booking.name,
        roomNumber: roomNumber,
        type: type,
        category: category,
        priority: priority,
        description: description,
        rating: selectedRating,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        attachmentName: attachment ? attachment.name : null,
        comments: []
    };

    // Add to feedback items
    feedbackItems.unshift(feedback);
    localStorage.setItem('feedbackItems', JSON.stringify(feedbackItems));

    // Send notifications
    notificationSystem.addNotification('success', 'Feedback submitted successfully');
    
    if (type === 'complaint' && priority === 'urgent') {
        await notificationSystem.sendEmailNotification(
            'admin@hostel.com',
            'Urgent Complaint Received',
            `Urgent complaint received from ${booking.name} (Room ${roomNumber})\n\nCategory: ${category}\n\nDescription: ${description}`
        );
    }

    // Reset form
    event.target.reset();
    selectedRating = 0;
    highlightStars(0);
    
    // Update display
    filterFeedback();
}

// Filter feedback items
function filterFeedback() {
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    let filtered = [...feedbackItems];
    
    if (typeFilter) {
        filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    displayFeedback(filtered);
}

// Display feedback items
function displayFeedback(items) {
    const container = document.getElementById('feedback-history');
    
    container.innerHTML = items.map(item => `
        <div class="complaint-card ${item.priority}">
            <div class="complaint-header">
                <div>
                    <h3>${item.type.charAt(0).toUpperCase() + item.type.slice(1)} - ${item.category}</h3>
                    <p><strong>From:</strong> ${item.studentName} (Room ${item.roomNumber})</p>
                </div>
                <span class="complaint-status status-${item.status}">${item.status.toUpperCase()}</span>
            </div>
            
            <p><strong>Description:</strong> ${item.description}</p>
            
            ${item.rating ? `
                <div class="rating-display">
                    <strong>Rating:</strong> ${'★'.repeat(item.rating)}${'☆'.repeat(5-item.rating)}
                </div>
            ` : ''}
            
            ${item.attachmentName ? `
                <p><strong>Attachment:</strong> ${item.attachmentName}</p>
            ` : ''}
            
            <p><strong>Submitted:</strong> ${formatDate(item.submittedAt)}</p>
            
            ${item.comments.length > 0 ? `
                <div class="comment-section">
                    <h4>Comments:</h4>
                    ${item.comments.map(comment => `
                        <div class="comment">
                            <strong>${comment.author}:</strong> ${comment.text}
                            <small>(${formatDate(comment.timestamp)})</small>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${item.status !== 'resolved' ? `
                <div style="margin-top: 10px;">
                    <button class="action-btn" onclick="addComment(${item.id})">Add Comment</button>
                    <button class="action-btn" onclick="updateStatus(${item.id})">Update Status</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Add comment to feedback
function addComment(feedbackId) {
    const comment = prompt('Enter your comment:');
    if (!comment) return;
    
    const feedback = feedbackItems.find(item => item.id === feedbackId);
    if (!feedback) return;
    
    feedback.comments.push({
        author: 'Student', // Could be dynamic based on user role
        text: comment,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('feedbackItems', JSON.stringify(feedbackItems));
    filterFeedback();
}

// Update feedback status
function updateStatus(feedbackId) {
    const newStatus = prompt('Enter new status (pending/in-progress/resolved):');
    if (!newStatus || !['pending', 'in-progress', 'resolved'].includes(newStatus)) {
        alert('Invalid status');
        return;
    }
    
    const feedback = feedbackItems.find(item => item.id === feedbackId);
    if (!feedback) return;
    
    feedback.status = newStatus;
    localStorage.setItem('feedbackItems', JSON.stringify(feedbackItems));
    
    if (newStatus === 'resolved') {
        notificationSystem.addNotification('success', `${feedback.type} marked as resolved`);
    }
    
    filterFeedback();
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show selected tab
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}
