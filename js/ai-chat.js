// AI Chat Assistant
class ChatAssistant {
    constructor() {
        this.messages = this.loadMessages();
        this.isTyping = false;
        this.apiKey = this.loadApiKey();
        this.apiProvider = 'gemini'; // or 'groq'
    }

    // Load messages from localStorage
    loadMessages() {
        const saved = localStorage.getItem('chat_messages');
        return saved ? JSON.parse(saved) : [];
    }

    // Save messages to localStorage
    saveMessages() {
        localStorage.setItem('chat_messages', JSON.stringify(this.messages));
    }

    // Load API key from localStorage
    loadApiKey() {
        return localStorage.getItem('ai_api_key') || '';
    }

    // Save API key to localStorage
    saveApiKey(key) {
        localStorage.setItem('ai_api_key', key);
        this.apiKey = key;
    }

    // Get business context from dashboard
    getBusinessContext() {
        return {
            revenue_q4_2025: '$141.9k',
            revenue_change: '-0.95%',
            revenue_current: '$145,337',
            revenue_goal: '$250,000',
            goal_percentage: '58%',
            product_categories: ['Doohickey', 'Gadget', 'Gizmo', 'Widget'],
            average_rating: '3.5/5'
        };
    }

    // Build system prompt with context
    buildSystemPrompt() {
        const context = this.getBusinessContext();
        return `You are a helpful business analytics AI assistant for a dashboard application.
You help users understand their business metrics and provide actionable insights.

Current Business Overview Data:
- Q4 2025 Revenue: ${context.revenue_q4_2025} (${context.revenue_change} vs previous quarter)
- Current Revenue: ${context.revenue_current}
- Revenue Goal: ${context.revenue_goal} (${context.goal_percentage} achieved)
- Product Categories: ${context.product_categories.join(', ')}
- Average Product Rating: ${context.average_rating}

Guidelines:
- Provide concise, actionable insights
- Use the data above to answer questions
- Be friendly and professional
- If asked about data you don't have, politely say so
- Suggest relevant follow-up questions`;
    }

    // Send message to AI (Gemini API)
    async sendToGemini(userMessage) {
        console.log('sendToGemini called with message:', userMessage);

        if (!this.apiKey) {
            throw new Error('API key tidak ditemukan. Silakan set API key terlebih dahulu.');
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        console.log('API URL:', url.replace(this.apiKey, 'HIDDEN'));

        const systemPrompt = this.buildSystemPrompt();
        const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`;

        console.log('Sending request to Gemini API...');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);

                try {
                    const error = JSON.parse(errorText);
                    throw new Error(error.error?.message || 'API request failed');
                } catch (e) {
                    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
                }
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.error('Unexpected API response structure:', data);
                throw new Error('Invalid response from API');
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    // Send message to AI (Groq API - alternative)
    async sendToGroq(userMessage) {
        if (!this.apiKey) {
            throw new Error('API key tidak ditemukan. Silakan set API key terlebih dahulu.');
        }

        const url = 'https://api.groq.com/openai/v1/chat/completions';

        const systemPrompt = this.buildSystemPrompt();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Send message
    async sendMessage(userMessage) {
        console.log('=== sendMessage called ===');
        console.log('User message:', userMessage);
        console.log('API Provider:', this.apiProvider);
        console.log('Has API Key:', !!this.apiKey);

        // Add user message
        const userMsg = {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };
        this.messages.push(userMsg);
        this.saveMessages();
        console.log('User message saved');

        try {
            // Get AI response
            console.log('Calling AI API...');
            let aiResponse;
            if (this.apiProvider === 'gemini') {
                aiResponse = await this.sendToGemini(userMessage);
            } else if (this.apiProvider === 'groq') {
                aiResponse = await this.sendToGroq(userMessage);
            }

            console.log('AI Response received:', aiResponse);

            // Add AI message
            const aiMsg = {
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            };
            this.messages.push(aiMsg);
            this.saveMessages();
            console.log('AI message saved');

            return aiMsg;
        } catch (error) {
            console.error('=== AI Error ===');
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    // Clear chat history
    clearHistory() {
        this.messages = [];
        this.saveMessages();
    }

    // Get all messages
    getMessages() {
        return this.messages;
    }
}

// Initialize chat assistant
const chatAssistant = new ChatAssistant();

// DOM Elements
let chatButton, chatPanel, chatMessages, chatInput, chatSendBtn;

// Initialize chat UI
document.addEventListener('DOMContentLoaded', () => {
    initializeChatUI();
});

function initializeChatUI() {
    chatButton = document.getElementById('chatButton');
    chatPanel = document.getElementById('chatPanel');
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    chatSendBtn = document.getElementById('chatSendBtn');

    if (!chatButton || !chatPanel) {
        console.warn('Chat UI elements not found');
        return;
    }

    // Load existing messages
    renderMessages();

    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    });

    // Check for API key
    if (!chatAssistant.apiKey) {
        showApiKeyPrompt();
    }
}

// Toggle chat panel
function toggleChat() {
    chatPanel.classList.toggle('active');
    if (chatPanel.classList.contains('active')) {
        chatInput.focus();
        scrollToBottom();
    }
}

// Close chat
function closeChat() {
    chatPanel.classList.remove('active');
}

// Clear chat
function clearChat() {
    if (confirm('Hapus semua riwayat chat?')) {
        chatAssistant.clearHistory();
        renderMessages();
        showToast('success', 'Chat Cleared', 'Riwayat chat telah dihapus');
    }
}

// Show API key prompt
function showApiKeyPrompt() {
    const key = prompt('Masukkan Google Gemini API Key Anda:\n\n(Dapatkan gratis di: https://aistudio.google.com/app/apikey)');
    if (key) {
        chatAssistant.saveApiKey(key.trim());
        showToast('success', 'API Key Saved', 'API key berhasil disimpan!');
    }
}

// Handle send message
async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Check API key
    if (!chatAssistant.apiKey) {
        showApiKeyPrompt();
        return;
    }

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Add user message to UI
    addMessageToUI('user', message);

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send to AI
        const aiMessage = await chatAssistant.sendMessage(message);

        // Remove typing indicator
        hideTypingIndicator();

        // Add AI response to UI
        addMessageToUI('assistant', aiMessage.content);

    } catch (error) {
        hideTypingIndicator();
        showToast('error', 'Error', error.message);

        // Add error message
        addMessageToUI('assistant', `Maaf, terjadi error: ${error.message}\n\nSilakan cek API key Anda atau coba lagi.`);
    }
}

// Render all messages
function renderMessages() {
    chatMessages.innerHTML = '';

    const messages = chatAssistant.getMessages();

    if (messages.length === 0) {
        // Show welcome message
        chatMessages.innerHTML = `
            <div class="chat-welcome">
                <div class="chat-welcome-icon">🤖</div>
                <h4>Halo! Saya AI Assistant</h4>
                <p>Saya bisa membantu Anda menganalisa data Business Overview. Tanyakan apa saja!</p>
            </div>
            <div class="chat-quick-actions">
                <button class="quick-action-btn" onclick="askQuickQuestion('Berapa revenue saya saat ini?')">💰 Revenue saya?</button>
                <button class="quick-action-btn" onclick="askQuickQuestion('Kategori produk mana yang paling laku?')">📊 Produk terlaris?</button>
                <button class="quick-action-btn" onclick="askQuickQuestion('Apakah saya on-track untuk mencapai target?')">🎯 Progress goal?</button>
            </div>
        `;
    } else {
        messages.forEach(msg => {
            addMessageToUI(msg.role, msg.content, msg.timestamp, false);
        });
    }

    scrollToBottom();
}

// Add message to UI
function addMessageToUI(role, content, timestamp = null, scroll = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role === 'user' ? 'user' : 'ai'}`;

    const time = timestamp ? new Date(timestamp) : new Date();
    const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const avatar = role === 'user' ? '👤' : '🤖';

    messageDiv.innerHTML = `
        <div class="chat-message-avatar">${avatar}</div>
        <div class="chat-message-content">
            <div class="chat-message-bubble">${content}</div>
            <div class="chat-message-time">${timeStr}</div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);

    if (scroll) {
        scrollToBottom();
    }
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="chat-message-avatar">🤖</div>
        <div class="chat-message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Scroll to bottom
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Quick question
function askQuickQuestion(question) {
    chatInput.value = question;
    handleSendMessage();
}
