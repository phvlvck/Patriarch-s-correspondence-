// ===== متعدد اللغات =====
const translations = {
    ar: {
        app_name: "دردشة العراق",
        welcome_title: "دردشة العراق",
        welcome_subtitle: "منصة التواصل العراقية الأولى للتعارف والصداقات",
        loading: "جاري التحميل...",
        
        // التنقل
        profile: "الملف الشخصي",
        settings: "الإعدادات",
        admin: "لوحة المشرف",
        chats: "المحادثات",
        contacts: "جهات الاتصال",
        discover: "اكتشف",
        
        // الدردشة
        type_message: "اكتب رسالة...",
        online: "متصل",
        offline: "غير متصل",
        
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
        create_account: "إنشاء حساب جديد"
    },
    
    en: {
        app_name: "Iraqi Chat",
        welcome_title: "Iraqi Chat",
        welcome_subtitle: "The first Iraqi platform for networking and friendships",
        loading: "Loading...",
        
        profile: "Profile",
        settings: "Settings",
        admin: "Admin Panel",
        chats: "Chats",
        contacts: "Contacts",
        discover: "Discover",
        
        type_message: "Type a message...",
        online: "Online",
        offline: "Offline",
        
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
        create_account: "Create New Account"
    },
    
    ku: {
        app_name: "چاتێکی عێراقی",
        welcome_title: "چاتێکی عێراقی",
        welcome_subtitle: "یەکەم پلاتفۆرمی عێراقی بۆ پەیوەندی و دۆستایەتی",
        loading: "بارکردن...",
        
        profile: "پڕۆفایل",
        settings: "ڕێکخستنەکان",
        admin: "پەنڵی بەڕێوەبەر",
        chats: "چاتەکان",
        contacts: "پەیوەندیەکان",
        discover: "دۆزینەوە",
        
        type_message: "نامەیەک بنووسە...",
        online: "سەرهێڵ",
        offline: "ئۆفڵاین",
        
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
        create_account: "دروستکردنی هەژماری نوێ"
    }
};

// إدارة اللغات
const LanguageManager = {
    currentLang: 'ar',
    
    init() {
        // الحصول على اللغة المحفوظة
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
        // تحديث جميع العناصر التي تحتوي على data-lang
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            const text = this.getText(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // تحديث عنوان الصفحة
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
    }
};

// تهيئة إدارة اللغات
document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
});

// تصدير للاستخدام في ملفات أخرى
window.LanguageManager = LanguageManager;
