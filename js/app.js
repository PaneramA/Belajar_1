// Global state
let metabaseClient = null;
let apiLogs = [];

// DOM Elements - Updated for new auth system
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const connectionStatus = document.getElementById('connectionStatus');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkDemoMode();
});

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// Check if we should run in demo mode
function checkDemoMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        loadDemoData();
    }
}

// Load all data
async function loadAllData() {
    try {
        await Promise.all([
            loadDashboards(),
            loadQuestions(),
            loadDatabases(),
            loadCollections()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('error', 'Error', 'Failed to load some data');
    }
}

// Load dashboards
async function loadDashboards() {
    const container = document.getElementById('dashboardsList');
    container.innerHTML = '<div class="loading">Loading dashboards...</div>';

    try {
        const dashboards = await metabaseClient.getDashboards();
        logApiRequest('GET', '/api/dashboard', 'success', `Loaded ${dashboards.length} dashboards`);

        // Update count
        document.getElementById('dashboardCount').textContent = dashboards.length;

        // Render dashboards
        if (dashboards.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div>No dashboards found</div>
                </div>
            `;
        } else {
            container.innerHTML = dashboards.map(d => `
                <div class="item">
                    <div class="item-info">
                        <div class="item-name">${d.name}</div>
                        <div class="item-meta">ID: ${d.id} • Created: ${new Date(d.created_at).toLocaleDateString('id-ID')}</div>
                    </div>
                    <div class="item-badge">${d.ordered_cards?.length || 0} cards</div>
                </div>
            `).join('');
        }
    } catch (error) {
        logApiRequest('GET', '/api/dashboard', 'error', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div>Error loading dashboards: ${error.message}</div>
            </div>
        `;
    }
}

// Load questions
async function loadQuestions() {
    const container = document.getElementById('questionsList');
    container.innerHTML = '<div class="loading">Loading questions...</div>';

    try {
        const questions = await metabaseClient.getCards();
        logApiRequest('GET', '/api/card', 'success', `Loaded ${questions.length} questions`);

        // Update count
        document.getElementById('questionCount').textContent = questions.length;

        // Render questions
        if (questions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div>No questions found</div>
                </div>
            `;
        } else {
            container.innerHTML = questions.map(q => `
                <div class="item">
                    <div class="item-info">
                        <div class="item-name">${q.name}</div>
                        <div class="item-meta">ID: ${q.id} • Type: ${q.display}</div>
                    </div>
                    <div class="item-badge">${q.database_id ? 'DB: ' + q.database_id : 'No DB'}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        logApiRequest('GET', '/api/card', 'error', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div>Error loading questions: ${error.message}</div>
            </div>
        `;
    }
}

// Load databases
async function loadDatabases() {
    const container = document.getElementById('databasesList');
    container.innerHTML = '<div class="loading">Loading databases...</div>';

    try {
        const databases = await metabaseClient.getDatabases();
        logApiRequest('GET', '/api/database', 'success', `Loaded ${databases.length} databases`);

        // Update count
        document.getElementById('databaseCount').textContent = databases.length;

        // Render databases
        if (databases.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🗄️</div>
                    <div>No databases found</div>
                </div>
            `;
        } else {
            container.innerHTML = databases.map(db => `
                <div class="item">
                    <div class="item-info">
                        <div class="item-name">${db.name}</div>
                        <div class="item-meta">ID: ${db.id} • Engine: ${db.engine}</div>
                    </div>
                    <div class="item-badge">${db.is_sample ? 'Sample' : 'Production'}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        logApiRequest('GET', '/api/database', 'error', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div>Error loading databases: ${error.message}</div>
            </div>
        `;
    }
}

// Load collections
async function loadCollections() {
    try {
        const collections = await metabaseClient.getCollections();
        logApiRequest('GET', '/api/collection', 'success', `Loaded ${collections.length} collections`);

        // Update count
        document.getElementById('collectionCount').textContent = collections.length;
    } catch (error) {
        logApiRequest('GET', '/api/collection', 'error', error.message);
        document.getElementById('collectionCount').textContent = '0';
    }
}

// Refresh functions
async function refreshDashboards() {
    showToast('info', 'Refreshing', 'Loading dashboards...');
    await loadDashboards();
}

async function refreshQuestions() {
    showToast('info', 'Refreshing', 'Loading questions...');
    await loadQuestions();
}

async function refreshDatabases() {
    showToast('info', 'Refreshing', 'Loading databases...');
    await loadDatabases();
}

// Tab switching
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `${tabName}-tab`);
    });
}

// Update connection status
function updateConnectionStatus(connected) {
    const dot = connectionStatus.querySelector('.status-dot');
    const text = connectionStatus.querySelector('.status-text');

    if (connected) {
        dot.classList.remove('disconnected');
        dot.classList.add('connected');
        text.textContent = 'Connected';
    } else {
        dot.classList.remove('connected');
        dot.classList.add('disconnected');
        text.textContent = 'Disconnected';
    }
}

// Log API requests
function logApiRequest(method, endpoint, status, message) {
    const log = {
        time: new Date().toLocaleTimeString('id-ID'),
        method,
        endpoint,
        status,
        message
    };

    apiLogs.unshift(log);

    // Keep only last 50 logs
    if (apiLogs.length > 50) {
        apiLogs = apiLogs.slice(0, 50);
    }

    // Update logs display
    updateLogsDisplay();
}

function updateLogsDisplay() {
    const container = document.getElementById('apiLogs');

    if (apiLogs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div>No API logs yet</div>
            </div>
        `;
    } else {
        container.innerHTML = apiLogs.map(log => `
            <div class="log-entry ${log.status}">
                <span class="log-time">${log.time}</span>
                <span class="log-method ${log.method}">${log.method}</span>
                <span class="log-endpoint">${log.endpoint}</span>
                <span class="log-message"> - ${log.message}</span>
            </div>
        `).join('');
    }
}

function clearLogs() {
    apiLogs = [];
    updateLogsDisplay();
    showToast('success', 'Cleared', 'API logs cleared');
}

// Logout function (called from auth.js or directly)
function logoutFromMetabase() {
    if (metabaseClient) {
        try {
            metabaseClient.logout();
            logApiRequest('DELETE', '/api/session', 'success', 'Logged out from Metabase');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    metabaseClient = null;
    apiLogs = [];
}

// Toast notifications
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Demo mode with fake data
function loadDemoData() {
    showToast('info', 'Demo Mode', 'Loading demo data...');

    // Hide auth section, show dashboard
    if (authSection) {
        authSection.style.display = 'none';
    }
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
    }

    // Load fake data
    const fakeDashboards = [
        { id: 1, name: 'Sales Dashboard', created_at: new Date(), ordered_cards: [{}, {}, {}] },
        { id: 2, name: 'Marketing Analytics', created_at: new Date(), ordered_cards: [{}, {}] },
        { id: 3, name: 'Customer Insights', created_at: new Date(), ordered_cards: [{}, {}, {}, {}] }
    ];

    const fakeQuestions = [
        { id: 1, name: 'Total Revenue', display: 'scalar', database_id: 1 },
        { id: 2, name: 'Orders by Month', display: 'line', database_id: 1 },
        { id: 3, name: 'Top Products', display: 'table', database_id: 1 },
        { id: 4, name: 'Customer Growth', display: 'bar', database_id: 1 },
        { id: 5, name: 'Revenue by Category', display: 'pie', database_id: 1 }
    ];

    const fakeDatabases = [
        { id: 1, name: 'Production DB', engine: 'postgres', is_sample: false },
        { id: 2, name: 'Sample Database', engine: 'h2', is_sample: true }
    ];

    // Update counts
    const dashboardCountEl = document.getElementById('dashboardCount');
    const questionCountEl = document.getElementById('questionCount');
    const databaseCountEl = document.getElementById('databaseCount');
    const collectionCountEl = document.getElementById('collectionCount');

    if (dashboardCountEl) dashboardCountEl.textContent = fakeDashboards.length;
    if (questionCountEl) questionCountEl.textContent = fakeQuestions.length;
    if (databaseCountEl) databaseCountEl.textContent = fakeDatabases.length;
    if (collectionCountEl) collectionCountEl.textContent = '5';

    // Render dashboards
    const dashboardsList = document.getElementById('dashboardsList');
    if (dashboardsList) {
        dashboardsList.innerHTML = fakeDashboards.map(d => `
            <div class="item">
                <div class="item-info">
                    <div class="item-name">${d.name}</div>
                    <div class="item-meta">ID: ${d.id} • Created: ${new Date(d.created_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="item-badge">${d.ordered_cards.length} cards</div>
            </div>
        `).join('');
    }

    // Render questions
    const questionsList = document.getElementById('questionsList');
    if (questionsList) {
        questionsList.innerHTML = fakeQuestions.map(q => `
            <div class="item">
                <div class="item-info">
                    <div class="item-name">${q.name}</div>
                    <div class="item-meta">ID: ${q.id} • Type: ${q.display}</div>
                </div>
                <div class="item-badge">DB: ${q.database_id}</div>
            </div>
        `).join('');
    }

    // Render databases
    const databasesList = document.getElementById('databasesList');
    if (databasesList) {
        databasesList.innerHTML = fakeDatabases.map(db => `
            <div class="item">
                <div class="item-info">
                    <div class="item-name">${db.name}</div>
                    <div class="item-meta">ID: ${db.id} • Engine: ${db.engine}</div>
                </div>
                <div class="item-badge">${db.is_sample ? 'Sample' : 'Production'}</div>
            </div>
        `).join('');
    }

    // Add demo logs
    logApiRequest('POST', '/api/session', 'success', 'Demo login successful');
    logApiRequest('GET', '/api/dashboard', 'success', `Loaded ${fakeDashboards.length} dashboards`);
    logApiRequest('GET', '/api/card', 'success', `Loaded ${fakeQuestions.length} questions`);
    logApiRequest('GET', '/api/database', 'success', `Loaded ${fakeDatabases.length} databases`);

    showToast('success', 'Demo Mode Active', 'Showing sample data. All features accessible!');
}
