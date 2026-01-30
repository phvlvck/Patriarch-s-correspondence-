// ============== إعدادات السيرفر ==============
// ⚠️ غيّر هذا العنوان إلى IP جهازك الذي يعمل عليه السيرفر
const SERVER_URL = 'http://192.168.0.107:5000'; // استخدم IP الذي ظهر في الرسالة

// ============== متغيرات عامة ==============
let socket = null;
let currentUser = null;
let isTyping = false;
let typingTimeout = null;

// ============== مصادقة المستخدم ==============
function showRegister() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;

    if(!username || !password || !email) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        });

        const data = await response.json();
        alert(data.message);
        
        if(data.success) {
            showLogin();
        }
    } catch(error) {
        console.error('Error:', error);
        alert('⚠️ خطأ في الاتصال بالسيرفر. تأكد من:\n1. تشغيل سيرفر Python\n2. صحة العنوان: ' + SERVER_URL);
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${SERVER_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if(data.success) {
            currentUser = username;
            localStorage.setItem('currentUser', username);
            startChat();
        } else {
            alert(data.message);
        }
    } catch(error) {
        console.error('Error:', error);
        alert('❌ لا يمكن الاتصال بالسيرفر!\n\nتأكد من:\n1. تشغيل سيرفر Python\n2. العنوان الصحيح: ' + SERVER_URL + '\n3. نفس شبكة الواي فاي');
    }
}

// ============== نظام الدردشة ==============
function startChat() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // الاتصال بالسيرفر
    socket = io(SERVER_URL);

    // إرسال اسم المستخدم للسيرفر
    socket.emit('user_connected', { username: currentUser });

    // تحديث قائمة المستخدمين المتصلين
    socket.on('user_list', (users) => {
        updateOnlineUsers(users);
    });

    // استقبال الرسائل الجديدة
    socket.on('new_message', (data) => {
        addMessage(data.user, data.message, data.time, data.user === currentUser);
    });

    // استقبال رسائل النظام
    socket.on('system_message', (data) => {
        addSystemMessage(data.message, data.time);
    });

    // معرفة من يكتب الآن
    socket.on('user_typing', (data) => {
        showTypingIndicator(data.user, data.isTyping);
    });

    // أحداث الاتصال
    socket.on('connect', () => {
        console.log('✅ متصل بالسيرفر');
        addSystemMessage('تم الاتصال بالسيرفر');
    });

    socket.on('disconnect', () => {
        console.log('❌ انقطع الاتصال');
        addSystemMessage('انقطع الاتصال بالسيرفر');
    });

    // إضافة حدث الكتابة
    document.getElementById('message-input').addEventListener('input', function() {
        if(currentUser && socket) {
            socket.emit('typing', { user: currentUser, isTyping: true });
            
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit('typing', { user: currentUser, isTyping: false });
            }, 1000);
        }
    });
}

// إرسال رسالة
function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if(message && currentUser && socket) {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // إرسال للسيرفر
        socket.emit('send_message', {
            user: currentUser,
            message: message,
            time: time
        });
        
        // مسح الحقل
        input.value = '';
    }
}

// إضافة رسالة للواجهة
function addMessage(user, message, time, isSent = false) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageClass = isSent ? 'sent' : 'received';
    
    const messageHTML = `
        <div class="message ${messageClass}">
            <div class="message-header">
                <i class="fas fa-user-circle"></i> ${user}
                ${isSent ? '<span style="font-size:12px;background:#6a11cb;color:white;padding:2px 8px;border-radius:10px;">(أنت)</span>' : ''}
            </div>
            <div class="message-text">${message}</div>
            <div class="message-time">
                <i class="far fa-clock"></i> ${time}
            </div>
        </div>
    `;
    
    messagesDiv.innerHTML += messageHTML;
    scrollToBottom();
}

// إضافة رسالة نظام
function addSystemMessage(message, time = null) {
    const messagesDiv = document.getElementById('chat-messages');
    const displayTime = time || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageHTML = `
        <div class="message" style="background:#fff3cd;border:1px solid #ffeaa7;color:#856404;text-align:center;margin:10px auto;max-width:90%;">
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

// عرض مؤشر الكتابة
function showTypingIndicator(username, isTyping) {
    let indicator = document.getElementById('typing-indicator');
    
    if(!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.style.cssText = `
            padding: 10px 15px;
            background: #f0f0f0;
            border-radius: 20px;
            margin: 10px 0;
            width: fit-content;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        document.getElementById('chat-messages').appendChild(indicator);
    }
    
    if(isTyping) {
        indicator.innerHTML = `
            <i class="fas fa-pencil-alt"></i>
            <span>${username} يكتب الآن...</span>
            <div style="display:flex;gap:3px;">
                <span style="width:8px;height:8px;background:#666;border-radius:50%;animation:bounce 1.4s infinite;"></span>
                <span style="width:8px;height:8px;background:#666;border-radius:50%;animation:bounce 1.4s infinite;animation-delay:0.2s;"></span>
                <span style="width:8px;height:8px;background:#666;border-radius:50%;animation:bounce 1.4s infinite;animation-delay:0.4s;"></span>
            </div>
        `;
        indicator.style.display = 'flex';
        
        // إضافة أنيميشن إذا لم تكن موجودة
        if(!document.getElementById('typing-animation')) {
            const style = document.createElement('style');
            style.id = 'typing-animation';
            style.textContent = `
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        indicator.style.display = 'none';
    }
    
    scrollToBottom();
}

// تحديث قائمة المستخدمين المتصلين
function updateOnlineUsers(users) {
    const usersList = document.getElementById('online-users');
    const onlineCount = document.getElementById('online-count');
    
    usersList.innerHTML = '';
    onlineCount.textContent = users.length;
    
    if(users.length === 0) {
        usersList.innerHTML = '<li style="color:#666;text-align:center;padding:20px;">لا يوجد مستخدمون متصلون</li>';
        return;
    }
    
    users.forEach(user => {
        const isCurrentUser = user === currentUser;
        const li = document.createElement('li');
        li.style.cssText = `
            padding: 10px;
            margin: 5px 0;
            background: ${isCurrentUser ? '#e3f2fd' : 'white'};
            border-radius: 5px;
            border-right: 3px solid ${isCurrentUser ? '#6a11cb' : '#2575fc'};
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: ${isCurrentUser ? 'bold' : 'normal'};
        `;
        
        li.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <i class="fas fa-user-circle" style="color:${isCurrentUser ? '#6a11cb' : '#2575fc'}"></i>
                <span>${user}</span>
            </div>
            ${isCurrentUser ? 
                '<span style="background:#6a11cb;color:white;padding:2px 8px;border-radius:10px;font-size:12px;">أنت</span>' : 
                '<span style="width:10px;height:10px;background:#28a745;border-radius:50%;display:inline-block;"></span>'
            }
        `;
        
        usersList.appendChild(li);
    });
}

// التمرير للأسفل
function scrollToBottom() {
    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// التعامل مع زر الإدخال
function handleKeyPress(event) {
    if(event.key === 'Enter') {
        sendMessage();
    }
}

// تسجيل الخروج
function logout() {
    if(socket) {
        socket.emit('user_disconnected', currentUser);
        socket.disconnect();
    }
    
    localStorage.removeItem('currentUser');
    location.reload();
}

// التحقق من تسجيل الدخول السابق
window.onload = function() {
    const savedUser = localStorage.getItem('currentUser');
    if(savedUser) {
        currentUser = savedUser;
        startChat();
    }
    
    // اختبار اتصال بالسيرفر
    fetch(`${SERVER_URL}/api/health`)
        .then(response => {
            if(response.ok) {
                console.log('✅ السيرفر يعمل بشكل صحيح');
            }
        })
        .catch(error => {
            console.warn('⚠️ لا يمكن الاتصال بالسيرفر');
            alert('⚠️ تنبيه: السيرفر غير متصل!\n\n' +
                  'لن تعمل الدردشة الحية حتى:\n' +
                  '1. تشغل سيرفر Python على جهازك\n' +
                  '2. تتأكد من العنوان: ' + SERVER_URL + '\n' +
                  '3. تكون على نفس الشبكة');
        });
};
