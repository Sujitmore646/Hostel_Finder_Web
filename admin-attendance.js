// Initialize data
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Update stats on page load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').value = today;
    document.getElementById('end-date').value = today;
    updateStats();
    displayAttendanceRecords();
});

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(record => record.date === today);
    
    const totalStudents = bookings.length;
    const presentToday = todayRecords.filter(record => record.status === 'Present').length;
    const absentToday = totalStudents - presentToday;
    const attendanceRate = totalStudents ? Math.round((presentToday / totalStudents) * 100) : 0;

    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('present-today').textContent = presentToday;
    document.getElementById('absent-today').textContent = absentToday;
    document.getElementById('attendance-rate').textContent = `${attendanceRate}%`;
}

function filterByDateRange() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    displayAttendanceRecords(startDate, endDate);
}

function searchRecords() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    displayAttendanceRecords(null, null, searchTerm);
}

function displayAttendanceRecords(startDate = null, endDate = null, searchTerm = '') {
    let filteredRecords = [...attendanceRecords];

    if (startDate && endDate) {
        filteredRecords = filteredRecords.filter(record => 
            record.date >= startDate && record.date <= endDate
        );
    }

    if (searchTerm) {
        filteredRecords = filteredRecords.filter(record =>
            record.studentName.toLowerCase().includes(searchTerm) ||
            record.roomNumber.toString().includes(searchTerm)
        );
    }

    const tbody = document.getElementById('attendance-records');
    tbody.innerHTML = filteredRecords.map(record => `
        <tr>
            <td>${formatDate(record.date)}</td>
            <td>${record.studentName}</td>
            <td>${record.roomNumber}</td>
            <td>${record.checkIn || '-'}</td>
            <td>${record.checkOut || '-'}</td>
            <td>
                <span class="status-badge status-${record.status.toLowerCase()}">
                    ${record.status}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="editRecord('${record.date}', '${record.roomNumber}')">Edit</button>
            </td>
        </tr>
    `).join('');
}

function generateReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates for the report');
        return;
    }

    const reportData = {
        dateRange: `${formatDate(startDate)} to ${formatDate(endDate)}`,
        totalStudents: bookings.length,
        attendanceStats: calculateAttendanceStats(startDate, endDate)
    };

    // Create and download PDF report
    const reportContent = generateReportHTML(reportData);
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${startDate}_to_${endDate}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function markAllAbsent() {
    const today = new Date().toISOString().split('T')[0];
    const unmarkedStudents = bookings.filter(booking => {
        return !attendanceRecords.some(record => 
            record.date === today && record.roomNumber === booking.roomNumber
        );
    });

    unmarkedStudents.forEach(student => {
        attendanceRecords.push({
            date: today,
            studentName: student.name,
            roomNumber: student.roomNumber,
            status: 'Absent',
            checkIn: null,
            checkOut: null
        });
    });

    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    updateStats();
    displayAttendanceRecords();
}

function exportToExcel() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let records = attendanceRecords;
    if (startDate && endDate) {
        records = records.filter(record => 
            record.date >= startDate && record.date <= endDate
        );
    }

    let csv = 'Date,Student Name,Room Number,Check In,Check Out,Status\n';
    records.forEach(record => {
        csv += `${record.date},${record.studentName},${record.roomNumber},${record.checkIn || ''},${record.checkOut || ''},${record.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_export_${startDate}_to_${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function editRecord(date, roomNumber) {
    const record = attendanceRecords.find(r => 
        r.date === date && r.roomNumber === roomNumber
    );
    
    if (!record) return;

    const newStatus = prompt('Enter new status (Present/Absent):', record.status);
    if (newStatus && ['Present', 'Absent'].includes(newStatus)) {
        record.status = newStatus;
        if (newStatus === 'Absent') {
            record.checkIn = null;
            record.checkOut = null;
        }
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        updateStats();
        displayAttendanceRecords();
    }
}

function calculateAttendanceStats(startDate, endDate) {
    const records = attendanceRecords.filter(record => 
        record.date >= startDate && record.date <= endDate
    );

    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const totalStudents = bookings.length;
    const totalPossibleAttendance = totalDays * totalStudents;
    const totalPresent = records.filter(r => r.status === 'Present').length;

    return {
        totalDays,
        totalStudents,
        totalPresent,
        attendanceRate: Math.round((totalPresent / totalPossibleAttendance) * 100)
    };
}

function generateReportHTML(data) {
    return `
        <html>
            <head>
                <title>Attendance Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .report-header { text-align: center; margin-bottom: 30px; }
                    .stats-container { margin: 20px 0; }
                    .stat-item { margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1>Attendance Report</h1>
                    <h3>${data.dateRange}</h3>
                </div>
                <div class="stats-container">
                    <div class="stat-item">Total Students: ${data.totalStudents}</div>
                    <div class="stat-item">Total Days: ${data.attendanceStats.totalDays}</div>
                    <div class="stat-item">Total Present: ${data.attendanceStats.totalPresent}</div>
                    <div class="stat-item">Attendance Rate: ${data.attendanceStats.attendanceRate}%</div>
                </div>
            </body>
        </html>
    `;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
