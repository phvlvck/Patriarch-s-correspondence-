// ===== Iraqi Chat - Main Application =====

// Global State
const AppState = {
    currentUser: null,
    users: [],
    chats: [],
    currentChat: null,
    socket: null,
    isOnline: false,
    isAdmin: false,
    language: 'ar',
    
    // Initialize
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.checkAuth();
        this.setupServiceWorker();
        this.updateConnectionStatus();
        
        // Simulate loading progress
        this.simulateLoading();
    },
    
    loadFromStorage() {
        // Load users
        const savedUsers = localStorage.getItem('iraqi_chat_users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
        
        // Load chats
        const savedChats = localStorage.getItem('iraqi_chat_chats');
        if (savedChats) {
            this.chats = JSON.parse(savedChats);
        }
        
        // Load current user
        const savedUser = localStorage.getItem('iraqi_chat_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.checkAdminStatus();
        }
        
        // Load language
        this.language = localStorage.getItem('chat_language') || 'ar';
    },
    
    saveToStorage() {
        localStorage.setItem('iraqi_chat_users', JSON.stringify(this.users));
        localStorage.setItem('iraqi_chat_chats', JSON.stringify(this.chats));
        if (this.currentUser) {
            localStorage.setItem('iraqi_chat_current_user', JSON.stringify(this.currentUser));
        }
    },
    
    checkAdminStatus() {
        if (this.currentUser && this.currentUser.email === 'admin@iraqichat.com') {
            this.isAdmin = true;
            document.getElementById('adminMenuItem').style.display = 'block';
        }
    },
    
    simulateLoading() {
        let progress = 0;
        const progressBar = document.getElementById('progressBar');
        const loadingText = document.getElementById('loadingText');
        
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress <= 25) {
                loadingText.textContent = LanguageManager.getText('loading') + '...';
            } else if (progress <= 50) {
                loadingText.textContent = 'جاري تحميل البيانات...';
            } else if (progress <= 75) {
                loadingText.textContent = 'جاري تهيئة النظام...';
            } else {
                loadingText.textContent = 'جاري الاتصال بالخادم...';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
        }, 100);
    },
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            
            if (this.currentUser) {
                this.showChatScreen();
                this.connectToServer();
            }
        }, 300);
    },
    
    setupEventListeners() {
        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));
        
        // Message input
        document.getElementById('messageInput').addEventListener('input', this.handleInputResize.bind(this));
        
        // Search
        document.getElementById('searchContacts').addEventListener('input', this.handleSearch.bind(this));
        
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
            
            // Close user menu
            if (!e.target.closest('.user-profile')) {
                const userMenu = document.getElementById('userMenu');
                userMenu.classList.remove('show');
            }
            
            // Close language menu
            if (!e.target.closest('.language-selector')) {
                const languageMenu = document.getElementById('languageMenu');
                languageMenu.classList.remove('show');
            }
        });
        
        // Online/Offline detection
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.showNotification(LanguageManager.getText('success'), 'الاتصال معاد', 'success');
            this.connectToServer();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
            this.showNotification(LanguageManager.getText('error'), 'فقد الاتصال بالانترنت', 'error');
        });
        
        // Before unload
        window.addEventListener('beforeunload', () => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.close();
            }
        });
    },
    
    checkAuth() {
        if (this.currentUser) {
            this.updateUserInfo();
            this.loadChats();
            this.showChatScreen();
        } else {
            this.showWelcomeScreen();
        }
    },
    
    updateUserInfo() {
        if (!this.currentUser) return;
        
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userStatus').textContent = 'متصل';
        document.getElementById('userStatus').className = 'status online';
        
        // Update avatar
        const avatar = document.getElementById('userAvatar');
        avatar.src = this.currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.currentUser.id}`;
    },
    
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        if (!email || !password) {
            this.showNotification('خطأ', 'الرجاء ملء جميع الحقول', 'error');
            return;
        }
        
        // Find user
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                bio: user.bio,
                age: user.age,
                city: user.city,
                isOnline: true,
                lastSeen: new Date().toISOString()
            };
            
            // Update user status
            const userIndex = this.users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                this.users[userIndex].isOnline = true;
                this.users[userIndex].lastSeen = new Date().toISOString();
            }
            
            this.saveToStorage();
            this.checkAdminStatus();
            this.updateUserInfo();
            this.closeAuthModal();
            this.showNotification('نجاح', 'تم تسجيل الدخول بنجاح', 'success');
            
            // Connect to server
            this.connectToServer();
            
            // Show chat screen
            setTimeout(() => {
                this.showChatScreen();
                this.loadChats();
            }, 500);
            
        } else {
            this.showNotification('خطأ', 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        }
    },
    
    handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const age = document.getElementById('registerAge').value;
        const city = document.getElementById('registerCity').value;
        
        // Validation
        if (!name || !username || !email || !password || !confirmPassword) {
            this.showNotification('خطأ', 'الرجاء ملء جميع الحقول الإلزامية', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('خطأ', 'كلمتا المرور غير متطابقتين', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        // Check if user exists
        if (this.users.some(u => u.email === email)) {
            this.showNotification('خطأ', 'البريد الإلكتروني مسجل مسبقاً', 'error');
            return;
        }
        
        if (this.users.some(u => u.username === username)) {
            this.showNotification('خطأ', 'اسم المستخدم مستخدم مسبقاً', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            username: username,
            email: email,
            password: password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: 'مرحباً! أنا جديد في دردشة العراق',
            age: age || null,
            city: city || '',
            isOnline: true,
            lastSeen: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        // Add to users list
        this.users.push(newUser);
        
        // Set as current user
        this.currentUser = {
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar,
            bio: newUser.bio,
            age: newUser.age,
            city: newUser.city,
            isOnline: true,
            lastSeen: new Date().toISOString()
        };
        
        this.saveToStorage();
        this.closeAuthModal();
        this.showNotification('نجاح', 'تم إنشاء الحساب بنجاح', 'success');
        
        // Send to server
        this.sendToServer('register', newUser);
        
        // Update UI
        setTimeout(() => {
            this.updateUserInfo();
            this.showChatScreen();
            this.loadChats();
            this.connectToServer();
        }, 500);
    },
    
    logout() {
        if (this.currentUser) {
            // Update user status
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex].isOnline = false;
                this.users[userIndex].lastSeen = new Date().toISOString();
            }
            
            // Send logout to server
            this.sendToServer('logout', { userId: this.currentUser.id });
            
            // Close socket
            if (this.socket) {
                this.socket.close();
            }
            
            // Clear current user
            this.currentUser = null;
            this.isAdmin = false;
            localStorage.removeItem('iraqi_chat_current_user');
            
            // Show welcome screen
            this.showWelcomeScreen();
            this.showNotification('نجاح', 'تم تسجيل الخروج بنجاح', 'success');
        }
    },
    
    showWelcomeScreen() {
        document.querySelector('.welcome-screen').style.display = 'flex';
        document.querySelector('.chat-screen').style.display = 'none';
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    },
    
    showChatScreen() {
        document.querySelector('.welcome-screen').style.display = 'none';
        document.querySelector('.chat-screen').style.display = 'flex';
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    },
    
    showPage(pageId) {
        const page = document.getElementById(`${pageId}Page`);
        if (page) {
            document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
            page.style.display = 'block';
            
            // Load page data
            if (pageId === 'profile') this.loadProfile();
            if (pageId === 'contacts') this.loadContacts();
            if (pageId === 'discover') this.loadDiscover();
            if (pageId === 'settings') this.loadSettings();
            if (pageId === 'admin') this.loadAdminPanel();
        }
    },
    
    loadChats() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;
        
        // Filter user's chats
        const userChats = this.chats.filter(chat => 
            chat.participants.includes(this.currentUser.id)
        );
        
        if (userChats.length === 0) {
            chatList.innerHTML = `
                <div class="no-chats">
                    <i class="fas fa-comments"></i>
                    <p>لا توجد محادثات بعد</p>
                    <button class="btn" onclick="showNewChatModal()">ابدأ محادثة جديدة</button>
                </div>
            `;
            return;
        }
        
        // Sort by last message time
        userChats.sort((a, b) => {
            const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(a.createdAt);
            const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(b.createdAt);
            return timeB - timeA;
        });
        
        // Render chats
        chatList.innerHTML = userChats.map(chat => {
            const otherUserId = chat.participants.find(id => id !== this.currentUser.id);
            const otherUser = this.users.find(u => u.id === otherUserId);
            
            if (!otherUser) return '';
            
            const lastMessage = chat.lastMessage || {};
            const unreadCount = chat.unreadCount || 0;
            const time = lastMessage.timestamp ? this.formatTime(lastMessage.timestamp) : '';
            
            return `
                <div class="chat-item" onclick="openChat('${chat.id}')">
                    <div class="chat-avatar">
                        <img src="${otherUser.avatar}" alt="${otherUser.name}" class="avatar">
                        ${otherUser.isOnline ? '<span class="online-indicator"></span>' : ''}
                    </div>
                    <div class="chat-info">
                        <div class="chat-header">
                            <h4>${otherUser.name}</h4>
                            <span class="chat-time">${time}</span>
                        </div>
                        <div class="chat-preview">
                            <p>${lastMessage.text || 'ابدأ المحادثة...'}</p>
                            ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    openChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;
        
        this.currentChat = chat;
        
        const otherUserId = chat.participants.find(id => id !== this.currentUser.id);
        const otherUser = this.users.find(u => u.id === otherUserId);
        
        if (!otherUser) return;
        
        // Update chat header
        document.getElementById('chatUserName').textContent = otherUser.name;
        document.getElementById('chatAvatar').src = otherUser.avatar;
        document.getElementById('chatUserStatus').textContent = otherUser.isOnline ? 'متصل' : 'غير متصل';
        document.getElementById('chatUserStatus').className = otherUser.isOnline ? 'status online' : 'status offline';
        
        // Load messages
        this.loadMessages(chatId);
        
        // Show chat screen on mobile
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('show');
        }
        
        // Mark as read
        this.markAsRead(chatId);
    },
    
    loadMessages(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;
        
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = '';
        
        // Group messages by date
        const groupedMessages = this.groupMessagesByDate(chat.messages || []);
        
        // Render messages
        for (const [date, messages] of Object.entries(groupedMessages)) {
            // Add date separator
            messagesContainer.innerHTML += `
                <div class="date-separator">
                    <span>${this.formatDate(date)}</span>
                </div>
            `;
            
            // Add messages
            messages.forEach(msg => {
                const isSent = msg.senderId === this.currentUser.id;
                const time = this.formatTime(msg.timestamp);
                
                messagesContainer.innerHTML += `
                    <div class="message ${isSent ? 'sent' : 'received'}">
                        <div class="message-content">${this.escapeHtml(msg.text)}</div>
                        <div class="message-time">
                            <span>${time}</span>
                            ${isSent ? `<span class="message-status">${this.getMessageStatus(msg.status)}</span>` : ''}
                        </div>
                    </div>
                `;
            });
        }
        
        // Scroll to bottom
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    },
    
    sendMessage() {
        const input = document.getElementById('messageInput');
        const text = input.value.trim();
        
        if (!text || !this.currentChat) return;
        
        // Create message
        const message = {
            id: Date.now().toString(),
            chatId: this.currentChat.id,
            senderId: this.currentUser.id,
            text: text,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };
        
        // Add to chat
        const chatIndex = this.chats.findIndex(c => c.id === this.currentChat.id);
        if (chatIndex !== -1) {
            if (!this.chats[chatIndex].messages) {
                this.chats[chatIndex].messages = [];
            }
            this.chats[chatIndex].messages.push(message);
            this.chats[chatIndex].lastMessage = message;
            this.chats[chatIndex].updatedAt = new Date().toISOString();
        }
        
        // Update UI
        this.loadMessages(this.currentChat.id);
        input.value = '';
        this.handleInputResize();
        
        // Save to storage
        this.saveToStorage();
        
        // Send to server
        this.sendToServer('message', message);
        
        // Update chat list
        this.loadChats();
    },
    
    // ===== Server Communication =====
    connectToServer() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            return;
        }
        
        // Try different server URLs (for GitHub Pages)
        const serverUrls = [
            'wss://iraqi-chat-server.onrender.com/ws',
            'wss://your-server.com/ws',
            'ws://localhost:8080/ws'
        ];
        
        for (const url of serverUrls) {
            try {
                this.socket = new WebSocket(url);
                break;
            } catch (error) {
                console.warn(`Failed to connect to ${url}:`, error);
            }
        }
        
        if (!this.socket) {
            console.error('Failed to connect to any server');
            this.updateConnectionStatus('disconnected');
            return;
        }
        
        this.socket.onopen = () => {
            console.log('Connected to server');
            this.isOnline = true;
            this.updateConnectionStatus('connected');
            
            // Send authentication
            if (this.currentUser) {
                this.sendToServer('auth', {
                    userId: this.currentUser.id,
                    userData: this.currentUser
                });
            }
        };
        
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            } catch (error) {
                console.error('Error parsing server message:', error);
            }
        };
        
        this.socket.onclose = () => {
            console.log('Disconnected from server');
            this.isOnline = false;
            this.updateConnectionStatus('disconnected');
            
            // Try to reconnect after 5 seconds
            setTimeout(() => {
                if (this.currentUser) {
                    this.connectToServer();
                }
            }, 5000);
        };
        
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.updateConnectionStatus('error');
        };
    },
    
    sendToServer(type, data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = {
                type: type,
                data: data,
                timestamp: new Date().toISOString(),
                userId: this.currentUser?.id
            };
            
            this.socket.send(JSON.stringify(message));
        } else {
            // Store for later sending
            this.queueMessage(type, data);
        }
    },
    
    queueMessage(type, data) {
        const queue = JSON.parse(localStorage.getItem('message_queue') || '[]');
        queue.push({ type, data, timestamp: new Date().toISOString() });
        localStorage.setItem('message_queue', JSON.stringify(queue));
    },
    
    handleServerMessage(data) {
        switch (data.type) {
            case 'auth_response':
                if (data.success) {
                    console.log('Authentication successful');
                }
                break;
                
            case 'message':
                this.handleIncomingMessage(data.data);
                break;
                
            case 'user_status':
                this.updateUserStatus(data.data);
                break;
                
            case 'typing':
                this.showTypingIndicator(data.data);
                break;
                
            case 'notification':
                this.showNotification(data.data.title, data.data.message, data.data.type);
                break;
                
            case 'admin_notification':
                if (this.isAdmin) {
                    this.handleAdminNotification(data.data);
                }
                break;
        }
    },
    
    handleIncomingMessage(message) {
        // Check if chat exists
        let chat = this.chats.find(c => c.id === message.chatId);
        
        if (!chat) {
            // Create new chat
            chat = {
                id: message.chatId,
                participants: [this.currentUser.id, message.senderId],
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.chats.push(chat);
        }
        
        // Add message
        if (!chat.messages) chat.messages = [];
        chat.messages.push(message);
        chat.lastMessage = message;
        chat.updatedAt = new Date().toISOString();
        
        // Update unread count if not in this chat
        if (this.currentChat?.id !== message.chatId) {
            chat.unreadCount = (chat.unreadCount || 0) + 1;
        }
        
        // Save and update UI
        this.saveToStorage();
        this.loadChats();
        
        // If this chat is open, update messages
        if (this.currentChat?.id === message.chatId) {
            this.loadMessages(message.chatId);
            this.markAsRead(message.chatId);
        }
        
        // Show notification
        if (this.currentChat?.id !== message.chatId) {
            const sender = this.users.find(u => u.id === message.senderId);
            if (sender) {
                this.showNotification(sender.name, message.text, 'info');
            }
        }
    },
    
    // ===== UI Helpers =====
    showNotification(title, message, type = 'info') {
        const notificationCenter = document.getElementById('notificationCenter');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationCenter.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },
    
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    },
    
    updateConnectionStatus(status = null) {
        const connectionStatus = document.getElementById('connectionStatus');
        
        if (status === 'connected') {
            connectionStatus.className = 'connection-status connected';
            connectionStatus.innerHTML = '<i class="fas fa-wifi"></i><span>متصل بالخادم</span>';
        } else if (status === 'disconnected') {
            connectionStatus.className = 'connection-status disconnected';
            connectionStatus.innerHTML = '<i class="fas fa-wifi-slash"></i><span>غير متصل</span>';
        } else if (status === 'connecting') {
            connectionStatus.className = 'connection-status connecting';
            connectionStatus.innerHTML = '<i class="fas fa-sync fa-spin"></i><span>جاري الاتصال...</span>';
        } else {
            connectionStatus.className = 'connection-status';
            connectionStatus.innerHTML = '<i class="fas fa-wifi"></i><span>جاري الاتصال...</span>';
        }
    },
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // If today
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        }
        
        // If yesterday
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'أمس';
        }
        
        // If within this week
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            return date.toLocaleDateString('ar-EG', { weekday: 'long' });
        }
        
        // Otherwise show date
        return date.toLocaleDateString('ar-EG');
    },
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        
        if (date.toDateString() === now.toDateString()) {
            return 'اليوم';
        }
        
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'أمس';
        }
        
        return date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    groupMessagesByDate(messages) {
        const groups = {};
        
        messages.forEach(msg => {
            const date = new Date(msg.timestamp).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        
        return groups;
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    getMessageStatus(status) {
        switch (status) {
            case 'sent': return '✓';
            case 'delivered': return '✓✓';
            case 'read': return '✓✓ (مقروء)';
            default: return '';
        }
    },
    
    // ===== Modal Functions =====
    showAuthModal(type = 'login') {
        const modal = document.getElementById('authModal');
        modal.classList.add('show');
        
        if (type === 'login') {
            switchAuthTab('login');
        } else {
            switchAuthTab('register');
        }
    },
    
    closeAuthModal() {
        document.getElementById('authModal').classList.remove('show');
    },
    
    showNewChatModal() {
        const modal = document.getElementById('newChatModal');
        modal.classList.add('show');
        
        // Load users
        this.loadUsersForChat();
    },
    
    closeNewChatModal() {
        document.getElementById('newChatModal').classList.remove('show');
    },
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    },
    
    // ===== Event Handlers =====
    handleInputResize() {
        const textarea = document.getElementById('messageInput');
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    },
    
    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const preview = item.querySelector('.chat-preview p').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || preview.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    },
    
    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    },
    
    // ===== Image Upload =====
    uploadImage(input) {
        return new Promise((resolve, reject) => {
            const file = input.files[0];
            if (!file) return reject('No file selected');
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                return reject('حجم الصورة كبير جداً (الحد الأقصى 5MB)');
            }
            
            // Check file type
            if (!file.type.match('image.*')) {
                return reject('الرجاء اختيار صورة فقط');
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                // Create compressed image
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate new dimensions
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 800;
                    
                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to base64
                    const base64 = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(base64);
                };
                img.src = e.target.result;
            };
            reader.onerror = () => reject('Error reading file');
            reader.readAsDataURL(file);
        });
    },
    
    // ===== Service Worker =====
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
};

// ===== Global Functions =====
function switchAuthTab(tab) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    // Activate selected tab
    document.getElementById(`${tab}Tab`).classList.add('active');
    document.getElementById(`${tab}Form`).classList.add('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="far fa-eye"></i>';
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('show');
}

function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    const selector = document.querySelector('.current-language');
    
    menu.classList.toggle('show');
    selector.classList.toggle('active');
}

function changeLanguage(lang) {
    LanguageManager.setLanguage(lang);
    toggleLanguageMenu();
    
    // Update app state
    AppState.language = lang;
    
    // Show notification
    AppState.showNotification('نجاح', 'تم تغيير اللغة', 'success');
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function closeChat() {
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.add('show');
    }
}

function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,audio/*,application/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            // For images, compress and send
            if (file.type.startsWith('image/')) {
                const base64 = await AppState.uploadImage(input);
                
                // Create message with image
                const message = {
                    id: Date.now().toString(),
                    chatId: AppState.currentChat.id,
                    senderId: AppState.currentUser.id,
                    text: '[صورة]',
                    image: base64,
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                    type: 'image'
                };
                
                // Add to chat
                const chatIndex = AppState.chats.findIndex(c => c.id === AppState.currentChat.id);
                if (chatIndex !== -1) {
                    AppState.chats[chatIndex].messages.push(message);
                    AppState.chats[chatIndex].lastMessage = message;
                }
                
                // Update UI
                AppState.loadMessages(AppState.currentChat.id);
                AppState.saveToStorage();
                AppState.sendToServer('message', message);
                
            } else {
                // For other files, send as attachment
                AppState.showNotification('معلومة', 'سيتم دعم هذا النوع من الملفات قريباً', 'info');
            }
        } catch (error) {
            AppState.showNotification('خطأ', error, 'error');
        }
    };
    
    input.click();
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Language Manager
    LanguageManager.init();
    
    // Initialize App State
    AppState.init();
    
    // Expose functions to global scope
    window.AppState = AppState;
    window.switchAuthTab = switchAuthTab;
    window.togglePassword = togglePassword;
    window.toggleUserMenu = toggleUserMenu;
    window.toggleLanguageMenu = toggleLanguageMenu;
    window.changeLanguage = changeLanguage;
    window.autoResize = autoResize;
    window.closeChat = closeChat;
    window.attachFile = attachFile;
    
    // Chat functions
    window.showAuthModal = (type) => AppState.showAuthModal(type);
    window.closeAuthModal = () => AppState.closeAuthModal();
    window.showNewChatModal = () => AppState.showNewChatModal();
    window.closeNewChatModal = () => AppState.closeNewChatModal();
    window.openChat = (chatId) => AppState.openChat(chatId);
    window.sendMessage = () => AppState.sendMessage();
    window.logout = () => AppState.logout();
    window.showPage = (pageId) => AppState.showPage(pageId);
});
