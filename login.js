const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session with user data
        const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'student',
            roomNumber: user.roomNumber,
            loggedInAt: new Date().toISOString()
        };
        
        // Store session
        localStorage.setItem('currentUser', JSON.stringify(session));
        
        // Show profile button
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.style.display = 'block';
        }
        
        // Redirect based on role
        if (session.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } else {
        alert('Invalid email or password');
    }
}

function showProfileMenu() {
    const menu = document.getElementById('profile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Check login status on page load
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileBtn = document.getElementById('profile-btn');
    
    if (currentUser && profileBtn) {
        profileBtn.style.display = 'block';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', checkLoginStatus);