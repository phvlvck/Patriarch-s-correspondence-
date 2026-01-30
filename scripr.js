// ===== إعدادات التطبيق =====
const APP_CONFIG = {
    SERVER_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8080' 
        : window.location.origin,
    WS_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'ws://localhost:8080/ws'
        : `ws://${window.location.hostname}:8080/ws`,
    
    // إعدادات الدردشة
    MESSAGE_LIMIT: 100,
    TYPING_TIMEOUT: 3000,
    RECONNECT_DELAY: 5000,
    
    // إعدادات المستخدم
    AVATAR_PROVIDER: 'dicebear',
    DEFAULT_AVATAR: 'avataaars',
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    
    // إعدادات الواجهة
    THEME: 'dark',
    LANGUAGE: 'ar',
    NOTIFICATIONS: true,
    SOUNDS: true,
    
    // إعدادات الأمان
    PASSWORD_MIN_LENGTH: 6,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000
};

// ===== إدارة البيانات المحلية =====
class LocalStorageManager {
    static getUsers() {
        try {
            const users = localStorage.getItem('iraqi_chat_users');
            return users ? JSON.parse(users) : [];
        } catch {
            return [];
        }
    }
    
    static saveUsers(users) {
        try {
            localStorage.setItem('iraqi_chat_users', JSON.stringify(users));
            return true;
        } catch {
            return false;
        }
    }
    
    static getChats() {
        try {
            const chats = localStorage.getItem('iraqi_chat_chats');
            return chats ? JSON.parse(chats) : {};
        } catch {
            return {};
        }
    }
    
    static saveChats(chats) {
        try {
            localStorage.setItem('iraqi_chat_chats', JSON.stringify(chats));
            return true;
        } catch {
            return false;
        }
    }
    
    static getCurrentUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }
    
    static saveCurrentUser(user) {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        } catch {
            return false;
        }
    }
    
    static clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }
    
    static getSettings() {
        try {
            const settings = localStorage.getItem('app_settings');
            return settings ? JSON.parse(settings) : APP_CONFIG;
        } catch {
            return APP_CONFIG;
        }
    }
    
    static saveSettings(settings) {
        try {
            localStorage.setItem('app_settings', JSON.stringify(settings));
            return true;
        } catch {
            return false;
        }
    }
}

// ===== وظائف المساعدة =====
const Helpers = {
    generateAvatar: (seed, style = 'avataaars') => {
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    },
    
    formatTime: (timestamp) => {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // أقل من دقيقة
        if (diff < 60000) {
            return 'الآن';
        }
        
        // أقل من ساعة
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `قبل ${minutes} دقيقة`;
        }
        
        // اليوم
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('ar-EG', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        // الأمس
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'أمس';
        }
        
        // أقل من أسبوع
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            return days[date.getDay()];
        }
        
        // أكثر من أسبوع
        return date.toLocaleDateString('ar-EG');
    },
    
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePassword: (password) => {
        return password.length >= 6;
    },
    
    truncateText: (text, maxLength = 50) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
};

// ===== إدارة التطبيق =====
class IraqiChatApp {
    constructor() {
        this.currentUser = null;
        this.currentChat = null;
        this.ws = null;
        this.isConnected = false;
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🚀 تهيئة تطبيق دردشة العراق...');
        
        // تحميل الإعدادات
        this.settings = LocalStorageManager.getSettings();
        
        // التحقق من تسجيل الدخول السابق
        this.currentUser = LocalStorageManager.getCurrentUser();
        if (this.currentUser) {
            this.updateUserInterface();
        }
        
        // تهيئة البيانات المحلية
        await this.initializeLocalData();
        
        // إعداد الأحداث
        this.setupEventListeners();
        
        // محاولة الاتصال بالسيرفر
        this.connectToServer();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
    }
    
    async initializeLocalData() {
        // إنشاء بيانات تجريبية إذا لم تكن موجودة
        const users = LocalStorageManager.getUsers();
        if (users.length === 0) {
            const mockUsers = [
                {
                    id: 'user_1',
                    name: 'أحمد العراقي',
                    username: 'ahmediraqi',
                    email: 'ahmed@iraqichat.com',
                    password: '123456',
                    avatar: Helpers.generateAvatar('Ahmed'),
                    bio: 'أحب السفر والتكنولوجيا',
                    age: 28,
                    city: 'بغداد',
                    is_online: true,
                    is_admin: false,
                    created_at: new Date().toISOString()
                },
                {
                    id: 'user_2',
                    name: 'سارة الكاظمي',
                    username: 'sarakadhimi',
                    email: 'sara@iraqichat.com',
                    password: '123456',
                    avatar: Helpers.generateAvatar('Sara'),
                    bio: 'مهندسة ورسامة هواية',
                    age: 25,
                    city: 'البصرة',
                    is_online: true,
                    is_admin: false,
                    created_at: new Date().toISOString()
                },
                {
                    id: 'user_admin',
                    name: 'المشرف الرئيسي',
                    username: 'admin',
                    email: 'admin@iraqichat.com',
                    password: 'admin123',
                    avatar: Helpers.generateAvatar('Admin'),
                    bio: 'مدير النظام',
                    age: 35,
                    city: 'بغداد',
                    is_online: true,
                    is_admin: true,
                    created_at: new Date().toISOString()
                }
            ];
            
            LocalStorageManager.saveUsers(mockUsers);
            console.log('📝 تم إنشاء بيانات تجريبية');
        }
    }
    
    async connectToServer() {
        try {
            // محاولة الاتصال بالسيرفر
            const response = await fetch(`${APP_CONFIG.SERVER_URL}/api/health`);
            if (response.ok) {
                console.log('✅ السيرفر متصل');
                this.showNotification('نجاح', 'تم الاتصال بالسيرفر', 'success');
                this.updateConnectionStatus('connected');
                
                // محاولة الاتصال بـ WebSocket
                this.connectWebSocket();
            } else {
                console.log('⚠️ السيرفر غير متصل، استخدام البيانات المحلية');
                this.showNotification('معلومة', 'جاري استخدام البيانات المحلية', 'info');
                this.updateConnectionStatus('disconnected');
            }
        } catch (error) {
            console.log('⚠️ لا يمكن الاتصال بالسيرفر:', error.message);
            this.showNotification('تحذير', 'لا يمكن الاتصال بالسيرفر - استخدام البيانات المحلية', 'warning');
            this.updateConnectionStatus('disconnected');
        }
    }
    
    connectWebSocket() {
        try {
            this.ws = new WebSocket(APP_CONFIG.WS_URL);
            
            this.ws.onopen = () => {
                console.log('🔌 تم الاتصال بـ WebSocket');
                this.isConnected = true;
                this.updateConnectionStatus('connected');
                
                // إرسال مصادقة إذا كان المستخدم مسجل الدخول
                if (this.currentUser) {
                    this.sendWebSocketMessage({
                        action: 'auth',
                        user_id: this.currentUser.id
                    });
                }
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('❌ خطأ في معالجة رسالة WebSocket:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('🔌 تم فصل اتصال WebSocket');
                this.isConnected = false;
                this.updateConnectionStatus('disconnected');
                
                // محاولة إعادة الاتصال بعد تأخير
                setTimeout(() => {
                    this.connectWebSocket();
                }, APP_CONFIG.RECONNECT_DELAY);
            };
            
            this.ws.onerror = (error) => {
                console.error('❌ خطأ في WebSocket:', error);
                this.updateConnectionStatus('error');
            };
            
        } catch (error) {
            console.error('❌ فشل الاتصال بـ WebSocket:', error);
        }
    }
    
    sendWebSocketMessage(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
            return true;
        }
        return false;
    }
    
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'connected':
                this.showNotification('نجاح', data.data.message, 'success');
                break;
                
            case 'new_message':
                this.handleNewMessage(data.data);
                break;
                
            case 'user_status':
                this.updateUserStatus(data.data);
                break;
                
            case 'ping':
                this.sendWebSocketMessage({ type: 'pong' });
                break;
        }
    }
    
    handleNewMessage(message) {
        console.log('📩 رسالة جديدة:', message);
        
        // تحديث الواجهة إذا كانت المحادثة مفتوحة
        if (this.currentChat && this.currentChat.id === message.chat_id) {
            this.addMessageToChat(message);
        }
        
        // إظهار إشعار
        this.showNotification('رسالة جديدة', message.text, 'info');
    }
    
    updateUserStatus(data) {
        // تحديث حالة المستخدم في الواجهة
        console.log('🔄 تحديث حالة المستخدم:', data);
    }
    
    setupEventListeners() {
        // تسجيل الدخول
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // التسجيل
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // إرسال الرسالة
        document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            this.showNotification('خطأ', 'الرجاء ملء جميع الحقول', 'error');
            return;
        }
        
        if (!Helpers.validateEmail(email)) {
            this.showNotification('خطأ', 'البريد الإلكتروني غير صالح', 'error');
            return;
        }
        
        if (!Helpers.validatePassword(password)) {
            this.showNotification('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            // البحث عن المستخدم في البيانات المحلية
            const users = LocalStorageManager.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                this.showNotification('خطأ', 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
                return;
            }
            
            // حفظ بيانات المستخدم الحالي
            const userData = {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                age: user.age,
                city: user.city,
                is_admin: user.is_admin
            };
            
            LocalStorageManager.saveCurrentUser(userData);
            this.currentUser = userData;
            
            // تحديث الواجهة
            this.updateUserInterface();
            
            // إغلاق نافذة المصادقة
            this.closeAuthModal();
            
            // إظهار شاشة الدردشة
            this.showChatScreen();
            
            // إرسال مصادقة لـ WebSocket
            if (this.isConnected) {
                this.sendWebSocketMessage({
                    action: 'auth',
                    user_id: userData.id
                });
            }
            
            this.showNotification('نجاح', 'تم تسجيل الدخول بنجاح', 'success');
            
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showNotification('خطأ', 'حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }
    
    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // التحقق من البيانات
        if (!name || !username || !email || !password || !confirmPassword) {
            this.showNotification('خطأ', 'الرجاء ملء جميع الحقول', 'error');
            return;
        }
        
        if (!Helpers.validateEmail(email)) {
            this.showNotification('خطأ', 'البريد الإلكتروني غير صالح', 'error');
            return;
        }
        
        if (!Helpers.validatePassword(password)) {
            this.showNotification('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('خطأ', 'كلمتا المرور غير متطابقتين', 'error');
            return;
        }
        
        try {
            // التحقق من عدم وجود البريد الإلكتروني مسبقاً
            const users = LocalStorageManager.getUsers();
            if (users.some(u => u.email === email)) {
                this.showNotification('خطأ', 'البريد الإلكتروني مسجل مسبقاً', 'error');
                return;
            }
            
            if (users.some(u => u.username === username)) {
                this.showNotification('خطأ', 'اسم المستخدم مستخدم مسبقاً', 'error');
                return;
            }
            
            // إنشاء مستخدم جديد
            const newUser = {
                id: 'user_' + Date.now(),
                name: name,
                username: username,
                email: email,
                password: password,
                avatar: Helpers.generateAvatar(username),
                bio: 'مرحباً! أنا جديد في دردشة العراق',
                age: document.getElementById('registerAge').value || null,
                city: document.getElementById('registerCity').value || '',
                is_online: true,
                is_admin: email === 'admin@iraqichat.com',
                created_at: new Date().toISOString()
            };
            
            // حفظ المستخدم
            users.push(newUser);
            LocalStorageManager.saveUsers(users);
            
            // تسجيل الدخول تلقائياً
            const userData = {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
                bio: newUser.bio,
                age: newUser.age,
                city: newUser.city,
                is_admin: newUser.is_admin
            };
            
            LocalStorageManager.saveCurrentUser(userData);
            this.currentUser = userData;
            
            // تحديث الواجهة
            this.updateUserInterface();
            
            // إغلاق نافذة المصادقة
            this.closeAuthModal();
            
            // إظهار شاشة الدردشة
            this.showChatScreen();
            
            this.showNotification('نجاح', 'تم إنشاء الحساب بنجاح', 'success');
            
        } catch (error) {
            console.error('❌ خطأ في التسجيل:', error);
            this.showNotification('خطأ', 'حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }
    
    updateUserInterface() {
        if (!this.currentUser) return;
        
        // تحديث معلومات المستخدم في الشريط الجانبي
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userAvatar').src = this.currentUser.avatar;
        document.getElementById('userStatus').textContent = 'متصل';
        document.getElementById('userStatus').className = 'status online';
        
        // إظهار زر المشرف إذا كان مشرفاً
        if (this.currentUser.is_admin) {
            document.getElementById('adminMenuItem').style.display = 'block';
        }
        
        // تحديث الصفحة الشخصية
        this.updateProfilePage();
    }
    
    updateProfilePage() {
        const profilePage = document.getElementById('profilePage');
        if (!profilePage || !this.currentUser) return;
        
        profilePage.innerHTML = `
            <div class="page-header">
                <button class="back-btn" onclick="app.showPage('chats')">
                    <i class="fas fa-arrow-right"></i>
                </button>
                <h2>الملف الشخصي</h2>
            </div>
            <div class="page-content">
                <div class="profile-container">
                    <div class="profile-header">
                        <img src="${this.currentUser.avatar}" alt="Avatar" class="profile-avatar">
                        <h2>${this.currentUser.name}</h2>
                        <p>@${this.currentUser.username}</p>
                    </div>
                    
                    <div class="profile-info">
                        <div class="info-item">
                            <span class="info-label">البريد الإلكتروني:</span>
                            <span class="info-value">${this.currentUser.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">المدينة:</span>
                            <span class="info-value">${this.currentUser.city || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">العمر:</span>
                            <span class="info-value">${this.currentUser.age || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">نبذة:</span>
                            <span class="info-value">${this.currentUser.bio || 'لا توجد نبذة'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    async sendMessage() {
        if (!this.currentUser || !this.currentChat) {
            this.showNotification('خطأ', 'الرجاء فتح محادثة أولاً', 'error');
            return;
        }
        
        const input = document.getElementById('messageInput');
        const text = input.value.trim();
        
        if (!text) return;
        
        try {
            // إنشاء رسالة
            const message = {
                id: 'msg_' + Date.now(),
                chat_id: this.currentChat.id,
                sender_id: this.currentUser.id,
                text: text,
                type: 'text',
                timestamp: new Date().toISOString(),
                status: 'sent'
            };
            
            // إضافة الرسالة إلى الواجهة
            this.addMessageToChat(message);
            
            // إرسال عبر WebSocket إذا كان متصلاً
            if (this.isConnected) {
                this.sendWebSocketMessage({
                    action: 'message',
                    message: message
                });
            }
            
            // حفظ الرسالة محلياً
            this.saveMessageLocally(message);
            
            // مسح حقل الإدخال
            input.value = '';
            input.style.height = 'auto';
            
        } catch (error) {
            console.error('❌ خطأ في إرسال الرسالة:', error);
            this.showNotification('خطأ', 'فشل إرسال الرسالة', 'error');
        }
    }
    
    addMessageToChat(message) {
        const messagesDiv = document.getElementById('chatMessages');
        if (!messagesDiv) return;
        
        const isSent = message.sender_id === this.currentUser?.id;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
        
        const time = Helpers.formatTime(message.timestamp);
        
        messageDiv.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time">${time}</div>
        `;
        
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    saveMessageLocally(message) {
        try {
            const chats = LocalStorageManager.getChats();
            const chatId = message.chat_id;
            
            if (!chats[chatId]) {
                chats[chatId] = {
                    id: chatId,
                    participant1: this.currentUser.id,
                    participant2: this.currentChat.other_user.id,
                    messages: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            }
            
            if (!chats[chatId].messages) {
                chats[chatId].messages = [];
            }
            
            chats[chatId].messages.push(message);
            chats[chatId].updated_at = new Date().toISOString();
            
            LocalStorageManager.saveChats(chats);
            
        } catch (error) {
            console.error('❌ خطأ في حفظ الرسالة محلياً:', error);
        }
    }
    
    showNotification(title, message, type = 'info') {
        const notificationCenter = document.getElementById('notificationCenter');
        if (!notificationCenter) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationCenter.appendChild(notification);
        
        // إزالة الإشعار بعد 5 ثواني
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        if (!statusElement) return;
        
        statusElement.className = `connection-status ${status}`;
        
        switch(status) {
            case 'connected':
                statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>متصل بالخادم</span>';
                break;
            case 'disconnected':
                statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i><span>غير متصل</span>';
                break;
            case 'error':
                statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>خطأ في الاتصال</span>';
                break;
            default:
                statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>جاري الاتصال...</span>';
        }
    }
    
    showChatScreen() {
        document.querySelector('.welcome-screen').classList.remove('active');
        document.getElementById('chatScreen').style.display = 'flex';
    }
    
    closeAuthModal() {
        document.getElementById('authModal').classList.remove('show');
    }
    
    showPage(page) {
        // إخفاء جميع الصفحات
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
        });
        
        document.querySelector('.welcome-screen').classList.remove('active');
        document.getElementById('chatScreen').style.display = 'none';
        
        // إظهار الصفحة المطلوبة
        switch(page) {
            case 'chats':
                document.querySelector('.welcome-screen').classList.add('active');
                break;
            case 'chat':
                document.getElementById('chatScreen').style.display = 'flex';
                break;
            case 'profile':
                document.getElementById('profilePage').style.display = 'block';
                break;
            case 'contacts':
                document.getElementById('contactsPage').style.display = 'block';
                break;
        }
    }
    
    logout() {
        // مسح بيانات المستخدم الحالي
        LocalStorageManager.clearCurrentUser();
        this.currentUser = null;
        
        // إغلاق اتصال WebSocket
        if (this.ws) {
            this.ws.close();
        }
        
        // إعادة تحميل الصفحة
        location.reload();
    }
}

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', () => {
    // إنشاء تطبيق جديد
    window.app = new IraqiChatApp();
    
    // جعل الدوال متاحة عالمياً
    window.toggleLanguageMenu = () => {
        const menu = document.getElementById('languageMenu');
        const current = document.querySelector('.current-language');
        menu.classList.toggle('show');
        current.classList.toggle('active');
    };
    
    window.changeLanguage = (lang) => {
        localStorage.setItem('chat_language', lang);
        location.reload();
    };
    
    window.toggleUserMenu = () => {
        document.getElementById('userMenu').classList.toggle('show');
    };
    
    window.logout = () => {
        window.app?.logout();
    };
    
    window.showPage = (page) => {
        window.app?.showPage(page);
    };
    
    window.closeChat = () => {
        document.getElementById('chatScreen').style.display = 'none';
        document.querySelector('.welcome-screen').classList.add('active');
    };
    
    window.startChatWith = (userId) => {
        // بدء محادثة جديدة (وهمي)
        const user = {
            id: userId,
            name: 'أحمد العراقي',
            avatar: Helpers.generateAvatar('Ahmed'),
            is_online: true
        };
        
        window.app.currentChat = {
            id: 'chat_' + userId + '_' + window.app.currentUser?.id,
            other_user: user
        };
        
        // تحديث واجهة الدردشة
        document.getElementById('chatUserName').textContent = user.name;
        document.getElementById('chatAvatar').src = user.avatar;
        document.getElementById('chatUserStatus').textContent = user.is_online ? 'متصل' : 'غير متصل';
        document.getElementById('chatUserStatus').className = `status ${user.is_online ? 'online' : 'offline'}`;
        
        // إظهار شاشة الدردشة
        window.app.showPage('chat');
    };
    
    window.sendMessage = () => {
        window.app?.sendMessage();
    };
    
    window.autoResize = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };
    
    window.handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            window.app?.sendMessage();
        }
    };
    
    window.showAuthModal = (type) => {
        const modal = document.getElementById('authModal');
        modal.classList.add('show');
        switchAuthTab(type);
    };
    
    window.closeAuthModal = () => {
        document.getElementById('authModal').classList.remove('show');
    };
    
    window.switchAuthTab = (tabName) => {
        // أزرار التبويب
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // النماذج
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(tabName + 'Form').classList.add('active');
        
        // العنوان
        document.getElementById('modalTitle').textContent = 
            tabName === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب';
    };
    
    window.togglePassword = (inputId) => {
        const input = document.getElementById(inputId);
        const icon = input.nextElementSibling?.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.className = 'far fa-eye-slash';
        } else {
            input.type = 'password';
            if (icon) icon.className = 'far fa-eye';
        }
    };
    
    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            document.getElementById('languageMenu').classList.remove('show');
            document.querySelector('.current-language').classList.remove('active');
        }
        
        if (!e.target.closest('.user-profile')) {
            document.getElementById('userMenu').classList.remove('show');
        }
    });
    
    console.log('🎉 تطبيق دردشة العراق جاهز للاستخدام!');
});
