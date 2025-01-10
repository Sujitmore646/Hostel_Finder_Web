// Sample hostels data
const hostels = [
    { name: "Girls Hostel A", type: "girls", location: "City Center" },
    { name: "Boys Hostel B", type: "boys", location: "North Side" },
    { name: "Co-Ed Hostel C", type: "all", location: "South Side" },
    { name: "Girls Hostel D", type: "girls", location: "East Side" },
    { name: "Boys Hostel E", type: "boys", location: "West Side" },
    { name: "Co-Ed Hostel F", type: "all", location: "Central Park" }
];

// Function to filter hostels based on type (girls, boys, or all)
function filterHostels(type) {
    const filteredHostels = hostels.filter(hostel => type === 'all' || hostel.type === type);
    displayHostels(filteredHostels);
}

// Function to display hostels
function displayHostels(filteredHostels) {
    const hostelsList = document.getElementById('hostels-list');
    hostelsList.innerHTML = ''; // Clear existing list

    filteredHostels.forEach(hostel => {
        const hostelCard = document.createElement('div');
        hostelCard.classList.add('hostel-card');
        hostelCard.innerHTML = `
            <h3>${hostel.name}</h3>
            <p>Location: ${hostel.location}</p>
        `;
        hostelsList.appendChild(hostelCard);
    });
}

// Function to search hostels based on input
function searchHostels() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filteredHostels = hostels.filter(hostel => hostel.name.toLowerCase().includes(query) || hostel.location.toLowerCase().includes(query));
    displayHostels(filteredHostels);
}

// Function to handle Profile button click
function viewProfile() {
    alert('Profile button clicked');
}

// Display all hostels initially
displayHostels(hostels);
