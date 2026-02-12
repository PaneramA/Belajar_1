// Authentication System
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('app_users');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('app_users', JSON.stringify(this.users));
    }

    // Load current user session
    loadCurrentUser() {
        const user = localStorage.getItem('current_user');
        return user ? JSON.parse(user) : null;
    }

    // Save current user session
    saveCurrentUser(user) {
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // Clear current user session
    clearCurrentUser() {
        localStorage.removeItem('current_user');
        this.currentUser = null;
    }

    // Simple password hashing (for demo - use proper hashing in production)
    hashPassword(password) {
        // Simple hash for demo purposes
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Register new user
    register(name, email, password) {
        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            throw new Error('Email sudah terdaftar');
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Format email tidak valid');
        }

        // Validate password length
        if (password.length < 6) {
            throw new Error('Password minimal 6 karakter');
        }

        // Create new user
        const user = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            avatar: this.getInitials(name)
        };

        this.users.push(user);
        this.saveUsers();

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email.toLowerCase().trim());

        if (!user) {
            throw new Error('Email tidak ditemukan');
        }

        if (user.password !== this.hashPassword(password)) {
            throw new Error('Password salah');
        }

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        };

        this.saveCurrentUser(sessionUser);
        return sessionUser;
    }

    // Logout user
    logout() {
        this.clearCurrentUser();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get user initials for avatar
    getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    // Check password strength
    checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength <= 3) return 'medium';
        return 'strong';
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// DOM Elements
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginFormSubmit = document.getElementById('loginFormSubmit');
const registerFormSubmit = document.getElementById('registerFormSubmit');

// Setup auth tabs
document.addEventListener('DOMContentLoaded', () => {
    setupAuthTabs();
    setupAuthForms();
    checkAutoLogin();
    setupPasswordStrength();
});

// Setup auth tab switching
function setupAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.authTab;

            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active form
            authForms.forEach(form => {
                if (form.id === `${targetTab}Form`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        });
    });
}

// Setup auth form handlers
function setupAuthForms() {
    console.log('Setting up auth forms...');

    // Login form
    if (loginFormSubmit) {
        console.log('Login form found, adding event listener');
        loginFormSubmit.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form NOT found!');
    }

    // Register form
    if (registerFormSubmit) {
        console.log('Register form found, adding event listener');
        registerFormSubmit.addEventListener('submit', handleRegister);
    } else {
        console.error('Register form NOT found!');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const submitBtn = loginFormSubmit.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    try {
        // Show loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Attempt login
        const user = authSystem.login(email, password);

        // Save remember me preference
        if (rememberMe) {
            localStorage.setItem('remember_me', 'true');
        } else {
            localStorage.removeItem('remember_me');
        }

        // Show success
        showToast('success', 'Login Berhasil!', `Selamat datang, ${user.name}!`);

        // Update UI
        updateUserProfile(user);
        showDashboard();

    } catch (error) {
        console.error('Login error:', error);
        showToast('error', 'Login Gagal', error.message);
    } finally {
        // Hide loading
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();
    console.log('Register form submitted!');

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    console.log('Form values:', { name, email, password: '***', confirmPassword: '***', agreeTerms });

    const submitBtn = registerFormSubmit.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    try {
        // Validate
        if (password !== confirmPassword) {
            throw new Error('Password tidak cocok');
        }

        if (!agreeTerms) {
            throw new Error('Anda harus menyetujui syarat dan ketentuan');
        }

        console.log('Validation passed, showing loading...');

        // Show loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log('Attempting to register user...');
        // Register user
        const user = authSystem.register(name, email, password);
        console.log('User registered successfully:', user);

        // Auto login after register
        authSystem.saveCurrentUser(user);
        console.log('User session saved');

        // Show success
        showToast('success', 'Registrasi Berhasil!', `Akun Anda telah dibuat, ${user.name}!`);

        // Update UI
        updateUserProfile(user);
        showDashboard();

        // Reset form
        registerFormSubmit.reset();

    } catch (error) {
        console.error('Register error:', error);
        showToast('error', 'Registrasi Gagal', error.message);
    } finally {
        // Hide loading
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Check auto login
function checkAutoLogin() {
    if (authSystem.isLoggedIn()) {
        const user = authSystem.getCurrentUser();
        updateUserProfile(user);
        showDashboard();
    }
}

// Show dashboard
function showDashboard() {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';

    // Initialize Business Overview charts
    if (typeof initializeCharts === 'function') {
        setTimeout(() => {
            initializeCharts();
        }, 100);
    }
}

// Update user profile in header
function updateUserProfile(user) {
    const connectionStatus = document.getElementById('connectionStatus');

    connectionStatus.innerHTML = `
        <div class="user-profile">
            <div class="user-avatar">${user.avatar}</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
        </div>
    `;
}

// Updated logout function
function logout() {
    authSystem.logout();

    // Also logout from Metabase if connected
    if (typeof logoutFromMetabase === 'function') {
        logoutFromMetabase();
    }

    // Reset UI
    const connectionStatus = document.getElementById('connectionStatus');
    connectionStatus.innerHTML = `
        <span class="status-dot disconnected"></span>
        <span class="status-text">Disconnected</span>
    `;

    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';

    // Reset forms
    if (loginFormSubmit) loginFormSubmit.reset();
    if (registerFormSubmit) registerFormSubmit.reset();

    showToast('success', 'Logged Out', 'Anda telah keluar dari dashboard');
}

// Show demo mode
function showDemoMode() {
    if (confirm('Masuk ke Demo Mode tanpa login?')) {
        const demoUser = {
            id: 'demo',
            name: 'Demo User',
            email: 'demo@example.com',
            avatar: 'DU'
        };

        authSystem.saveCurrentUser(demoUser);
        updateUserProfile(demoUser);
        showDashboard();
        showToast('info', 'Demo Mode', 'Anda masuk sebagai Demo User');

        // Load demo data
        loadDemoData();
    }
}

// Setup password strength indicator
function setupPasswordStrength() {
    const registerPassword = document.getElementById('registerPassword');
    if (!registerPassword) return;

    // Create strength indicator
    const strengthDiv = document.createElement('div');
    strengthDiv.className = 'password-strength';
    strengthDiv.innerHTML = `
        <div class="password-strength-bar"></div>
    `;

    const strengthText = document.createElement('div');
    strengthText.className = 'password-strength-text';

    registerPassword.parentElement.appendChild(strengthDiv);
    registerPassword.parentElement.appendChild(strengthText);

    const strengthBar = strengthDiv.querySelector('.password-strength-bar');

    registerPassword.addEventListener('input', (e) => {
        const password = e.target.value;
        if (password.length === 0) {
            strengthBar.className = 'password-strength-bar';
            strengthText.textContent = '';
            return;
        }

        const strength = authSystem.checkPasswordStrength(password);
        strengthBar.className = `password-strength-bar ${strength}`;

        const strengthTexts = {
            weak: 'Lemah',
            medium: 'Sedang',
            strong: 'Kuat'
        };
        strengthText.textContent = `Kekuatan password: ${strengthTexts[strength]}`;
    });
}
