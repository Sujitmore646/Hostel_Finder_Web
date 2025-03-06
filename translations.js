// Language translations
const translations = {
    en: {
        // Navigation
        home: 'Home',
        login: 'Login',
        register: 'Register',
        adminAccess: 'Admin Access',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',

        // Profile Menu
        myProfile: 'My Profile',
        attendanceSystem: 'Attendance System',
        leaveManagement: 'Leave Management',
        roomManagement: 'Room Management',
        complaintsAndFeedback: 'Complaints & Feedback',
        myBookings: 'My Bookings',

        // Settings
        profileSettings: 'Profile Settings',
        notificationSettings: 'Notification Settings',
        securitySettings: 'Security Settings',
        displayName: 'Display Name',
        phoneNumber: 'Phone Number',
        changeProfilePicture: 'Change Profile Picture',
        saveChanges: 'Save Changes',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        changePassword: 'Change Password',

        // Notifications
        emailNotifications: 'Email Notifications',
        browserNotifications: 'Browser Notifications',
        attendanceReminders: 'Attendance Reminders',
        leaveUpdates: 'Leave Updates',
        recentNotifications: 'Recent Notifications',
        noNotifications: 'No recent notifications',

        // Messages
        profileUpdateSuccess: 'Profile updated successfully',
        passwordChangeSuccess: 'Password changed successfully',
        passwordMismatch: 'New passwords do not match',
        incorrectPassword: 'Current password is incorrect',
        userNotFound: 'User not found',
        notificationEnabled: 'Notifications Enabled',
        notificationMessage: 'You will now receive desktop notifications',
        browserNotSupported: 'This browser does not support desktop notifications',

        // Theme
        theme: 'Theme',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',

        // Language
        language: 'Language',
        english: 'English',
        hindi: 'हिंदी',
        spanish: 'Español',

        // Help Center
        helpCenter: 'Help Center',
        searchHelp: 'Search for help...',
        gettingStarted: 'Getting Started',
        gettingStartedDesc: 'Learn the basics of using our hostel management system',
        accountSecurity: 'Account & Security',
        accountSecurityDesc: 'Manage your account settings and security preferences',
        bookingsHelp: 'Bookings & Reservations',
        bookingsHelpDesc: 'Learn how to make and manage your hostel bookings',
        attendanceHelp: 'Attendance System',
        attendanceHelpDesc: 'Understanding the attendance marking system',
        frequentlyAsked: 'Frequently Asked Questions',
        faqQuestion1: 'How do I mark my attendance?',
        faqAnswer1: 'You can mark your attendance through the Attendance System page. Click on "Mark Attendance" and confirm your presence for the day.',
        faqQuestion2: 'How do I apply for leave?',
        faqAnswer2: 'Navigate to the Leave Management section, fill out the leave application form with your dates and reason, and submit for approval.',
        faqQuestion3: 'How can I change my room?',
        faqAnswer3: 'Room changes can be requested through the Room Management section. Submit a room change request with your preferred room number and reason.',
        liveSupport: 'Live Support',
        typeMessage: 'Type your message...',
        send: 'Send',
    },
    hi: {
        // Navigation
        home: 'होम',
        login: 'लॉगिन',
        register: 'रजिस्टर',
        adminAccess: 'एडमिन एक्सेस',
        profile: 'प्रोफाइल',
        settings: 'सेटिंग्स',
        logout: 'लॉगआउट',

        // Profile Menu
        myProfile: 'मेरी प्रोफाइल',
        attendanceSystem: 'उपस्थिति प्रणाली',
        leaveManagement: 'छुट्टी प्रबंधन',
        roomManagement: 'कमरा प्रबंधन',
        complaintsAndFeedback: 'शिकायत और प्रतिक्रिया',
        myBookings: 'मेरी बुकिंग',

        // Settings
        profileSettings: 'प्रोफाइल सेटिंग्स',
        notificationSettings: 'नोटिफिकेशन सेटिंग्स',
        securitySettings: 'सुरक्षा सेटिंग्स',
        displayName: 'प्रदर्शित नाम',
        phoneNumber: 'फोन नंबर',
        changeProfilePicture: 'प्रोफाइल फोटो बदलें',
        saveChanges: 'परिवर्तन सहेजें',
        currentPassword: 'वर्तमान पासवर्ड',
        newPassword: 'नया पासवर्ड',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        changePassword: 'पासवर्ड बदलें',

        // Notifications
        emailNotifications: 'ईमेल नोटिफिकेशन',
        browserNotifications: 'ब्राउज़र नोटिफिकेशन',
        attendanceReminders: 'उपस्थिति रिमाइंडर',
        leaveUpdates: 'छुट्टी अपडेट',
        recentNotifications: 'हाल की सूचनाएं',
        noNotifications: 'कोई हाल की सूचना नहीं',

        // Messages
        profileUpdateSuccess: 'प्रोफाइल सफलतापूर्वक अपडेट किया गया',
        passwordChangeSuccess: 'पासवर्ड सफलतापूर्वक बदला गया',
        passwordMismatch: 'नए पासवर्ड मेल नहीं खाते',
        incorrectPassword: 'वर्तमान पासवर्ड गलत है',
        userNotFound: 'उपयोगकर्ता नहीं मिला',
        notificationEnabled: 'नोटिफिकेशन सक्षम',
        notificationMessage: 'अब आपको डेस्कटॉप नोटिफिकेशन प्राप्त होंगे',
        browserNotSupported: 'यह ब्राउज़र डेस्कटॉप नोटिफिकेशन का समर्थन नहीं करता',

        // Theme
        theme: 'थीम',
        lightMode: 'लाइट मोड',
        darkMode: 'डार्क मोड',

        // Language
        language: 'भाषा',
        english: 'English',
        hindi: 'हिंदी',
        spanish: 'Español',

        // Help Center
        helpCenter: 'सहायता केंद्र',
        searchHelp: 'सहायता खोजें...',
        gettingStarted: 'शुरू करें',
        gettingStartedDesc: 'हमारी छात्रावास प्रबंधन प्रणाली का उपयोग करने की मूल बातें सीखें',
        accountSecurity: 'खाता और सुरक्षा',
        accountSecurityDesc: 'अपने खाते की सेटिंग्स और सुरक्षा प्राथमिकताएं प्रबंधित करें',
        bookingsHelp: 'बुकिंग और आरक्षण',
        bookingsHelpDesc: 'छात्रावास बुकिंग कैसे करें और प्रबंधित करें',
        attendanceHelp: 'उपस्थिति प्रणाली',
        attendanceHelpDesc: 'उपस्थिति अंकन प्रणाली को समझना',
        frequentlyAsked: 'अक्सर पूछे जाने वाले प्रश्न',
        faqQuestion1: 'मैं अपनी उपस्थिति कैसे दर्ज करूं?',
        faqAnswer1: 'आप उपस्थिति प्रणाली पेज के माध्यम से अपनी उपस्थिति दर्ज कर सकते हैं। "उपस्थिति दर्ज करें" पर क्लिक करें और दिन के लिए अपनी उपस्थिति की पुष्टि करें।',
        faqQuestion2: 'मैं छुट्टी के लिए कैसे आवेदन करूं?',
        faqAnswer2: 'छुट्टी प्रबंधन खंड में जाएं, अपनी तिथियों और कारण के साथ छुट्टी आवेदन फॉर्म भरें, और स्वीकृति के लिए जमा करें।',
        faqQuestion3: 'मैं अपना कमरा कैसे बदल सकता हूं?',
        faqAnswer3: 'कमरा प्रबंधन खंड के माध्यम से कमरा बदलने का अनुरोध किया जा सकता है। अपने पसंदीदा कमरा नंबर और कारण के साथ कमरा बदलने का अनुरोध जमा करें।',
        liveSupport: 'लाइव सहायता',
        typeMessage: 'अपना संदेश टाइप करें...',
        send: 'भेजें',
    },
    es: {
        // Navigation
        home: 'Inicio',
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        adminAccess: 'Acceso Admin',
        profile: 'Perfil',
        settings: 'Ajustes',
        logout: 'Cerrar Sesión',

        // Profile Menu
        myProfile: 'Mi Perfil',
        attendanceSystem: 'Sistema de Asistencia',
        leaveManagement: 'Gestión de Permisos',
        roomManagement: 'Gestión de Habitaciones',
        complaintsAndFeedback: 'Quejas y Comentarios',
        myBookings: 'Mis Reservas',

        // Settings
        profileSettings: 'Ajustes de Perfil',
        notificationSettings: 'Ajustes de Notificaciones',
        securitySettings: 'Ajustes de Seguridad',
        displayName: 'Nombre Visible',
        phoneNumber: 'Número de Teléfono',
        changeProfilePicture: 'Cambiar Foto de Perfil',
        saveChanges: 'Guardar Cambios',
        currentPassword: 'Contraseña Actual',
        newPassword: 'Nueva Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        changePassword: 'Cambiar Contraseña',

        // Notifications
        emailNotifications: 'Notificaciones por Email',
        browserNotifications: 'Notificaciones del Navegador',
        attendanceReminders: 'Recordatorios de Asistencia',
        leaveUpdates: 'Actualizaciones de Permisos',
        recentNotifications: 'Notificaciones Recientes',
        noNotifications: 'No hay notificaciones recientes',

        // Messages
        profileUpdateSuccess: 'Perfil actualizado con éxito',
        passwordChangeSuccess: 'Contraseña cambiada con éxito',
        passwordMismatch: 'Las nuevas contraseñas no coinciden',
        incorrectPassword: 'La contraseña actual es incorrecta',
        userNotFound: 'Usuario no encontrado',
        notificationEnabled: 'Notificaciones Habilitadas',
        notificationMessage: 'Ahora recibirás notificaciones de escritorio',
        browserNotSupported: 'Este navegador no soporta notificaciones de escritorio',

        // Theme
        theme: 'Tema',
        lightMode: 'Modo Claro',
        darkMode: 'Modo Oscuro',

        // Language
        language: 'Idioma',
        english: 'English',
        hindi: 'हिंदी',
        spanish: 'Español',

        // Help Center
        helpCenter: 'Centro de Ayuda',
        searchHelp: 'Buscar ayuda...',
        gettingStarted: 'Comenzar',
        gettingStartedDesc: 'Aprende lo básico sobre el uso de nuestro sistema de gestión de hostales',
        accountSecurity: 'Cuenta y Seguridad',
        accountSecurityDesc: 'Gestiona la configuración y preferencias de seguridad de tu cuenta',
        bookingsHelp: 'Reservas',
        bookingsHelpDesc: 'Aprende a hacer y gestionar tus reservas de hostal',
        attendanceHelp: 'Sistema de Asistencia',
        attendanceHelpDesc: 'Entendiendo el sistema de marcado de asistencia',
        frequentlyAsked: 'Preguntas Frecuentes',
        faqQuestion1: '¿Cómo marco mi asistencia?',
        faqAnswer1: 'Puedes marcar tu asistencia a través de la página del Sistema de Asistencia. Haz clic en "Marcar Asistencia" y confirma tu presencia del día.',
        faqQuestion2: '¿Cómo solicito un permiso?',
        faqAnswer2: 'Navega a la sección de Gestión de Permisos, completa el formulario de solicitud con tus fechas y motivo, y envíalo para su aprobación.',
        faqQuestion3: '¿Cómo puedo cambiar mi habitación?',
        faqAnswer3: 'Los cambios de habitación se pueden solicitar a través de la sección de Gestión de Habitaciones. Envía una solicitud de cambio con tu número de habitación preferido y el motivo.',
        liveSupport: 'Soporte en Vivo',
        typeMessage: 'Escribe tu mensaje...',
        send: 'Enviar',
    }
};

// Language management
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    // Add language selector to settings if on settings page
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
    }
});

// Set language
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    translatePage();
}

// Translate page
function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[currentLanguage][key] || key;
    });
}

// Get translation
function getTranslation(key) {
    return translations[currentLanguage][key] || key;
}

// Export language functions
window.i18n = {
    setLanguage,
    translatePage,
    getTranslation,
    getCurrentLanguage: () => currentLanguage
};
