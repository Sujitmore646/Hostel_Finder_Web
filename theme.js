// Theme management
const themes = {
    light: {
        '--primary-bg': '#ffffff',
        '--secondary-bg': '#f8f9fa',
        '--primary-text': '#333333',
        '--secondary-text': '#6c757d',
        '--border-color': '#dee2e6',
        '--shadow-color': 'rgba(0,0,0,0.1)',
        '--hover-bg': '#f5f5f5',
        '--card-bg': '#ffffff',
        '--input-bg': '#ffffff',
        '--button-bg': '#4CAF50',
        '--button-text': '#ffffff',
        '--menu-bg': '#ffffff',
        '--notification-bg': '#f8f9fa'
    },
    dark: {
        '--primary-bg': '#1a1a1a',
        '--secondary-bg': '#2d2d2d',
        '--primary-text': '#ffffff',
        '--secondary-text': '#b0b0b0',
        '--border-color': '#404040',
        '--shadow-color': 'rgba(0,0,0,0.3)',
        '--hover-bg': '#3d3d3d',
        '--card-bg': '#2d2d2d',
        '--input-bg': '#333333',
        '--button-bg': '#45a049',
        '--button-text': '#ffffff',
        '--menu-bg': '#2d2d2d',
        '--notification-bg': '#333333'
    }
};

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Add theme toggle to settings if on settings page
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
    }
});

// Apply theme
function applyTheme(themeName) {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
    
    // Store theme preference
    localStorage.setItem('theme', themeName);
    
    // Update body class for additional styling hooks
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${themeName}`);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme['--primary-bg'];
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    return newTheme;
}

// Export theme functions
window.themeUtils = {
    applyTheme,
    toggleTheme,
    getCurrentTheme: () => localStorage.getItem('theme') || 'light'
};
