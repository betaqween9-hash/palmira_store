// ===== المتغيرات العامة =====
let cart = [];
let products = [];
let users = [];
let orders = [];
let notifications = [];
let currentUser = null;
let currentSlide = 0;
let slideInterval;
let currentCurrency = 'SAR'; // العملة الافتراضية (ريال سعودي)

// أسعار الصرف (ثابتة للتطبيق)
const exchangeRates = {
    'SAR': 1,        // ريال سعودي (الأساس)
    'YER': 66.75     // ريال يمني (66.75 ريال يمني = 1 ريال سعودي)
};

const currencySymbols = {
    'SAR': 'ر.س',
    'YER': 'ر.ي'
};

const currencyNames = {
    'SAR': 'ريال سعودي',
    'YER': 'ريال يمني'
};

// ===== بيانات المنتجات =====
const productsData = [
    // العناية بالبشرة
    {
        id: 1,
        brand_id: 9,
        name: 'سيروم فيتامين سي للوجه',
        description: 'سيروم مغذي للبشرة يحتوي على فيتامين سي المركز لنضارة فورية وتوحيد لون البشرة.',
        category: 'skin',
        subcategory: 'face',
        price: 150,
        oldPrice: 200,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop',
        badge: 'خصم 25%',
        isNew: true,
        isSale: true,
        popularity: 95
    },
    {
        id: 2,
        brand_id: 4,
        name: 'كريم مرطب للبشرة الجافة',
        description: 'كريم مرطب بعمق للبشرة شديدة الجفاف، يدوم ترطيبه لمدة 24 ساعة.',
        category: 'skin',
        subcategory: 'face',
        price: 120,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
        badge: 'جديد',
        isNew: true,
        isSale: false,
        popularity: 80
    },
    {
        id: 3,
        brand_id: 1,
        name: 'غسول الوجه بالشاي الأخضر',
        description: 'غسول لطيف على البشرة ينظف بعمق ويقلل من ظهور الحبوب.',
        category: 'skin',
        subcategory: 'face',
        price: 85,
        oldPrice: 100,
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=300&fit=crop',
        badge: 'خصم 15%',
        isNew: false,
        isSale: true,
        popularity: 88
    },
    {
        id: 4,
        brand_id: 9,
        name: 'قناع الطين للوجه',
        description: 'قناع الطين المغربي لتنظيف المسام وإزالة السموم من البشرة.',
        category: 'skin',
        subcategory: 'face',
        price: 95,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 75
    },
    {
        id: 5,
        brand_id: 9,
        name: 'كريم العناية بالعين',
        description: 'كريم متخصص لعلاج الهالات السوداء والانتفاخات حول العين.',
        category: 'skin',
        subcategory: 'eye',
        price: 180,
        oldPrice: 220,
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=300&fit=crop',
        badge: 'خصم 18%',
        isNew: false,
        isSale: true,
        popularity: 82
    },
    {
        id: 6,
        brand_id: 2,
        name: 'مرطب الشفاة بالعسل',
        description: 'مرطب طبيعي للشفاة يمنع التشقق ويمنحها لمعاناً طبيعياً.',
        category: 'skin',
        subcategory: 'lips',
        price: 35,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1606244562472-6b5ed9b9c6c8?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 90
    },
    {
        id: 7,
        brand_id: 3,
        name: 'واقي شمس SPF 50',
        description: 'واقي شمس واسع المدى يحمي من الأشعة فوق البنفسجية ولا يترك أثراً دهنياً.',
        category: 'skin',
        subcategory: 'sun',
        price: 110,
        oldPrice: 140,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
        badge: 'خصم 21%',
        isNew: false,
        isSale: true,
        popularity: 92
    },
    {
        id: 8,
        brand_id: 4,
        name: 'مقشر الجسم بالقهوة',
        description: 'مقشر طبيعي للجسم يقلل من ظهور السيلوليت وينعم الجلد.',
        category: 'skin',
        subcategory: 'body',
        price: 75,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 78
    },
    // العناية بالشعر
    {
        id: 9,
        brand_id: 1,
        name: 'شامبو للشعر الجاف',
        description: 'شامبو مرطب للشعر المصبوغ والجاف يعيد له حيويته.',
        category: 'hair',
        subcategory: 'shampoo',
        price: 65,
        oldPrice: 85,
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=300&fit=crop',
        badge: 'خصم 24%',
        isNew: false,
        isSale: true,
        popularity: 85
    },
    {
        id: 10,
        brand_id: 3,
        name: 'ماسك الشعر بالأرغان',
        description: 'ماسك مكثف لإصلاح الشعر التالف والمتضرر من الحرارة.',
        category: 'hair',
        subcategory: 'mask',
        price: 145,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        badge: 'جديد',
        isNew: true,
        isSale: false,
        popularity: 87
    },
    {
        id: 11,
        brand_id: 1,
        name: 'زيت الشعر بالأفوكادو',
        description: 'زيت طبيعي يغذي فروة الرأس ويساعد في تطويل الشعر.',
        category: 'hair',
        subcategory: 'oil',
        price: 95,
        oldPrice: 120,
        image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop',
        badge: 'خصم 21%',
        isNew: false,
        isSale: true,
        popularity: 83
    },
    {
        id: 12,
        brand_id: 4,
        name: 'بلسم الشعر',
        description: 'بلسم منعم يسهل تسريح الشعر ويمنحه لمعاناً رائعاً.',
        category: 'hair',
        subcategory: 'conditioner',
        price: 55,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 79
    },
    // المكياج
    {
        id: 13,
        brand_id: 10,
        name: 'أحمر شفاه مات',
        description: 'أحمر شفاه مطفي يدوم طويلاً بتركيبة كريمية مريحة.',
        category: 'makeup',
        subcategory: 'lips',
        price: 85,
        oldPrice: 110,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop',
        badge: 'خصم 23%',
        isNew: false,
        isSale: true,
        popularity: 94
    },
    {
        id: 14,
        brand_id: 2,
        name: 'كريم الأساس',
        description: 'كريم أساس بتغطية متوسطة إلى كاملة يمنحك مظهراً طبيعياً.',
        category: 'makeup',
        subcategory: 'face',
        price: 180,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop',
        badge: 'جديد',
        isNew: true,
        isSale: false,
        popularity: 89
    },
    {
        id: 15,
        brand_id: 10,
        name: 'ماسكارا',
        description: 'ماسكارا لتكثيف وتطويل الرموش بدون تكتل.',
        category: 'makeup',
        subcategory: 'eyes',
        price: 75,
        oldPrice: 95,
        image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=300&fit=crop',
        badge: 'خصم 21%',
        isNew: false,
        isSale: true,
        popularity: 91
    },
    {
        id: 16,
        brand_id: 2,
        name: 'ظلال العيون',
        description: 'باليت ظلال عيون بألوان دافئة وتغطية عالية الثبات.',
        category: 'makeup',
        subcategory: 'eyes',
        price: 120,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 86
    },
    // الأجهزة
    {
        id: 17,
        brand_id: 7,
        name: 'مجفف الشعر الاحترافي',
        description: 'مجفف شعر بقوة 2200 واط مع تقنية الأيونات لتقليل الهيشان.',
        category: 'devices',
        subcategory: 'hair-dryer',
        price: 350,
        oldPrice: 450,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
        badge: 'خصم 22%',
        isNew: false,
        isSale: true,
        popularity: 77
    },
    {
        id: 18,
        brand_id: 7,
        name: 'جهاز تمليس الشعر',
        description: 'مكواة شعر سيراميك لتمليس سريع وحماية للشعر من الحرارة.',
        category: 'devices',
        subcategory: 'hair-straightener',
        price: 280,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
        badge: 'جديد',
        isNew: true,
        isSale: false,
        popularity: 80
    },
    // الأم والطفل
    {
        id: 19,
        brand_id: 5,
        name: 'كريم العناية بالأم',
        description: 'كريم مرطب لعلامات التمدد أثناء وبعد الحمل.',
        category: 'baby',
        subcategory: 'mom-care',
        price: 95,
        oldPrice: 120,
        image: 'https://images.unsplash.com/photo-1519689680058-324335c77b99f?w=400&h=300&fit=crop',
        badge: 'خصم 21%',
        isNew: false,
        isSale: true,
        popularity: 81
    },
    {
        id: 20,
        brand_id: 5,
        name: 'شامبو الطفل',
        description: 'شامبو "لا دموع بعد اليوم" لطيف جداً على فروة رأس الطفل.',
        category: 'baby',
        subcategory: 'baby-care',
        price: 45,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 93
    },
    // العطور
    {
        id: 21,
        brand_id: 6,
        name: 'عطر نسائي فاخر',
        description: 'عطر زهري بلمسات من الياسمين والفانيليا، يدوم طويلاً.',
        category: 'perfume',
        subcategory: 'women',
        price: 450,
        oldPrice: 550,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
        badge: 'خصم 18%',
        isNew: false,
        isSale: true,
        popularity: 88
    },
    {
        id: 22,
        brand_id: 7,
        name: 'عطر رجالي كلاسيكي',
        description: 'عطر خشبي قوي يجمع بين العود والصندل للأناقة الكلاسيكية.',
        category: 'perfume',
        subcategory: 'men',
        price: 380,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
        badge: 'جديد',
        isNew: true,
        isSale: false,
        popularity: 84
    },
    // العدسات
    {
        id: 23,
        brand_id: 3,
        name: 'عدسات يومية',
        description: 'عدسات لاصقة مريحة جداً للاستخدام اليومي لمرة واحدة.',
        category: 'lenses',
        subcategory: 'daily',
        price: 150,
        oldPrice: 180,
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
        badge: 'خصم 17%',
        isNew: false,
        isSale: true,
        popularity: 76
    },
    {
        id: 24,
        brand_id: 3,
        name: 'عدسات شهرية',
        description: 'عدسات شهرية عالية الجودة تمنحك رؤية واضحة وراحة طوال اليوم.',
        category: 'lenses',
        subcategory: 'monthly',
        price: 280,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 72
    },
    // المكملات الغذائية
    {
        id: 25,
        brand_id: 8,
        name: 'فيتامينات للشعر',
        description: 'مكمل غذائي يحتوي على البيوتين والزنك لتقوية الشعر ومنع التساقط.',
        category: 'supplements',
        subcategory: 'hair',
        price: 120,
        oldPrice: 150,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        badge: 'خصم 20%',
        isNew: false,
        isSale: true,
        popularity: 79
    },
    {
        id: 26,
        brand_id: 8,
        name: 'كولاجين للبشرة',
        description: 'بودرة كولاجين قابلة للذوبان لتحسين مرونة البشرة وتقليل التجاعيد.',
        category: 'supplements',
        subcategory: 'skin',
        price: 180,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
        badge: 'جديد',
        isNew: true,
        isSale: false,
        popularity: 85
    },
    // أدوات العناية
    {
        id: 27,
        brand_id: 9,
        name: 'فرشاة الوجه',
        description: 'فرشاة تنظيف الوجه السيليكون لإزالة الرؤوس السوداء والشوائب.',
        category: 'tools',
        subcategory: 'face',
        price: 220,
        oldPrice: 280,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
        badge: 'خصم 21%',
        isNew: false,
        isSale: true,
        popularity: 74
    },
    {
        id: 28,
        brand_id: 4,
        name: 'فرشاة الشعر',
        description: 'فرشاة شعر خشبية تقلل من تقصف الشعر وتدلك فروة الرأس.',
        category: 'tools',
        subcategory: 'hair',
        price: 85,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 82
    },
    // معطرات المنزل
    {
        id: 29,
        brand_id: 6,
        name: 'بخور عود',
        description: 'بخور عود طبيعي فاخر لرائحة تدوم طويلاً في المنزل.',
        category: 'home',
        subcategory: 'incense',
        price: 65,
        oldPrice: 80,
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=300&fit=crop',
        badge: 'خصم 19%',
        isNew: false,
        isSale: true,
        popularity: 73
    },
    {
        id: 30,
        brand_id: 6,
        name: 'شمعة عطرية',
        description: 'شمعة عطرية برائحة اللافندر تساعد على الاسترخاء والهدوء.',
        category: 'home',
        subcategory: 'candle',
        price: 45,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1602906009653-2e7c5253c7e8?w=400&h=300&fit=crop',
        badge: null,
        isNew: false,
        isSale: false,
        popularity: 71
    }

];

// ===== بيانات الماركات =====
const brandsData = [
    { id: 1, name: 'لوريال', letter: 'L', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop' },
    { id: 2, name: 'مايبلين', letter: 'M', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
    { id: 3, name: 'نيكيا', letter: 'N', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop' },
    { id: 4, name: 'دوف', letter: 'D', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop' },
    { id: 5, name: 'جونسون', letter: 'J', image: 'https://images.unsplash.com/photo-1519689680058-324335c77b99f?w=200&h=200&fit=crop' },
    { id: 6, name: 'ايف سان لوران', letter: 'Y', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop' },
    { id: 7, name: 'شانيل', letter: 'C', image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200&fit=crop' },
    { id: 8, name: 'ديور', letter: 'D', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' },
    { id: 9, name: 'استي لودر', letter: 'E', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop' },
    { id: 10, name: 'ماك', letter: 'M', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop' }
];

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    loadUsers();
    loadOrders();
    loadCart();
    loadNotifications();
    loadCurrentUser();
    setupEventListeners();
    renderProducts();
    startSlider();
    updateCartBadge();
    updateNotificationBadge();
    setupScrollToTop();
}

// ===== تحميل البيانات =====
function loadProducts() {
    // دائماً نحدث البيانات من المصدر لضمان وجود brand_id
    products = productsData;
    localStorage.setItem('palmiraProducts', JSON.stringify(products));
}


function loadUsers() {
    const savedUsers = localStorage.getItem('palmiraUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

function loadOrders() {
    const savedOrders = localStorage.getItem('palmiraOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

function loadCart() {
    const savedCart = localStorage.getItem('palmiraCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function loadNotifications() {
    const savedNotifications = localStorage.getItem('palmiraNotifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    } else {
        notifications = [
            {
                id: 1,
                title: 'مرحباً بك في بالميرا ستور',
                message: 'تم إنشاء حسابك بنجاح. استمتعي بالتسوق!',
                time: new Date().toISOString(),
                read: false
            }
        ];
        localStorage.setItem('palmiraNotifications', JSON.stringify(notifications));
    }
}

function loadCurrentUser() {
    const savedUser = localStorage.getItem('palmiraCurrentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// ===== إعداد مستمعي الأحداث =====
function setupEventListeners() {
    // البحث
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length > 0) {
                document.getElementById('searchResults').classList.add('active');
            }
        });
        
        // التعامل مع زر Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                viewAllResults(searchInput.value);
            }
        });
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            viewAllResults(searchInput.value);
        });
    }

    // إغلاق البحث والقوائم عند النقر الخارج
    document.addEventListener('click', (e) => {
        const searchDropdown = document.getElementById('searchDropdown');
        const searchResults = document.getElementById('searchResults');
        const searchToggleBtn = document.querySelector('.search-toggle-btn');
        const menuToggle = document.querySelector('.menu-toggle');
        const dropdownMenu = document.getElementById('dropdownMenu');

        // إغلاق نتائج البحث إذا نقرنا خارج منطقة البحث
        if (searchResults && !searchResults.contains(e.target) && !searchInput.contains(e.target)) {
            searchResults.classList.remove('active');
        }

        // إغلاق قائمة البحث إذا نقرنا خارجها (وليس على زر التبديل)
        if (searchDropdown && !searchDropdown.contains(e.target) && searchToggleBtn && !searchToggleBtn.contains(e.target)) {
            searchDropdown.classList.remove('active');
        }

        // إغلاق القائمة الرئيسية إذا نقرنا خارجها
        if (dropdownMenu && !dropdownMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });


    // القوائم الفرعية
    document.querySelectorAll('.has-submenu').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // نماذج المصادقة
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // تحميل العملة المحفوظة
    loadCurrency();

    // إغلاق dropdown العملة عند النقر خارجها
    document.addEventListener('click', (e) => {
        const currencySelector = document.querySelector('.currency-selector');
        const currencyDropdown = document.getElementById('currencyDropdown');
        if (currencySelector && !currencySelector.contains(e.target) && currencyDropdown) {
            currencyDropdown.classList.remove('active');
        }
    });
}

// ===== نظام العملات =====
function loadCurrency() {
    const savedCurrency = localStorage.getItem('palmiraCurrency');
    if (savedCurrency) {
        currentCurrency = savedCurrency;
    }
    updateCurrencyDisplay();
}

function saveCurrency() {
    localStorage.setItem('palmiraCurrency', currentCurrency);
}

function getCurrentCurrency() {
    return currentCurrency;
}

function setCurrency(currency) {
    if (currency !== 'SAR' && currency !== 'YER') return;

    currentCurrency = currency;
    saveCurrency();
    updateCurrencyDisplay();
    updateAllPrices();
    toggleCurrencyDropdown();

    showToast(`تم تغيير العملة إلى ${currencyNames[currency]}`);
}

function toggleCurrencyDropdown() {
    const dropdown = document.getElementById('currencyDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function updateCurrencyDisplay() {
    const symbolElement = document.getElementById('currentCurrencySymbol');
    if (symbolElement) {
        symbolElement.textContent = currencySymbols[currentCurrency];
    }

    // تحديث الخيارات النشطة
    const options = document.querySelectorAll('.currency-option');
    options.forEach(option => {
        option.classList.remove('active');
        if (option.textContent.includes(currencyNames[currentCurrency])) {
            option.classList.add('active');
        }
    });
}

// تحويل السعر من ريال سعودي إلى العملة المحددة
function convertPrice(priceInSAR) {
    if (currentCurrency === 'SAR') {
        return priceInSAR;
    }
    return Math.round(priceInSAR * exchangeRates[currentCurrency]);
}

// تنسيق السعر مع رمز العملة
function formatPrice(price) {
    const convertedPrice = convertPrice(price);
    return `${convertedPrice} ${currencySymbols[currentCurrency]}`;
}

// تحديث جميع الأسعار في التطبيق
function updateAllPrices() {
    // إعادة عرض المنتجات لتحديث الأسعار
    renderProducts();

    // تحديث صفحة تفاصيل المنتج إذا كانت مفتوحة
    const productPage = document.getElementById('productPage');
    if (productPage && !productPage.classList.contains('hidden') && currentProduct) {
        // إعادة تحميل المنتج الحالي مباشرة
        renderProductPage(currentProduct);
    }

    // تحديث السلة
    renderCart();

    // تحديث صفحة الدفع
    renderCheckout();
}

// ===== نظام التنقل SPA =====
function navigateTo(page) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(p => {
        p.classList.add('hidden');
    });

    // إغلاق القائمة المنسدلة
    document.getElementById('dropdownMenu').classList.remove('active');

    // عرض الصفحة المطلوبة
    switch(page) {
        case 'home':
            document.getElementById('homePage').classList.remove('hidden');
            break;
        case 'all-categories':
            document.getElementById('allCategoriesPage').classList.remove('hidden');
            renderAllCategoriesProducts();
            break;
        case 'brands':
            document.getElementById('brandsPage').classList.remove('hidden');
            renderBrands();
            break;
        case 'skin':
            document.getElementById('skinPage').classList.remove('hidden');
            break;
        case 'offers':
            document.getElementById('offersPage').classList.remove('hidden');
            renderOffersProducts();
            break;
        case 'login':
            document.getElementById('loginPage').classList.remove('hidden');
            renderLoginPage();
            break;
        case 'notifications':
            document.getElementById('notificationsPage').classList.remove('hidden');
            renderNotifications();
            break;
        case 'cart':
            document.getElementById('cartPage').classList.remove('hidden');
            renderCart();
            break;
        case 'checkout':
            document.getElementById('checkoutPage').classList.remove('hidden');
            renderCheckout();
            break;
        case 'orders':
            document.getElementById('ordersPage').classList.remove('hidden');
            renderOrders();
            break;
        case 'product':
            document.getElementById('productPage').classList.remove('hidden');
            break;
    }


    window.scrollTo(0, 0);
}

// ===== القائمة المنسدلة =====
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

function toggleSearch() {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchDropdown) {
        searchDropdown.classList.toggle('active');

        if (searchDropdown.classList.contains('active')) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
}


// ===== التحكم في القوائم الفرعية =====
function toggleSubmenu(element) {
    // إغلاق جميع القوائم الفرعية في نفس المستوى
    const parent = element.parentElement;
    const siblings = parent.parentElement.querySelectorAll(':scope > .has-submenu');
    siblings.forEach(sibling => {
        if (sibling !== parent) {
            sibling.classList.remove('active');
        }
    });

    // تبديل حالة القائمة الحالية
    element.classList.toggle('active');
}

// إضافة event listeners للقوائم الفرعية
document.addEventListener('DOMContentLoaded', function() {
    const submenuTriggers = document.querySelectorAll('.has-submenu > span');
    submenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSubmenu(this.parentElement);
        });
    });
});

// ===== سلايدر الإعلانات =====
function startSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function nextSlide() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function updateSlider() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const slideWidth = sliderWrapper.offsetWidth;
    sliderWrapper.style.transform = `translateX(${currentSlide * slideWidth}px)`;
}

// ===== التمرير الأفقي =====
function scrollContainer(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = 300;
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ===== عرض المنتجات المميزة =====
function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    // عرض أول 3 منتجات أو المنتجات المميزة
    const featuredProducts = products.slice(0, 3);

    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// ===== عرض المنتجات =====
function renderProducts() {
    renderCategoryProducts('skinProducts', 'skin');
    renderCategoryProducts('hairProducts', 'hair');
    renderCategoryProducts('makeupProducts', 'makeup');
    renderCategoryProducts('devicesProducts', 'devices');
    renderCategoryProducts('babyProducts', 'baby');
    renderCategoryProducts('perfumeProducts', 'perfume');
    renderCategoryProducts('lensesProducts', 'lenses');
    renderCategoryProducts('supplementsProducts', 'supplements');
    renderCategoryProducts('toolsProducts', 'tools');
    renderCategoryProducts('homeProducts', 'home');
}

function renderCategoryProducts(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categoryProducts = products.filter(p => p.category === category).slice(0, 8);
    
    container.innerHTML = categoryProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

    return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="discount-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                    ${discount > 0 ? `<span class="discount-percentage">-${discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        أضيفي للسلة
                    </button>
                    <button class="quick-add" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <img src="assets/icons/plus.svg" class="icon" alt="add">
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const names = {
        'skin': 'العناية بالبشرة',
        'hair': 'العناية بالشعر',
        'makeup': 'المكياج',
        'devices': 'الأجهزة',
        'baby': 'الأم والطفل',
        'perfume': 'العطور',
        'lenses': 'العدسات',
        'supplements': 'المكملات الغذائية',
        'tools': 'أدوات العناية',
        'home': 'معطرات المنزل'
    };
    return names[category] || category;
}

// ===== عرض جميع المنتجات =====
function renderAllCategoriesProducts(filter = 'new', searchQuery = '') {
    const container = document.getElementById('allCategoriesProducts');
    if (!container) return;

    let filteredProducts = [...products];

    // فلترة البحث أولاً إذا وجدت
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            getCategoryName(product.category).toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // تحديث عنوان الصفحة ليعكس نتائج البحث
        const pageHeader = document.querySelector('#allCategoriesPage .page-header h1');
        if (pageHeader) {
            pageHeader.textContent = `نتائج البحث عن: ${searchQuery}`;
        }
    } else {
        const pageHeader = document.querySelector('#allCategoriesPage .page-header h1');
        if (pageHeader) {
            pageHeader.textContent = `جميع الأقسام`;
        }
    }

    switch(filter) {
        case 'new':
            filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'sale':
            filteredProducts = filteredProducts.filter(p => p.isSale);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">لا توجد منتجات تطابق بحثك</div>';
        return;
    }

    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// ===== تبديل القائمة الفرعية فقط (بدون انتقال) =====
function toggleSubmenuOnly(event, arrowElement) {
    event.stopPropagation();
    const hasSubmenu = arrowElement.closest('.has-submenu');
    if (hasSubmenu) {
        hasSubmenu.classList.toggle('active');
    }
}

// ===== عرض منتجات حسب القسم أو التصنيف الفرعي =====
function showCategoryProducts(category, subcategory = null, categoryName = '') {
    // الانتقال لصفحة جميع الأقسام
    navigateTo('all-categories');

    const container = document.getElementById('allCategoriesProducts');
    if (!container) return;

    // فلترة المنتجات
    let filteredProducts = products.filter(p => p.category === category);

    // إذا كان هناك تصنيف فرعي، نفلتر أكثر
    if (subcategory) {
        filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory);
    }

    // تحديث عنوان الصفحة
    const pageHeader = document.querySelector('#allCategoriesPage .page-header h1');
    if (pageHeader) {
        if (subcategory && categoryName) {
            pageHeader.textContent = categoryName;
        } else {
            pageHeader.textContent = getCategoryName(category);
        }
    }

    // عرض المنتجات
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.5;"></i>
                <p style="font-size: 18px;">لا توجد منتجات في هذا القسم حالياً</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

    // إغلاق القائمة المنسدلة
    document.getElementById('dropdownMenu').classList.remove('active');
}

// ===== عرض العروض =====
function renderOffersProducts() {
    const container = document.getElementById('offersProducts');
    if (!container) return;

    const offerProducts = products.filter(p => p.isSale);
    container.innerHTML = offerProducts.map(product => createProductCard(product)).join('');
}

// ===== عرض الماركات =====
function renderBrands(filter = 'all') {
    const container = document.getElementById('brandsGrid');
    if (!container) return;

    let filteredBrands = [...brandsData];

    if (filter !== 'all') {
        filteredBrands = brandsData.filter(b => b.letter === filter);
    }

    container.innerHTML = filteredBrands.map(brand => `
        <div class="brand-card" onclick="showBrandProducts(${brand.id})">
            <img src="${brand.image}" alt="${brand.name}">
            <span>${brand.name}</span>
        </div>
    `).join('');
}

function filterBrands(letter) {
    renderBrands(letter);
}

// ===== عرض منتجات نوع البشرة =====
function showSkinTypeProducts(skinType, skinTypeName) {
    // فلترة المنتجات حسب نوع البشرة
    let filteredProducts = [];
    switch(skinType) {
        case 'dry':
            filteredProducts = products.filter(p => p.skinType === 'dry' || (p.category === 'skin' && p.tags && p.tags.includes('dry')));
            break;
        case 'oily':
            filteredProducts = products.filter(p => p.skinType === 'oily' || p.subcategory === 'face' || (p.tags && p.tags.includes('oily')));
            break;
        case 'sensitive':
            filteredProducts = products.filter(p => p.skinType === 'sensitive' || p.forSensitive || (p.tags && p.tags.includes('sensitive')));
            break;
        case 'firming':
            filteredProducts = products.filter(p => p.skinType === 'firming' || p.subcategory === 'anti-aging' || (p.tags && p.tags.includes('firming')));
            break;
        case 'damaged':
            filteredProducts = products.filter(p => p.skinType === 'damaged' || p.forDamaged || (p.tags && p.tags.includes('damaged')));
            break;
        case 'acne':
            filteredProducts = products.filter(p => p.skinType === 'acne' || p.forAcne || p.subcategory === 'acne' || (p.tags && p.tags.includes('acne')));
            break;
        default:
            filteredProducts = products.filter(p => p.category === 'skin');
    }

    // إذا لم توجد منتجات مخصصة، نعرض جميع منتجات البشرة
    if (filteredProducts.length === 0) {
        filteredProducts = products.filter(p => p.category === 'skin');
    }

    // تحديث العناوين
    const titleEl = document.getElementById('skinPageTitle');
    const breadcrumbEl = document.getElementById('skinBreadcrumb');
    const productsTitleEl = document.getElementById('skinProductsTitle');
    if (titleEl) titleEl.textContent = skinTypeName || 'منتجات البشرة';
    if (breadcrumbEl) breadcrumbEl.textContent = skinTypeName || 'العناية بالبشرة';
    if (productsTitleEl) productsTitleEl.textContent = skinTypeName || 'منتجات البشرة';

    // إخفاء الشبكة وإظهار المنتجات
    const typesSection = document.getElementById('skinTypesSection');
    const productsSection = document.getElementById('skinProductsSection');
    const productsGrid = document.getElementById('skinProductsGrid');

    if (typesSection) typesSection.classList.add('hidden');
    if (productsSection) productsSection.classList.remove('hidden');

    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.5;"></i>
                <p style="font-size: 18px;">لا توجد منتجات لنوع البشرة المحدد</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

    // الانتقال لصفحة البشرة إذا لم نكن فيها
    const skinPage = document.getElementById('skinPage');
    if (skinPage && skinPage.classList.contains('hidden')) {
        navigateTo('skin');
    }
}

function backToSkinTypes() {
    const typesSection = document.getElementById('skinTypesSection');
    const productsSection = document.getElementById('skinProductsSection');
    const titleEl = document.getElementById('skinPageTitle');
    const breadcrumbEl = document.getElementById('skinBreadcrumb');

    if (typesSection) typesSection.classList.remove('hidden');
    if (productsSection) productsSection.classList.add('hidden');
    if (titleEl) titleEl.textContent = 'العناية بالبشرة';
    if (breadcrumbEl) breadcrumbEl.textContent = 'العناية بالبشرة';
}


// ===== عرض منتجات الماركة =====
function showBrandProducts(brandId) {
    const brand = brandsData.find(b => b.id === brandId);
    const filteredProducts = products.filter(p => p.brand_id === brandId);

    // تحديث العناوين
    const titleEl = document.getElementById('brandsPageTitle');
    const subtitleEl = document.getElementById('brandsPageSubtitle');
    const breadcrumbEl = document.getElementById('brandsBreadcrumb');
    const productsTitleEl = document.getElementById('brandProductsTitle');

    if (titleEl) titleEl.textContent = brand ? `منتجات ${brand.name}` : 'منتجات الماركة';
    if (subtitleEl) subtitleEl.textContent = brand ? `${filteredProducts.length} منتج` : '';
    if (breadcrumbEl) breadcrumbEl.textContent = brand ? brand.name : 'الماركة';
    if (productsTitleEl) productsTitleEl.textContent = brand ? brand.name : '';

    // إخفاء قائمة الماركات وإظهار المنتجات
    const listSection = document.getElementById('brandsListSection');
    const productsSection = document.getElementById('brandProductsSection');
    const productsGrid = document.getElementById('brandProductsGrid');

    if (listSection) listSection.classList.add('hidden');
    if (productsSection) productsSection.classList.remove('hidden');

    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.5;"></i>
                <p style="font-size: 18px;">لا توجد منتجات لهذه الماركة حالياً</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

    // الانتقال لصفحة الماركات إذا لم نكن فيها
    const brandsPage = document.getElementById('brandsPage');
    if (brandsPage && brandsPage.classList.contains('hidden')) {
        navigateTo('brands');
    }
}

function backToBrandsList() {
    const listSection = document.getElementById('brandsListSection');
    const productsSection = document.getElementById('brandProductsSection');
    const titleEl = document.getElementById('brandsPageTitle');
    const subtitleEl = document.getElementById('brandsPageSubtitle');
    const breadcrumbEl = document.getElementById('brandsBreadcrumb');

    if (listSection) listSection.classList.remove('hidden');
    if (productsSection) productsSection.classList.add('hidden');
    if (titleEl) titleEl.textContent = 'الماركات';
    if (subtitleEl) subtitleEl.textContent = 'جميع الماركات';
    if (breadcrumbEl) breadcrumbEl.textContent = 'الماركات';
}


// ===== عرض منتجات الفئة المختارة =====
function showShopByCategory(category, categoryName) {
    // تحويل اسم القسم إلى معرف
    const categoryMap = {
        'العناية بالبشرة': 'skin',
        'العناية بالشعر': 'hair',
        'المكياج': 'makeup',
        'الأجهزة': 'devices',
        'الأم والطفل': 'baby',
        'العطور': 'perfume',
        'العدسات': 'lenses',
        'المكملات الغذائية': 'supplements',
        'أدوات العناية': 'tools',
        'معطرات المنزل': 'home'
    };

    const categoryId = categoryMap[category] || category;
    showCategoryProducts(categoryId, null, categoryName);
}

// ===== عرض منتجات الماركة بالاسم =====
function showBrandProductsByName(brandName) {
    navigateTo('all-categories');

    const container = document.getElementById('allCategoriesProducts');
    if (!container) return;

    // فلترة المنتجات حسب اسم الماركة
    let filteredProducts = products.filter(p =>
        p.brand === brandName ||
        p.brandName === brandName ||
        (p.name && p.name.toLowerCase().includes(brandName.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(brandName.toLowerCase()))
    );

    // تحديث عنوان الصفحة
    const pageHeader = document.querySelector('#allCategoriesPage .page-header h1');
    if (pageHeader) {
        pageHeader.textContent = `منتجات ${brandName}`;
    }

    // عرض المنتجات
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.5;"></i>
                <p style="font-size: 18px;">لا توجد منتجات لهذه الماركة حالياً</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// ===== الفلترة =====
function filterProducts(filter) {
    renderAllCategoriesProducts(filter);
}

// ===== نظام البحث =====
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    if (!resultsContainer) return;

    if (query.length < 1) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('active');
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        getCategoryName(product.category).toLowerCase().includes(query)
    );

    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>لا توجد نتائج تطابق "${query}"</p>
            </div>
        `;
        resultsContainer.classList.add('active');
        return;
    }

    resultsContainer.innerHTML = `
        <div class="search-results-header">نتائج البحث (${filteredProducts.length})</div>
        <div class="search-results-list">
            ${filteredProducts.slice(0, 8).map(product => `
                <div class="search-result-item" onclick="showProductDetails(${product.id})">
                    <div class="search-result-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="search-result-info">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-category">${getCategoryName(product.category)}</div>
                        <div class="search-result-price">${formatPrice(product.price)}</div>
                    </div>
                    <i class="fas fa-chevron-left search-result-arrow"></i>
                </div>
            `).join('')}
        </div>
        ${filteredProducts.length > 8 ? `
            <div class="search-results-footer" onclick="viewAllResults('${query}')">
                عرض جميع النتائج (${filteredProducts.length})
            </div>
        ` : ''}
    `;

    resultsContainer.classList.add('active');
}

function viewAllResults(query) {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchDropdown) searchDropdown.classList.remove('active');
    
    navigateTo('all-categories');
    renderAllCategoriesProducts('new', query);
}


// ===== نظام السلة =====
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartBadge();
    showAddToCartSuccess(product);
}

// عرض Toast نجاح الإضافة للسلة
function showAddToCartSuccess(product) {
    // إزالة أي Toast موجود مسبقاً
    const existingToast = document.querySelector('.cart-success-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-success-toast';
    toast.textContent = 'تم إضافة المنتج إلى السلة';

    document.body.appendChild(toast);

    // إزالة تلقائي بعد 2 ثانية
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}


function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('تم حذف المنتج من السلة');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartBadge();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('palmiraCart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

function getDeliveryFeeSAR() {
    return currentCurrency === 'YER' ? (1000 / exchangeRates['YER']) : 7;
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('cartSubtotal');
    const deliveryElement = document.getElementById('deliveryFeeUI');
    const totalElement = document.getElementById('cartTotal');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">السلة فارغة</div>';
        if (subtotalElement) subtotalElement.textContent = formatPrice(0);
        if (deliveryElement) deliveryElement.textContent = formatPrice(0);
        if (totalElement) totalElement.textContent = formatPrice(0);
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <span class="cart-item-price">${formatPrice(item.price)}</span>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <img src="assets/icons/delete.svg" class="icon" alt="remove">
            </button>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = getDeliveryFeeSAR();
    const finalTotal = subtotal + deliveryFee;

    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (deliveryElement) deliveryElement.textContent = formatPrice(deliveryFee);
    if (totalElement) totalElement.textContent = formatPrice(finalTotal);
}

// ===== نظام المصادقة =====
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[onclick="switchAuthTab('${tab}')"]`).classList.add('active');

    if (tab === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    } else {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    }
}

function renderLoginPage() {
    const authContainer = document.getElementById('authContainer');
    const userProfile = document.getElementById('userProfile');

    if (currentUser) {
        // User is logged in - show profile
        if (authContainer) authContainer.classList.add('hidden');
        if (userProfile) {
            userProfile.classList.remove('hidden');
            document.getElementById('profileName').textContent = currentUser.name;
            document.getElementById('profilePhone').textContent = currentUser.phone;
            document.getElementById('profileEmail').textContent = currentUser.email;
            document.getElementById('profileGovernorate').textContent = currentUser.governorate || '-';
        }
    } else {
        // User is not logged in - show login form
        if (authContainer) authContainer.classList.remove('hidden');
        if (userProfile) userProfile.classList.add('hidden');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('palmiraCurrentUser');
    showToast('تم تسجيل الخروج بنجاح');
    updateNotificationBadge();
    navigateTo('home');
}

function handleLogin(e) {
    e.preventDefault();
    const phone = e.target.querySelector('input[type="tel"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const user = users.find(u => u.phone === phone && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('palmiraCurrentUser', JSON.stringify(user));
        showToast('تم تسجيل الدخول بنجاح');
        updateNotificationBadge();
        navigateTo('home');
    } else {
        showToast('رقم الهاتف أو كلمة المرور غير صحيحة');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = e.target.querySelector('input[placeholder="أدخل اسمك الكامل"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const phone = e.target.querySelector('input[type="tel"]').value;
    const governorate = e.target.querySelector('select').value;
    const password = e.target.querySelector('input[type="password"]').value;

    if (users.find(u => u.email === email)) {
        showToast('البريد الإلكتروني مسجل بالفعل');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        governorate,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('palmiraUsers', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('palmiraCurrentUser', JSON.stringify(newUser));

    showToast('تم إنشاء الحساب بنجاح');
    navigateTo('home');
}

// ===== إتمام الطلب =====
function renderCheckout() {
    if (!currentUser) {
        showToast('يرجى تسجيل الدخول أولاً');
        navigateTo('login');
        return;
    }

    document.getElementById('checkoutName').textContent = currentUser.name;
    document.getElementById('checkoutPhone').textContent = currentUser.phone;
    document.getElementById('checkoutEmail').textContent = currentUser.email;
    document.getElementById('checkoutGovernorate').textContent = currentUser.governorate || '-';

    // تحديث ملخص الطلب
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = getDeliveryFeeSAR();
    const finalTotal = subtotal + deliveryFee;

    const checkoutSubtotalEl = document.getElementById('checkoutSubtotal');
    const checkoutDeliveryFeeEl = document.getElementById('checkoutDeliveryFee');
    const checkoutTotalEl = document.getElementById('checkoutTotal');

    if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = formatPrice(subtotal);
    if (checkoutDeliveryFeeEl) checkoutDeliveryFeeEl.textContent = formatPrice(deliveryFee);
    if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(finalTotal);

    // إعداد حقل الملاحظات
    setupOrderNotes();

    // إعداد رفع صورة إثبات التحويل
    setupTransferProofUpload();

    // إعادة تعيين المتغيرات
    transferProofImage = null;
    selectedPaymentMethod = null;

    // إعادة تعيين واجهة الدفع
    document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('.wallet-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('transferDetails')?.classList.add('hidden');
    document.getElementById('walletDetails')?.classList.add('hidden');

    // إعادة تعيين حقل رفع الصورة
    const fileInput = document.getElementById('transferProof');
    if (fileInput) fileInput.value = '';
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const uploadArea = document.getElementById('proofUploadArea');
    const uploadStatus = document.getElementById('uploadStatus');

    if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
    if (imagePreview) imagePreview.classList.add('hidden');
    if (uploadArea) uploadArea.classList.remove('has-image');
    if (uploadStatus) {
        uploadStatus.textContent = '';
        uploadStatus.className = 'upload-status';
    }
}

// ===== إعداد حقل ملاحظات الطلب =====
function setupOrderNotes() {
    const notesTextarea = document.getElementById('orderNotes');
    const charCount = document.getElementById('notesCharCount');

    if (!notesTextarea || !charCount) return;

    // تحديث عداد الأحرف عند الكتابة
    notesTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;

        // تغيير اللون عند الاقتراب من الحد الأقصى
        if (currentLength >= 280) {
            charCount.parentElement.style.color = '#e74c3c';
        } else if (currentLength >= 250) {
            charCount.parentElement.style.color = '#f39c12';
        } else {
            charCount.parentElement.style.color = 'var(--text-light)';
        }
    });

    // تنظيف الحقل عند مغادرة الصفحة
    notesTextarea.value = '';
    charCount.textContent = '0';
}

// ===== اختيار طريقة الدفع =====
let selectedPaymentMethod = null;

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    // تحديث Radio buttons
    document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
        radio.checked = radio.value === method;
    });

    // إخفاء جميع التفاصيل
    document.getElementById('transferDetails').classList.add('hidden');
    document.getElementById('walletDetails').classList.add('hidden');

    // إعادة تعيين اختيار طريقة الدفع الفرعية عند تغيير الطريقة الرئيسية
    if (method !== 'transfer') {
        document.querySelectorAll('.wallet-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // إظهار التفاصيل المناسبة
    if (method === 'transfer') {
        document.getElementById('transferDetails').classList.remove('hidden');
        document.getElementById('walletDetails').classList.remove('hidden');
    }

    // إظهار إشعار التأكيد
    if (method === 'cash') {
        showToast('تم اختيار الدفع عند استلام الطلب');
    } else if (method === 'transfer') {
        showToast('تم اختيار الدفع الإلكتروني - يرجى اختيار طريقة التحويل');
    }
}

// ===== اختيار طريقة الدفع الفرعية (البنك أو المحافظ) =====
function selectPaymentOption(option) {
    selectedPaymentMethod = option;

    // تحديث active state للأزرار
    document.querySelectorAll('.wallet-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.wallet-btn').classList.add('active');

    // إظهار إشعار التأكيد
    const optionNames = {
        'bank': 'البنك',
        'paytabs': 'ون كاش',
        'jeib': 'جيب',
        'flousk': 'فلوسك'
    };
    showToast(`تم اختيار ${optionNames[option] || option}`);
}

// ===== التحديد التلقائي للموقع عبر GPS =====
function autoDetectLocation() {
    const locationInput = document.getElementById('deliveryLocationInput');
    const autoDetectBtn = document.getElementById('autoDetectBtn');
    const verifyMapBtn = document.getElementById('verifyMapBtn');
    const locationHint = document.getElementById('locationHint');

    // التحقق من دعم المتصفح
    if (!navigator.geolocation) {
        showToast('المتصفح لا يدعم خدمة تحديد الموقع');
        return;
    }

    // تغيير حالة الزر إلى "جاري التحديد..."
    if (autoDetectBtn) {
        autoDetectBtn.innerHTML = '<img src="assets/icons/loading.svg" class="icon icon-white fa-spin" alt="loading">';
        autoDetectBtn.title = 'جاري تحديد الموقع...';
    }

    if (locationHint) {
        locationHint.textContent = 'جاري تحديد موقعك، يرجى الانتظار...';
        locationHint.style.color = 'var(--primary-color)';
    }

    // استخدام HTML5 Geolocation API
    navigator.geolocation.getCurrentPosition(
        // نجاح التحديد
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            // حفظ الإحداثيات
            document.getElementById('deliveryLat').value = latitude;
            document.getElementById('deliveryLng').value = longitude;

            // عرض الإحداثيات في الحقل
            if (locationInput) {
                locationInput.value = `الموقع: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (دقة: ${Math.round(accuracy)}م)`;
            }

            // إظهار زر التأكد من الخريطة
            if (verifyMapBtn) {
                verifyMapBtn.style.display = 'flex';
            }

            // إعادة الزر لوضعه الطبيعي
            if (autoDetectBtn) {
                autoDetectBtn.innerHTML = '<img src="assets/icons/check.svg" class="icon icon-white" alt="check">';
                autoDetectBtn.style.background = '#27ae60';
                autoDetectBtn.title = 'تم التحديد بنجاح';
            }

            if (locationHint) {
                locationHint.textContent = 'تم تحديد موقعك بنجاح! يمكنك التأكد بالضغط على زر Google';
                locationHint.style.color = '#27ae60';
            }

            showToast('تم تحديد موقعك بنجاح');
        },
        // فشل التحديد
        (error) => {
            let errorMsg = 'تعذر تحديد الموقع';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = 'تم رفض الوصول للموقع. يرجى السماح بالوصول';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = 'معلومات الموقع غير متوفرة';
                    break;
                case error.TIMEOUT:
                    errorMsg = 'انتهى الوقت المحدد لتحديد الموقع';
                    break;
            }

            // إعادة الزر لوضعه الطبيعي
            if (autoDetectBtn) {
                autoDetectBtn.innerHTML = '<img src="assets/icons/location.svg" class="icon icon-white" alt="detect">';
                autoDetectBtn.title = 'تحديد موقعي تلقائياً';
            }

            if (locationHint) {
                locationHint.textContent = errorMsg;
                locationHint.style.color = '#e74c3c';
            }

            showToast(errorMsg);
        },
        // الخيارات
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

// ===== فتح Google Maps للتأكد من الموقع =====
function openGoogleMapsVerify() {
    const lat = document.getElementById('deliveryLat').value;
    const lng = document.getElementById('deliveryLng').value;

    if (!lat || !lng) {
        showToast('لم يتم تحديد الموقع بعد');
        return;
    }

    // فتح Google Maps مع الإحداثيات المحددة
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=18`;
    window.open(mapsUrl, '_blank');
}

// ===== Google Maps Location Picker =====
let mapPickerWindow = null;

function openGoogleMapsPicker() {
    // فتح نافذة خرائط Google مع وضع تحديد الموقع
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // فتح Google Maps في تبويب جديد
    const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=الموقع+الحالي';

    mapPickerWindow = window.open(
        mapsUrl,
        'GoogleMapsPicker',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    showToast('افتح Google Maps، ابحث عن موقعك، ثم عد للإدخال اليدوي');
    showMapPickerModal();
}

function showMapPickerModal() {
    // إنشاء مودال مخصص لتحديد الموقع
    const modal = document.createElement('div');
    modal.id = 'mapPickerModal';
    modal.className = 'map-picker-modal';
    modal.innerHTML = `
        <div class="map-picker-overlay" onclick="closeMapPicker()"></div>
        <div class="map-picker-container">
            <div class="map-picker-header">
                <h3><i class="fas fa-map-marked-alt"></i> تحديد موقع التوصيل</h3>
                <button onclick="closeMapPicker()" class="close-map-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="map-picker-instructions">
                <p>ابحث عن موقعك في الخريطة، ثم انسخ الرابط أو الإحداثيات</p>
            </div>
            <div class="map-picker-options">
                <div class="map-option" onclick="openGoogleMapsTab()">
                    <i class="fab fa-google"></i>
                    <span>فتح Google Maps</span>
                    <small>في تبويب جديد</small>
                </div>
                <div class="manual-coords">
                    <label>أو أدخل الإحداثيات يدوياً:</label>
                    <div class="coords-inputs">
                        <input type="number" id="manualLat" placeholder="خط العرض (Latitude)" step="any">
                        <input type="number" id="manualLng" placeholder="خط الطول (Longitude)" step="any">
                    </div>
                    <button onclick="saveManualCoords()" class="save-coords-btn">
                        <i class="fas fa-check"></i> حفظ الإحداثيات
                    </button>
                </div>
            </div>
            <div class="map-picker-footer">
                <button onclick="getCurrentLocationForDelivery()" class="current-location-btn">
                    <i class="fas fa-crosshairs"></i> استخدام موقعي الحالي
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeMapPicker() {
    const modal = document.getElementById('mapPickerModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function openGoogleMapsTab() {
    // فتح Google Maps في تبويب جديد مع البحث عن الموقع الحالي
    const url = 'https://www.google.com/maps/search/?api=1&query=الموقع+الحالي';
    window.open(url, '_blank');

    showToast('افتح Google Maps، ابحث عن موقعك، ثم انسخ الرابط');
}

function saveManualCoords() {
    const lat = document.getElementById('manualLat').value;
    const lng = document.getElementById('manualLng').value;

    if (!lat || !lng) {
        showToast('يرجى إدخال الإحداثيات');
        return;
    }

    setDeliveryLocation(lat, lng, 'الموقع المحدد يدوياً');
    closeMapPicker();
    showToast('تم حفظ الموقع بنجاح');
}

function getCurrentLocationForDelivery() {
    if (!navigator.geolocation) {
        showToast('المتصفح لا يدعم تحديد الموقع');
        return;
    }

    const btn = document.querySelector('.current-location-btn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديد...';
        btn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setDeliveryLocation(lat, lng, 'الموقع الحالي (GPS)');
            closeMapPicker();
            showToast('تم تحديد موقعك بنجاح');
        },
        (error) => {
            showToast('تعذر تحديد الموقع: ' + error.message);
            if (btn) {
                btn.innerHTML = '<i class="fas fa-crosshairs"></i> استخدام موقعي الحالي';
                btn.disabled = false;
            }
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function setDeliveryLocation(lat, lng, description) {
    const locationInput = document.getElementById('deliveryLocationInput');
    const latInput = document.getElementById('deliveryLat');
    const lngInput = document.getElementById('deliveryLng');

    if (locationInput) {
        locationInput.value = description || `الموقع: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
    if (latInput) latInput.value = lat;
    if (lngInput) lngInput.value = lng;
}

// ===== إثبات التحويل البنكي =====
let transferProofImage = null; // تخزين الصورة كـ base64

function setupTransferProofUpload() {
    const uploadArea = document.getElementById('proofUploadArea');
    const fileInput = document.getElementById('transferProof');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = imagePreview?.querySelector('img');
    const uploadStatus = document.getElementById('uploadStatus');

    if (!uploadArea || !fileInput) return;

    // فتح نافذة اختيار الملف عند الضغط على المنطقة
    uploadArea.addEventListener('click', (e) => {
        if (e.target.closest('.change-image-btn')) return; // لا تفتح إذا ضغط على زر التغيير
        fileInput.click();
    });

    // معالجة اختيار الملف
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // التحقق من نوع الملف
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            showUploadStatus('يجب أن تكون الصورة بصيغة JPG أو PNG فقط', 'error');
            return;
        }

        // التحقق من حجم الملف (أقصى 5 ميجا)
        if (file.size > 5 * 1024 * 1024) {
            showUploadStatus('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'error');
            return;
        }

        // قراءة الملف وتحويله إلى base64
        const reader = new FileReader();
        reader.onload = (event) => {
            transferProofImage = event.target.result;

            // عرض المعاينة
            if (previewImg) {
                previewImg.src = transferProofImage;
            }

            // إخفاء placeholder وإظهار المعاينة
            uploadPlaceholder.classList.add('hidden');
            imagePreview.classList.remove('hidden');
            uploadArea.classList.add('has-image');

            showUploadStatus('تم رفع الصورة بنجاح ✓', 'success');
        };

        reader.onerror = () => {
            showUploadStatus('حدث خطأ أثناء قراءة الصورة', 'error');
        };

        reader.readAsDataURL(file);
    });
}

function showUploadStatus(message, type) {
    const uploadStatus = document.getElementById('uploadStatus');
    if (!uploadStatus) return;

    uploadStatus.textContent = message;
    uploadStatus.className = `upload-status ${type}`;

    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        uploadStatus.textContent = '';
        uploadStatus.className = 'upload-status';
    }, 5000);
}

function changeProofImage() {
    const fileInput = document.getElementById('transferProof');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const uploadArea = document.getElementById('proofUploadArea');

    // إعادة تعيين الحقول
    fileInput.value = '';
    transferProofImage = null;

    // إظهار placeholder وإخفاء المعاينة
    uploadPlaceholder.classList.remove('hidden');
    imagePreview.classList.add('hidden');
    uploadArea.classList.remove('has-image');

    showUploadStatus('يرجى اختيار صورة جديدة', '');

    // فتح نافذة اختيار الملف
    setTimeout(() => fileInput.click(), 100);
}

function completeOrder() {
    // التحقق من تسجيل الدخول
    if (!currentUser) {
        showToast('❌ يرجى تسجيل الدخول أولاً');
        navigateTo('login');
        return;
    }

    if (cart.length === 0) {
        showToast('السلة فارغة');
        return;
    }

    // ===== التحقق 1: تحديد موقع التوصيل =====
    const deliveryLat = document.getElementById('deliveryLat')?.value;
    const deliveryLng = document.getElementById('deliveryLng')?.value;

    if (!deliveryLat || !deliveryLng) {
        showToast('❌ يرجى تحديد موقع التوصيل أولاً');
        // التركيز على قسم الموقع
        document.getElementById('deliveryLocationInput')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // إضافة تأثير خطأ على الحقل
        const locationInput = document.getElementById('deliveryLocationInput');
        if (locationInput) {
            locationInput.style.border = '2px solid #e74c3c';
            setTimeout(() => { locationInput.style.border = ''; }, 3000);
        }
        return;
    }

    // ===== التحقق 2: وصف الموقع بالتفصيل =====
const deliveryDetails = document.querySelector('#checkoutPage textarea')?.value?.trim();   
    if (!deliveryDetails || deliveryDetails.length < 10) {
        showToast('❌ يرجى كتابة وصف تفصيلي للموقع (10 أحرف على الأقل)');
        const detailsField = document.querySelector('textarea[placeholder*="وصف الموقع"]');
        detailsField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // إضافة تأثير خطأ على الحقل
        if (detailsField) {
            detailsField.style.border = '2px solid #e74c3c';
            setTimeout(() => { detailsField.style.border = ''; }, 3000);
        }
        return;
    }

    // ===== التحقق 3: اختيار طريقة الدفع =====
    // طرق الدفع الإلكترونية التي تتطلب إثبات تحويل
    const electronicPaymentMethods = ['bank', 'paytabs', 'jeib', 'flousk'];
    
    if (!selectedPaymentMethod) {
        showToast('❌ يرجى اختيار طريقة الدفع');
        document.querySelector('.payment-methods')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // التحقق من اختيار طريقة الدفع الفرعية عند اختيار "تحويل لمتجر بالميرا"
    if (selectedPaymentMethod === 'transfer') {
        showToast('❌ يرجى اختيار طريقة التحويل (البنك أو إحدى المحافظ الإلكترونية)');
        document.getElementById('walletDetails')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // التحقق من وجود صورة إثبات التحويل عند الدفع الإلكتروني (البنك أو المحافظ)
    if (electronicPaymentMethods.includes(selectedPaymentMethod)) {
        if (!transferProofImage) {
            showToast('❌ يرجى رفع صورة إثبات التحويل قبل إتمام الطلب');
            document.getElementById('proofUploadArea')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = getDeliveryFeeSAR();
    const total = subtotal + deliveryFee;

    // الحصول على ملاحظات الطلب
    const orderNotes = document.getElementById('orderNotes')?.value?.trim() || '';

    const order = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
        userGovernorate: currentUser.governorate,
        deliveryLocation: {
            latitude: deliveryLat,
            longitude: deliveryLng,
            details: deliveryDetails
        },
        items: [...cart],
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        paymentMethod: selectedPaymentMethod,
        notes: orderNotes,
        transferProof: transferProofImage, // صورة إثبات التحويل
        status: 'pending',
        verificationStatus: electronicPaymentMethods.includes(selectedPaymentMethod) ? 'pending_verification' : 'verified', // حالة التحقق
        createdAt: new Date().toISOString()
    };

    orders.push(order);
    localStorage.setItem('palmiraOrders', JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCartBadge();

    addNotification('طلب جديد', `تم استلام طلبك رقم #${order.id} بنجاح`, currentUser.id);

    showToast('✅ تم إرسال طلبك بنجاح!');
    navigateTo('orders');
}

// ===== عرض الطلبات =====
function renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;

    if (!currentUser) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">يرجى تسجيل الدخول لعرض طلباتك</div>';
        return;
    }

    const userOrders = orders.filter(o => o.userId === currentUser.id).reverse();

    if (userOrders.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">لا توجد طلبات حتى الآن</div>';
        return;
    }

    container.innerHTML = userOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">طلب #${order.id}</span>
                <span class="order-status ${order.status}">${getOrderStatusText(order.status)}</span>
            </div>
                        <div class="order-created-at" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #f0f9ff; border-radius: 8px; margin-bottom: 12px; font-size: 13px; color: #666; border-right: 3px solid #3b82f6;">
                <img src="assets/icons/calendar.svg" class="icon" alt="calendar" style="filter: invert(41%) sepia(91%) saturate(1960%) hue-rotate(202deg) brightness(101%) contrast(92%);">
                <span> ${order.created_at || new Date(order.createdAt).toLocaleString('ar-SA')}</span>
            </div>
            ${['bank', 'paytabs', 'jeib', 'flousk'].includes(order.paymentMethod) ? `
                <div class="verification-status ${order.verificationStatus}" style="margin-bottom: 15px; padding: 10px 15px; border-radius: var(--border-radius-small); font-size: 13px; font-weight: 600; text-align: center; background: ${order.verificationStatus === 'verified' ? '#d4edda' : order.verificationStatus === 'rejected' ? '#f8d7da' : '#fff3cd'}; color: ${order.verificationStatus === 'verified' ? '#155724' : order.verificationStatus === 'rejected' ? '#721c24' : '#856404'};">
                    <img src="assets/icons/${order.verificationStatus === 'verified' ? 'check' : order.verificationStatus === 'rejected' ? 'close' : 'loading'}.svg" class="icon ${order.verificationStatus === 'loading' ? 'fa-spin' : ''}" alt="status">
                    ${getVerificationStatusText(order.verificationStatus)}
                </div>
            ` : ''}
            <div class="order-details">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
                ${order.notes ? `
                    <div class="order-notes" style="margin-top: 15px; padding: 12px; background: var(--primary-light); border-radius: var(--border-radius-small); border-right: 3px solid var(--primary-color);">
                        <strong style="display: block; margin-bottom: 6px; color: var(--text-primary);"><img src="assets/icons/note.svg" class="icon" alt="note" style="margin-left: 6px;">ملاحظات الطلب:</strong>
                        <span style="color: var(--text-secondary); font-size: 14px;">${order.notes}</span>
                    </div>
                ` : ''}
            </div>
            <div class="order-total-details" style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 14px;">
                    <span>إجمالي المنتجات:</span>
                    <span>${formatPrice(order.subtotal || (order.total - (order.deliveryFee || 0)))}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 14px;">
                    <span>سعر التوصيل:</span>
                    <span>${formatPrice(order.deliveryFee || 0)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 5px; padding-top: 5px; border-top: 1px dashed var(--border-color); color: var(--primary-color);">
                    <span>الإجمالي النهائي:</span>
                    <span>${formatPrice(order.total)}</span>
                </div>
            </div>
            <div class="order-actions" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <button class="whatsapp-btn" onclick="confirmOrderViaWhatsApp(${order.id})">
                    <img src="assets/icons/whatsapp.svg" class="icon icon-white" alt="whatsapp">
                    تأكيد الطلب عبر واتساب
                </button>
            </div>
        </div>
    `).join('');
}

function getOrderStatusText(status) {
    const statusMap = {
        'pending': 'قيد المراجعة',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التوصيل',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

function getVerificationStatusText(status) {
    const statusMap = {
        'pending_verification': 'بانتظار التحقق من الإيصال',
        'verified': 'تم التحقق من الدفع ✓',
        'rejected': 'تم رفض الإيصال ✗'
    };
    return statusMap[status] || status;
}

// ===== تأكيد الطلب عبر واتساب =====
function confirmOrderViaWhatsApp(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showToast('لم يتم العثور على الطلب');
        return;
    }

    // إنشاء قائمة المنتجات
    const productsList = order.items.map(item =>
        `• ${item.name} - ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`
    ).join('%0A');

    // تحديد طريقة الدفع
    const paymentMethodNames = {
        'cash': 'الدفع عند استلام الطلب',
        'bank': 'تحويل بنكي',
        'paytabs': 'ون كاش',
        'jeib': 'جيب',
        'flousk': 'فلوسك'
    };
    const paymentMethodText = paymentMethodNames[order.paymentMethod] || 'غير محدد';

    // إنشاء نص الرسالة
    // إنشاء نص الرسالة
    const message = `مرحباً، أنا عميل من متجر بالميرا
أرغب بتأكيد طلبي

📋 رقم الطلب: #${order.id}
👤 الاسم: ${order.userName}
📱 رقم الجوال: ${order.userPhone || '-'}
📍 المحافظة: ${order.userGovernorate || '-'}

🛒 المنتجات:
${order.items.map(item => `• ${item.name} - ${item.quantity} × ${formatPrice(item.price)}`).join('\n')}

💰 إجمالي المنتجات: ${formatPrice(order.subtotal || (order.total - (order.deliveryFee || 0)))}
🚚 التوصيل: ${formatPrice(order.deliveryFee || 0)}
💵 الإجمالي النهائي: ${formatPrice(order.total)}

📝 ملاحظات: ${order.notes || 'لا توجد ملاحظات'}

💳 طريقة الدفع: ${paymentMethodText}`;

    // ترميز الرسالة للرابط
    const encodedMessage = encodeURIComponent(message);

    // إنشاء رابط واتساب (رقم اليمن +967)
    const whatsappUrl = `https://wa.me/967776926279?text=${encodedMessage}`;

    // فتح الرابط في نافذة جديدة
    window.open(whatsappUrl, '_blank');
}

// ===== نظام الإشعارات =====
function addNotification(title, message, userId = null) {
    const notification = {
        id: Date.now(),
        userId: userId,
        title,
        message,
        time: new Date().toISOString(),
        read: false
    };

    notifications.unshift(notification);
    localStorage.setItem('palmiraNotifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    if (!currentUser) {
        badge.textContent = '0';
        badge.style.display = 'none';
        return;
    }

    const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

function renderNotifications() {
    const container = document.getElementById('notificationsList');
    if (!container) return;

    if (!currentUser) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">يرجى تسجيل الدخول لعرض الإشعارات الخاصة بك</div>';
        return;
    }

    const userNotifications = notifications.filter(n => n.userId === currentUser.id);

    if (userNotifications.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">لا توجد إشعارات</div>';
        return;
    }

    container.innerHTML = userNotifications.map(notification => `
        <div class="notification-item" style="${!notification.read ? 'background: var(--primary-light);' : ''}">
            <div class="notification-icon">
                <img src="assets/icons/notification.svg" class="icon icon-primary" alt="notification">
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${formatTime(notification.time)}</div>
            </div>
        </div>
    `).join('');

    // تحديد الإشعارات الخاصة بالمستخدم الحالي كمقروءة فقط في الخلفية
    let updated = false;
    notifications.forEach(n => {
        if (n.userId === currentUser.id && !n.read) {
            n.read = true;
            updated = true;
        }
    });
    
    if (updated) {
        localStorage.setItem('palmiraNotifications', JSON.stringify(notifications));
        updateNotificationBadge();
    }
}

function formatTime(timeString) {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} دقيقة`;
    if (diff < 86400000) return `منذ ${Math.floor(diff / 3600000)} ساعة`;
    return date.toLocaleDateString('ar-SA');
}

// ===== Popup =====
function showPopup(type) {
    const modal = document.getElementById('popupModal');
    const body = document.getElementById('popupBody');

    let content = '';

    switch(type) {
        case 'order':
            content = `
                <h3>كيفية الطلب</h3>
                <p>1. تصفحي المنتجات واختياري ما يناسبك</p>
                <p>2. أضيفي المنتجات للسلة</p>
                <p>3. أكملي عملية الشراء</p>
                <p>4. حددي موقعك واكتبي الوصف بالتفصيل</p>
                <p>5. تمتعي بالتوصيل السريع</p>
            `;
            break;
        case 'shipping':
            content = `
                <h3>التوصيل والشحن</h3>
                <p>نوفر خدمة التوصيل السريع لجميع مناطق المملكة</p>
                <p>مدة التوصيل: 2-5 أيام عمل</p>
                <p>التوصيل مجاني للطلبات فوق 200 ر.س</p>
                <p>رسوم التوصيل للطلبات الأقل: 15 ر.س</p>
            `;
            break;
        case 'return':
            content = `
                <h3>الاستبدال والاسترجاع</h3>
                <p>يمكنك استرجاع المنتج خلال 14 يوم من تاريخ الاستلام</p>
                <p>يجب أن يكون المنتج في حالته الأصلية</p>
                <p>نقوم برد المبلغ خلال 7 أيام عمل</p>
                <p>للاسترجاع، تواصلي معنا عبر الواتساب</p>
            `;
            break;
    }

    body.innerHTML = content;
    modal.classList.add('active');
}

function closePopup() {
    document.getElementById('popupModal').classList.remove('active');
}

// ===== روابط خارجية =====
function openEmail() {
    window.location.href = 'mailto:info@palmirastore.com';
}

function openWhatsApp() {
    window.open('https://wa.me/966500000000', '_blank');
}

function openMap() {
    alert('سيتم فتح الخريطة لتحديد الموقع');
}

// ===== زر الرجوع للأعلى =====
function setupScrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== عرض تفاصيل المنتج =====
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // مسح خانة البحث وإخفاء النتائج
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchDropdown = document.getElementById('searchDropdown');

    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.classList.remove('active');
    if (searchDropdown) searchDropdown.classList.remove('active');

    // الانتقال لصفحة المنتج (سنستخدم تنبيه مؤقت حالياً أو ننشئ صفحة بسيطة)
    renderProductPage(product);
    navigateTo('product');
}

let currentProduct = null; // المنتج الحالي المعروض

function renderProductPage(product) {
    const container = document.getElementById('productPage');
    if (!container) return;

    // تخزين المنتج الحالي
    currentProduct = product;
    container.dataset.productId = product.id;

    // دعم صور متعددة للمنتج
    const productImages = product.images || [product.image];

    container.innerHTML = `
        <div class="breadcrumb">
            <a href="#" onclick="navigateTo('home')">الرئيسية</a>
            <span>/</span>
            <a href="#" onclick="navigateTo('all-categories')">${getCategoryName(product.category)}</a>
            <span>/</span>
            <span>${product.name}</span>
        </div>

        <div class="product-detail-container">
            <!-- قسم الصور -->
            <div class="product-detail-images">
                <div class="image-slider" id="imageSlider">
                    ${productImages.map((img, index) => `
                        <div class="slide-item" data-index="${index}">
                            <img src="${img}" alt="${product.name}" onclick="openImagePreview('${img}')">
                        </div>
                    `).join('')}
                </div>
                ${productImages.length > 1 ? `
                    <div class="image-dots">
                        ${productImages.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
                        `).join('')}
                    </div>
                ` : ''}
                ${product.badge ? `<span class="detail-badge">${product.badge}</span>` : ''}
            </div>

            <!-- قسم المعلومات -->
            <div class="product-detail-content">
                <!-- معلومات الماركة -->
                <div class="brand-section">
                    <span class="brand-label">الماركة:</span>
                    <span class="brand-name-text">${product.brand || 'PALMYRA'}</span>
                    <a href="#" class="brand-products-link" onclick="event.stopPropagation(); showBrandProducts('${product.brand || 'PALMYRA'}')">
                        عرض منتجات الماركة
                        <img src="assets/icons/arrow-left.svg" class="icon" alt="back">
                    </a>
                </div>

                <div class="detail-category">${getCategoryName(product.category)}</div>
                <h1 class="detail-name">${product.name}</h1>

                <!-- تفاصيل المنتج -->
                <div class="product-specs">
                    <div class="spec-item">
                        <span class="spec-label">الحجم:</span>
                        <span class="spec-value">${product.size || 'قياس قياسي'}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">العملة:</span>
                        <span class="spec-value">${product.currency || 'ريال سعودي'}</span>
                    </div>
                </div>

                <div class="detail-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>

                <!-- وصف المنتج -->
                <div class="detail-description">
                    <h3>وصف المنتج</h3>
                    <p>${product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}</p>
                </div>

                <div class="detail-usage">
                    <h3>طريقة الاستخدام</h3>
                    <p>${product.usage || 'استخدم المنتج حسب التعليمات الموجودة على العبوة.'}</p>
                </div>

                <div class="detail-actions">
                    <div class="quantity-control">
                        <button onclick="updateDetailQuantity(-1)">-</button>
                        <span id="detailQuantity">1</span>
                        <button onclick="updateDetailQuantity(1)">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, parseInt(document.getElementById('detailQuantity').textContent))">
                        أضيفي للسلة
                        <img src="assets/icons/cart.svg" class="icon icon-white" alt="cart">
                    </button>
                </div>

                <div class="detail-features">
                    <div class="feature-item">
                        <img src="assets/icons/truck.svg" class="icon" alt="truck">
                        <span>توصيل سريع</span>
                    </div>
                    <div class="feature-item">
                        <img src="assets/icons/undo.svg" class="icon" alt="undo">
                        <span>استرجاع سهل</span>
                    </div>
                    <div class="feature-item">
                        <img src="assets/icons/shield.svg" class="icon" alt="shield">
                        <span>منتج أصلي 100%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- منتجات ذات صلة -->
        <div class="related-products-section">
            <div class="section-header">
                <h2>منتجات ذات صلة</h2>
            </div>
            <div class="related-products-scroll">
                ${getRelatedProducts(product.category, product.id).map(p => createProductCard(p)).join('')}
            </div>
        </div>
    `;

    // تهيئة السلايدر
    initImageSlider();
}

// دالة للحصول على منتجات ذات صلة
function getRelatedProducts(category, currentProductId) {
    return products
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, 4);
}

// تهيئة سلايدر الصور
let currentProductSlide = 0;
let touchStartX = 0;
let touchEndX = 0;

function initImageSlider() {
    const slider = document.getElementById('imageSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide-item');
    if (slides.length <= 1) return;

    // دعم اللمس (Swipe)
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    // دعم الماوس
    let isDragging = false;
    let startX = 0;

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    slider.addEventListener('mouseup', (e) => {
        if (isDragging) {
            const diff = startX - e.clientX;
            if (diff > 50) goToSlide(currentProductSlide + 1);
            else if (diff < -50) goToSlide(currentProductSlide - 1);
            isDragging = false;
        }
    });

    slider.addEventListener('mouseleave', () => {
        isDragging = false;
    });
}

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (diff > 50) goToSlide(currentProductSlide + 1);
    else if (diff < -50) goToSlide(currentProductSlide - 1);
}

function goToSlide(index) {
    const slider = document.getElementById('imageSlider');
    const dots = document.querySelectorAll('.image-dots .dot');
    const slides = slider.querySelectorAll('.slide-item');

    if (!slider || slides.length === 0) return;

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentProductSlide = index;
    slider.style.transform = `translateX(-${currentProductSlide * 100}%)`;

    // تحديث النقاط
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentProductSlide);
    });
}

// فتح معاينة الصور بملء الشاشة
function openImagePreview(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
        <div class="preview-content">
            <button class="preview-close" onclick="this.closest('.image-preview-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageSrc}" alt="معاينة الصورة">
        </div>
    `;
    document.body.appendChild(modal);

    // إغلاق عند الضغط خارج الصورة
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}



let detailQuantity = 1;

// ===== Toast Notification =====
function showToast(message) {
    // إنشاء عنصر Toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: var(--background-white);
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        font-weight: 600;
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // إزالة Toast بعد 3 ثواني
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== إدارة العملات =====
function toggleCurrencyDropdown() {
    const dropdown = document.getElementById('currencyDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function setCurrency(currencyCode) {
    currentCurrency = currencyCode;
    localStorage.setItem('palmiraCurrency', currencyCode);
    
    // تحديث الواجهة
    updateCurrencyUI();
    
    // إغلاق القائمة
    const dropdown = document.getElementById('currencyDropdown');
    if (dropdown) dropdown.classList.remove('active');
    
    // إعادة رندر المنتجات والسلة بالعملة الجديدة
    renderProducts();
    renderCart();
    renderAllCategoriesProducts();
    renderOffersProducts();
    
    // إذا كنا في صفحة منتج، نعيد رندره
    const productPage = document.getElementById('productPage');
    if (productPage && !productPage.classList.contains('hidden')) {
        const productId = parseInt(productPage.getAttribute('data-product-id'));
        if (productId) {
            const product = products.find(p => p.id === productId);
            if (product) renderProductPage(product);
        }
    }

    showToast(`تم تغيير العملة إلى ${currencyNames[currencyCode]}`);
}

function updateCurrencyUI() {
    const symbolEl = document.getElementById('currentCurrencySymbol');
    if (symbolEl) {
        symbolEl.textContent = currencySymbols[currentCurrency];
    }
    
    // تحديث الحالة النشطة في القائمة
    document.querySelectorAll('.currency-option').forEach(opt => {
        opt.classList.remove('active');
    });
    const activeOpt = document.getElementById(`currency-${currentCurrency}`);
    if (activeOpt) activeOpt.classList.add('active');
}

function formatPrice(priceSAR) {
    const convertedPrice = priceSAR * exchangeRates[currentCurrency];
    // إذا كانت العملة يمنية، لا نحتاج لكسور عشرية عادةً
    if (currentCurrency === 'YER') {
        return Math.round(convertedPrice).toLocaleString();
    }
    return convertedPrice.toLocaleString();
}

// تعديل createProductCard ليستخدم formatPrice
function createProductCard(product) {
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    
    return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="discount-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)} ${currencySymbols[currentCurrency]}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)} ${currencySymbols[currentCurrency]}</span>` : ''}
                    ${discount > 0 ? `<span class="discount-percentage">-${discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        أضيفي للسلة
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// تحديث initializeApp ليشمل تحميل العملة
const originalInitializeApp = initializeApp;
initializeApp = function() {
    const savedCurrency = localStorage.getItem('palmiraCurrency');
    if (savedCurrency) {
        currentCurrency = savedCurrency;
    }
    originalInitializeApp();
    updateCurrencyUI();
};

