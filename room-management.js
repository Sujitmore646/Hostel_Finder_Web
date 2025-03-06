// Initialize room data structure
let rooms = JSON.parse(localStorage.getItem('rooms')) || {};
let maintenanceSchedule = JSON.parse(localStorage.getItem('maintenanceSchedule')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (Object.keys(rooms).length === 0) {
        initializeRooms();
    }
    populateFloorFilter();
    filterRooms();
});

// Initialize default room structure
function initializeRooms() {
    const floors = 4; // 4 floors
    const roomsPerFloor = 10; // 10 rooms per floor
    
    for (let floor = 1; floor <= floors; floor++) {
        for (let room = 1; room <= roomsPerFloor; room++) {
            const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
            rooms[roomNumber] = {
                floor: floor,
                number: roomNumber,
                type: room % 3 === 0 ? 'dormitory' : (room % 2 === 0 ? 'double' : 'single'),
                status: 'available',
                amenities: ['Wi-Fi', 'Air Conditioning', 'Study Table'],
                lastCleaned: new Date().toISOString(),
                occupant: null,
                capacity: room % 3 === 0 ? 4 : (room % 2 === 0 ? 2 : 1),
                price: room % 3 === 0 ? 1500 : (room % 2 === 0 ? 2000 : 2500)
            };
        }
    }
    saveRooms();
}

// Save rooms to localStorage
function saveRooms() {
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

// Populate floor filter
function populateFloorFilter() {
    const floorFilter = document.getElementById('floor-filter');
    const floors = new Set(Object.values(rooms).map(room => room.floor));
    
    floors.forEach(floor => {
        const option = document.createElement('option');
        option.value = floor;
        option.textContent = `Floor ${floor}`;
        floorFilter.appendChild(option);
    });
}

// Filter rooms based on selected criteria
function filterRooms() {
    const floorFilter = document.getElementById('floor-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    
    const container = document.getElementById('rooms-container');
    container.innerHTML = '';
    
    // Group rooms by floor
    const roomsByFloor = {};
    Object.values(rooms).forEach(room => {
        if ((!floorFilter || room.floor == floorFilter) &&
            (!statusFilter || room.status === statusFilter) &&
            (!typeFilter || room.type === typeFilter)) {
            
            if (!roomsByFloor[room.floor]) {
                roomsByFloor[room.floor] = [];
            }
            roomsByFloor[room.floor].push(room);
        }
    });
    
    // Create floor sections
    Object.entries(roomsByFloor).sort(([a], [b]) => a - b).forEach(([floor, floorRooms]) => {
        const floorSection = createFloorSection(floor, floorRooms);
        container.appendChild(floorSection);
    });
}

// Create floor section with rooms
function createFloorSection(floor, floorRooms) {
    const section = document.createElement('div');
    section.className = 'floor-section';
    
    const header = document.createElement('div');
    header.className = 'floor-header';
    header.innerHTML = `
        <h2>Floor ${floor}</h2>
        <div>
            Total Rooms: ${floorRooms.length} | 
            Available: ${floorRooms.filter(r => r.status === 'available').length} |
            Occupied: ${floorRooms.filter(r => r.status === 'occupied').length}
        </div>
    `;
    
    const roomGrid = document.createElement('div');
    roomGrid.className = 'room-grid';
    
    floorRooms.forEach(room => {
        roomGrid.appendChild(createRoomCard(room));
    });
    
    section.appendChild(header);
    section.appendChild(roomGrid);
    return section;
}

// Create room card
function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = `room-card ${room.status}`;
    
    const statusClass = `status-${room.status}`;
    const occupantInfo = room.occupant ? 
        `<p><strong>Occupant:</strong> ${room.occupant}</p>` : '';
    
    card.innerHTML = `
        <span class="room-status ${statusClass}">${room.status}</span>
        <h3>Room ${room.number}</h3>
        <div class="room-details">
            <p><strong>Type:</strong> ${room.type}</p>
            <p><strong>Capacity:</strong> ${room.capacity} person(s)</p>
            <p><strong>Price:</strong> ₹${room.price}/month</p>
            ${occupantInfo}
            <div class="room-amenities">
                ${room.amenities.map(amenity => 
                    `<span class="amenity-tag">${amenity}</span>`
                ).join('')}
            </div>
        </div>
        <div style="margin-top: 15px;">
            ${room.status === 'available' ? 
                `<button class="action-btn" onclick="assignRoom('${room.number}')">Assign Room</button>` : ''}
            <button class="action-btn" onclick="showMaintenance('${room.number}')">Schedule Maintenance</button>
        </div>
    `;
    
    return card;
}

// Show maintenance form
function showMaintenance(roomNumber) {
    const form = document.getElementById('maintenance-form');
    document.getElementById('maintenance-room').value = roomNumber;
    form.style.display = 'block';
}

// Hide maintenance form
function hideMaintenance() {
    document.getElementById('maintenance-form').style.display = 'none';
}

// Schedule maintenance
function scheduleMaintenance(event) {
    event.preventDefault();
    
    const roomNumber = document.getElementById('maintenance-room').value;
    const type = document.getElementById('maintenance-type').value;
    const date = document.getElementById('maintenance-date').value;
    const description = document.getElementById('maintenance-description').value;
    
    const maintenance = {
        id: Date.now(),
        roomNumber,
        type,
        date,
        description,
        status: 'scheduled'
    };
    
    maintenanceSchedule.push(maintenance);
    localStorage.setItem('maintenanceSchedule', JSON.stringify(maintenanceSchedule));
    
    // Update room status
    rooms[roomNumber].status = 'maintenance';
    saveRooms();
    
    // Show notification
    notificationSystem.addNotification('success', `Maintenance scheduled for Room ${roomNumber}`);
    
    // Hide form and refresh display
    hideMaintenance();
    filterRooms();
}

// Assign room to student
function assignRoom(roomNumber) {
    const studentId = prompt('Enter student ID:');
    if (!studentId) return;
    
    // Get student details from bookings
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.studentId === studentId);
    
    if (!booking) {
        notificationSystem.addNotification('error', 'Student not found');
        return;
    }
    
    rooms[roomNumber].status = 'occupied';
    rooms[roomNumber].occupant = booking.name;
    saveRooms();
    
    notificationSystem.addNotification('success', `Room ${roomNumber} assigned to ${booking.name}`);
    filterRooms();
}

// Check maintenance schedule daily
function checkMaintenanceSchedule() {
    const today = new Date().toISOString().split('T')[0];
    
    maintenanceSchedule.forEach(maintenance => {
        if (maintenance.date === today && maintenance.status === 'scheduled') {
            rooms[maintenance.roomNumber].status = 'maintenance';
            maintenance.status = 'in-progress';
        }
    });
    
    saveRooms();
    localStorage.setItem('maintenanceSchedule', JSON.stringify(maintenanceSchedule));
}

// Initialize maintenance check
setInterval(checkMaintenanceSchedule, 1000 * 60 * 60); // Check every hour
checkMaintenanceSchedule(); // Check on load
