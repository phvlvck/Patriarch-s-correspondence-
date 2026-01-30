// ===== إعدادات السيرفر =====
// اختر واحداً من هذه الروابط حسب مكان تشغيل السيرفر

// 1. للتشغيل المحلي على نفس الجهاز:
const SERVER_CONFIG = {
    WS_URL: 'ws://localhost:8080/ws',
    API_URL: 'http://localhost:8080/api',
    SERVER_URL: 'http://localhost:8080'
};

 2. للتشغيل على شبكة محلية (لوصل جهازين):
 const SERVER_CONFIG = {
     WS_URL: 'ws://192.168.1.100:8080/ws',  // ضع IP جهاز السيرفر
     API_URL: 'http://192.168.1.100:8080/api',
     SERVER_URL: 'http://192.168.1.100:8080'
 };

 //3. للسيرفر المنشور على Render.com:
// const SERVER_CONFIG = {
//     WS_URL: 'wss://iraqi-chat.onrender.com/ws',
//     API_URL: 'https://iraqi-chat.onrender.com/api',
//     SERVER_URL: 'https://iraqi-chat.onrender.com'
// };

// 4. للسيرفر المنشور على PythonAnywhere:
 //const SERVER_CONFIG = {
    // WS_URL: 'wss://username.pythonanywhere.com/ws',
 //    API_URL: 'https://username.pythonanywhere.com/api',
 //    SERVER_URL: 'https://username.pythonanywhere.com'
// };

// ===== إعدادات التطبيق =====
const APP_CONFIG = {
    // إعدادات الدردشة
    MESSAGE_LIMIT: 100,               // عدد الرسائل الأقصى في المحادثة
    TYPING_TIMEOUT: 3000,             // وقت عرض "يكتب..." بالمللي ثانية
    RECONNECT_DELAY: 5000,            // وقت إعادة الاتصال عند فصله
    
    // إعدادات المستخدم
    AVATAR_PROVIDER: 'dicebear',      // 'dicebear' أو 'gravatar'
    DEFAULT_AVATAR: 'avataaars',      // نمط الصورة الافتراضي
    MAX_FILE_SIZE: 5 * 1024 * 1024,   // الحد الأقصى لحجم الملف (5MB)
    
    // إعدادات الواجهة
    THEME: 'dark',                    // 'dark' أو 'light'
    LANGUAGE: 'ar',                   // 'ar' أو 'en' أو 'ku'
    NOTIFICATIONS: true,              // تفعيل الإشعارات
    SOUNDS: true,                     // تفعيل الأصوات
    
    // إعدادات الأمان
    PASSWORD_MIN_LENGTH: 6,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 ساعة
    MAX_LOGIN_ATTEMPTS: 5
};

// ===== بيانات تجريبية للمستخدمين =====
const MOCK_USERS = [
    {
        id: '1',
        name: 'أحمد العراقي',
        username: '@ahmediraqi',
        email: 'ahmed@iraqichat.com',
        password: '123456',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
        bio: 'أحب السفر والتكنولوجيا',
        age: 28,
        city: 'بغداد',
        is_online: true,
        is_admin: false
    },
    {
        id: '2',
        name: 'سارة الكاظمي',
        username: '@sarakadhimi',
        email: 'sara@iraqichat.com',
        password: '123456',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
        bio: 'مهندسة ورسامة هواية',
        age: 25,
        city: 'البصرة',
        is_online: true,
        is_admin: false
    },
    {
        id: '3',
        name: 'مصطفى النجفي',
        username: '@mustafanajafi',
        email: 'mustafa@iraqichat.com',
        password: '123456',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mustafa',
        bio: 'طبيب متخصص',
        age: 35,
        city: 'النجف',
        is_online: false,
        is_admin: false
    },
    {
        id: '4',
        name: 'زهراء البغدادية',
        username: '@zahrabaghdadi',
        email: 'zahra@iraqichat.com',
        password: '123456',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra',
        bio: 'معلمة وكاتبة',
        age: 30,
        city: 'بغداد',
        is_online: true,
        is_admin: false
    },
    {
        id: '5',
        name: 'المشرف الرئيسي',
        username: '@admin',
        email: 'admin@iraqichat.com',
        password: 'admin123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        bio: 'مدير النظام',
        age: 40,
        city: 'بغداد',
        is_online: true,
        is_admin: true
    }
];

// ===== المدن العراقية =====
const IRAQI_CITIES = [
    'بغداد', 'البصرة', 'الموصل', 'أربيل', 'السليمانية',
    'كربلاء', 'النجف', 'بابل', 'واسط', 'صلاح الدين',
    'ديالى', 'ذي قار', 'ميسان', 'القادسية', 'المثنى',
    'الأنبار', 'نينوى', 'دهوك', 'كركوك', 'حلبجة'
];

// ===== قائمة الرموز التعبيرية =====
const EMOJIS = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
    hands: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    flags: ['🇮🇶', '🇸🇦', '🇦🇪', '🇰🇼', '🇶🇦', '🇧🇭', '🇴🇲', '🇯🇴', '🇸🇾', '🇱🇧', '🇪🇬', '🇵🇸']
};

// ===== وظائف المساعدة =====
const Helpers = {
    // توليد الصورة الشخصية
    generateAvatar: (seed, style = 'avataaars') => {
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    },
    
    // تنسيق الوقت
    formatTime: (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        }
        
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'أمس';
        }
        
        if ((now - date) < 7 * 24 * 60 * 60 * 1000) {
            const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            return days[date.getDay()];
        }
        
        return date.toLocaleDateString('ar-EG');
    },
    
    // تنسيق التاريخ
    formatDate: (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // تقصير النص
    truncateText: (text, maxLength = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    // التحقق من صحة البريد الإلكتروني
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // تحويل الحجم
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 بايت';
        const k = 1024;
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// ===== اتصال WebSocket =====
class WebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.listeners = new Map();
    }
    
    connect() {
        try {
            this.ws = new WebSocket(SERVER_CONFIG.WS_URL);
            
            this.ws.onopen = () => {
                console.log('✅ تم الاتصال بـ WebSocket');
                this.reconnectAttempts = 0;
                this.emit('connected');
                
                // إرسال المصادقة إذا كان هناك مستخدم مسجل الدخول
                const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
                if (user) {
                    this.send({
                        action: 'auth',
                        user_id: user.id
                    });
                }
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.emit('message', data);
                    
                    // معالجة أنواع الرسائل المختلفة
                    switch(data.type) {
                        case 'new_message':
                            this.emit('new_message', data.data);
                            break;
                        case 'user_status':
                            this.emit('user_status', data.data);
                            break;
                        case 'typing':
                            this.emit('typing', data.data);
                            break;
                        case 'connected':
                            this.emit('server_connected', data.data);
                            break;
                    }
                } catch (error) {
                    console.error('❌ خطأ في معالجة رسالة WebSocket:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('🔌 تم فصل اتصال WebSocket');
                this.emit('disconnected');
                
                // إعادة الاتصال بعد تأخير
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        console.log(`🔄 محاولة إعادة الاتصال (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                        this.connect();
                    }, delay);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('❌ خطأ في WebSocket:', error);
                this.emit('error', error);
            };
            
        } catch (error) {
            console.error('❌ فشل إنشاء اتصال WebSocket:', error);
        }
    }
    
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
            return true;
        } else {
            console.warn('⚠️ WebSocket غير متصل');
            return false;
        }
    }
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ خطأ في مستمع ${event}:`, error);
                }
            });
        }
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// ===== مدير API =====
class APIManager {
    constructor() {
        this.baseURL = SERVER_CONFIG.API_URL;
    }
    
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `خطأ ${response.status}`);
            }
            
            return data;
            
        } catch (error) {
            console.error(`❌ خطأ في API ${endpoint}:`, error);
            throw error;
        }
    }
    
    // تسجيل مستخدم جديد
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    
    // تسجيل الدخول
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
    
    // البحث عن مستخدمين
    async searchUsers(query, excludeId = null) {
        let url = `/users/search?q=${encodeURIComponent(query)}`;
        if (excludeId) url += `&exclude_id=${excludeId}`;
        return this.request(url);
    }
    
    // الحصول على محادثات المستخدم
    async getUserChats(userId) {
        return this.request(`/chats?user_id=${userId}`);
    }
    
    // إنشاء محادثة جديدة
    async createChat(user1Id, user2Id) {
        return this.request('/chats', {
            method: 'POST',
            body: JSON.stringify({ user1_id: user1Id, user2_id: user2Id })
        });
    }
    
    // الحصول على رسائل المحادثة
    async getChatMessages(chatId, userId, limit = 100) {
        return this.request(`/chats/${chatId}/messages?user_id=${userId}&limit=${limit}`);
    }
    
    // إرسال رسالة
    async sendMessage(chatId, senderId, text, type = 'text') {
        return this.request('/messages', {
            method: 'POST',
            body: JSON.stringify({
                chat_id: chatId,
                sender_id: senderId,
                text: text,
                type: type
            })
        });
    }
    
    // تحديث حالة القراءة
    async markAsRead(chatId, userId) {
        return this.request(`/messages/${chatId}/read`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId })
        });
    }
    
    // الحصول على إحصائيات المشرف
    async getAdminStats(userId) {
        return this.request(`/admin/stats?user_id=${userId}`);
    }
    
    // الحصول على قائمة المستخدمين للمشرف
    async getAdminUsers(adminId) {
        return this.request(`/admin/users?admin_id=${adminId}`);
    }
    
    // فحص صحة السيرفر
    async checkHealth() {
        return this.request('/health');
    }
}

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تشغيل تطبيق دردشة العراق');
    
    // إنشاء المديرين
    window.wsManager = new WebSocketManager();
    window.apiManager = new APIManager();
    
    // اختبار اتصال السيرفر
    async function testServerConnection() {
        try {
            const health = await apiManager.checkHealth();
            console.log('✅ اتصال السيرفر نشط:', health);
            return true;
        } catch (error) {
            console.error('❌ فشل الاتصال بالسيرفر:', error);
            
            // استخدام البيانات التجريبية إذا فشل الاتصال
            console.log('🔄 استخدام البيانات التجريبية...');
            initializeMockData();
            return false;
        }
    }
    
    // تهيئة البيانات التجريبية
    function initializeMockData() {
        // حفظ المستخدمين التجريبيين
        localStorage.setItem('iraqi_chat_users', JSON.stringify(MOCK_USERS));
        
        // إنشاء محادثات تجريبية
        const mockChats = {
            'chat_1_5': {
                id: 'chat_1_5',
                participant1: '1',
                participant2: '5',
                messages: [
                    {
                        id: '1',
                        sender_id: '1',
                        text: 'مرحباً يا مشرف، كيف الحال؟',
                        timestamp: new Date().toISOString(),
                        status: 'read'
                    },
                    {
                        id: '2',
                        sender_id: '5',
                        text: 'أهلاً أحمد، كل شيء بخير الحمد لله! كيف يمكنني مساعدتك؟',
                        timestamp: new Date().toISOString(),
                        status: 'read'
                    }
                ],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        };
        
        localStorage.setItem('iraqi_chat_chats', JSON.stringify(mockChats));
        
        // إظهار رسالة للمستخدم
        if (AppState && AppState.showNotification) {
            AppState.showNotification('معلومة', 'جاري استخدام البيانات التجريبية', 'info');
        }
    }
    
    // بدء اتصال WebSocket
    function startWebSocket() {
        wsManager.connect();
        
        // إضافة المستمعين للأحداث
        wsManager.on('connected', () => {
            console.log('🎉 WebSocket متصل بنجاح');
            if (AppState && AppState.updateConnectionStatus) {
                AppState.updateConnectionStatus('connected');
            }
        });
        
        wsManager.on('disconnected', () => {
            console.log('⚠️ WebSocket مقطوع');
            if (AppState && AppState.updateConnectionStatus) {
                AppState.updateConnectionStatus('disconnected');
            }
        });
        
        wsManager.on('new_message', (message) => {
            console.log('📩 رسالة جديدة:', message);
            
            // معالجة الرسالة الجديدة
            if (AppState && AppState.handleIncomingMessage) {
                AppState.handleIncomingMessage(message);
            }
        });
        
        wsManager.on('user_status', (status) => {
            console.log('📊 تحديث حالة مستخدم:', status);
            
            // تحديث حالة المستخدم
            if (AppState && AppState.updateUserStatus) {
                AppState.updateUserStatus(status);
            }
        });
    }
    
    // اختبار الاتصال ثم بدء التطبيق
    testServerConnection().then(isConnected => {
        if (isConnected) {
            startWebSocket();
        }
        
        // تهيئة LanguageManager إذا كان موجوداً
        if (window.LanguageManager) {
            LanguageManager.init();
        }
        
        // تهيئة AppState إذا كان موجوداً
        if (window.AppState) {
            AppState.init();
        }
    });
    
    // إضافة المدن العراقية لقائمة الاختيار
    function populateCities() {
        const citySelect = document.getElementById('registerCity');
        if (citySelect) {
            IRAQI_CITIES.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    }
    
    // استدعاء وظائف التهيئة
    populateCities();
    
    // إظهار معلومات التشغيل
    console.log('⚙️ إعدادات السيرفر:', SERVER_CONFIG);
    console.log('🎨 إعدادات التطبيق:', APP_CONFIG);
    console.log('👥 المستخدمون التجريبيون:', MOCK_USERS.length);
    console.log('🏙️ المدن العراقية:', IRAQI_CITIES.length);
});

// ===== تصدير المتغيرات للاستخدام العام =====
window.SERVER_CONFIG = SERVER_CONFIG;
window.APP_CONFIG = APP_CONFIG;
window.MOCK_USERS = MOCK_USERS;
window.IRAQI_CITIES = IRAQI_CITIES;
window.EMOJIS = EMOJIS;
window.Helpers = Helpers;

console.log('✅ تم تحميل إعدادات تطبيق دردشة العراق');            this.showNotification('خطأ', 'البريد الإلكتروني مسجل مسبقاً', 'error');
            return;
        }
        
        if (this.users.some(u => u.username === username)) {
            this.showNotification('خطأ', 'اسم المستخدم مستخدم مسبقاً', 'error');
            return;
        }
        
