function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return params;
}
function goBack() {
    window.location.href = 'index.html';
}
function loadHostelDetails() {
    const params = getUrlParams();
    const hostelId = params.get('id');
    const hostelData = JSON.parse(localStorage.getItem('selectedHostel'));
    
    if (hostelData) {
        document.getElementById('hostel-name').textContent = hostelData.name;
        document.getElementById('hostel-img').src = hostelData.image;
        document.getElementById('hostel-img').alt = hostelData.name;
        document.getElementById('hostel-location').textContent = hostelData.location;
        document.getElementById('hostel-type').textContent = hostelData.type;
        document.getElementById('hostel-facilities').textContent = hostelData.facilities;
        document.getElementById('hostel-contact').textContent = hostelData.contact;
        document.getElementById('hostel-price').textContent = hostelData.price;
        document.getElementById('hostel-rooms').textContent = hostelData.rooms;
    } else {
        alert('Hostel details not found');
        goBack();
    }
}

function contactHostel() {
    const hostelData = JSON.parse(localStorage.getItem('selectedHostel'));

        window.location.href = "contact-form.html";
}

function bookHostel() {
    const hostelData = JSON.parse(localStorage.getItem('selectedHostel'));
    localStorage.setItem('selectedHostelId', hostelData.id);
        window.location.href = "booking-form.html";
}

window.onload = loadHostelDetails;
