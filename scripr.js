// ===== إعدادات السيرفر =====
// اختر واحداً من هذه الروابط حسب مكان تشغيل السيرفر

// 1. للتشغيل المحلي على نفس الجهاز (الأفضل للتجربة):
const SERVER_CONFIG = {
    WS_URL: 'ws://localhost:8080/ws',
    API_URL: 'http://localhost:8080/api',
    SERVER_URL: 'http://localhost:8080'
};

// 2. للتشغيل على شبكة محلية (جهازين مختلفين):
// const SERVER_CONFIG = {
//     WS_URL: 'ws://192.168.1.100:8080/ws',  // ضع IP جهاز السيرفر
//     API_URL: 'http://192.168.1.100:8080/api',
//     SERVER_URL: 'http://192.168.1.100:8080'
// };

// 3. للتشغيل على Termux (جوال):
// const SERVER_CONFIG = {
//     WS_URL: 'ws://127.0.0.1:8080/ws',
//     API_URL: 'http://127.0.0.1:8080/api',
//     SERVER_URL: 'http://127.0.0.1:8080'
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
            
            if (!response.ok) {
                throw new Error(`خطأ ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`❌ خطأ في API ${endpoint}:`, error);
            
            // في حالة فشل الاتصال، استخدم البيانات المحلية
            if (endpoint === '/auth/login') {
                return this.mockLogin(options.body);
            } else if (endpoint === '/auth/register') {
                return this.mockRegister(options.body);
            }
            
            throw error;
        }
    }
    
    // تسجيل مستخدم جديد (نسخة محلية)
    async mockRegister(body) {
        try {
            const userData = JSON.parse(body);
            
            // التحقق من البريد الإلكتروني
            const users = JSON.parse(localStorage.getItem('iraqi_chat_users') || '[]');
            if (users.some(u => u.email === userData.email)) {
                return { success: false, error: "البريد الإلكتروني مسجل مسبقاً" };
            }
            
            if (users.some(u => u.username === userData.username)) {
                return { success: false, error: "اسم المستخدم مستخدم مسبقاً" };
            }
            
            // إنشاء مستخدم جديد
            const newUser = {
                id: 'user_' + Date.now(),
                name: userData.name,
                username: userData.username,
                email: userData.email,
                password: userData.password,
                avatar: Helpers.generateAvatar(userData.username),
                bio: userData.bio || 'مرحباً! أنا جديد في دردشة العراق',
                age: userData.age || null,
                city: userData.city || '',
                is_online: true,
                is_admin: userData.email === 'admin@iraqichat.com',
                created_at: new Date().toISOString()
            };
            
            // حفظ المستخدم
            users.push(newUser);
            localStorage.setItem('iraqi_chat_users', JSON.stringify(users));
            
            return {
                success: true,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    username: newUser.username,
                    email: newUser.email,
                    avatar: newUser.avatar,
                    bio: newUser.bio,
                    age: newUser.age,
                    city: newUser.city,
                    is_admin: newUser.is_admin
                },
                message: "تم إنشاء الحساب بنجاح"
            };
            
        } catch (error) {
            console.error('❌ خطأ في التسجيل المحلي:', error);
            return { success: false, error: "حدث خطأ أثناء التسجيل" };
        }
    }
    
    // تسجيل الدخول (نسخة محلية)
    async mockLogin(body) {
        try {
            const { email, password } = JSON.parse(body);
            
            // البحث عن المستخدم
            const users = JSON.parse(localStorage.getItem('iraqi_chat_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
            }
            
            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    age: user.age,
                    city: user.city,
                    is_admin: user.is_admin
                },
                token: user.id,
                message: "تم تسجيل الدخول بنجاح"
            };
            
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول المحلي:', error);
            return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" };
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
        
        try {
            return await this.request(url);
        } catch {
            // استخدام البيانات المحلية
            const users = JSON.parse(localStorage.getItem('iraqi_chat_users') || '[]');
            const filtered = users.filter(user => {
                if (user.id === excludeId) return false;
                if (!query) return true;
                
                const searchLower = query.toLowerCase();
                return user.name.toLowerCase().includes(searchLower) ||
                       user.username.toLowerCase().includes(searchLower) ||
                       user.bio?.toLowerCase().includes(searchLower) ||
                       user.city?.toLowerCase().includes(searchLower);
            });
            
            return {
                success: true,
                users: filtered.map(user => ({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar,
                    bio: user.bio,
                    city: user.city,
                    is_online: user.is_online,
                    last_seen: user.last_seen
                }))
            };
        }
    }
    
    // الحصول على محادثات المستخدم
    async getUserChats(userId) {
        try {
            return await this.request(`/chats?user_id=${userId}`);
        } catch {
            // استخدام البيانات المحلية
            const chats = JSON.parse(localStorage.getItem('iraqi_chat_chats') || '{}');
            const userChats = [];
            
            for (const chatId in chats) {
                const chat = chats[chatId];
                if (chat.participant1 === userId || chat.participant2 === userId) {
                    const otherUserId = chat.participant1 === userId ? chat.participant2 : chat.participant1;
                    const users = JSON.parse(localStorage.getItem('iraqi_chat_users') || '[]');
                    const otherUser = users.find(u => u.id === otherUserId);
                    
                    if (otherUser) {
                        userChats.push({
                            id: chatId,
                            other_user: {
                                id: otherUser.id,
                                name: otherUser.name,
                                avatar: otherUser.avatar,
                                is_online: otherUser.is_online
                            },
                            unread_count: 0,
                            last_message: chat.messages?.[chat.messages.length - 1]?.text || 'ابدأ المحادثة...',
                            last_message_time: chat.messages?.[chat.messages.length - 1]?.timestamp,
                            updated_at: chat.updated_at
                        });
                    }
                }
            }
            
            return { success: true, chats: userChats };
        }
    }
    
    // إنشاء محادثة جديدة
    async createChat(user1Id, user2Id) {
        try {
            return await this.request('/chats', {
                method: 'POST',
                body: JSON.stringify({ user1_id: user1Id, user2_id: user2Id })
            });
        } catch {
            // إنشاء محادثة محلية
            const participants = [user1Id, user2Id].sort();
            const chatId = `chat_${participants[0]}_${participants[1]}`;
            
            const chats = JSON.parse(localStorage.getItem('iraqi_chat_chats') || '{}');
            if (!chats[chatId]) {
                chats[chatId] = {
                    id: chatId,
                    participant1: participants[0],
                    participant2: participants[1],
                    messages: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                localStorage.setItem('iraqi_chat_chats', JSON.stringify(chats));
            }
            
            return { success: true, chat_id: chatId, message: "تم إنشاء المحادثة" };
        }
    }
    
    // الحصول على رسائل المحادثة
    async getChatMessages(chatId, userId, limit = 100) {
        try {
            return await this.request(`/chats/${chatId}/messages?user_id=${userId}&limit=${limit}`);
        } catch {
            // استخدام البيانات المحلية
            const chats = JSON.parse(localStorage.getItem('iraqi_chat_chats') || '{}');
            const chat = chats[chatId];
            
            if (!chat) {
                return { success: false, error: "المحادثة غير موجودة" };
            }
            
            const messages = (chat.messages || []).slice(-limit).map(msg => ({
                ...msg,
                sender_name: 'مستخدم',
                sender_avatar: Helpers.generateAvatar(msg.sender_id)
            }));
            
            return { success: true, messages };
        }
    }
    
    // إرسال رسالة
    async sendMessage(chatId, senderId, text, type = 'text') {
        try {
            return await this.request('/messages', {
                method: 'POST',
                body: JSON.stringify({
                    chat_id: chatId,
                    sender_id: senderId,
                    text: text,
                    type: type
                })
            });
        } catch {
            // حفظ الرسالة محلياً
            const chats = JSON.parse(localStorage.getItem('iraqi_chat_chats') || '{}');
            const chat = chats[chatId];
            
            if (chat) {
                const message = {
                    id: 'msg_' + Date.now(),
                    chat_id: chatId,
                    sender_id: senderId,
                    text: text,
                    type: type,
                    timestamp: new Date().toISOString(),
                    status: 'sent'
                };
                
                if (!chat.messages) chat.messages = [];
                chat.messages.push(message);
                chat.updated_at = new Date().toISOString();
                
                localStorage.setItem('iraqi_chat_chats', JSON.stringify(chats));
                
                return { success: true, message };
            }
            
            return { success: false, error: "المحادثة غير موجودة" };
        }
    }
    
    // فحص صحة السيرفر
    async checkHealth() {
        try {
            return await this.request('/health');
        } catch {
            // حالة السيرفر المحلي
            return {
                status: "ok",
                timestamp: new Date().toISOString(),
                server: "Iraqi Chat Server (Local)",
                version: "1.0.0",
                online_users: 0,
                database: "LocalStorage",
                stats: {
                    total_users: MOCK_USERS.length,
                    online_users: MOCK_USERS.filter(u => u.is_online).length,
                    total_chats: 1,
                    total_messages: 2
                }
            };
        }
    }
}

// ===== تهيئة البيانات المحلية =====
function initializeLocalData() {
    console.log('🔄 تهيئة البيانات المحلية...');
    
    // تحميل المستخدمين إذا لم يكونوا موجودين
    if (!localStorage.getItem('iraqi_chat_users')) {
        localStorage.setItem('iraqi_chat_users', JSON.stringify(MOCK_USERS));
        console.log('✅ تم تحميل المستخدمين التجريبيين');
    }
    
    // تحميل المحادثات إذا لم تكن موجودة
    if (!localStorage.getItem('iraqi_chat_chats')) {
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
        console.log('✅ تم تحميل المحادثات التجريبية');
    }
    
    // تحميل الإعدادات
    if (!localStorage.getItem('app_settings')) {
        localStorage.setItem('app_settings', JSON.stringify({
            theme: 'dark',
            language: 'ar',
            notifications: true,
            sounds: true
        }));
    }
}

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تشغيل تطبيق دردشة العراق');
    
    // تهيئة البيانات المحلية
    initializeLocalData();
    
    // إنشاء المديرين
    window.wsManager = new WebSocketManager();
    window.apiManager = new APIManager();
    
    // اختبار اتصال السيرفر
    async function testServerConnection() {
        try {
            const health = await apiManager.checkHealth();
            console.log('✅ حالة السيرفر:', health);
            
            if (health.status === 'ok') {
                console.log('🌐 السيرفر متصل:', health.server);
                showNotification('نجاح', 'تم الاتصال بالسيرفر بنجاح', 'success');
                return true;
            } else {
                console.log('⚠️ السيرفر يعمل محلياً');
                showNotification('معلومة', 'جاري استخدام البيانات المحلية', 'info');
                return false;
            }
        } catch (error) {
            console.error('❌ فشل الاتصال بالسيرفر:', error);
            console.log('🔄 استخدام البيانات المحلية...');
            showNotification('تحذير', 'تعذر الاتصال بالسيرفر - استخدام البيانات المحلية', 'warning');
            return false;
        }
    }
    
    // بدء اتصال WebSocket
    function startWebSocket() {
        try {
            wsManager.connect();
            
            wsManager.on('connected', () => {
                console.log('🎉 WebSocket متصل بنجاح');
                showNotification('نجاح', 'تم الاتصال بالدردشة المباشرة', 'success');
                
                // تحديث حالة الاتصال
                updateConnectionStatus('connected');
            });
            
            wsManager.on('disconnected', () => {
                console.log('⚠️ WebSocket مقطوع');
                showNotification('تحذير', 'فقد الاتصال بالدردشة المباشرة', 'warning');
                
                // تحديث حالة الاتصال
                updateConnectionStatus('disconnected');
            });
            
            wsManager.on('new_message', (message) => {
                console.log('📩 رسالة جديدة:', message);
                
                // معالجة الرسالة الجديدة
                handleIncomingMessage(message);
            });
            
        } catch (error) {
            console.error('❌ فشل بدء WebSocket:', error);
        }
    }
    
    // تحديث حالة الاتصال
    function updateConnectionStatus(status) {
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
            default:
                statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>جاري الاتصال...</span>';
        }
    }
    
    // معالجة الرسائل الواردة
    function handleIncomingMessage(message) {
        // هنا سيتم معالجة الرسائل الواردة
        console.log('💬 رسالة واردة:', message);
        
        // إظهار إشعار
        showNotification('رسالة جديدة', message.text, 'info');
    }
    
    // إظهار إشعار
    function showNotification(title, message, type = 'info') {
        const notificationCenter = document.getElementById('notificationCenter');
        if (!notificationCenter) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationCenter.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
    
    // اختبار الاتصال ثم بدء التطبيق
    testServerConnection().then(isConnected => {
        if (isConnected) {
            startWebSocket();
        }
        
        // تحميل المدن العراقية
        populateCities();
        
        // إخفاء شاشة التحميل
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const app = document.getElementById('app');
            
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (app) app.style.display = 'flex';
                    
                    // التحقق من تسجيل الدخول
                    checkUserAuth();
                }, 500);
            }
        }, 1000);
    });
    
    // تحميل المدن العراقية
    function populateCities() {
        const citySelect = document.getElementById('registerCity');
        if (citySelect) {
            // إضافة الخيار الأول
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'اختر المدينة';
            citySelect.appendChild(defaultOption);
            
            // إضافة المدن
            IRAQI_CITIES.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    }
    
    // التحقق من تسجيل الدخول
    function checkUserAuth() {
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                console.log('👤 المستخدم مسجل الدخول:', user.name);
                
                // تحديث واجهة المستخدم
                updateUserInterface(user);
                
                // إظهار شاشة الدردشة
                showChatScreen();
                
            } catch (error) {
                console.error('❌ خطأ في بيانات المستخدم:', error);
                localStorage.removeItem('currentUser');
                showWelcomeScreen();
            }
        } else {
            console.log('👤 لا يوجد مستخدم مسجل الدخول');
            showWelcomeScreen();
        }
    }
    
    // تحديث واجهة المستخدم
    function updateUserInterface(user) {
        // تحديث صورة المستخدم
        const avatarElement = document.getElementById('userAvatar');
        if (avatarElement && user.avatar) {
            avatarElement.src = user.avatar;
        }
        
        // تحديث الاسم
        const nameElement = document.getElementById('userName');
        if (nameElement) {
            nameElement.textContent = user.name;
        }
        
        // تحديث حالة الاتصال
        const statusElement = document.getElementById('userStatus');
        if (statusElement) {
            statusElement.textContent = 'متصل';
            statusElement.className = 'status online';
        }
        
        // إظهار زر المشرف إذا كان مشرفاً
        if (user.is_admin) {
            const adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) {
                adminBtn.style.display = 'block';
            }
        }
    }
    
    // إظهار شاشة الترحيب
    function showWelcomeScreen() {
        const welcomeScreen = document.querySelector('.welcome-screen');
        const chatScreen = document.querySelector('.chat-screen');
        
        if (welcomeScreen) welcomeScreen.style.display = 'flex';
        if (chatScreen) chatScreen.style.display = 'none';
        
        console.log('🖥️ عرض شاشة الترحيب');
    }
    
    // إظهار شاشة الدردشة
    function showChatScreen() {
        const welcomeScreen = document.querySelector('.welcome-screen');
        const chatScreen = document.querySelector('.chat-screen');
        
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (chatScreen) chatScreen.style.display = 'flex';
        
        console.log('💬 عرض شاشة الدردشة');
    }
    
    // جعل الوظائف متاحة عالمياً
    window.showNotification = showNotification;
    window.showWelcomeScreen = showWelcomeScreen;
    window.showChatScreen = showChatScreen;
    
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

console.log('✅ تم تحميل إعدادات تطبيق دردشة العراق');
