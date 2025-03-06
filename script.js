const hostels = [
    { 
        id: 1,
        image: "RK.jpg", 
        name: "RUDRA PALACE", 
        type: "Girls", 
        location: "KOPERGAON",
        facilities: "WiFi, Hot Water, Power Backup, Study Table",
        contact: "+91 9876543210",
        rooms: {
            "Single": 2000,
            "Double sharing": 1800
        }
    },
    { 
        id: 2,
        image: "Kumawat Beckers.jpg", 
        name: "Kumawat Hostel", 
        type: "Boys", 
        location: "KOPERGAON",
        facilities: "WiFi, Hot Water, Power Backup,study Table",
        contact: "+91 7276262928",
        rooms: {
            "Single": 2000,
            "Double sharing": 1300,
            "Triple sharing": 1000
        }
    },
    { 
        id: 3,
        image: "kh.jpg", 
        name: "Kotate hostel", 
        type: "Boys", 
        location: "YEOLA",
        facilities: "WiFi, Hot Water, Power Backup,study Table",
        contact: "+91 96896 43729",
        rooms: {
            "Single": 2000,
            "Double sharing": 1300,
            "Triple sharing": 1000
        }
    },
    { 
        id: 4,
        image: "Pawan.jpg", 
        name: "Pawan Hostel", 
        type: "Boys", 
        location: "YEOLA",
        facilities: "WiFi, Hot Water, Power Backup,study Table",
        contact: "+91 7276262928",
        rooms: {
            "Single": 2200,
            "Double sharing": 1900,
            "Triple sharing": 1400
        }
    },
    { 
        id: 5,
        image: "Atma Malik.jpg", 
        name: "Atma Malik", 
        type: "Boys", 
        location: "KOPERGAON",
        facilities: "WiFi, Hot Water, Power Backup, Sports Area",
        contact: "+91 9876543212",
        rooms: {
            "Double sharing": 1500,
            "Triple sharing": 1200
        }
    },
    { 
        id: 6,
        image: "Trividha Girls Hostel.jpg", 
        name: "Trividha Hostel", 
        type: "Girls", 
        location: "KOPERGAON",
        facilities: "WiFi, Hot Water, Power Backup, Library",
        contact: "+91 9876543213",
        rooms: {
            "Single": 2000,
            "Double sharing": 1700
        }
    },
    { 
        id: 7,
        image: "Nandini Girls Hostel.jpg", 
        name: "Nandini Hostel", 
        type: "Girls", 
        location: "KOPERGAON",
        facilities: "WiFi, Hot Water, Power Backup, Common Room",
        contact: "+91 9876543214",
        rooms: {
            "Single": 1500,
            "Double sharing": 1200,
            "Triple sharing": 1000
        }
    }
];

function filterHostels(type) {
    const filteredHostels = hostels.filter(hostel => type === 'all' || hostel.type === type);
    displayHostels(filteredHostels);
}

function displayHostels(filteredHostels) {
    const hostelsList = document.getElementById('hostels-list');
    if (!hostelsList) return; // Guard clause for when element doesn't exist
    
    hostelsList.innerHTML = ''; 

    filteredHostels.forEach(hostel => {
        const hostelCard = document.createElement('button');
        hostelCard.classList.add('hostel-card');
        hostelCard.onclick = () => viewHostelDetails(hostel);
        hostelCard.innerHTML = `
            <div class="hostel-content">
                <img src="${hostel.image}" alt="${hostel.name}" class="hostel-image" onerror="this.src='placeholder.jpg'">
                <h3>${hostel.name}</h3>
                <p>Location: ${hostel.location}</p>
                <p class="price-preview">${Object.keys(hostel.rooms).map(room => `${room}: ₹${hostel.rooms[room]} per month`).join(', ')}</p>
            </div>
        `;
        hostelsList.appendChild(hostelCard);
    });
}

function searchHostels() {
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) return; // Guard clause

    const query = searchBar.value.toLowerCase();
    const filteredHostels = hostels.filter(hostel => 
        hostel.name.toLowerCase().includes(query) || 
        hostel.location.toLowerCase().includes(query)
    );
    displayHostels(filteredHostels);
}

function viewHostelDetails(hostel) {
    localStorage.setItem('selectedHostel', JSON.stringify(hostel));
    window.location.href = `hostel-details.html?id=${hostel.id}`;
}

// Profile management functions
function viewProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        window.location.href = 'student-profile.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Display all hostels by default
    displayHostels(hostels);

    // Add search functionality
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', searchHostels);
    }

    // Check login status and update UI
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.querySelector('.login-btn');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (loginBtn && profileBtn) {
        if (user) {
            loginBtn.style.display = 'none';
            profileBtn.style.display = 'flex';
            profileBtn.querySelector('.user-name').textContent = user.name;
        } else {
            loginBtn.style.display = 'block';
            profileBtn.style.display = 'none';
        }
    }
});
