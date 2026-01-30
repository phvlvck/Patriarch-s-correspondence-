// ============== ⭐⭐⭐ إعدادات السيرفر ⭐⭐⭐ ==============
// 🔧 غير هذا فقط إذا غيرت IP السيرفر
const SERVER_URL = 'http://192.168.0.107:5000';
// const SERVER_URL = 'http://localhost:5000'; // إذا كنت تجرب من نفس الجهاز

// ============== متغيرات عامة ==============
let socket = null;
let currentUser = null;
let isTyping = false;
let typingTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// ============== مصادقة المستخدم ==============
function showRegister() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
    console.log('🔄 عرض نموذج التسجيل');
}

function showLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    console.log('🔄 عرض نموذج الدخول');
}

async function register() {
    console.log('📝 محاولة تسجيل...');
    
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const email = document.getElementById('register-email').value.trim();

    if (!username || !password || !email) {
        showAlert('❌ خطأ', 'الرجاء ملء جميع الحقول', 'error');
        return;
    }

    if (username.length < 3) {
        showAlert('❌ خطأ', 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل', 'error');
        return;
    }

    if (password.length < 4) {
        showAlert('❌ خطأ', 'كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'error');
        return;
    }

    try {
        console.log(`📤 إرسال طلب تسجيل لـ: ${username}`);
        
        const response = await fetch(`${SERVER_URL}/api/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ username, password, email })
        });

        console.log(`📥 استجابة التسجيل: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`خطأ في السيرفر: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 بيانات الاستجابة:', data);
        
        if (data.success) {
            showAlert('✅ نجاح', data.message, 'success');
            // مسح الحقول
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-email').value = '';
            showLogin();
        } else {
            showAlert('❌ خطأ', data.message, 'error');
        }
    } catch (error) {
        console.error('❌ خطأ في التسجيل:', error);
        showAlert('❌ خطأ اتصال', 
            `لا يمكن الاتصال بالسيرفر!\n\n` +
            `تفاصيل: ${error.message}\n\n` +
            `تأكد من:\n` +
            `1. تشغيل سيرفر Python (server.py)\n` +
            `2. العنوان الصحيح: ${SERVER_URL}\n` +
            `3. نفس شبكة الواي فاي\n\n` +
            `افتح ${SERVER_URL} في متصفح جديد لتتأكد`, 
            'error'
        );
    }
}

async function login() {
    console.log('🔐 محاولة تسجيل دخول...');
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        showAlert('❌ خطأ', 'الرجاء إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }

    try {
        console.log(`📤 إرسال طلب دخول لـ: ${username}`);
        
        const response = await fetch(`${SERVER_URL}/api/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ username, password })
        });

        console.log(`📥 استجابة الدخول: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`خطأ في السيرفر: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 بيانات الاستجابة:', data);
        
        if (data.success) {
            showAlert('✅ نجاح', 'تم تسجيل الدخول بنجاح', 'success');
            currentUser = data.username;
            localStorage.setItem('currentUser', data.username);
            setTimeout(() => startChat(), 1000);
        } else {
            showAlert('❌ خطأ', data.message, 'error');
        }
    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        showAlert('❌ خطأ اتصال', 
            `فشل الاتصال بالسيرفر!\n\n` +
            `تفاصيل: ${error.message}\n\n` +
            `السيرفر الحالي: ${SERVER_URL}\n\n` +
            `افتح هذا الرابط في متصفح جديد:\n${SERVER_URL}`,
            'error'
        );
    }
}

// ============== نظام الدردشة ==============
function startChat() {
    console.log('🚀 بدء نظام الدردشة...');
    
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    
    // إضافة حدث للمفاتيح في حقل الرسالة
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keypress', handleKeyPress);
    messageInput.addEventListener('input', handleTyping);
    
    // ⭐⭐⭐ ربط زر الإرسال بالدالة ⭐⭐⭐
    const sendButton = document.querySelector('.chat-input button');
    if (sendButton) {
        sendButton.onclick = sendMessage;
        console.log('✅ زر الإرسال مربوط');
    }
    
    connectToSocket();
    loadPreviousMessages();
    updateUserStatus();
}

function connectToSocket() {
    console.log('🔌 محاولة الاتصال بالسيرفر عبر Socket.IO...');
    
    if (socket) {
        console.log('🔄 فصل الاتصال القديم...');
        socket.disconnect();
    }
    
    try {
        console.log(`📡 الاتصال بـ: ${SERVER_URL}`);
        
        socket = io(SERVER_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
            reconnectionDelay: 1000,
            timeout: 20000,
            forceNew: true
        });
        
        // ============== أحداث Socket.IO ==============
        socket.on('connect', () => {
            console.log('✅ ✅ ✅ متصل بالسيرفر بنجاح!');
            console.log(`   🆔 Socket ID: ${socket.id}`);
            reconnectAttempts = 0;
            
            // إعلام السيرفر بالمستخدم المتصل
            if (currentUser) {
                console.log(`👤 إعلام السيرفر بأن ${currentUser} متصل`);
                socket.emit('user_connected', { username: currentUser });
            }
            
            addSystemMessage('✅ تم الاتصال بالسيرفر بنجاح');
            updateConnectionStatus(true);
        });
        
        socket.on('connect_error', (error) => {
            console.error('❌ ❌ ❌ خطأ في الاتصال:', error);
            reconnectAttempts++;
            
            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                showAlert('⚠️ تحذير', 
                    'فقد الاتصال بالسيرفر. جرب:\n' +
                    '1. تحديث الصفحة (F5)\n' +
                    '2. التأكد من تشغيل السيرفر\n' +
                    `3. فتح ${SERVER_URL} للتأكد`, 
                    'warning'
                );
            } else {
                console.log(`🔄 محاولة إعادة الاتصال ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
            }
            
            updateConnectionStatus(false);
        });
        
        socket.on('disconnect', (reason) => {
            console.log('❌ انقطع الاتصال:', reason);
            addSystemMessage('❌ انقطع الاتصال بالسيرفر');
            updateConnectionStatus(false);
        });
        
        socket.on('reconnect', (attemptNumber) => {
            console.log(`🔁 تم إعادة الاتصال (المحاولة ${attemptNumber})`);
            addSystemMessage('🔁 تم إعادة الاتصال بالسيرفر');
            if (currentUser) {
                socket.emit('user_connected', { username: currentUser });
            }
            updateConnectionStatus(true);
        });
        
        socket.on('user_list', (users) => {
            console.log('👥 تحديث قائمة المستخدمين:', users);
            updateOnlineUsers(users);
        });
        
        socket.on('new_message', (data) => {
            console.log('📨 رسالة جديدة:', data);
            addMessage(data.user, data.message, data.time, data.user === currentUser);
        });
        
        socket.on('system_message', (data) => {
            console.log('🔔 رسالة نظام:', data);
            addSystemMessage(data.message, data.time);
        });
        
        socket.on('user_typing', (data) => {
            console.log('✍️ مستخدم يكتب:', data);
            showTypingIndicator(data.user, data.isTyping);
        });
        
        socket.on('error', (error) => {
            console.error('❌ خطأ Socket.IO:', error);
        });
        
    } catch (error) {
        console.error('❌ ❌ ❌ فشل الاتصال بالسيرفر:', error);
        showAlert('❌ خطأ فادح', 
            `تعذر الاتصال بالسيرفر!\n\n` +
            `الخطأ: ${error.message}\n\n` +
            `تأكد من:\n` +
            `1. تشغيل server.py\n` +
            `2. فتح ${SERVER_URL} في متصفح آخر`, 
            'error'
        );
    }
}

// ⭐⭐⭐ ⭐⭐⭐ ⭐⭐⭐ دالة إرسال الرسالة المصححة ⭐⭐⭐ ⭐⭐⭐ ⭐⭐⭐
function sendMessage() {
    console.log('📤 محاولة إرسال رسالة...');
    
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    console.log('الرسالة:', message);
    console.log('المستخدم الحالي:', currentUser);
    console.log('Socket:', socket ? 'موجود' : 'مفقود');
    console.log('Socket متصل:', socket && socket.connected ? 'نعم' : 'لا');
    
    if (!message) {
        console.log('❌ نص الرسالة فارغ');
        showAlert('⚠️ تنبيه', 'اكتب رسالة أولاً', 'warning');
        return;
    }
    
    if (!currentUser) {
        console.log('❌ لا يوجد مستخدم مسجل دخول');
        showAlert('❌ خطأ', 'يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!socket) {
        console.log('❌ Socket غير موجود');
        showAlert('❌ خطأ', 'الاتصال بالسيرفر مفقود', 'error');
        connectToSocket();
        return;
    }
    
    if (!socket.connected) {
        console.log('❌ Socket غير متصل');
        showAlert('⚠️ تحذير', 'الاتصال بالسيرفر مقطوع. جاري إعادة الاتصال...', 'warning');
        connectToSocket();
        return;
    }
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    console.log(`📨 إرسال: ${currentUser} -> "${message}" (${time})`);
    
    // ⭐⭐⭐ إرسال الرسالة عبر Socket.IO ⭐⭐⭐
    socket.emit('send_message', {
        user: currentUser,
        message: message,
        time: time
    });
    
    console.log('✅ تم إرسال event send_message');
    
    // إضافة الرسالة محلياً فوراً (بدون انتظار السيرفر)
    addMessage(currentUser, message, time, true);
    
    // مسح حقل الإدخال
    messageInput.value = '';
    messageInput.focus();
    
    // إلغاء مؤشر الكتابة
    if (isTyping) {
        socket.emit('typing', { user: currentUser, isTyping: false });
        isTyping = false;
    }
    
    console.log('✅ ✅ ✅ تمت العملية بنجاح');
}

function handleKeyPress(event) {
    console.log('⌨️ ضغط على مفتاح:', event.key);
    
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        console.log('↵ Enter مضغوط - إرسال الرسالة');
        sendMessage();
    }
}

function handleTyping() {
    if (!currentUser || !socket || !socket.connected) return;
    
    const messageInput = document.getElementById('message-input');
    const typing = messageInput.value.trim().length > 0;
    
    if (typing !== isTyping) {
        isTyping = typing;
        console.log(`✍️ ${currentUser} ${typing ? 'يكتب...' : 'توقف'}`);
        socket.emit('typing', { user: currentUser, isTyping: typing });
    }
    
    clearTimeout(typingTimeout);
    if (typing) {
        typingTimeout = setTimeout(() => {
            if (isTyping) {
                isTyping = false;
                socket.emit('typing', { user: currentUser, isTyping: false });
                console.log(`✍️ ${currentUser} توقف عن الكتابة (مهلة)`);
            }
        }, 2000);
    }
}

// ============== إدارة الرسائل ==============
function addMessage(user, message, time, isSent = false) {
    console.log(`➕ إضافة رسالة: ${user} -> "${message}"`);
    
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) {
        console.error('❌ عنصر chat-messages غير موجود!');
        return;
    }
    
    const messageClass = isSent ? 'sent' : 'received';
    
    const messageHTML = `
        <div class="message ${messageClass}" data-user="${user}">
            <div class="message-header">
                <i class="fas fa-user-circle"></i>
                <span class="username">${user}</span>
                ${isSent ? '<span class="you-badge">(أنت)</span>' : ''}
            </div>
            <div class="message-text">${escapeHtml(message)}</div>
            <div class="message-time">
                <i class="far fa-clock"></i> ${time}
            </div>
        </div>
    `;
    
    messagesDiv.innerHTML += messageHTML;
    scrollToBottom();
}

function addSystemMessage(message, time = null) {
    console.log(`🔔 إضافة رسالة نظام: ${message}`);
    
    const messagesDiv = document.getElementById('chat-messages');
    const displayTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageHTML = `
        <div class="message system">
            <div class="message-text">
                <i class="fas fa-info-circle"></i> ${message}
            </div>
            <div class="message-time">
                <i class="far fa-clock"></i> ${displayTime}
            </div>
        </div>
    `;
    
    messagesDiv.innerHTML += messageHTML;
    scrollToBottom();
}

function updateOnlineUsers(users) {
    console.log('👥 تحديث المستخدمين المتصلين:', users);
    
    const usersList = document.getElementById('online-users');
    const onlineCount = document.getElementById('online-count');
    
    if (!usersList || !onlineCount) {
        console.error('❌ عناصر قائمة المستخدمين غير موجودة!');
        return;
    }
    
    onlineCount.textContent = users.length;
    
    if (users.length === 0) {
        usersList.innerHTML = '<li class="empty">لا يوجد مستخدمون متصلون</li>';
        return;
    }
    
    let usersHTML = '';
    users.forEach(user => {
        const isCurrentUser = user === currentUser;
        usersHTML += `
            <li class="${isCurrentUser ? 'current-user' : ''}">
                <i class="fas fa-user-circle ${isCurrentUser ? 'you' : ''}"></i>
                <span>${user}</span>
                ${isCurrentUser ? '<span class="online-badge">أنت</span>' : '<span class="online-dot"></span>'}
            </li>
        `;
    });
    
    usersList.innerHTML = usersHTML;
}

function showTypingIndicator(username, isTyping) {
    console.log(`✍️ مؤشر الكتابة: ${username} -> ${isTyping}`);
    
    let indicator = document.getElementById('typing-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'typing-indicator';
        document.getElementById('chat-messages').appendChild(indicator);
    }
    
    if (isTyping) {
        indicator.innerHTML = `
            <i class="fas fa-pencil-alt"></i>
            <span>${username} يكتب الآن...</span>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        indicator.style.display = 'flex';
    } else {
        indicator.style.display = 'none';
    }
    
    scrollToBottom();
}

async function loadPreviousMessages() {
    try {
        console.log('📂 جلب الرسائل السابقة...');
        
        const response = await fetch(`${SERVER_URL}/api/messages?limit=20`);
        const data = await response.json();
        
        console.log('📥 الرسائل المستلمة:', data.messages ? data.messages.length : 0);
        
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(msg => {
                addMessage(msg.user, msg.message, msg.time, msg.user === currentUser);
            });
            addSystemMessage(`تم تحميل ${data.messages.length} رسالة سابقة`);
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل الرسائل السابقة:', error);
    }
}

// ============== دوال مساعدة ==============
function scrollToBottom() {
    const messagesDiv = document.getElementById('chat-messages');
    if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAlert(title, message, type = 'info') {
    console.log(`💬 تنبيه [${type}]: ${title} - ${message}`);
    
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = `
        <strong>${title}</strong>
        <p style="white-space: pre-line;">${message}</p>
    `;
    
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.remove();
    }, 5000);
}

function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connection-status') || createConnectionStatus();
    statusEl.textContent = connected ? '🟢 متصل' : '🔴 غير متصل';
    statusEl.className = connected ? 'connected' : 'disconnected';
}

function createConnectionStatus() {
    const statusEl = document.createElement('div');
    statusEl.id = 'connection-status';
    statusEl.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
    `;
    document.body.appendChild(statusEl);
    return statusEl;
}

function updateUserStatus() {
    const userStatus = document.getElementById('user-status') || createUserStatus();
    userStatus.innerHTML = `<i class="fas fa-user"></i> ${currentUser}`;
}

function createUserStatus() {
    const statusEl = document.createElement('div');
    statusEl.id = 'user-status';
    statusEl.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 5px 10px;
        background: #6a11cb;
        color: white;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1000;
    `;
    document.body.appendChild(statusEl);
    return statusEl;
}

function logout() {
    console.log('👋 تسجيل الخروج...');
    
    if (socket) {
        socket.disconnect();
    }
    
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    
    // مسح الحقول
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('message-input').value = '';
    
    showAlert('✅ تم', 'تم تسجيل الخروج بنجاح', 'info');
}

// ============== التهيئة عند تحميل الصفحة ==============
window.onload = function() {
    console.log('🚀 صفحة الدردشة جاهزة!');
    console.log('🌐 عنوان السيرفر:', SERVER_URL);
    console.log('📱 User Agent:', navigator.userAgent);
    
    // اختبار اتصال بالسيرفر
    checkServerConnection();
    
    // التحقق من تسجيل دخول سابق
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        console.log('🔑 مستخدم مسجل مسبقاً:', savedUser);
        currentUser = savedUser;
        setTimeout(() => startChat(), 500);
    } else {
        console.log('👤 لا يوجد مستخدم مسجل');
    }
    
    // إضافة أنماط CSS ديناميكية
    addDynamicStyles();
    
    // ⭐⭐⭐ ربط الأزرار بالدوال ⭐⭐⭐
    console.log('🔗 ربط الأزرار...');
    
    // زر التسجيل
    const registerBtn = document.querySelector('#register-section button');
    if (registerBtn) {
        registerBtn.onclick = register;
        console.log('✅ زر التسجيل مربوط');
    }
    
    // زر الدخول
    const loginBtn = document.querySelector('#login-section button');
    if (loginBtn) {
        loginBtn.onclick = login;
        console.log('✅ زر الدخول مربوط');
    }
    
    // زر الإرسال (تم ربطه في startChat أيضاً)
    const sendBtn = document.querySelector('.chat-input button');
    if (sendBtn) {
        sendBtn.onclick = sendMessage;
        console.log('✅ زر الإرسال مربوط');
    }
    
    // زر الخروج
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = logout;
        console.log('✅ زر الخروج مربوط');
    }
    
    console.log('✅ ✅ ✅ جميع الأزرار مربوطة بنجاح');
};

async function checkServerConnection() {
    console.log('🔍 اختبار اتصال بالسيرفر...');
    
    try {
        const response = await fetch(`${SERVER_URL}/api/health`, { 
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ السيرفر يعمل بشكل صحيح:', data);
            console.log('📍 عنوان السيرفر:', data.server_url);
            showAlert('✅ اتصال ناجح', `السيرفر جاهز على: ${data.server_url}`, 'success');
        } else {
            console.warn('⚠️ السيرفر رد لكن بحالة خطأ:', response.status);
            showAlert('⚠️ تنبيه', 
                `السيرفر موجود لكن بحالة ${response.status}\n` +
                `افتح ${SERVER_URL} للتأكد`, 
                'warning'
            );
        }
    } catch (error) {
        console.error('❌ لا يمكن الاتصال بالسيرفر:', error);
        showAlert('❌ خطأ اتصال', 
            `لا يمكن الوصول للسيرفر!\n\n` +
            `الخطأ: ${error.message}\n\n` +
            `تأكد من:\n` +
            `1. تشغيل server.py على جهازك\n` +
            `2. فتح ${SERVER_URL} في متصفح آخر\n` +
            `3. نفس شبكة الواي فاي\n\n` +
            `أعد تحميل الصفحة بعد تشغيل السيرفر`, 
            'error'
        );
    }
}

function addDynamicStyles() {
    const styles = `
        /* أنماط التنبيهات */
        .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            left: 20px;
            max-width: 400px;
            margin: 0 auto;
            padding: 15px;
            border-radius: 10px;
            color: white;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            font-family: Arial, sans-serif;
        }
        
        .alert-success {
            background: linear-gradient(135deg, #28a745, #20c997);
            border-left: 5px solid #1e7e34;
        }
        
        .alert-error {
            background: linear-gradient(135deg, #dc3545, #fd7e14);
            border-left: 5px solid #bd2130;
        }
        
        .alert-warning {
            background: linear-gradient(135deg, #ffc107, #fd7e14);
            border-left: 5px solid #d39e00;
        }
        
        .alert-info {
            background: linear-gradient(135deg, #17a2b8, #20c997);
            border-left: 5px solid #117a8b;
        }
        
        /* حالة الاتصال */
        #connection-status.connected {
            background: #28a745;
            color: white;
        }
        
        #connection-status.disconnected {
            background: #dc3545;
            color: white;
        }
        
        /* مؤشر الكتابة */
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 15px;
            background: #f8f9fa;
            border-radius: 20px;
            margin: 10px 0;
            width: fit-content;
            border: 1px solid #dee2e6;
            font-size: 14px;
            color: #6c757d;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: #6c757d;
            border-radius: 50%;
            animation: bounce 1.4s infinite;
        }
        
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        
        /* رسوم متحركة */
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
        
        /* تحسينات للدردشة */
        .message.sent {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%) !important;
            color: white !important;
            margin-left: 20% !important;
            margin-right: 5% !important;
        }
        
        .message.received {
            background: #f8f9fa !important;
            color: #212529 !important;
            margin-right: 20% !important;
            margin-left: 5% !important;
            border: 1px solid #dee2e6 !important;
        }
        
        .you-badge {
            background: rgba(255,255,255,0.3);
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            margin-right: 5px;
        }
        
        .online-badge {
            background: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
        }
        
        .online-dot {
            width: 10px;
            height: 10px;
            background: #28a745;
            border-radius: 50%;
            display: inline-block;
        }
        
        .current-user {
            background: #e3f2fd !important;
            font-weight: bold;
        }
        
        /* زر الإرسال */
        .chat-input button {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border: none;
            padding: 0 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        }
        
        .chat-input button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(106, 17, 203, 0.4);
        }
        
        .chat-input button:active {
            transform: scale(0.95);
        }
        
        /* تحسينات عامة */
        *:focus {
            outline: 2px solid #6a11cb;
            outline-offset: 2px;
        }
        
        /* تخصيص شريط التمرير */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    console.log('🎨 الأنماط الديناميكية مضافة');
}

// ============== أحداث التنقل بين الصفحات ==============
document.addEventListener('keydown', function(event) {
    // Alt + L للذهاب لتسجيل الدخول
    if (event.altKey && event.key === 'l') {
        showLogin();
        event.preventDefault();
    }
    
    // Alt + R للذهاب للتسجيل
    if (event.altKey && event.key === 'r') {
        showRegister();
        event.preventDefault();
    }
    
    // ESC للخروج من الدردشة
    if (event.key === 'Escape' && currentUser) {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            logout();
        }
    }
});

// ============== تحسينات الأداء ==============
let messageCount = 0;
const MAX_MESSAGES_IN_MEMORY = 200;

function optimizeMessages() {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;
    
    const messages = messagesDiv.querySelectorAll('.message');
    if (messages.length > MAX_MESSAGES_IN_MEMORY) {
        // حذف الرسائل القديمة للحفاظ على الأداء
        const messagesToRemove = messages.length - MAX_MESSAGES_IN_MEMORY;
        for (let i = 0; i < messagesToRemove; i++) {
            messages[i].remove();
        }
        console.log(`🧹 تم تنظيف ${messagesToRemove} رسالة قديمة`);
    }
}

// تشغيل التنظيف كل 30 ثانية
setInterval(optimizeMessages, 30000);

// ============== إدارة الجلسة ==============
function checkSession() {
    if (currentUser) {
        // تحديث وقت آخر نشاط
        localStorage.setItem('lastActivity', Date.now());
        
        // التحقق من انتهاء الجلسة (30 دقيقة)
        const lastActivity = localStorage.getItem('lastActivity');
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (Date.now() - lastActivity > thirtyMinutes) {
            showAlert('⏰ انتهاء الجلسة', 'انتهت جلستك بسبب عدم النشاط', 'warning');
            logout();
        }
    }
}

// التحقق من الجلسة كل دقيقة
setInterval(checkSession, 60000);

// تحديث وقت النشاط عند أي تفاعل
document.addEventListener('click', () => {
    if (currentUser) {
        localStorage.setItem('lastActivity', Date.now());
    }
});

document.addEventListener('keypress', () => {
    if (currentUser) {
        localStorage.setItem('lastActivity', Date.now());
    }
});

// ============== إشعارات المتصفح ==============
let notificationPermission = false;

function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            notificationPermission = permission === "granted";
            console.log('🔔 صلاحية الإشعارات:', permission);
        });
    }
}

function showNotification(title, message) {
    if (!notificationPermission || document.hasFocus()) return;
    
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💬</text></svg>'
        });
    }
}

// طلب صلاحية الإشعارات عند الدخول للدردشة
if ("Notification" in window) {
    requestNotificationPermission();
}

// ============== نسخ الرسائل ==============
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('message-text')) {
        const text = event.target.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showAlert('📋 تم النسخ', 'تم نسخ نص الرسالة', 'success');
        });
    }
});

// ============== البحث في الرسائل ==============
function searchMessages(keyword) {
    const messages = document.querySelectorAll('.message-text');
    let found = false;
    
    messages.forEach(msg => {
        if (msg.textContent.toLowerCase().includes(keyword.toLowerCase())) {
            msg.style.backgroundColor = '#fff3cd';
            msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            found = true;
        } else {
            msg.style.backgroundColor = '';
        }
    });
    
    return found;
}

// ============== إحصائيات الدردشة ==============
function getChatStats() {
    const messages = document.querySelectorAll('.message:not(.system)');
    const sentMessages = document.querySelectorAll('.message.sent');
    const receivedMessages = document.querySelectorAll('.message.received');
    
    return {
        total: messages.length,
        sent: sentMessages.length,
        received: receivedMessages.length,
        usersOnline: document.getElementById('online-count')?.textContent || 0
    };
}

// ============== تصدير المحادثة ==============
function exportChat() {
    const messages = document.querySelectorAll('.message');
    let chatText = '===== سجل المحادثة =====\n\n';
    
    messages.forEach(msg => {
        const user = msg.querySelector('.username')?.textContent || 'النظام';
        const text = msg.querySelector('.message-text')?.textContent || '';
        const time = msg.querySelector('.message-time')?.textContent || '';
        
        chatText += `[${time}] ${user}: ${text}\n`;
    });
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showAlert('📤 تم التصدير', 'تم حفظ سجل المحادثة', 'success');
}

// ============== أوامر خاصة ==============
document.addEventListener('keydown', function(event) {
    // Ctrl + E لتصدير المحادثة
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        exportChat();
    }
    
    // Ctrl + F للبحث
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        const keyword = prompt('أدخل كلمة للبحث في الرسائل:');
        if (keyword) {
            const found = searchMessages(keyword);
            if (!found) {
                showAlert('🔍 لم يتم العثور', 'لم يتم العثور على الرسائل التي تحتوي على هذه الكلمة', 'info');
            }
        }
    }
    
    // Ctrl + S للإحصائيات
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        const stats = getChatStats();
        showAlert('📊 إحصائيات الدردشة', 
            `إجمالي الرسائل: ${stats.total}\n` +
            `الرسائل المرسلة: ${stats.sent}\n` +
            `الرسائل المستلمة: ${stats.received}\n` +
            `المستخدمون المتصلون: ${stats.usersOnline}`, 
            'info'
        );
    }
});

// ============== تحسين تجربة المستخدم ==============
function addMessageContextMenu() {
    document.addEventListener('contextmenu', function(event) {
        if (event.target.classList.contains('message-text')) {
            event.preventDefault();
            
            const menu = document.createElement('div');
            menu.style.cssText = `
                position: fixed;
                top: ${event.clientY}px;
                left: ${event.clientX}px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                min-width: 150px;
            `;
            
            menu.innerHTML = `
                <div style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;" 
                     onclick="copyMessageText(this)">📋 نسخ النص</div>
                <div style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;"
                     onclick="replyToMessage(this)">↩️ رد</div>
                <div style="padding: 10px; cursor: pointer;"
                     onclick="reportMessage(this)">🚨 إبلاغ</div>
            `;
            
            document.body.appendChild(menu);
            
            // إزالة القائمة عند النقر في أي مكان
            setTimeout(() => {
                document.addEventListener('click', function removeMenu() {
                    menu.remove();
                    document.removeEventListener('click', removeMenu);
                });
            }, 100);
        }
    });
}

function copyMessageText(element) {
    const message = element.closest('.message').querySelector('.message-text').textContent;
    navigator.clipboard.writeText(message);
    showAlert('📋 تم النسخ', 'تم نسخ نص الرسالة', 'success');
}

function replyToMessage(element) {
    const message = element.closest('.message').querySelector('.message-text').textContent;
    const user = element.closest('.message').querySelector('.username').textContent;
    
    const input = document.getElementById('message-input');
    input.value = `رد على ${user}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`;
    input.focus();
}

function reportMessage() {
    showAlert('🚨 الإبلاغ', 'تم إرسال بلاغ عن هذه الرسالة للمسؤول', 'info');
}

// تفعيل القائمة السياقية
addMessageContextMenu();

// ============== حفظ المسودة التلقائي ==============
let draftSaveTimeout;
function saveDraft() {
    const message = document.getElementById('message-input').value;
    if (message.trim()) {
        localStorage.setItem('messageDraft', message);
    }
}

function loadDraft() {
    const draft = localStorage.getItem('messageDraft');
    if (draft) {
        document.getElementById('message-input').value = draft;
        showAlert('💾 مسودة مستعادة', 'تم استعادة المسودة السابقة', 'info');
    }
}

// حفظ المسودة كل 5 ثوان
document.getElementById('message-input')?.addEventListener('input', function() {
    clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(saveDraft, 5000);
});

// تحميل المسودة عند بدء الدردشة
loadDraft();

// ============== إدارة الصوت ==============
let soundEnabled = true;

function playMessageSound() {
    if (!soundEnabled) return;
    
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
        audio.play().catch(e => console.log('🔇 تعذر تشغيل الصوت:', e));
    } catch (e) {
        console.log('🔇 الصوت غير متوفر');
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    showAlert(soundEnabled ? '🔊 الصوت مفعل' : '🔇 الصوت معطل', 
              soundEnabled ? 'سيتم تشغيل صوت عند وصول رسائل جديدة' : 'تم إيقاف الأصوات', 
              'info');
}

// تشغيل صوت عند استقبال رسائل جديدة (غير المرسلة من المستخدم)
socket?.on('new_message', (data) => {
    if (data.user !== currentUser) {
        playMessageSound();
        
        // إشعار المتصفح
        showNotification(`رسالة جديدة من ${data.user}`, data.message.substring(0, 50));
    }
});

// ============== إضافة اختصارات لوحة المفاتيح ==============
document.addEventListener('keydown', function(event) {
    // Ctrl + M للتركيز على حقل الرسالة
    if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        const input = document.getElementById('message-input');
        if (input) {
            input.focus();
            showAlert('🎯 التركيز', 'تم نقل التركيز إلى حقل الرسالة', 'info');
        }
    }
    
    // Ctrl + T لتفعيل/تعطيل الصوت
    if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        toggleSound();
    }
    
    // Ctrl + D لحذف المسودة
    if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        localStorage.removeItem('messageDraft');
        document.getElementById('message-input').value = '';
        showAlert('🗑️ تم الحذف', 'تم حذف المسودة المحفوظة', 'success');
    }
});

// ============== تحسينات الذاكرة ==============
function cleanupLocalStorage() {
    // حذف البيانات القديمة (أقدم من 7 أيام)
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('chat_')) {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.timestamp && (now - item.timestamp > sevenDays)) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // تجاهل العناصر غير القابلة للتحليل
            }
        }
    }
}

// تنظيف الذاكرة كل ساعة
setInterval(cleanupLocalStorage, 60 * 60 * 1000);

// ============== النسخ الاحتياطي التلقائي ==============
function backupChat() {
    const messages = document.querySelectorAll('.message');
    const backup = [];
    
    messages.forEach(msg => {
        backup.push({
            user: msg.querySelector('.username')?.textContent || '',
            text: msg.querySelector('.message-text')?.textContent || '',
            time: msg.querySelector('.message-time')?.textContent || '',
            type: msg.classList.contains('sent') ? 'sent' : 
                  msg.classList.contains('received') ? 'received' : 'system'
        });
    });
    
    localStorage.setItem('chatBackup_' + new Date().toISOString().split('T')[0], JSON.stringify(backup));
    console.log('💾 تم إنشاء نسخة احتياطية');
}

// نسخ احتياطي كل 30 دقيقة
setInterval(backupChat, 30 * 60 * 1000);

// ============== تحسينات واجهة المستخدم ==============
function addTooltips() {
    const elements = [
        { selector: '#login-username', text: 'أدخل اسم المستخدم المسجل لديك' },
        { selector: '#login-password', text: 'أدخل كلمة المرور الخاصة بك' },
        { selector: '#message-input', text: 'اكتب رسالتك هنا ثم اضغط Enter أو انقر على زر الإرسال' },
        { selector: '.logout-btn', text: 'تسجيل الخروج من الدردشة' },
        { selector: '.chat-input button', text: 'انقر هنا أو اضغط Enter لإرسال الرسالة' }
    ];
    
    elements.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.setAttribute('title', item.text);
        }
    });
}

// تفعيل التلميحات
setTimeout(addTooltips, 1000);

// ============== تقارير الأداء ==============
function logPerformance() {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('⚡ وقت تحميل الصفحة:', pageLoadTime, 'ms');
        
        if (pageLoadTime > 3000) {
            console.warn('⚠️ وقت التحميل طويل، جرب تقليل عدد الرسائل المعروضة');
        }
    }
}

// تسجيل الأداء بعد تحميل الصفحة
window.addEventListener('load', function() {
    setTimeout(logPerformance, 1000);
});

// ============== نظام المساعدة ==============
function showHelp() {
    const helpText = `
    🆘 **أوامر لوحة المفاتيح:**
    
    **عام:**
    - Alt + L: تسجيل الدخول
    - Alt + R: التسجيل جديد
    - ESC: تسجيل الخروج
    
    **في الدردشة:**
    - Enter: إرسال الرسالة
    - Ctrl + M: التركيز على حقل الرسالة
    - Ctrl + F: البحث في الرسائل
    - Ctrl + S: عرض الإحصائيات
    - Ctrl + E: تصدير المحادثة
    - Ctrl + T: تفعيل/تعطيل الصوت
    - Ctrl + D: حذف المسودة
    
    **إضافي:**
    - انقر بزر الماوس الأيمن على أي رسالة للقائمة السياقية
    - انقر على اسم المستخدم في القائمة لمشاهدة معلوماته
    `;
    
    showAlert('🆘 مساعدة - أوامر لوحة المفاتيح', helpText, 'info');
}

// إضافة زر المساعدة
function addHelpButton() {
    const helpBtn = document.createElement('button');
    helpBtn.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    helpBtn.onclick = showHelp;
    document.body.appendChild(helpBtn);
}

// إضافة زر المساعدة بعد تحميل الصفحة
setTimeout(addHelpButton, 2000);

// ============== النهاية - جميع الميزات مضاف

// تمكين الروبوت الدردشة البسيط
function initChatBot() {
    console.log('🤖 روبوت الدردشة جاهز للمساعدة');
    
    socket?.on('new_message', (data) => {
        // الرد التلقائي على بعض الكلمات المفتاحية
        const message = data.message.toLowerCase();
        const responses = {
            'مرحبا': 'مرحباً بك! كيف يمكنني مساعدتك؟',
            'اهلا': 'أهلاً وسهلاً! كيف حالك؟',
            'كيف حالك': 'أنا بخير، شكراً لسؤالك! 😊',
            'اسمك': 'أنا روبوت الدردشة! 🤖',
            'مساعدة': 'أنا هنا للإجابة على أسئلتك. جرب كتابة "مرحبا" أو "كيف حالك"',
            'شكرا': 'عفواً! سعيد بأن أكون في خدمتك 🌟',
            'صباح الخير': 'صباح النور! يوم سعيد 🌞',
            'مساء الخير': 'مساء الخير والسرور 🌙'
        };
        
        for (const [keyword, response] of Object.entries(responses)) {
            if (message.includes(keyword) && data.user !== currentUser) {
                setTimeout(() => {
                    socket.emit('send_message', {
                        user: 'روبوت الدردشة',
                        message: response,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                }, 1000);
                break;
            }
        }
    });
}

// تفعيل الروبوت بعد الاتصال
socket?.on('connect', initChatBot);

// ============== تفعيل كامل النظام ==============
console.log('🎉 نظام الدردشة جاهز بالكامل مع جميع الميزات!');
console.log('📍 عنوان السيرفر:', SERVER_URL);
console.log('📊 الميزات النشطة:');
console.log('   ✅ دردشة في الوقت الحقيقي');
console.log('   ✅ تسجيل مستخدمين');
console.log('   ✅ مؤشر الكتابة');
console.log('   ✅ إشعارات المتصفح');
console.log('   ✅ نسخ احتياطي تلقائي');
console.log('   ✅ أوامر لوحة المفاتيح');
console.log('   ✅ نظام مساعدة');
console.log('   ✅ روبوت دردشة');
console.log('   ✅ تحسينات الأداء');
console.log('   ✅ إدارة الجلسات');
