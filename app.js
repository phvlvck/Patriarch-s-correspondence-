let socket;
let currentUser = null;

// عرض نموذج التسجيل
function showRegister() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

// عرض نموذج الدخول
function showLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

// تسجيل مستخدم جديد
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;

    if(!username || !password || !email) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }

    // حفظ المستخدم في localStorage (في تطبيق حقيقي، سيكون في قاعدة بيانات)
    const users = JSON.parse(localStorage.getItem('chat_users') || '{}');
    if(users[username]) {
        alert('اسم المستخدم موجود بالفعل!');
        return;
    }

    users[username] = { password, email };
    localStorage.setItem('chat_users', JSON.stringify(users));
    alert('تم التسجيل بنجاح! يمكنك الآن الدخول.');
    showLogin();
}

// تسجيل الدخول
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('chat_users') || '{}');
    
    if(users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        startChat();
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
    }
}

// بدء الدردشة
function startChat() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // الاتصال بالسيرفر
    socket = io('https://your-server-url.herokuapp.com'); // سيتم تغيير هذا لاحقاً

    // إرسال اسم المستخدم للسيرفر
    socket.emit('user_connected', currentUser);

    // تحديث قائمة المستخدمين المتصلين
    socket.on('user_list', (users) => {
        updateOnlineUsers(users);
    });

    // استقبال الرسائل الجديدة
    socket.on('new_message', (data) => {
        addMessage(data.user, data.message, data.time, data.user === currentUser);
    });

    // استقبال رسائل النظام
    socket.on('system_message', (message) => {
        addSystemMessage(message);
    });

    // تحميل الرسائل السابقة
    loadMessages();
}

// إرسال رسالة
function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if(message && currentUser) {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // إرسال للسيرفر
        socket.emit('send_message', {
            user: currentUser,
            message: message,
            time: time
        });

        // إضافة للواجهة مباشرة
        addMessage(currentUser, message, time, true);
        
        // حفظ في localStorage
        saveMessage(currentUser, message, time);
        
        input.value = '';
    }
}

// إضافة رسالة للواجهة
function addMessage(user, message, time, isSent = false) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageClass = isSent ? 'sent' : 'received';
    
    const messageHTML = `
        <div class="message ${messageClass}">
            <div class="message-header">${user}</div>
            <div class="message-text">${message}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesDiv.innerHTML += messageHTML;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// إضافة رسالة نظام
function addSystemMessage(message) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageHTML = `
        <div class="message" style="background:#ffecb3;color:#333;max-width:100%;margin:10px auto;text-align:center;">
            <i class="fas fa-info-circle"></i> ${message}
        </div>
    `;
    
    messagesDiv.innerHTML += messageHTML;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// تحديث قائمة المستخدمين المتصلين
function updateOnlineUsers(users) {
    const usersList = document.getElementById('online-users');
    const onlineCount = document.getElementById('online-count');
    
    usersList.innerHTML = '';
    onlineCount.textContent = users.length;
    
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-user-circle"></i> ${user}`;
        usersList.appendChild(li);
    });
}

// حفظ الرسائل
function saveMessage(user, message, time) {
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    messages.push({ user, message, time, timestamp: Date.now() });
    
    // حفظ آخر 100 رسالة فقط
    if(messages.length > 100) {
        messages.splice(0, messages.length - 100);
    }
    
    localStorage.setItem('chat_messages', JSON.stringify(messages));
}

// تحميل الرسائل السابقة
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    messages.forEach(msg => {
        addMessage(msg.user, msg.message, msg.time, msg.user === currentUser);
    });
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
};
