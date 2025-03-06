// Feedback System
class FeedbackSystem {
    constructor() {
        this.feedback = JSON.parse(localStorage.getItem('userFeedback')) || {};
        this.setupEventListeners();
    }

    // Initialize feedback system
    init() {
        this.injectFeedbackButton();
        this.createFeedbackModal();
    }

    // Create feedback button
    injectFeedbackButton() {
        const button = document.createElement('button');
        button.id = 'feedback-button';
        button.className = 'feedback-floating-button';
        button.innerHTML = '💭';
        button.title = window.i18n.getTranslation('provideFeedback');
        document.body.appendChild(button);
    }

    // Create feedback modal
    createFeedbackModal() {
        const modal = document.createElement('div');
        modal.id = 'feedback-modal';
        modal.className = 'feedback-modal';
        modal.innerHTML = `
            <div class="feedback-modal-content">
                <span class="close-button">&times;</span>
                <h2 data-i18n="feedbackTitle">${window.i18n.getTranslation('feedbackTitle')}</h2>
                <div class="feedback-type-selector">
                    <button class="feedback-type" data-type="suggestion">💡</button>
                    <button class="feedback-type" data-type="issue">🐞</button>
                    <button class="feedback-type" data-type="praise">👏</button>
                </div>
                <textarea id="feedback-text" placeholder="${window.i18n.getTranslation('feedbackPlaceholder')}"></textarea>
                <div class="feedback-rating">
                    <span data-i18n="rating">${window.i18n.getTranslation('rating')}</span>
                    <div class="star-rating">
                        ${Array(5).fill().map((_, i) => `
                            <span class="star" data-rating="${i + 1}">★</span>
                        `).join('')}
                    </div>
                </div>
                <button class="submit-feedback" data-i18n="submitFeedback">
                    ${window.i18n.getTranslation('submitFeedback')}
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'feedback-button') {
                this.showFeedbackModal();
            } else if (e.target.classList.contains('close-button')) {
                this.hideFeedbackModal();
            } else if (e.target.classList.contains('feedback-type')) {
                this.selectFeedbackType(e.target);
            } else if (e.target.classList.contains('star')) {
                this.selectRating(e.target);
            } else if (e.target.classList.contains('submit-feedback')) {
                this.submitFeedback();
            }
        });
    }

    // Show feedback modal
    showFeedbackModal() {
        const modal = document.getElementById('feedback-modal');
        modal.style.display = 'block';
        this.resetForm();
    }

    // Hide feedback modal
    hideFeedbackModal() {
        const modal = document.getElementById('feedback-modal');
        modal.style.display = 'none';
    }

    // Select feedback type
    selectFeedbackType(button) {
        document.querySelectorAll('.feedback-type').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        this.currentType = button.dataset.type;
    }

    // Select rating
    selectRating(star) {
        const rating = parseInt(star.dataset.rating);
        document.querySelectorAll('.star').forEach((s, index) => {
            s.classList.toggle('selected', index < rating);
        });
        this.currentRating = rating;
    }

    // Reset feedback form
    resetForm() {
        document.getElementById('feedback-text').value = '';
        document.querySelectorAll('.feedback-type').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('selected');
        });
        this.currentType = null;
        this.currentRating = null;
    }

    // Submit feedback
    submitFeedback() {
        const text = document.getElementById('feedback-text').value.trim();
        if (!text || !this.currentType || !this.currentRating) {
            alert(window.i18n.getTranslation('fillAllFields'));
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert(window.i18n.getTranslation('loginRequired'));
            return;
        }

        const feedback = {
            userId: currentUser.email,
            type: this.currentType,
            text: text,
            rating: this.currentRating,
            timestamp: new Date().toISOString()
        };

        this.saveFeedback(feedback);
        this.hideFeedbackModal();
        this.showThankYouMessage();

        // Track feedback submission
        window.trackActivity(currentUser.email, 'feedback_submitted', {
            type: this.currentType,
            rating: this.currentRating
        });
    }

    // Save feedback
    saveFeedback(feedback) {
        if (!this.feedback[feedback.userId]) {
            this.feedback[feedback.userId] = [];
        }
        this.feedback[feedback.userId].push(feedback);
        localStorage.setItem('userFeedback', JSON.stringify(this.feedback));
    }

    // Show thank you message
    showThankYouMessage() {
        const message = document.createElement('div');
        message.className = 'feedback-thank-you';
        message.textContent = window.i18n.getTranslation('thankYouFeedback');
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Get user feedback
    getUserFeedback(userId) {
        return this.feedback[userId] || [];
    }

    // Get feedback statistics
    getFeedbackStats() {
        const stats = {
            total: 0,
            byType: {},
            averageRating: 0,
            ratingDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        };

        Object.values(this.feedback).flat().forEach(feedback => {
            stats.total++;
            stats.byType[feedback.type] = (stats.byType[feedback.type] || 0) + 1;
            stats.ratingDistribution[feedback.rating]++;
            stats.averageRating += feedback.rating;
        });

        if (stats.total > 0) {
            stats.averageRating /= stats.total;
        }

        return stats;
    }
}

// Initialize feedback system
const feedbackSystem = new FeedbackSystem();
document.addEventListener('DOMContentLoaded', () => {
    feedbackSystem.init();
});

// Export feedback system
window.feedbackSystem = feedbackSystem;
