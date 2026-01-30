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
        
