// ===== متعدد اللغات =====
const translations = {
    ar: {
        // التطبيق
        app_name: "دردشة العراق",
        welcome_title: "دردشة العراق",
        welcome_subtitle: "منصة التواصل العراقية الأولى للتعارف والصداقات",
        loading: "جاري التحميل...",
        
        // المصادقة
        login: "تسجيل الدخول",
        register: "إنشاء حساب",
        logout: "تسجيل الخروج",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        confirm_password: "تأكيد كلمة المرور",
        full_name: "الاسم الكامل",
        username: "اسم المستخدم",
        age: "العمر",
        city: "المدينة",
        create_account: "إنشاء حساب جديد",
        forgot_password: "نسيت كلمة المرور؟",
        no_account: "ليس لديك حساب؟",
        have_account: "لديك حساب بالفعل؟",
        
        // الميزات
        feature1_title: "آمن ومحمي",
        feature1_desc: "حماية بياناتك هي أولويتنا",
        feature2_title: "سريع ومباشر",
        feature2_desc: "دردشة فورية بدون تأخير",
        feature3_title: "تواصل حقيقي",
        feature3_desc: "تعرف على أشخاص حقيقيين",
        
        // التنقل
        profile: "الملف الشخصي",
        settings: "الإعدادات",
        admin: "لوحة المشرف",
        chats: "المحادثات",
        contacts: "جهات الاتصال",
        discover: "اكتشف",
        new_chat: "محادثة جديدة",
        search: "بحث",
        
        // الدردشة
        type_message: "اكتب رسالة...",
        online: "متصل",
        offline: "غير متصل",
        typing: "يكتب الآن...",
        last_seen: "آخر ظهور",
        today: "اليوم",
        yesterday: "أمس",
        sent: "تم الإرسال",
        delivered: "تم التوصيل",
        read: "تمت القراءة",
        delete: "حذف",
        edit: "تعديل",
        forward: "إعادة توجيه",
        copy: "نسخ",
        
        // البحث
        search_placeholder: "ابحث عن محادثة...",
        search_users: "ابحث عن مستخدم...",
        no_results: "لا توجد نتائج",
        
        // الإشعارات
        notification: "إشعار",
        message_received: "رسالة جديدة",
        user_online: "المستخدم متصل الآن",
        user_offline: "المستخدم غير متصل",
        
        // الأخطاء
        error: "خطأ",
        connection_error: "فقد الاتصال بالخادم",
        login_error: "خطأ في تسجيل الدخول",
        register_error: "خطأ في إنشاء الحساب",
        validation_error: "الرجاء ملء جميع الحقول",
        password_mismatch: "كلمتا المرور غير متطابقتين",
        
        // النجاح
        success: "نجاح",
        login_success: "تم تسجيل الدخول بنجاح",
        register_success: "تم إنشاء الحساب بنجاح",
        profile_updated: "تم تحديث الملف الشخصي",
        message_sent: "تم إرسال الرسالة",
        
        // المشرف
        admin_panel: "لوحة التحكم للمشرف",
        total_users: "إجمالي المستخدمين",
        active_users: "المستخدمون النشطون",
        total_messages: "إجمالي الرسائل",
        today_messages: "رسائل اليوم",
        user_list: "قائمة المستخدمين",
        actions: "الإجراءات",
        delete_user: "حذف مستخدم",
        ban_user: "حظر مستخدم",
        unban_user: "فك حظر مستخدم",
        
        // الإعدادات
        language: "اللغة",
        theme: "المظهر",
        notifications: "الإشعارات",
        privacy: "الخصوصية",
        security: "الأمان",
        help: "المساعدة",
        about: "عن التطبيق"
    },
    
    en: {
        // App
        app_name: "Iraqi Chat",
        welcome_title: "Iraqi Chat",
        welcome_subtitle: "The first Iraqi platform for networking and friendships",
        loading: "Loading...",
        
        // Auth
        login: "Login",
        register: "Register",
        logout: "Logout",
        email: "Email",
        password: "Password",
        confirm_password: "Confirm Password",
        full_name: "Full Name",
        username: "Username",
        age: "Age",
        city: "City",
        create_account: "Create New Account",
        forgot_password: "Forgot Password?",
        no_account: "Don't have an account?",
        have_account: "Already have an account?",
        
        // Features
        feature1_title: "Secure & Protected",
        feature1_desc: "Your data protection is our priority",
        feature2_title: "Fast & Direct",
        feature2_desc: "Instant messaging without delay",
        feature3_title: "Real Connections",
        feature3_desc: "Meet real people from Iraq",
        
        // Navigation
        profile: "Profile",
        settings: "Settings",
        admin: "Admin Panel",
        chats: "Chats",
        contacts: "Contacts",
        discover: "Discover",
        new_chat: "New Chat",
        search: "Search",
        
        // Chat
        type_message: "Type a message...",
        online: "Online",
        offline: "Offline",
        typing: "typing...",
        last_seen: "Last seen",
        today: "Today",
        yesterday: "Yesterday",
        sent: "Sent",
        delivered: "Delivered",
        read: "Read",
        delete: "Delete",
        edit: "Edit",
        forward: "Forward",
        copy: "Copy",
        
        // Search
        search_placeholder: "Search conversations...",
        search_users: "Search users...",
        no_results: "No results found",
        
        // Notifications
        notification: "Notification",
        message_received: "New message",
        user_online: "User is now online",
        user_offline: "User is offline",
        
        // Errors
        error: "Error",
        connection_error: "Connection to server lost",
        login_error: "Login failed",
        register_error: "Registration failed",
        validation_error: "Please fill all fields",
        password_mismatch: "Passwords do not match",
        
        // Success
        success: "Success",
        login_success: "Login successful",
        register_success: "Account created successfully",
        profile_updated: "Profile updated",
        message_sent: "Message sent",
        
        // Admin
        admin_panel: "Admin Dashboard",
        total_users: "Total Users",
        active_users: "Active Users",
        total_messages: "Total Messages",
        today_messages: "Today's Messages",
        user_list: "User List",
        actions: "Actions",
        delete_user: "Delete User",
        ban_user: "Ban User",
        unban_user: "Unban User",
        
        // Settings
        language: "Language",
        theme: "Theme",
        notifications: "Notifications",
        privacy: "Privacy",
        security: "Security",
        help: "Help",
        about: "About"
    },
    
    ku: {
        // App
        app_name: "چاتێکی عێراقی",
        welcome_title: "چاتێکی عێراقی",
        welcome_subtitle: "یەکەم پلاتفۆرمی عێراقی بۆ پەیوەندی و دۆستایەتی",
        loading: "بارکردن...",
        
        // Auth
        login: "چوونەژوورەوە",
        register: "دروستکردنی هەژمار",
        logout: "چوونەدەرەوە",
        email: "ئیمەیڵ",
        password: "وشەی نهێنی",
        confirm_password: "دڵنیابوونەوەی وشەی نهێنی",
        full_name: "ناوی تەواو",
        username: "ناوی بەکارهێنەر",
        age: "تەمەن",
        city: "شار",
        create_account: "دروستکردنی هەژماری نوێ",
        forgot_password: "وشەی نهێنیت لەبیرچووە؟",
        no_account: "هەژمارت نییە؟",
        have_account: "هەژمارت هەیە؟",
        
        // Features
        feature1_title: "پارێزراو و ئاسایش",
        feature1_desc: "پاراستنی زانیاریەکانت لە پلەی یەکەمدایە",
        feature2_title: "خێرا و ڕاستەوخۆ",
        feature2_desc: "نامەگوزاری خێرا بێ دوایەخ",
        feature3_title: "پەیوەندی ڕاستەقینە",
        feature3_desc: "خەڵکی ڕاستەقینەی عێراق ببینە",
        
        // Navigation
        profile: "پڕۆفایل",
        settings: "ڕێکخستنەکان",
        admin: "پەنڵی بەڕێوەبەر",
        chats: "چاتەکان",
        contacts: "پەیوەندیەکان",
        discover: "دۆزینەوە",
        new_chat: "چاتی نوێ",
        search: "گەڕان",
        
        // Chat
        type_message: "نامەیەک بنووسە...",
        online: "سەرهێڵ",
        offline: "ئۆفڵاین",
        typing: "نووسین...",
        last_seen: "کۆتایی بینین",
        today: "ئەمڕۆ",
        yesterday: "دوێنێ",
        sent: "نێردرا",
        delivered: "گەیێنرا",
        read: "خوێنرا",
        delete: "سڕینەوە",
        edit: "دەستکاری",
        forward: "ناردن",
        copy: "کۆپیکردن",
        
        // Search
        search_placeholder: "گەڕان بۆ گفتوگۆکان...",
        search_users: "گەڕان بەدوای بەکارهێنەران...",
        no_results: "هیچ ئەنجامێک نەدۆزرایەوە",
        
        // Notifications
        notification: "ئاگادارکردنەوە",
        message_received: "نامەیەکی نوێ",
        user_online: "بەکارهێنەر ئێستا سەرهێڵە",
        user_offline: "بەکارهێنەر ئۆفڵاینە",
        
        // Errors
        error: "هەڵە",
        connection_error: "پەیوەندی بە سێرڤەرەوە لەدەستچوو",
        login_error: "چوونەژوورەوە سەرکەوتوو نەبوو",
        register_error: "دروستکردنی هەژمار سەرکەوتوو نەبوو",
        validation_error: "تکایە هەموو خانەکان پر بکە",
        password_mismatch: "وشە نهێنیەکان یەک ناگونجێن",
        
        // Success
        success: "سەرکەوتن",
        login_success: "چوونەژوورەوە سەرکەوتوو بوو",
        register_success: "هەژمار بە سەرکەوتوویی دروستکرا",
        profile_updated: "پڕۆفایل نوێکرایەوە",
        message_sent: "نامە نێردرا",
        
        // Admin
        admin_panel: "داشبۆردی بەڕێوەبەر",
        total_users: "کۆی بەکارهێنەران",
        active_users: "بەکارهێنەرانی چالاک",
        total_messages: "کۆی نامەکان",
        today_messages: "نامەکانی ئەمڕۆ",
        user_list: "لیستی بەکارهێنەران",
        actions: "کردارەکان",
        delete_user: "سڕینەوەی بەکارهێنەر",
        ban_user: "قەدەغەکردنی بەکارهێنەر",
        unban_user: "لابردنی قەدەغە",
        
        // Settings
        language: "زمان",
        theme: "ڕووکار",
        notifications: "ئاگادارکردنەوەکان",
        privacy: "تایبەتمەندی",
        security: "ئاسایش",
        help: "یارمەتی",
        about: "دەربارە"
    }
};

// Language Manager
const LanguageManager = {
    currentLang: 'ar',
    
    init() {
        // Get saved language
        const savedLang = localStorage.getItem('chat_language') || 'ar';
        this.setLanguage(savedLang);
    },
    
    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('chat_language', lang);
            this.updatePage();
            this.updateLanguageSelector();
        }
    },
    
    getText(key) {
        return translations[this.currentLang][key] || key;
    },
    
    updatePage() {
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            const text = this.getText(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // Update page title
        document.title = this.getText('app_name');
    },
    
    updateLanguageSelector() {
        const currentFlag = document.getElementById('currentFlag');
        const currentLang = document.getElementById('currentLang');
        
        if (this.currentLang === 'ar') {
            currentFlag.className = 'fi fi-iq';
            currentLang.textContent = 'العربية';
        } else if (this.currentLang === 'en') {
            currentFlag.className = 'fi fi-us';
            currentLang.textContent = 'English';
        } else if (this.currentLang === 'ku') {
            currentFlag.className = 'fi fi-iq';
            currentLang.textContent = 'Kurdî';
        }
    },
    
    translateObject(obj) {
        const translated = {};
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                translated[key] = this.getText(obj[key]) || obj[key];
            } else {
                translated[key] = obj[key];
            }
        }
        return translated;
    }
};

// Initialize language manager
document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, LanguageManager };
}
