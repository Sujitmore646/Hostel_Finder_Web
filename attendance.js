// Store attendance records in localStorage
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

function markAttendance(type) {
    const studentId = document.getElementById('student-id').value;
    if (!studentId) {
        alert('Please enter Student ID/Room Number');
        return;
    }

    // Get student booking details
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.roomNumber === studentId);
    
    if (!booking) {
        alert('No booking found for this room number');
        return;
    }

    const currentTime = new Date();
    const today = currentTime.toISOString().split('T')[0];

    let record = attendanceRecords.find(r => 
        r.studentId === studentId && 
        r.date === today
    );

    if (type === 'in') {
        if (record && record.checkIn) {
            alert('Already checked in today!');
            return;
        }
        
        if (!record) {
            record = {
                studentId,
                studentName: booking.name,
                roomNumber: studentId,
                date: today,
                checkIn: currentTime.toLocaleTimeString(),
                checkOut: null,
                status: 'Present'
            };
            attendanceRecords.push(record);
        } else {
            record.checkIn = currentTime.toLocaleTimeString();
            record.status = 'Present';
        }
    } else if (type === 'out') {
        if (!record || !record.checkIn) {
            alert('Please check in first!');
            return;
        }
        if (record.checkOut) {
            alert('Already checked out today!');
            return;
        }
        record.checkOut = currentTime.toLocaleTimeString();
    }

    // Save to localStorage
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    updateAttendanceLog();
    document.getElementById('student-id').value = '';
}

function filterAttendanceByDate(date) {
    if (!date) {
        date = new Date().toISOString().split('T')[0];
    }
    updateAttendanceLog(date);
}

function updateAttendanceLog(date = new Date().toISOString().split('T')[0]) {
    const tbody = document.getElementById('attendance-log');
    
    // Filter records for selected date
    const dateRecords = attendanceRecords.filter(record => record.date === date);
    
    // Update summary statistics
    const totalStudents = getAllBookedStudents().length;
    const presentStudents = dateRecords.filter(r => r.status === 'Present').length;
    
    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('present-count').textContent = presentStudents;
    document.getElementById('absent-count').textContent = totalStudents - presentStudents;
    
    tbody.innerHTML = dateRecords.map(record => `
        <tr>
            <td>${record.studentName}</td>
            <td>${record.roomNumber}</td>
            <td>${record.checkIn || '-'}</td>
            <td>${record.checkOut || '-'}</td>
            <td>${record.status}</td>
        </tr>
    `).join('');
}

function getAllBookedStudents() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    return bookings.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const today = new Date();
        return today >= checkIn && today <= checkOut;
    });
}

function exportAttendance() {
    const date = document.getElementById('attendance-date').value || new Date().toISOString().split('T')[0];
    const records = attendanceRecords.filter(record => record.date === date);
    
    let csv = 'Student Name,Room Number,Check In,Check Out,Status\n';
    records.forEach(record => {
        csv += `${record.studentName},${record.roomNumber},${record.checkIn || ''},${record.checkOut || ''},${record.status}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize attendance log and date picker on page load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendance-date').value = today;
    updateAttendanceLog();
});
