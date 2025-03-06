class QRAttendanceSystem {
    constructor() {
        this.scanner = null;
        this.videoElement = null;
    }

    // Initialize QR scanner
    async initializeScanner(videoElementId) {
        try {
            this.videoElement = document.getElementById(videoElementId);
            
            // Using HTML5 QR Code scanner library
            this.scanner = new Html5QrcodeScanner(videoElementId, {
                fps: 10,
                qrbox: 250
            });

            this.scanner.render(this.handleQRScan.bind(this));
        } catch (error) {
            console.error('Error initializing QR scanner:', error);
            throw error;
        }
    }

    // Handle QR code scan
    async handleQRScan(qrData) {
        try {
            const data = JSON.parse(qrData);
            if (data.type === 'attendance' && data.roomNumber && data.action) {
                await this.processAttendance(data);
            }
        } catch (error) {
            console.error('Error processing QR code:', error);
            notificationSystem.addNotification('error', 'Invalid QR code format');
        }
    }

    // Process attendance from QR code
    async processAttendance(data) {
        const { roomNumber, action } = data;
        
        // Get student details from bookings
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const booking = bookings.find(b => b.roomNumber === roomNumber);
        
        if (!booking) {
            notificationSystem.addNotification('error', 'Room number not found');
            return;
        }

        // Mark attendance
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
        const today = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString();

        let record = attendanceRecords.find(r => 
            r.roomNumber === roomNumber && r.date === today
        );

        if (action === 'check-in') {
            if (record && record.checkIn) {
                notificationSystem.addNotification('warning', 'Already checked in today');
                return;
            }

            if (!record) {
                record = {
                    studentName: booking.name,
                    roomNumber: roomNumber,
                    date: today,
                    checkIn: currentTime,
                    status: 'Present'
                };
                attendanceRecords.push(record);
            } else {
                record.checkIn = currentTime;
                record.status = 'Present';
            }

            notificationSystem.addNotification('success', `${booking.name} checked in successfully`);
        } else if (action === 'check-out') {
            if (!record || !record.checkIn) {
                notificationSystem.addNotification('error', 'Please check in first');
                return;
            }

            if (record.checkOut) {
                notificationSystem.addNotification('warning', 'Already checked out today');
                return;
            }

            record.checkOut = currentTime;
            notificationSystem.addNotification('success', `${booking.name} checked out successfully`);
        }

        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        this.updateAttendanceDisplay();
    }

    // Generate QR code for a student
    generateStudentQR(roomNumber) {
        const data = {
            type: 'attendance',
            roomNumber: roomNumber,
            action: 'check-in'
        };

        return new QRCode(document.createElement('div'), {
            text: JSON.stringify(data),
            width: 128,
            height: 128
        });
    }

    // Update attendance display
    updateAttendanceDisplay() {
        // Trigger update in the main attendance display
        if (typeof updateAttendanceLog === 'function') {
            updateAttendanceLog();
        }
    }

    // Stop scanner
    stopScanner() {
        if (this.scanner) {
            this.scanner.stop();
        }
    }
}

// Initialize QR attendance system
const qrAttendanceSystem = new QRAttendanceSystem();
