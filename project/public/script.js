class CollegeChatbot {
    constructor() {
        this.conversationHistory = [];
        this.isTyping = false;
        this.apiBaseUrl = window.location.origin;
        this.datasets = [];
        
        this.initializeElements();
        this.bindEvents();
        this.checkServerHealth();
        this.loadDatasets();
    }
    
    initializeElements() {
        this.welcomeSection = document.getElementById('welcomeSection');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.statusDot = document.getElementById('statusDot');
        this.statusText = document.getElementById('statusText');
        this.reloadBtn = document.getElementById('reloadBtn');
        
        // Quick action buttons
        this.quickButtons = document.querySelectorAll('.quick-btn');
    }
    
    bindEvents() {
        // Send message events
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input events
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = !this.messageInput.value.trim();
        });
        
        // Quick action buttons
        this.quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                if (message) {
                    this.messageInput.value = message;
                    this.sendMessage();
                }
            });
        });
        
        // Reload button
        this.reloadBtn.addEventListener('click', () => this.reloadData());
        
        // Focus input on load
        this.messageInput.focus();
    }
    
    async loadDatasets() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/datasets`);
            const data = await response.json();
            this.datasets = data.datasets || [];
            this.updateDatasetInfo();
        } catch (error) {
            console.error('Failed to load datasets:', error);
        }
    }
    
    updateDatasetInfo() {
        if (this.datasets.length > 0) {
            const totalRecords = this.datasets.reduce((sum, ds) => sum + ds.totalRecords, 0);
            console.log(`📊 Available datasets: ${this.datasets.map(d => `${d.name} (${d.totalRecords} records)`).join(', ')}`);
        }
    }
    
    async checkServerHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/health`);
            const data = await response.json();
            
            if (data.status === 'healthy') {
                const statusMessage = data.datasets > 1 
                    ? `Connected • ${data.recordCount} records from ${data.datasets} datasets`
                    : `Connected • ${data.recordCount} records loaded`;
                this.updateStatus('online', statusMessage);
                
                // Update datasets info
                if (data.datasetInfo) {
                    this.datasets = data.datasetInfo;
                    this.updateDatasetInfo();
                }
            } else {
                this.updateStatus('offline', 'Server unavailable');
            }
        } catch (error) {
            console.error('Health check failed:', error);
            this.updateStatus('offline', 'Connection failed');
        }
    }
    
    updateStatus(status, text) {
        this.statusDot.className = `status-dot ${status}`;
        this.statusText.textContent = text;
    }
    
    async reloadData() {
        try {
            this.reloadBtn.classList.add('loading');
            this.updateStatus('offline', 'Reloading all datasets...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/reload-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                const statusMessage = data.datasets > 1 
                    ? `Data reloaded • ${data.recordCount} records from ${data.datasets} datasets`
                    : `Data reloaded • ${data.recordCount} records`;
                this.updateStatus('online', statusMessage);
                
                // Update datasets
                if (data.datasetInfo) {
                    this.datasets = data.datasetInfo;
                    this.updateDatasetInfo();
                }
                
                const datasetNames = data.datasetInfo ? data.datasetInfo.map(d => d.name).join(', ') : 'datasets';
                this.showSystemMessage(`Successfully reloaded ${datasetNames}!`, 'success');
            } else {
                this.updateStatus('offline', 'Reload failed');
                this.showSystemMessage('Failed to reload data: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Reload failed:', error);
            this.updateStatus('offline', 'Reload failed');
            this.showSystemMessage('Failed to reload data. Please check your connection.', 'error');
        } finally {
            this.reloadBtn.classList.remove('loading');
        }
    }
    
    showSystemMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `system-message ${type}`;
        messageElement.textContent = message;
        
        if (this.chatMessages.children.length === 0) {
            this.switchToChatView();
        }
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Clear input and disable send button
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        // Switch to chat view if needed
        if (this.welcomeSection.style.display !== 'none') {
            this.switchToChatView();
        }
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Send to backend
            const response = await fetch(`${this.apiBaseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Simulate realistic typing delay
            const typingDelay = Math.min(data.response.length * 20, 2000);
            await this.delay(typingDelay);
            
            // Hide typing and add bot response
            this.hideTyping();
            this.addMessage(data.response, 'bot', data.category, data.sourceDataset);
            
            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: data.response }
            );
            
            // Keep history reasonable length
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }
            
        } catch (error) {
            console.error('Send message error:', error);
            this.hideTyping();
            
            let errorMessage = 'I apologize, but I\'m having trouble connecting to the server. Please check your connection and try again.';
            
            if (error.message.includes('HTTP 500')) {
                errorMessage = 'I\'m experiencing some technical difficulties. Please try reloading the Excel data or contact support if the problem persists.';
            }
            
            this.addMessage(errorMessage, 'bot', 'Error');
            this.updateStatus('offline', 'Connection error');
        }
        
        // Re-focus input
        this.messageInput.focus();
    }
    
    switchToChatView() {
        this.welcomeSection.style.display = 'none';
        this.chatMessages.classList.add('active');
        this.chatMessages.style.display = 'block';
    }
    
    addMessage(text, sender, category = null, sourceDataset = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let categoryHtml = '';
        if (category && sender === 'bot') {
            let categoryText = category;
            if (sourceDataset) {
                categoryText += ` • ${sourceDataset.file}`;
                if (sourceDataset.sheet !== 'Data') {
                    categoryText += ` (${sourceDataset.sheet})`;
                }
            }
            categoryHtml = `<div class="message-category">${categoryText}</div>`;
        }
        
        const avatarContent = sender === 'user' ? 'You' : 
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6z"/>
            </svg>`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">${avatarContent}</div>
                <div class="message-bubble">
                    ${categoryHtml}
                    <div class="message-text">${this.formatMessage(text)}</div>
                    <div class="message-time">${timestamp}</div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        // Basic formatting for better readability
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
    
    showTyping() {
        this.isTyping = true;
        this.typingIndicator.classList.add('active');
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('active');
    }
    
    scrollToBottom() {
        setTimeout(() => {
            if (this.chatMessages.scrollHeight > 0) {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }
        }, 100);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new CollegeChatbot();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Re-check server status when page becomes visible
        setTimeout(() => {
            if (window.chatbot) {
                window.chatbot.checkServerHealth();
            }
        }, 1000);
    }
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});