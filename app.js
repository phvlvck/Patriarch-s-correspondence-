// ... الكود السابق يبقى كما هو حتى دالة login ...

// تسجيل الدخول (محدث للعمل مع Python)
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
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
        alert('خطأ في الاتصال بالسيرفر');
    }
}

// التسجيل (محدث)
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;

    if(!username || !password || !email) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }

    try {
        const response = await fetch('/api/register', {
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
        alert('خطأ في الاتصال بالسيرفر');
    }
}

// بدء الدردشة (محدث)
function startChat() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // الاتصال بالسيرفر Python
    socket = io(); // سيصل تلقائياً إلى نفس النطاق

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
    socket.on('system_message', (message) => {
        addSystemMessage(message);
    });

    // معرفة من يكتب الآن
    socket.on('user_typing', (data) => {
        showTypingIndicator(data.user, data.isTyping);
    });

    // إضافة مؤشر الكتابة
    let typingTimeout;
    document.getElementById('message-input').addEventListener('input', function() {
        if(currentUser) {
            socket.emit('typing', { user: currentUser, isTyping: true });
            
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit('typing', { user: currentUser, isTyping: false });
            }, 1000);
        }
    });
}

// عرض مؤشر الكتابة
function showTypingIndicator(username, isTyping) {
    let indicator = document.getElementById('typing-indicator');
    
    if(!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.style.cssText = `
            padding: 5px 10px;
            font-style: italic;
            color: #666;
            font-size: 14px;
        `;
        document.getElementById('chat-messages').appendChild(indicator);
    }
    
    if(isTyping) {
        indicator.textContent = `${username} يكتب الآن...`;
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

// ... باقي الدوال تبقى كما هي ...

// إضافة تحميل المستخدمين عند البدء
async function loadAllUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        console.log('المستخدمون المسجلون:', users);
    } catch(error) {
        console.error('Error loading users:', error);
    }
}

window.onload = function() {
    const savedUser = localStorage.getItem('currentUser');
    if(savedUser) {
        currentUser = savedUser;
        startChat();
    }
    loadAllUsers();
};
