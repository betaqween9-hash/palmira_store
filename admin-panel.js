// ===== Palmira Store Admin Panel =====
// Professional Admin Dashboard with Full Functionality

// ===== Global Variables =====
let currentUser = null;
let currentPage = 'dashboard';
let itemsPerPage = 10;
let charts = {};
let deleteCallback = null;
let deferredPrompt = null;

// Data Stores
let products = [];
let categories = [];
let brands = [];
let skinTypes = [];
let orders = [];
let customers = [];
let users = [];
let offers = [];
let banners = [];
let notifications = [];
let settings = {};
let currencies = [];
let currencyFilter = 'all';

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function () {
    initData();
    checkAuth();
    setupEventListeners();
    setupPWA();
});


// ===== Image Upload Helpers =====
function previewSingleImage(input, previewImgId, placeholderId, hiddenInputId) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataURL = e.target.result;
        const img = document.getElementById(previewImgId);
        const placeholder = document.getElementById(placeholderId);
        const hidden = document.getElementById(hiddenInputId);
        if (img) { img.src = dataURL; img.style.display = 'block'; }
        if (placeholder) placeholder.style.display = 'none';
        if (hidden) hidden.value = dataURL;
    };
    reader.readAsDataURL(file);
}

function resetImgUpload(previewImgId, placeholderId, hiddenInputId) {
    const img = document.getElementById(previewImgId);
    const placeholder = document.getElementById(placeholderId);
    const hidden = document.getElementById(hiddenInputId);
    if (img) { img.src = ''; img.style.display = 'none'; }
    if (placeholder) placeholder.style.display = 'flex';
    if (hidden) hidden.value = '';
}

function restoreImgUpload(previewImgId, placeholderId, imageUrl) {
    const img = document.getElementById(previewImgId);
    const placeholder = document.getElementById(placeholderId);
    if (imageUrl && imageUrl.trim() !== '') {
        if (img) { img.src = imageUrl; img.style.display = 'block'; }
        if (placeholder) placeholder.style.display = 'none';
    } else {
        if (img) { img.src = ''; img.style.display = 'none'; }
        if (placeholder) placeholder.style.display = 'flex';
    }
}

// ===== Build Default Categories (3-level hierarchy matching store menu) =====

function buildDefaultCategories() {
    let id = 1;
    const cats = [];

    function addCategory(name, parentId, image) {
        const cat = { id: id++, name, parentId, image: image || 'assets/images/placeholder.png' };
        cats.push(cat);
        return cat.id;
    }

    // ===== 1. العناية بالبشرة =====
    const skin = addCategory('العناية بالبشرة', null);
    const skinFace = addCategory('العناية بالوجه', skin);
    addCategory('غسول وجه', skinFace);
    addCategory('قناع الوجه', skinFace);
    addCategory('مقشر الوجه', skinFace);
    addCategory('تونر الوجه', skinFace);
    addCategory('سيروم الوجه', skinFace);
    addCategory('مرطب الوجه', skinFace);
    addCategory('صابون قالب', skinFace);
    addCategory('لصقات حب الشباب', skinFace);

    const skinEye = addCategory('العناية بالعين', skin);
    addCategory('كريم العين', skinEye);
    addCategory('سيروم العين', skinEye);
    addCategory('قناع العين', skinEye);
    addCategory('شرائح العين', skinEye);

    const skinMouth = addCategory('العناية بالفم', skin);
    addCategory('معجون أسنان', skinMouth);
    addCategory('غسول الفم', skinMouth);
    addCategory('لصقات تبيض الأسنان', skinMouth);
    addCategory('عناية اللسان', skinMouth);
    addCategory('أجهزة العناية بالفم', skinMouth);
    addCategory('فرش الأسنان', skinMouth);
    addCategory('خيط الأسنان', skinMouth);
    addCategory('معطر فم', skinMouth);

    const skinHand = addCategory('العناية باليدين', skin);
    addCategory('مرطبات اليدين', skinHand);
    addCategory('العناية بالأظافر', skinHand);
    addCategory('قفازات اليدين', skinHand);

    const skinFoot = addCategory('العناية بالقدمين', skin);
    addCategory('مرطب القدمين', skinFoot);
    addCategory('جوارب القدمين', skinFoot);

    const skinBody = addCategory('العناية بالجسم', skin);
    addCategory('عسل الجسم', skinBody);
    addCategory('مقشر الجسم', skinBody);
    addCategory('الصابون المغربي', skinBody);
    addCategory('مرطب الجسم', skinBody);
    addCategory('مزيل العرق', skinBody);
    addCategory('العناية النسائية', skinBody);
    addCategory('الزيوت', skinBody);
    addCategory('بودرة الجسم', skinBody);
    addCategory('منتجات الحلاقة', skinBody);
    addCategory('غسول اليدين', skinBody);
    addCategory('منتجات التشقير', skinBody);

    const skinSun = addCategory('واقي الشمس', skin);
    addCategory('كريم واقي شمس', skinSun);
    addCategory('جل كريم واقي شمس', skinSun);
    addCategory('سائل واقي شمس', skinSun);
    addCategory('بخاخ واقي شمس', skinSun);
    addCategory('ستيك واقي شمس', skinSun);

    const skinLip = addCategory('العناية بالشفاة', skin);
    addCategory('مرطب الشفاة', skinLip);
    addCategory('ماسك الشفاة', skinLip);
    addCategory('مقشر الشفاة', skinLip);
    addCategory('مكبر الشفاة', skinLip);

    addCategory('مجموعات العناية', skin);

    // ===== 2. العناية بالشعر =====
    const hair = addCategory('العناية بالشعر', null);
    const hairShampoo = addCategory('شامبو وبلسم الشعر', hair);
    addCategory('شامبو', hairShampoo);
    addCategory('بلسم', hairShampoo);
    addCategory('شامبو وبلسم معاً', hairShampoo);

    const hairMask = addCategory('ماسك الشعر وحمام الزيت', hair);
    addCategory('ماسك الشعر', hairMask);
    addCategory('حمام الزيت', hairMask);
    addCategory('ماسك عميق', hairMask);

    const hairCream = addCategory('كريم الشعر', hair);
    addCategory('كريم تصفيف', hairCream);
    addCategory('كريم ترطيب', hairCream);
    addCategory('كريم فرد الشعر', hairCream);

    const hairOil = addCategory('زيت الشعر', hair);
    addCategory('زيت الأرغان', hairOil);
    addCategory('زيت جوز الهند', hairOil);
    addCategory('زيت الزيتون', hairOil);
    addCategory('زيوت أخرى', hairOil);

    const hairTreatment = addCategory('معالجات الشعر', hair);
    addCategory('علاج التلف', hairTreatment);
    addCategory('علاج القشرة', hairTreatment);
    addCategory('علاج تساقط الشعر', hairTreatment);

    const hairStyling = addCategory('مثبت ورغوة الشعر', hair);
    addCategory('مثبت الشعر', hairStyling);
    addCategory('رغوة الشعر', hairStyling);
    addCategory('بودرة مثبتة', hairStyling);

    const hairGel = addCategory('جل الشعر', hair);
    addCategory('جل قوي', hairGel);
    addCategory('جل خفيف', hairGel);
    addCategory('جل لامع', hairGel);

    const hairColor = addCategory('صبغات الشعر', hair);
    addCategory('صبغات دائمة', hairColor);
    addCategory('صبغات مؤقتة', hairColor);
    addCategory('صبغات طبيعية', hairColor);

    const hairAcc = addCategory('اكسسوارات وفرش الشعر', hair);
    addCategory('فرش الشعر', hairAcc);
    addCategory('مشط الشعر', hairAcc);
    addCategory('عصابات الشعر', hairAcc);
    addCategory('اكسسوارات أخرى', hairAcc);

    // ===== 3. المكياج =====
    const makeup = addCategory('المكياج', null);
    const makeupFace = addCategory('مكياج الوجه', makeup);
    addCategory('كريم الأساس', makeupFace);
    addCategory('كونسيلر', makeupFace);
    addCategory('بودرة الوجه', makeupFace);
    addCategory('برايمر الوجه', makeupFace);
    addCategory('مثبت المكياج', makeupFace);
    addCategory('بي بي كريم', makeupFace);
    addCategory('مزيل المكياج', makeupFace);

    const makeupLips = addCategory('مكياج الشفاة', makeup);
    addCategory('أحمر الشفاة', makeupLips);
    addCategory('تنت الشفاة', makeupLips);
    addCategory('ملمع الشفاة', makeupLips);
    addCategory('محددات الشفاة', makeupLips);

    const makeupEyes = addCategory('مكياج العيون', makeup);
    addCategory('ماسكارا', makeupEyes);
    addCategory('حجل', makeupEyes);
    addCategory('ظلال العيون', makeupEyes);
    addCategory('برايمر العيون', makeupEyes);

    const makeupBrows = addCategory('مكياج الحواجب', makeup);
    addCategory('مسكرة الحواجب', makeupBrows);
    addCategory('جل الحواجب', makeupBrows);
    addCategory('أقلام الحواجب', makeupBrows);

    const makeupCheeks = addCategory('مكياج الخدود', makeup);
    addCategory('أحمر الخدود', makeupCheeks);
    addCategory('كونتور', makeupCheeks);
    addCategory('برونزر', makeupCheeks);

    const makeupHighlighter = addCategory('الهايلايتر', makeup);
    addCategory('الهايلايتر البودرة', makeupHighlighter);
    addCategory('الهايلايتر السائلة', makeupHighlighter);
    addCategory('باليت ومجموعة هايلايتر', makeupHighlighter);

    const makeupBrushes = addCategory('فرش المكياج', makeup);
    addCategory('مجموعة فرش المكياج', makeupBrushes);
    addCategory('فرش الوجه', makeupBrushes);
    addCategory('فرش العيون', makeupBrushes);
    addCategory('فرش الحواجب', makeupBrushes);
    addCategory('الإسفنج', makeupBrushes);
    addCategory('أدوات المكياج', makeupBrushes);

    const makeupNails = addCategory('مكياج الأظافر', makeup);
    addCategory('المناكير', makeupNails);
    addCategory('مزيل المناكير', makeupNails);

    addCategory('غراء الرموش والأظافر', makeup);

    // ===== 4. الأجهزة =====
    const devices = addCategory('الأجهزة', null);
    const devOral = addCategory('أجهزة العناية بالفم', devices);
    addCategory('فرشاة أسنان كهربائية', devOral);
    addCategory('مبيض أسنان', devOral);
    addCategory('مزيل بلاك', devOral);

    const devDryer = addCategory('مجففات الشعر', devices);
    addCategory('مجفف احترافي', devDryer);
    addCategory('مجفف منزلي', devDryer);
    addCategory('مجفف سفر', devDryer);

    const devStyling = addCategory('أجهزة تمليس الشعر', devices);
    addCategory('مكواة شعر', devStyling);
    addCategory('مكواة تجعيد', devStyling);
    addCategory('مجعد الشعر', devStyling);

    // ===== 5. الأم والطفل =====
    const baby = addCategory('الأم والطفل', null);
    const mother = addCategory('منتجات العناية بالأم', baby);
    addCategory('كريمات الحمل', mother);
    addCategory('مرطبات ما بعد الولادة', mother);
    addCategory('عناية الثدي', mother);

    const child = addCategory('منتجات العناية بالطفل', baby);
    addCategory('شامبو الطفل', child);
    addCategory('لوشن الطفل', child);
    addCategory('زيت الطفل', child);
    addCategory('بودرة الطفل', child);

    // ===== 6. العطور =====
    const perfume = addCategory('العطور', null);
    const perfWomen = addCategory('عطور نسائية', perfume);
    addCategory('عطور شرقية', perfWomen);
    addCategory('عطور غربية', perfWomen);
    addCategory('عطور فواكه', perfWomen);
    addCategory('عطور زهور', perfWomen);

    const perfMen = addCategory('عطور رجالية', perfume);
    addCategory('عطور كلاسيكية', perfMen);
    addCategory('عطور رياضية', perfMen);
    addCategory('عطور عصرية', perfMen);

    // ===== 7. العدسات =====
    const lenses = addCategory('العدسات', null);
    const lensDaily = addCategory('عدسات يومية', lenses);
    addCategory('عدسات يومية ملونة', lensDaily);
    addCategory('عدسات يومية طبية', lensDaily);
    addCategory('عدسات يومية تصحيحية', lensDaily);

    const lensMonthly = addCategory('عدسات شهرية', lenses);
    addCategory('عدسات شهرية ملونة', lensMonthly);
    addCategory('عدسات شهرية طبية', lensMonthly);
    addCategory('عدسات شهرية تصحيحية', lensMonthly);

    const lensYearly = addCategory('عدسات سنوية', lenses);
    addCategory('عدسات سنوية ملونة', lensYearly);
    addCategory('عدسات سنوية طبية', lensYearly);
    addCategory('عدسات سنوية تصحيحية', lensYearly);

    const lensSolution = addCategory('محلول العدسات', lenses);
    addCategory('محلول تنظيف', lensSolution);
    addCategory('محلول ترطيب', lensSolution);
    addCategory('قطرات العدسات', lensSolution);

    // ===== 8. المكملات الغذائية =====
    const supps = addCategory('المكملات الغذائية', null);
    const suppBeauty = addCategory('مكملات الجمال', supps);
    addCategory('كولاجين', suppBeauty);
    addCategory('بيوتين', suppBeauty);
    addCategory('فيتامين E', suppBeauty);

    const suppVitamins = addCategory('فيتامينات', supps);
    addCategory('فيتامين C', suppVitamins);
    addCategory('فيتامين D', suppVitamins);
    addCategory('فيتامينات متعددة', suppVitamins);

    const suppMinerals = addCategory('معادن', supps);
    addCategory('زنك', suppMinerals);
    addCategory('حديد', suppMinerals);
    addCategory('كالسيوم', suppMinerals);
    addCategory('مغنيسيوم', suppMinerals);

    // ===== 9. أدوات العناية =====
    const tools = addCategory('أدوات العناية', null);
    const toolFace = addCategory('أدوات العناية بالوجه', tools);
    addCategory('فرشاة تنظيف الوجه', toolFace);
    addCategory('رولر الوجه', toolFace);
    addCategory('أدوات إزالة الرؤوس السوداء', toolFace);

    const toolBody = addCategory('أدوات العناية بالجسم', tools);
    addCategory('قفازات تقشير', toolBody);
    addCategory('لوفة', toolBody);
    addCategory('حجر الخفاف', toolBody);

    const toolHands = addCategory('أدوات العناية باليدين والأظافر', tools);
    addCategory('مبرد الأظافر', toolHands);
    addCategory('قصافة الأظافر', toolHands);
    addCategory('أدوات العناية بالأظافر', toolHands);

    const toolFeet = addCategory('أدوات العناية بالقدمين', tools);
    addCategory('حجر القدم', toolFeet);
    addCategory('مبرد القدم', toolFeet);
    addCategory('أدوات العناية بالقدم', toolFeet);

    const toolHair = addCategory('أدوات العناية بالشعر', tools);
    addCategory('فرشاة الشعر', toolHair);
    addCategory('مشط الشعر', toolHair);
    addCategory('عصابات الشعر', toolHair);

    // ===== 10. معطرات المنزل =====
    const home = addCategory('معطرات المنزل', null);
    const homeIncense = addCategory('البخور والمعمول', home);
    addCategory('بخور عود', homeIncense);
    addCategory('بخور بخور', homeIncense);
    addCategory('معمول', homeIncense);
    addCategory('مبخر', homeIncense);

    const homeFreshener = addCategory('معطرات الجو', home);
    addCategory('بخاخ معطر', homeFreshener);
    addCategory('جهاز معطر', homeFreshener);
    addCategory('شموع عطرية', homeFreshener);
    addCategory('أحجار عطرية', homeFreshener);

    return cats;
}

// ===== Build Default Products (matching store's productsData) =====
function buildDefaultProducts() {
    // Ensure categories are loaded first
    const cats = categories.length > 0 ? categories : buildDefaultCategories();

    // Helper to find category ID by name
    function findCat(name) {
        const cat = cats.find(c => c.name === name);
        return cat ? cat.id : null;
    }

    // Map store category keys to admin category names
    // The store uses: category (main key) + subcategory (sub key)
    // We need to map to: main category ID, sub category ID, inner category name
    const categoryMapping = {
        // العناية بالبشرة
        'skin': {
            main: 'العناية بالبشرة',
            subs: {
                'face': { sub: 'العناية بالوجه', inner: null },
                'eye': { sub: 'العناية بالعين', inner: null },
                'lips': { sub: 'العناية بالشفاة', inner: null },
                'lip': { sub: 'العناية بالشفاة', inner: null },
                'sun': { sub: 'واقي الشمس', inner: null },
                'body': { sub: 'العناية بالجسم', inner: null },
                'hand': { sub: 'العناية باليدين', inner: null },
                'foot': { sub: 'العناية بالقدمين', inner: null },
                'mouth': { sub: 'العناية بالفم', inner: null }
            }
        },
        // العناية بالشعر
        'hair': {
            main: 'العناية بالشعر',
            subs: {
                'shampoo': { sub: 'شامبو وبلسم الشعر', inner: 'شامبو' },
                'conditioner': { sub: 'شامبو وبلسم الشعر', inner: 'بلسم' },
                'mask': { sub: 'ماسك الشعر وحمام الزيت', inner: 'ماسك الشعر' },
                'oil': { sub: 'زيت الشعر', inner: null },
                'cream': { sub: 'كريم الشعر', inner: null },
                'treatment': { sub: 'معالجات الشعر', inner: null },
                'styling': { sub: 'مثبت ورغوة الشعر', inner: null },
                'gel': { sub: 'جل الشعر', inner: null },
                'color': { sub: 'صبغات الشعر', inner: null },
                'accessories': { sub: 'اكسسوارات وفرش الشعر', inner: null }
            }
        },
        // المكياج
        'makeup': {
            main: 'المكياج',
            subs: {
                'face': { sub: 'مكياج الوجه', inner: null },
                'lips': { sub: 'مكياج الشفاة', inner: null },
                'eyes': { sub: 'مكياج العيون', inner: null },
                'eyebrows': { sub: 'مكياج الحواجب', inner: null },
                'cheeks': { sub: 'مكياج الخدود', inner: null },
                'highlighter': { sub: 'الهايلايتر', inner: null },
                'brushes': { sub: 'فرش المكياج', inner: null },
                'nails': { sub: 'مكياج الأظافر', inner: null }
            }
        },
        // الأجهزة
        'devices': {
            main: 'الأجهزة',
            subs: {
                'hair-dryer': { sub: 'مجففات الشعر', inner: 'مجفف احترافي' },
                'dryer': { sub: 'مجففات الشعر', inner: null },
                'hair-straightener': { sub: 'أجهزة تمليس الشعر', inner: 'مكواة شعر' },
                'styling': { sub: 'أجهزة تمليس الشعر', inner: null },
                'oral': { sub: 'أجهزة العناية بالفم', inner: null }
            }
        },
        // الأم والطفل
        'baby': {
            main: 'الأم والطفل',
            subs: {
                'mom-care': { sub: 'منتجات العناية بالأم', inner: 'كريمات الحمل' },
                'mother': { sub: 'منتجات العناية بالأم', inner: null },
                'baby-care': { sub: 'منتجات العناية بالطفل', inner: 'شامبو الطفل' },
                'child': { sub: 'منتجات العناية بالطفل', inner: null }
            }
        },
        // العطور
        'perfume': {
            main: 'العطور',
            subs: {
                'women': { sub: 'عطور نسائية', inner: null },
                'men': { sub: 'عطور رجالية', inner: null }
            }
        },
        // العدسات
        'lenses': {
            main: 'العدسات',
            subs: {
                'daily': { sub: 'عدسات يومية', inner: null },
                'monthly': { sub: 'عدسات شهرية', inner: null },
                'yearly': { sub: 'عدسات سنوية', inner: null },
                'solution': { sub: 'محلول العدسات', inner: null }
            }
        },
        // المكملات الغذائية
        'supplements': {
            main: 'المكملات الغذائية',
            subs: {
                'beauty': { sub: 'مكملات الجمال', inner: null },
                'skin': { sub: 'مكملات الجمال', inner: 'كولاجين' },
                'hair': { sub: 'مكملات الجمال', inner: 'بيوتين' },
                'vitamins': { sub: 'فيتامينات', inner: null },
                'minerals': { sub: 'معادن', inner: null }
            }
        },
        // أدوات العناية
        'tools': {
            main: 'أدوات العناية',
            subs: {
                'face': { sub: 'أدوات العناية بالوجه', inner: 'فرشاة تنظيف الوجه' },
                'body': { sub: 'أدوات العناية بالجسم', inner: null },
                'hands': { sub: 'أدوات العناية باليدين والأظافر', inner: null },
                'feet': { sub: 'أدوات العناية بالقدمين', inner: null },
                'hair': { sub: 'أدوات العناية بالشعر', inner: 'فرشاة الشعر' }
            }
        },
        // معطرات المنزل
        'home': {
            main: 'معطرات المنزل',
            subs: {
                'incense': { sub: 'البخور والمعمول', inner: 'بخور عود' },
                'candle': { sub: 'معطرات الجو', inner: 'شموع عطرية' },
                'air-freshener': { sub: 'معطرات الجو', inner: null }
            }
        }
    };

    // Store products data (same as palmira-store.js productsData)
    const storeProducts = [
        { id: 1, brand_id: 9, name: 'سيروم فيتامين سي للوجه', description: 'سيروم مغذي للبشرة يحتوي على فيتامين سي المركز لنضارة فورية وتوحيد لون البشرة.', cat: 'skin', sub: 'face', price: 150, oldPrice: 200, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', isNew: true, isSale: true, popularity: 95 },
        { id: 2, brand_id: 4, name: 'كريم مرطب للبشرة الجافة', description: 'كريم مرطب بعمق للبشرة شديدة الجفاف، يدوم ترطيبه لمدة 24 ساعة.', cat: 'skin', sub: 'face', price: 120, oldPrice: null, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', isNew: true, isSale: false, popularity: 80 },
        { id: 3, brand_id: 1, name: 'غسول الوجه بالشاي الأخضر', description: 'غسول لطيف على البشرة ينظف بعمق ويقلل من ظهور الحبوب.', cat: 'skin', sub: 'face', price: 85, oldPrice: 100, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 88 },
        { id: 4, brand_id: 9, name: 'قناع الطين للوجه', description: 'قناع الطين المغربي لتنظيف المسام وإزالة السموم من البشرة.', cat: 'skin', sub: 'face', price: 95, oldPrice: null, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 75 },
        { id: 5, brand_id: 9, name: 'كريم العناية بالعين', description: 'كريم متخصص لعلاج الهالات السوداء والانتفاخات حول العين.', cat: 'skin', sub: 'eye', price: 180, oldPrice: 220, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 82 },
        { id: 6, brand_id: 2, name: 'مرطب الشفاة بالعسل', description: 'مرطب طبيعي للشفاة يمنع التشقق ويمنحها لمعاناً طبيعياً.', cat: 'skin', sub: 'lips', price: 35, oldPrice: null, image: 'https://images.unsplash.com/photo-1606244562472-6b5ed9b9c6c8?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 90 },
        { id: 7, brand_id: 3, name: 'واقي شمس SPF 50', description: 'واقي شمس واسع المدى يحمي من الأشعة فوق البنفسجية ولا يترك أثراً دهنياً.', cat: 'skin', sub: 'sun', price: 110, oldPrice: 140, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 92 },
        { id: 8, brand_id: 4, name: 'مقشر الجسم بالقهوة', description: 'مقشر طبيعي للجسم يقلل من ظهور السيلوليت وينعم الجلد.', cat: 'skin', sub: 'body', price: 75, oldPrice: null, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 78 },
        { id: 9, brand_id: 1, name: 'شامبو للشعر الجاف', description: 'شامبو مرطب للشعر المصبوغ والجاف يعيد له حيويته.', cat: 'hair', sub: 'shampoo', price: 65, oldPrice: 85, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 85 },
        { id: 10, brand_id: 3, name: 'ماسك الشعر بالأرغان', description: 'ماسك مكثف لإصلاح الشعر التالف والمتضرر من الحرارة.', cat: 'hair', sub: 'mask', price: 145, oldPrice: null, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', isNew: true, isSale: false, popularity: 87 },
        { id: 11, brand_id: 1, name: 'زيت الشعر بالأفوكادو', description: 'زيت طبيعي يغذي فروة الرأس ويساعد في تطويل الشعر.', cat: 'hair', sub: 'oil', price: 95, oldPrice: 120, image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 83 },
        { id: 12, brand_id: 4, name: 'بلسم الشعر', description: 'بلسم منعم يسهل تسريح الشعر ويمنحه لمعاناً رائعاً.', cat: 'hair', sub: 'conditioner', price: 55, oldPrice: null, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 79 },
        { id: 13, brand_id: 10, name: 'أحمر شفاه مات', description: 'أحمر شفاه مطفي يدوم طويلاً بتركيبة كريمية مريحة.', cat: 'makeup', sub: 'lips', price: 85, oldPrice: 110, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 94 },
        { id: 14, brand_id: 2, name: 'كريم الأساس', description: 'كريم أساس بتغطية متوسطة إلى كاملة يمنحك مظهراً طبيعياً.', cat: 'makeup', sub: 'face', price: 180, oldPrice: null, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop', isNew: true, isSale: false, popularity: 89 },
        { id: 15, brand_id: 10, name: 'ماسكارا', description: 'ماسكارا لتكثيف وتطويل الرموش بدون تكتل.', cat: 'makeup', sub: 'eyes', price: 75, oldPrice: 95, image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 91 },
        { id: 16, brand_id: 2, name: 'ظلال العيون', description: 'باليت ظلال عيون بألوان دافئة وتغطية عالية الثبات.', cat: 'makeup', sub: 'eyes', price: 120, oldPrice: null, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 86 },
        { id: 17, brand_id: 7, name: 'مجفف الشعر الاحترافي', description: 'مجفف شعر بقوة 2200 واط مع تقنية الأيونات لتقليل الهيشان.', cat: 'devices', sub: 'hair-dryer', price: 350, oldPrice: 450, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 77 },
        { id: 18, brand_id: 7, name: 'جهاز تمليس الشعر', description: 'مكواة شعر سيراميك لتمليس سريع وحماية للشعر من الحرارة.', cat: 'devices', sub: 'hair-straightener', price: 280, oldPrice: null, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop', isNew: true, isSale: false, popularity: 80 },
        { id: 19, brand_id: 5, name: 'كريم العناية بالأم', description: 'كريم مرطب لعلامات التمدد أثناء وبعد الحمل.', cat: 'baby', sub: 'mom-care', price: 95, oldPrice: 120, image: 'https://images.unsplash.com/photo-1519689680058-324335c77b99f?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 81 },
        { id: 20, brand_id: 5, name: 'شامبو الطفل', description: 'شامبو "لا دموع بعد اليوم" لطيف جداً على فروة رأس الطفل.', cat: 'baby', sub: 'baby-care', price: 45, oldPrice: null, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 93 },
        { id: 21, brand_id: 6, name: 'عطر نسائي فاخر', description: 'عطر زهري بلمسات من الياسمين والفانيليا، يدوم طويلاً.', cat: 'perfume', sub: 'women', price: 450, oldPrice: 550, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 88 },
        { id: 22, brand_id: 7, name: 'عطر رجالي كلاسيكي', description: 'عطر خشبي قوي يجمع بين العود والصندل للأناقة الكلاسيكية.', cat: 'perfume', sub: 'men', price: 380, oldPrice: null, image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop', isNew: true, isSale: false, popularity: 84 },
        { id: 23, brand_id: 3, name: 'عدسات يومية', description: 'عدسات لاصقة مريحة جداً للاستخدام اليومي لمرة واحدة.', cat: 'lenses', sub: 'daily', price: 150, oldPrice: 180, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 76 },
        { id: 24, brand_id: 3, name: 'عدسات شهرية', description: 'عدسات شهرية عالية الجودة تمنحك رؤية واضحة وراحة طوال اليوم.', cat: 'lenses', sub: 'monthly', price: 280, oldPrice: null, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 72 },
        { id: 25, brand_id: 8, name: 'فيتامينات للشعر', description: 'مكمل غذائي يحتوي على البيوتين والزنك لتقوية الشعر ومنع التساقط.', cat: 'supplements', sub: 'hair', price: 120, oldPrice: 150, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 79 },
        { id: 26, brand_id: 8, name: 'كولاجين للبشرة', description: 'بودرة كولاجين قابلة للذوبان لتحسين مرونة البشرة وتقليل التجاعيد.', cat: 'supplements', sub: 'skin', price: 180, oldPrice: null, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop', isNew: true, isSale: false, popularity: 85 },
        { id: 27, brand_id: 9, name: 'فرشاة الوجه', description: 'فرشاة تنظيف الوجه السيليكون لإزالة الرؤوس السوداء والشوائب.', cat: 'tools', sub: 'face', price: 220, oldPrice: 280, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 74 },
        { id: 28, brand_id: 4, name: 'فرشاة الشعر', description: 'فرشاة شعر خشبية تقلل من تقصف الشعر وتدلك فروة الرأس.', cat: 'tools', sub: 'hair', price: 85, oldPrice: null, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 82 },
        { id: 29, brand_id: 6, name: 'بخور عود', description: 'بخور عود طبيعي فاخر لرائحة تدوم طويلاً في المنزل.', cat: 'home', sub: 'incense', price: 65, oldPrice: 80, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=300&fit=crop', isNew: false, isSale: true, popularity: 73 },
        { id: 30, brand_id: 6, name: 'شمعة عطرية', description: 'شمعة عطرية برائحة اللافندر تساعد على الاسترخاء والهدوء.', cat: 'home', sub: 'candle', price: 45, oldPrice: null, image: 'https://images.unsplash.com/photo-1602906009653-2e7c5253c7e8?w=400&h=300&fit=crop', isNew: false, isSale: false, popularity: 71 }
    ];

    return storeProducts.map(sp => {
        const mapping = categoryMapping[sp.cat];
        if (!mapping) return null;

        const mainCatId = findCat(mapping.main);
        let subCatId = null;
        let innerCatId = null;

        if (sp.sub && mapping.subs[sp.sub]) {
            const subMapping = mapping.subs[sp.sub];
            subCatId = findCat(subMapping.sub);
            if (subMapping.inner) {
                innerCatId = findCat(subMapping.inner);
            }
        }

        const allCategories = [mainCatId, subCatId, innerCatId].filter(Boolean);

        return {
            id: sp.id,
            name: sp.name,
            description: sp.description,
            price: sp.price,
            oldPrice: sp.oldPrice,
            quantity: Math.floor(Math.random() * 50) + 10,
            category: mainCatId,
            subCategory: subCatId,
            innerCategory: innerCatId,
            allCategories: allCategories,
            brand_id: sp.brand_id,
            skinType: sp.cat === 'skin' ? null : null,
            size: '',
            usage: '',
            image: sp.image,
            images: [sp.image],
            isNew: sp.isNew,
            isSale: sp.isSale,
            popularity: sp.popularity
        };
    }).filter(Boolean);
}

// ===== Map Store Products (string categories) to Admin (numeric IDs) =====
function mapStoreProductsToAdmin(storeProducts) {
    const cats = categories.length > 0 ? categories : buildDefaultCategories();

    function findCat(name) {
        const cat = cats.find(c => c.name === name);
        return cat ? cat.id : null;
    }

    // Simple map from store category strings to admin category names
    const mainCatMap = {
        'skin': 'العناية بالبشرة', 'hair': 'العناية بالشعر', 'makeup': 'المكياج',
        'devices': 'الأجهزة', 'baby': 'الأم والطفل', 'perfume': 'العطور',
        'lenses': 'العدسات', 'supplements': 'المكملات الغذائية',
        'tools': 'أدوات العناية', 'home': 'معطرات المنزل'
    };

    return storeProducts.map(p => {
        if (typeof p.category !== 'string') return p; // Already mapped

        const mainName = mainCatMap[p.category];
        const mainCatId = mainName ? findCat(mainName) : null;

        // Try to find subcategory
        let subCatId = null;
        if (p.subcategory && mainCatId) {
            const subCats = cats.filter(c => c.parentId === mainCatId);
            // Try matching by subcategory key or name similarity
            const sub = subCats.find(sc => sc.name.includes(p.subcategory) || p.subcategory.includes(sc.name));
            if (sub) subCatId = sub.id;
        }

        const allCategories = [mainCatId, subCatId].filter(Boolean);

        return {
            ...p,
            category: mainCatId || p.category,
            subCategory: subCatId,
            innerCategory: null,
            allCategories: allCategories,
            quantity: p.quantity || Math.floor(Math.random() * 50) + 10,
            images: p.images || (p.image ? [p.image] : ['assets/images/placeholder.png'])
        };
    });
}

// ===== Data Initialization =====
function initData() {
    // Load or initialize users
    const savedUsers = localStorage.getItem('adminUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Default users
        users = [
            { id: 1, fullName: 'المشرف', username: 'admin', password: 'admin', role: 'admin', status: 'active', lastLogin: null },
            { id: 2, fullName: 'موظف', username: 'employee', password: 'employee', role: 'employee', status: 'active', lastLogin: null }
        ];
        saveData('adminUsers', users);
    }

    // Load products from main store
    const savedProducts = localStorage.getItem('palmiraProducts');
    if (savedProducts) {
        const storeProducts = JSON.parse(savedProducts);
        // If products exist but lack admin category IDs, map them
        if (storeProducts.length > 0 && typeof storeProducts[0].category === 'string') {
            products = mapStoreProductsToAdmin(storeProducts);
            saveData('palmiraProducts', products);
        } else {
            products = storeProducts;
        }
    } else {
        // Build default products matching the store's product catalog
        products = buildDefaultProducts();
        saveData('palmiraProducts', products);
    }

    // Load categories
    const savedCategories = localStorage.getItem('adminCategories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    } else {
        categories = buildDefaultCategories();
        saveData('adminCategories', categories);
    }

    // Load brands
    const savedBrands = localStorage.getItem('adminBrands');
    if (savedBrands) {
        brands = JSON.parse(savedBrands);
    } else {
        brands = [
            { id: 1, name: 'لوريال', letter: 'L', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
            { id: 2, name: 'مايبلين', letter: 'M', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop' },
            { id: 3, name: 'نيكيا', letter: 'N', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop' },
            { id: 4, name: 'دوف', letter: 'D', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop' },
            { id: 5, name: 'جونسون', letter: 'J', image: 'https://images.unsplash.com/photo-1519689680058-324335c77b99f?w=200&h=200&fit=crop' },
            { id: 6, name: 'ايف سان لوران', letter: 'Y', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop' }
        ];
        saveData('adminBrands', brands);
    }

    // Load skin types
    const savedSkinTypes = localStorage.getItem('adminSkinTypes');
    if (savedSkinTypes) {
        skinTypes = JSON.parse(savedSkinTypes);
    } else {
        skinTypes = [
            { id: 1, name: 'البشرة العادية', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop' },
            { id: 2, name: 'البشرة الجافة', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
            { id: 3, name: 'البشرة الدهنية', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=200&h=200&fit=crop' },
            { id: 4, name: 'البشرة المختلطة', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=200&h=200&fit=crop' },
            { id: 5, name: 'البشرة الحساسة', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop' }
        ];
        saveData('adminSkinTypes', skinTypes);
    }

    // Load orders
    const savedOrders = localStorage.getItem('palmiraOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        // Generate mock orders
        orders = generateMockOrders(25);
        saveData('palmiraOrders', orders);
    }

    // Load customers
    const savedCustomers = localStorage.getItem('palmiraUsers');
    if (savedCustomers) {
        const allUsers = JSON.parse(savedCustomers);
        customers = allUsers.filter(u => u.type === 'customer' || !u.type);
    } else {
        customers = generateMockCustomers(15);
        saveData('palmiraUsers', customers);
    }

    // Load offers
    const savedOffers = localStorage.getItem('adminOffers');
    if (savedOffers) {
        offers = JSON.parse(savedOffers);
    } else {
        offers = [];
    }

    // Load banners
    const savedBanners = localStorage.getItem('adminBanners');
    if (savedBanners) {
        banners = JSON.parse(savedBanners);
    } else {
        banners = [
            { id: 1, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop', link: '#', position: 0 },
            { id: 2, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=400&fit=crop', link: '#', position: 1 },
            { id: 3, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=800&h=400&fit=crop', link: '#', position: 2 }
        ];
        saveData('adminBanners', banners);
    }

    // Load settings
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    } else {
        settings = {
            storeName: 'بالميرا ستور',
            storePhone: '0500000000',
            storeEmail: 'info@palmira.com',
            deliveryPrice: 20,
            storeAddress: 'المملكة العربية السعودية'
        };
        saveData('adminSettings', settings);
    }

    // Load notifications
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    } else {
        notifications = [
            { id: Date.now(), title: 'تنبيه نظام', body: 'مرحباً بك في لوحة تحكم بالميرا ستور', date: new Date().toISOString(), read: false, target: 'all' }
        ];
        saveData('adminNotifications', notifications);
    }

    // Load currencies
    const savedCurrencies = localStorage.getItem('adminCurrencies');
    if (savedCurrencies) {
        currencies = JSON.parse(savedCurrencies);
    } else {
        currencies = [
            { id: 1, name: 'ريال سعودي', code: 'SAR', symbol: 'ر.س', rate: 1.0000, status: 'active', isDefault: true, updatedAt: new Date().toISOString() },
            { id: 2, name: 'دولار أمريكي', code: 'USD', symbol: '$', rate: 0.2667, status: 'active', isDefault: false, updatedAt: new Date().toISOString() },
            { id: 3, name: 'يورو', code: 'EUR', symbol: '€', rate: 0.2448, status: 'active', isDefault: false, updatedAt: new Date().toISOString() },
            { id: 4, name: 'درهم إماراتي', code: 'AED', symbol: 'د.إ', rate: 0.9796, status: 'active', isDefault: false, updatedAt: new Date().toISOString() },
            { id: 5, name: 'جنيه إسترليني', code: 'GBP', symbol: '£', rate: 0.2103, status: 'inactive', isDefault: false, updatedAt: new Date().toISOString() },
        ];
        saveData('adminCurrencies', currencies);
    }
}

// Generate Mock Data
function generateMockOrders(count) {
    const statuses = ['pending', 'processing', 'ready', 'delivered', 'cancelled'];
    const paymentMethods = ['cash', 'bank', 'paytabs', 'jeib', 'flousk'];
    const names = ['أحمد محمد', 'فاطمة علي', 'سارة أحمد', 'محمد خالد', 'نورة سعد', 'عبدالله فهد', 'ليلى محمد', 'خالد عبدالرحمن'];
    const mockOrders = [];

    for (let i = 1; i <= count; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        mockOrders.push({
            id: i,
            customerName: names[Math.floor(Math.random() * names.length)],
            userPhone: '05' + Math.floor(Math.random() * 100000000),
            total: Math.floor(Math.random() * 500) + 100,
            status: status,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            transferProof: null, // سيتم إضافتها من الواجهات عند رفع صورة الإثبات
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: [
                { name: 'منتج ' + i, quantity: Math.floor(Math.random() * 3) + 1, price: Math.floor(Math.random() * 200) + 50 }
            ],
            address: 'الرياض، السعودية',
            notes: '',
            verificationStatus: (() => {
                const pm = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                return ['bank', 'paytabs', 'jeib', 'flousk'].includes(mockOrders[mockOrders.length]?.paymentMethod || pm) ? 'pending_verification' : 'verified';
            })()
        });
    }
    return mockOrders.sort((a, b) => b.id - a.id);
}

function generateMockCustomers(count) {
    const names = ['أحمد محمد', 'فاطمة علي', 'سارة أحمد', 'محمد خالد', 'نورة سعد', 'عبدالله فهد', 'ليلى محمد', 'خالد عبدالرحمن', 'منى عبدالله', 'يوسف سامي'];
    const mockCustomers = [];

    for (let i = 1; i <= count; i++) {
        mockCustomers.push({
            id: i,
            name: names[Math.floor(Math.random() * names.length)] + ' ' + i,
            phone: '05' + Math.floor(Math.random() * 100000000),
            ordersCount: Math.floor(Math.random() * 10),
            totalSpent: Math.floor(Math.random() * 5000),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
    }
    return mockCustomers;
}

// ===== Auth Functions =====
function checkAuth() {
    const savedUser = sessionStorage.getItem('currentAdmin');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';

    // Update user info
    document.getElementById('currentUserName').textContent = currentUser.fullName;
    document.getElementById('currentUserRole').textContent = currentUser.role === 'admin' ? 'مشرف' : 'موظف';
    document.getElementById('topbarUserName').textContent = currentUser.fullName;
    document.getElementById('topbarUserRole').textContent = currentUser.role === 'admin' ? 'مشرف' : 'موظف';

    // Show/hide admin-only items
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    adminOnlyItems.forEach(item => {
        item.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
    });

    // Restrict employee access
    if (currentUser.role === 'employee') {
        // Hide products, categories, brands, etc. nav items for employees
        const restrictedPages = ['products', 'categories', 'brands', 'skinTypes', 'offers', 'banners', 'customers', 'settings'];
        document.querySelectorAll('.nav-item').forEach(item => {
            const page = item.getAttribute('data-page');
            if (restrictedPages.includes(page) && page !== 'orders') {
                item.style.display = 'none';
            }
        });
    }

    // Update page title
    document.getElementById('pageTitle').textContent = 'الرئيسية';

    // Render dashboard
    renderDashboard();
}

function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password && u.status === 'active');
    if (user) {
        currentUser = { ...user };
        delete currentUser.password;
        sessionStorage.setItem('currentAdmin', JSON.stringify(currentUser));

        // Update last login
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            saveData('adminUsers', users);
        }

        showDashboard();
        showToast('تم تسجيل الدخول بنجاح', 'success');
        return true;
    }
    showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    return false;
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentAdmin');
    showLogin();
    showToast('تم تسجيل الخروج', 'success');
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        login(username, password);
    });

    // Logout - using event delegation for reliability
    document.addEventListener('click', function (e) {
        const logoutBtn = e.target.closest('#logoutBtn');
        if (logoutBtn) {
            e.preventDefault();
            e.stopPropagation();
            logout();
        }
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Mobile menu toggle
    document.getElementById('menuToggle')?.addEventListener('click', function () {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Filter tabs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            if (currentPage === 'orders') {
                const searchValue = document.getElementById('ordersSearch')?.value || '';
                renderOrders(1, filter, searchValue);
            }
        });
    });

    // Search boxes
    document.getElementById('productsSearch')?.addEventListener('input', debounce(function () {
        renderProducts(1, this.value);
    }, 300));

    document.getElementById('ordersSearch')?.addEventListener('input', function (e) {
        const activeFilter = document.querySelector('#ordersPage .filter-tabs .active')?.getAttribute('data-filter') || 'all';
        const val = e.target.value;
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            renderOrders(1, activeFilter, val);
        }, 300);
    });

    document.getElementById('customersSearch')?.addEventListener('input', debounce(function () {
        renderCustomers(1, this.value);
    }, 300));

    // Notifications Dropdown toggle
    document.getElementById('notificationBtn')?.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNotificationsDropdown(this);
    });

    // Forms
    document.getElementById('productForm')?.addEventListener('submit', handleProductSubmit);
    document.getElementById('categoryForm')?.addEventListener('submit', handleCategorySubmit);
    document.getElementById('brandForm')?.addEventListener('submit', handleBrandSubmit);
    document.getElementById('skinTypeForm')?.addEventListener('submit', handleSkinTypeSubmit);
    document.getElementById('offerForm')?.addEventListener('submit', handleOfferSubmit);
    document.getElementById('userForm')?.addEventListener('submit', handleUserSubmit);
    document.getElementById('notificationForm')?.addEventListener('submit', handleNotificationSubmit);
    document.getElementById('storeSettingsForm')?.addEventListener('submit', handleSettingsSubmit);
    document.getElementById('passwordSettingsForm')?.addEventListener('submit', handlePasswordChangeSubmit);

    // Category cascades
    document.getElementById('productCategoryMain')?.addEventListener('change', function () {
        const categoryId = this.value;
        populateSubCategories(categoryId);

        // Show skin type if related
        const category = categories.find(c => c.id == categoryId);
        const skinTypeGroup = document.getElementById('skinTypeGroup');
        if (category && (category.name.includes('بشرة') || categoryId === '1' || getCategoryRoot(categoryId) === 1)) {
            skinTypeGroup.style.display = 'block';
        } else {
            skinTypeGroup.style.display = 'none';
        }
    });

    document.getElementById('productCategorySub')?.addEventListener('change', function () {
        populateInnerCategories(this.value);
    });

    // Image Uploads
    window.tempProductFiles = [];
    document.getElementById('productImageFiles')?.addEventListener('change', handleImageUpload);

    // Delete confirmation
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', function () {
        if (deleteCallback) {
            deleteCallback();
            deleteCallback = null;
        }
        closeModal('deleteModal');
    });

    // Banner inputs - now handled by file upload (previewSingleImage)

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// ===== Navigation =====
function navigateTo(page) {
    if (!currentUser) return;

    // Check permissions for employees
    if (currentUser.role === 'employee' && !['dashboard', 'orders', 'notifications'].includes(page)) {
        showToast('ليس لديك صلاحية للوصول لهذه الصفحة', 'error');
        return;
    }

    currentPage = page;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // Show selected page
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Update page title
    const titles = {
        dashboard: 'الرئيسية',
        orders: 'الطلبات',
        products: 'المنتجات',
        categories: 'الأقسام',
        brands: 'الماركات',
        skinTypes: 'أنواع البشرة',
        offers: 'العروض',
        banners: 'البنرات',
        customers: 'العملاء',
        users: 'المستخدمين',
        notifications: 'الإشعارات',
        settings: 'الإعدادات',
        currencies: 'إدارة العملات'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    // Render page content
    switch (page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'orders':
            renderOrders();
            break;
        case 'products':
            renderProducts();
            break;
        case 'categories':
            renderCategories();
            break;
        case 'brands':
            renderBrands();
            break;
        case 'skinTypes':
            renderSkinTypes();
            break;
        case 'offers':
            renderOffers();
            break;
        case 'banners':
            renderBanners();
            break;
        case 'customers':
            renderCustomers();
            break;
        case 'users':
            renderUsers();
            break;
        case 'notifications':
            renderNotifications();
            break;
        case 'settings':
            renderSettings();
            break;
        case 'currencies':
            renderCurrencies();
            break;
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 992) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

// ===== Dashboard =====
function renderDashboard() {
    // Update stats
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalCategories').textContent = categories.filter(c => !c.parentId).length;

    // Calculate revenues
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.date && o.date === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('todayRevenue').textContent = todayRevenue + ' ر.س';

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyOrders = orders.filter(o => o.date && o.date.startsWith(currentMonth));
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('monthlyRevenue').textContent = monthlyRevenue + ' ر.س';

    // Update orders badge
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    document.getElementById('ordersBadge').textContent = pendingOrders;

    // Render charts
    renderCharts();

    // Render recent orders
    renderRecentOrders();

    // Render top products
    renderTopProducts();
}

function renderCharts() {
    const dailyCtx = document.getElementById('dailySalesChart');
    const monthlyCtx = document.getElementById('monthlySalesChart');

    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const dailyData = days.map(() => Math.floor(Math.random() * 5000) + 1000);

    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const monthlyData = months.map(() => Math.floor(Math.random() * 50000) + 10000);

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        if (dailyCtx && dailyCtx.style.display !== 'none') {
            dailyCtx.style.display = 'none';
            const container = dailyCtx.parentElement;
            let maxDaily = Math.max(...dailyData);
            let html = '<div style="display: flex; align-items: flex-end; justify-content: space-between; height: 200px; padding: 20px 0; border-bottom: 1px solid #eee;">';
            dailyData.forEach((val, i) => {
                const height = (val / maxDaily) * 100;
                html += `<div style="display: flex; flex-direction: column; align-items: center; width: 12%;">
                    <div style="background: linear-gradient(to top, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.8)); width: 100%; height: ${height}%; border-radius: 4px 4px 0 0; transition: height 0.5s ease;" title="${val} ر.س"></div>
                    <span style="font-size: 10px; margin-top: 5px; color: #666;">${days[i]}</span>
                </div>`;
            });
            html += '</div>';
            const fallback = document.createElement('div');
            fallback.innerHTML = html;
            container.appendChild(fallback);
        }

        if (monthlyCtx && monthlyCtx.style.display !== 'none') {
            monthlyCtx.style.display = 'none';
            const container = monthlyCtx.parentElement;
            let maxMonthly = Math.max(...monthlyData);
            let html = '<div style="display: flex; align-items: flex-end; justify-content: space-between; height: 200px; padding: 20px 0; border-bottom: 1px solid #eee;">';
            monthlyData.forEach((val, i) => {
                const height = (val / maxMonthly) * 100;
                html += `<div style="display: flex; flex-direction: column; align-items: center; width: 12%;">
                    <div style="background: #FFD700; width: 100%; height: ${height}%; border-radius: 4px 4px 0 0; transition: height 0.5s ease;" title="${val} ر.س"></div>
                    <span style="font-size: 10px; margin-top: 5px; color: #666;">${months[i]}</span>
                </div>`;
            });
            html += '</div>';
            const fallback = document.createElement('div');
            fallback.innerHTML = html;
            container.appendChild(fallback);
        }
        return;
    }

    // Daily sales chart
    if (dailyCtx) {
        if (charts.daily) charts.daily.destroy();

        const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
        const dailyData = days.map(() => Math.floor(Math.random() * 5000) + 1000);

        charts.daily = new Chart(dailyCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'المبيعات',
                    data: dailyData,
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Monthly sales chart
    if (monthlyCtx) {
        if (charts.monthly) charts.monthly.destroy();

        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
        const monthlyData = months.map(() => Math.floor(Math.random() * 50000) + 10000);

        charts.monthly = new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'المبيعات',
                    data: monthlyData,
                    backgroundColor: '#FFD700'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function renderRecentOrders() {
    const container = document.getElementById('recentOrdersTable');
    if (!container) return;

    const recentOrders = orders.slice(0, 5);

    if (recentOrders.length === 0) {
        container.innerHTML = '<tr><td colspan="4" class="empty-state">لا توجد طلبات</td></tr>';
        return;
    }

    container.innerHTML = recentOrders.map(order => `
        <tr onclick="viewOrderDetails(${order.id})" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f9f9f9'" onmouseout="this.style.background='transparent'">
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.total} ر.س</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
        </tr>
    `).join('');
}

function renderTopProducts() {
    const container = document.getElementById('topProductsList');
    if (!container) return;

    const topProducts = [...products]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 5);

    if (topProducts.length === 0) {
        container.innerHTML = '<div class="empty-state">لا توجد منتجات</div>';
        return;
    }

    container.innerHTML = topProducts.map((product, index) => `
        <div class="top-product-item">
            <div class="top-product-rank">${index + 1}</div>
            <div class="top-product-info">
                <h5>${product.name}</h5>
                <p>${getCategoryName(product.category)}</p>
            </div>
            <span class="top-product-sales">${product.popularity || 0} مبيعة</span>
        </div>
    `).join('');
}

// ===== Orders =====
function renderOrders(page = 1, filter = 'all', search = '') {
    const container = document.getElementById('ordersTable');
    if (!container) return;

    let filteredOrders = [...orders];

    // Apply status filter
    if (filter && filter !== 'all') {
        filteredOrders = filteredOrders.filter(o => o.status === filter);
    }

    // Apply search
    if (search) {
        const query = search.toLowerCase();
        filteredOrders = filteredOrders.filter(o =>
            (o.customerName && o.customerName.toLowerCase().includes(query)) ||
            (o.id && o.id.toString().includes(query)) ||
            (o.userPhone && o.userPhone.includes(query))
        );
    }

    // Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    if (paginatedOrders.length === 0) {
        container.innerHTML = `<tr><td colspan="8" class="empty-state">${search ? 'لا توجد نتائج' : 'لا توجد طلبات'}</td></tr>`;
        document.getElementById('ordersPagination').innerHTML = '';
        return;
    }

    container.innerHTML = paginatedOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.userPhone || '-'}</td>
            <td>${order.total} ر.س</td>
            <td><span style="display: inline-flex; align-items: center; gap: 4px; font-size: 13px;">${getPaymentMethodIcon(order.paymentMethod)} <span style="color: ${order.paymentMethod === 'cash' ? '#27ae60' : '#e67e22'}; font-weight: 500;">${getPaymentMethodText(order.paymentMethod)}</span></span></td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${order.date}</td>
            <td>
                <button class="btn-icon btn-edit" onclick="viewOrderDetails(${order.id})" title="عرض التفاصيل">
                    <img src="assets/icons/eye.svg" class="icon icon-white" alt="view">
                </button>
                ${currentUser?.role === 'admin' ? `
                <button class="btn-icon btn-delete" onclick="confirmDeleteOrder(${order.id})" title="حذف">
                    <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                </button>
                ` : ''}
            </td>
        </tr>
    `).join('');

    renderPagination('ordersPagination', filteredOrders.length, page, (p) => renderOrders(p, filter, search));
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('orderDetailsNumber').textContent = '#' + order.id;

    const content = document.getElementById('orderDetailsContent');

    const itemsHtml = order.items?.map(item => `
        <div class="order-product-item">
            <img src="${item.image || 'assets/images/placeholder.png'}" alt="${item.name}">
            <div class="order-product-info">
                <h5>${item.name}</h5>
                <p>الكمية: ${item.quantity} × ${item.price} ر.س</p>
            </div>
            <span>${item.quantity * item.price} ر.س</span>
        </div>
    `).join('') || '<p>لا توجد منتجات</p>';

    content.innerHTML = `
        <div class="order-details-section">
            <h4>معلومات الطلب</h4>
            <div class="order-info-grid">
                <div class="order-info-item">
                    <label>رقم الطلب</label>
                    <span>#${order.id}</span>
                </div>
                <div class="order-info-item">
                    <label>العميل</label>
                    <span>${order.customerName}</span>
                </div>
                <div class="order-info-item">
                    <label>رقم الهاتف</label>
                    <span>${order.userPhone || '-'}</span>
                </div>
                <div class="order-info-item">
                    <label>التاريخ</label>
                    <span>${order.date}</span>
                </div>
                <div class="order-info-item">
                    <label>طريقة الدفع</label>
                    <span style="display: inline-flex; align-items: center; gap: 6px;">
                        ${getPaymentMethodIcon(order.paymentMethod)}
                        <span style="font-weight: 600; color: ${order.paymentMethod === 'cash' ? '#27ae60' : '#e67e22'};">${getPaymentMethodText(order.paymentMethod)}</span>
                    </span>
                </div>
                <div class="order-info-item">
                    <label>الحالة</label>
                    <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
                </div>
            </div>
        </div>
        
        <div class="order-details-section">
            <h4>العنوان</h4>
            <p>${order.address || 'غير محدد'}</p>
        </div>
        
        <div class="order-details-section">
            <h4>المنتجات</h4>
            <div class="order-products-list">
                ${itemsHtml}
            </div>
            <div class="order-total">
                الإجمالي: ${order.total} ر.س
            </div>
        </div>
        
        ${['bank', 'paytabs', 'jeib', 'flousk'].includes(order.paymentMethod) ? `
        <div class="transfer-proof-box" style="border: 2px solid #e67e22; border-radius: 12px; padding: 20px; margin-top: 15px; background: linear-gradient(135deg, #fef9f0, #fdf4e8);">
            <h4 style="margin: 0 0 15px; display: flex; align-items: center; gap: 8px; color: #e67e22;">
                <img src="assets/icons/note.svg" class="icon" alt="transfer">
                إثبات الدفع الإلكتروني
                <span style="background: #e67e22; color: white; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: normal;">${getPaymentMethodText(order.paymentMethod)}</span>
            </h4>
            ${order.transferProof ? `
            <div class="proof-image-container" style="margin: 15px 0; text-align: center; border: 2px dashed #ddd; padding: 15px; border-radius: 10px; background: white;">
                <img src="${order.transferProof}" alt="إثبات التحويل" style="max-width: 100%; max-height: 300px; cursor: zoom-in; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" onclick="viewImage(this.src)">
                <p style="color: #888; font-size: 12px; margin-top: 10px;">اضغط على الصورة للتكبير</p>
            </div>
            ` : `
            <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; border: 2px dashed #ddd;">
                <p style="color: #999; font-size: 14px; margin: 0;">لم يتم رفع صورة إثبات التحويل بعد</p>
                <p style="color: #ccc; font-size: 12px; margin: 5px 0 0;">سيتم إرفاقها من قبل العميل</p>
            </div>
            `}
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 15px;">
                <span style="font-size: 13px; color: #666;">حالة التحقق:</span>
                <span style="padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; ${order.verificationStatus === 'verified' ? 'background: #d4edda; color: #155724;' : order.verificationStatus === 'rejected' ? 'background: #f8d7da; color: #721c24;' : 'background: #fff3cd; color: #856404;'}">
                    ${order.verificationStatus === 'verified' ? '✓ تم التحقق' : order.verificationStatus === 'rejected' ? '✗ مرفوض' : '⏳ بانتظار التحقق'}
                </span>
            </div>
            <div class="verification-actions" style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn-success" onclick="verifyOrder(${order.id}, 'verified')" ${order.verificationStatus === 'verified' ? 'disabled' : ''} style="flex: 1;">
                    <img src="assets/icons/check.svg" class="icon icon-white" alt="verify"> قبول الدفع
                </button>
                <button class="btn-danger" onclick="verifyOrder(${order.id}, 'rejected')" ${order.verificationStatus === 'rejected' ? 'disabled' : ''} style="flex: 1;">
                    <img src="assets/icons/close.svg" class="icon icon-white" alt="reject"> رفض الدفع
                </button>
            </div>
        </div>
        ` : ''}
        
        <div class="order-details-section">
            <h4>تحديث حالة الطلب</h4>
            <div class="order-status-actions">
                <button class="btn-primary" onclick="updateOrderStatus(${order.id}, 'pending')" ${order.status === 'pending' ? 'disabled' : ''}>قيد المراجعة</button>
                <button class="btn-primary" onclick="updateOrderStatus(${order.id}, 'processing')" ${order.status === 'processing' ? 'disabled' : ''}>جاري التجهيز</button>
                <button class="btn-primary" onclick="updateOrderStatus(${order.id}, 'ready')" ${order.status === 'ready' ? 'disabled' : ''}>جاهز</button>
                <button class="btn-success" onclick="updateOrderStatus(${order.id}, 'delivered')" ${order.status === 'delivered' ? 'disabled' : ''}>تم التوصيل</button>
                <button class="btn-danger" onclick="updateOrderStatus(${order.id}, 'cancelled')" ${order.status === 'cancelled' ? 'disabled' : ''}>ملغي</button>
            </div>
        </div>
    `;

    openModal('orderDetailsModal');
}

function updateOrderStatus(orderId, status) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const oldStatus = orders[orderIndex].status;
    orders[orderIndex].status = status;
    saveData('palmiraOrders', orders);

    // Send notification to customer
    const statusMessages = {
        pending: 'جاري تأكيد طلبك',
        processing: 'تم تأكيد طلبك وجاري التجهيز',
        ready: 'طلبك جاهز للاستلام',
        delivered: 'تم تسليم طلبك بنجاح',
        cancelled: 'تم إلغاء طلبك'
    };

    if (statusMessages[status]) {
        const customer = customers.find(c => c.name === orders[orderIndex].customerName);
        addNotification({
            title: 'تحديث حالة الطلب',
            body: statusMessages[status] + ` #${orderId}`,
            target: 'customer',
            customerId: customer ? customer.id : null
        });
    }

    showToast('تم تحديث حالة الطلب بنجاح', 'success');
    viewOrderDetails(orderId);
    renderOrders();
}

function verifyOrder(orderId, status) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    orders[orderIndex].verificationStatus = status;
    saveData('palmiraOrders', orders);

    showToast(status === 'verified' ? 'تم قبول إثبات التحويل' : 'تم رفض إثبات التحويل', status === 'verified' ? 'success' : 'warning');
    viewOrderDetails(orderId);
}

function confirmDeleteOrder(orderId) {
    showDeleteConfirmation('هل أنت متأكد من حذف هذا الطلب؟', function () {
        orders = orders.filter(o => o.id !== orderId);
        saveData('palmiraOrders', orders);
        showToast('تم حذف الطلب بنجاح', 'success');
        renderOrders();
    });
}

// ===== Products =====
function renderProducts(page = 1, search = '') {
    const container = document.getElementById('productsTable');
    if (!container) return;

    let filteredProducts = [...products];

    if (search) {
        const query = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.id.toString().includes(query)
        );
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    if (paginatedProducts.length === 0) {
        container.innerHTML = '<tr><td colspan="9" class="empty-state">لا توجد منتجات</td></tr>';
        document.getElementById('productsPagination').innerHTML = '';
        return;
    }

    container.innerHTML = paginatedProducts.map(product => {
        const mainCat = categories.find(c => c.id == product.category);
        const subCat = product.subCategory ? categories.find(c => c.id == product.subCategory) : null;
        const innerCat = product.innerCategory ? categories.find(c => c.id == product.innerCategory) : null;
        const brand = brands.find(b => b.id == product.brand_id);
        const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

        // Build full category path
        let categoryPath = mainCat?.name || '-';
        if (subCat) categoryPath += ' › ' + subCat.name;
        if (innerCat) categoryPath += ' › ' + innerCat.name;

        return `
            <tr>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${product.price} ر.س</td>
                <td>${product.oldPrice ? product.oldPrice + ' ر.س' : '-'}</td>
                <td>${product.quantity || 0}</td>
                <td><span style="font-size: 12px;">${categoryPath}</span></td>
                <td>${brand?.name || '-'}</td>
                <td><span class="status-badge ${product.isSale ? 'status-ready' : 'status-pending'}">${product.isSale ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                    <button class="btn-icon btn-edit" onclick="editProduct(${product.id})" title="تعديل">
                        <img src="assets/icons/edit.svg" class="icon icon-white" alt="edit">
                    </button>
                    <button class="btn-icon btn-delete" onclick="confirmDeleteProduct(${product.id})" title="حذف">
                        <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    renderPagination('productsPagination', filteredProducts.length, page, (p) => renderProducts(p, search));
}

function openAddProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalTitle').textContent = 'إضافة منتج';

    window.tempProductFiles = [];
    document.getElementById('productImagePreviews').innerHTML = '';
    document.getElementById('productImageFiles').value = '';

    populateCategorySelects();
    populateBrandSelect();
    populateSkinTypeSelect();
    openModal('productModal');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOldPrice').value = product.oldPrice || '';
    document.getElementById('productQuantity').value = product.quantity || 0;

    // When editing, convert existing image URLs to the expected format
    window.tempProductFiles = (product.images || (product.image ? [product.image] : [])).map(url => {
        if (typeof url === 'string') return url; // Keep legacy string format for display
        return url;
    });
    renderImagePreviews();

    document.getElementById('productBrand').value = product.brand_id || '';
    document.getElementById('productSkinType').value = product.skinType || '';
    document.getElementById('productSize').value = product.size || '';
    document.getElementById('productUsage').value = product.usage || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productIsNew').checked = product.isNew || false;
    document.getElementById('productIsSale').checked = product.isSale || false;

    document.getElementById('productModalTitle').textContent = 'تعديل منتج';
    populateCategorySelects(product.allCategories || [product.category, product.subCategory, product.innerCategory].filter(Boolean));
    populateBrandSelect();
    populateSkinTypeSelect();
    openModal('productModal');
}

function handleProductSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('productName').value;
    const priceInput = document.getElementById('productPrice').value;

    const mainCategory = document.getElementById('productCategoryMain').value;
    const subCategory = document.getElementById('productCategorySub').value;
    const innerCategory = document.getElementById('productCategoryInner').value;

    if (!nameInput.trim()) {
        showToast('يرجى إدخال اسم المنتج', 'error');
        return;
    }

    if (!priceInput || isNaN(parseFloat(priceInput))) {
        showToast('يرجى إدخال سعر صحيح للمنتج', 'error');
        return;
    }

    if (!mainCategory) {
        showToast('يرجى اختيار القسم الرئيسي', 'error');
        return;
    }

    const allCategories = [mainCategory, subCategory, innerCategory].filter(Boolean).map(id => parseInt(id));

    const productId = document.getElementById('productId').value;
    // Extract preview URLs from the file objects for storage
    const images = window.tempProductFiles.map(item => {
        if (typeof item === 'string') return item;
        return item.previewUrl;
    });

    const productData = {
        id: productId ? parseInt(productId) : Date.now(),
        name: nameInput,
        price: parseFloat(priceInput),
        oldPrice: document.getElementById('productOldPrice').value ? parseFloat(document.getElementById('productOldPrice').value) : null,
        quantity: parseInt(document.getElementById('productQuantity').value) || 0,
        category: parseInt(mainCategory), // Backward compatibility - main category
        subCategory: subCategory ? parseInt(subCategory) : null,
        innerCategory: innerCategory ? parseInt(innerCategory) : null,
        allCategories: allCategories, // All selected category levels
        brand_id: document.getElementById('productBrand').value || null,
        skinType: document.getElementById('productSkinType').value || null,
        size: document.getElementById('productSize').value,
        usage: document.getElementById('productUsage').value,
        description: document.getElementById('productDescription').value,
        image: images[0] || 'assets/images/placeholder.png',
        images: images.length > 0 ? images : ['assets/images/placeholder.png'],
        isNew: document.getElementById('productIsNew').checked,
        isSale: document.getElementById('productIsSale').checked,
        popularity: 0
    };

    if (productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            productData.popularity = products[index].popularity || 0;
            products[index] = productData;
        }
    } else {
        products.push(productData);
    }

    saveData('palmiraProducts', products);
    closeModal('productModal');

    // Clear memory / UI
    window.tempProductFiles = [];
    document.getElementById('productImagePreviews').innerHTML = '';
    document.getElementById('productForm').reset();

    showToast(productId ? 'تم تعديل المنتج بنجاح' : 'تم إضافة المنتج بنجاح', 'success');
    renderProducts();
}

function confirmDeleteProduct(productId) {
    showDeleteConfirmation('هل أنت متأكد من حذف هذا المنتج؟', function () {
        products = products.filter(p => p.id !== productId);
        saveData('palmiraProducts', products);
        showToast('تم حذف المنتج بنجاح', 'success');
        renderProducts();
    });
}

// ===== Categories =====
function renderCategories() {
    const container = document.getElementById('categoriesTree');
    if (!container) return;

    const parentCategories = categories.filter(c => !c.parentId);

    if (parentCategories.length === 0) {
        container.innerHTML = '<div class="empty-state">لا توجد أقسام</div>';
        return;
    }

    container.innerHTML = parentCategories.map(cat => renderCategoryTree(cat)).join('');
}

function renderCategoryTree(category, level = 0) {
    const children = categories.filter(c => c.parentId === category.id);
    const padding = level * 30;

    return `
        <div class="category-tree-item" style="padding-right: ${15 + padding}px">
            <div class="category-tree-main">
                <img src="${category.image || 'assets/images/placeholder.png'}" alt="${category.name}">
                <div class="category-tree-info">
                    <h4>${category.name}</h4>
                    <p>${children.length} قسم فرعي | ${products.filter(p => (p.allCategories && p.allCategories.includes(category.id)) || p.category == category.id || p.subCategory == category.id || p.innerCategory == category.id).length} منتج</p>
                </div>
            </div>
            <div class="category-actions">
                <button class="btn-icon btn-edit" onclick="editCategory(${category.id})" title="تعديل">
                    <img src="assets/icons/edit.svg" class="icon icon-white" alt="edit">
                </button>
                <button class="btn-icon btn-delete" onclick="confirmDeleteCategory(${category.id})" title="حذف">
                    <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                </button>
            </div>
        </div>
        ${children.map(child => renderCategoryTree(child, level + 1)).join('')}
    `;
}

function openAddCategoryModal() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModalTitle').textContent = 'إضافة قسم';
    
    // Reset type selector
    document.getElementById('categoryTypeGroup').style.display = 'block';
    resetCategoryTypeSelector();
    setCategoryType('main'); // Default to main
    resetImgUpload('categoryImagePreviewImg', 'categoryImagePlaceholder', 'categoryImage');
    openModal('categoryModal');
}

function resetCategoryTypeSelector() {
    ['catTypeMain', 'catTypeSub', 'catTypeInner'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.borderColor = '#e0e0e0';
            el.style.background = '#fafafa';
            el.style.boxShadow = 'none';
        }
    });
    document.getElementById('catParentMainGroup').style.display = 'none';
    document.getElementById('catParentSubGroup').style.display = 'none';
    document.getElementById('categoryParent').value = '';
}

function setCategoryType(type) {
    // Store current type
    window._categoryType = type;
    
    // Reset all card styles
    resetCategoryTypeSelector();
    
    // Highlight selected card
    const colorMap = { main: '#e67e22', sub: '#3498db', inner: '#27ae60' };
    const idMap = { main: 'catTypeMain', sub: 'catTypeSub', inner: 'catTypeInner' };
    const selectedEl = document.getElementById(idMap[type]);
    if (selectedEl) {
        selectedEl.style.borderColor = colorMap[type];
        selectedEl.style.background = `${colorMap[type]}10`;
        selectedEl.style.boxShadow = `0 0 0 3px ${colorMap[type]}20`;
    }
    
    // Check the hidden radio
    const radio = selectedEl?.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
    
    // Show/hide parent selectors based on type
    if (type === 'main') {
        document.getElementById('catParentMainGroup').style.display = 'none';
        document.getElementById('catParentSubGroup').style.display = 'none';
        document.getElementById('categoryParent').value = '';
    } else if (type === 'sub') {
        populateCatParentMainSelect();
        document.getElementById('catParentMainGroup').style.display = 'block';
        document.getElementById('catParentSubGroup').style.display = 'none';
    } else if (type === 'inner') {
        populateCatParentMainSelect();
        document.getElementById('catParentMainGroup').style.display = 'block';
        document.getElementById('catParentSubGroup').style.display = 'block';
        document.getElementById('catParentSub').innerHTML = '<option value="">اختر القسم الفرعي أولاً</option>';
    }
}

function populateCatParentMainSelect() {
    const select = document.getElementById('catParentMain');
    if (!select) return;
    const currentId = document.getElementById('categoryId').value;
    const mainCats = categories.filter(c => !c.parentId && c.id != currentId);
    select.innerHTML = '<option value="">اختر القسم الرئيسي</option>' +
        mainCats.map(c => `<option value="${c.id}">📁 ${c.name}</option>`).join('');
}

function onCatParentMainChange() {
    const mainId = document.getElementById('catParentMain').value;
    
    if (window._categoryType === 'sub') {
        // For sub-category, the parent IS the selected main category
        document.getElementById('categoryParent').value = mainId;
    } else if (window._categoryType === 'inner') {
        // For inner category, populate sub-categories dropdown
        const subSelect = document.getElementById('catParentSub');
        if (!subSelect) return;
        
        if (!mainId) {
            subSelect.innerHTML = '<option value="">اختر القسم الرئيسي أولاً</option>';
            document.getElementById('categoryParent').value = '';
            return;
        }
        
        const currentId = document.getElementById('categoryId').value;
        const subCats = categories.filter(c => c.parentId == mainId && c.id != currentId);
        subSelect.innerHTML = '<option value="">اختر القسم الفرعي</option>' +
            subCats.map(c => `<option value="${c.id}">📂 ${c.name}</option>`).join('');
        
        // Listen for sub-category change
        subSelect.onchange = function() {
            document.getElementById('categoryParent').value = this.value;
        };
    }
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryImage').value = category.image || '';
    restoreImgUpload('categoryImagePreviewImg', 'categoryImagePlaceholder', category.image);
    document.getElementById('categoryModalTitle').textContent = 'تعديل قسم';
    
    // Determine the level of this category
    if (!category.parentId) {
        // Main category
        document.getElementById('categoryTypeGroup').style.display = 'block';
        setCategoryType('main');
        document.getElementById('categoryParent').value = '';
    } else {
        const parent = categories.find(c => c.id === category.parentId);
        if (parent && !parent.parentId) {
            // Sub-category (parent is a main category)
            document.getElementById('categoryTypeGroup').style.display = 'block';
            setCategoryType('sub');
            document.getElementById('catParentMain').value = category.parentId;
            document.getElementById('categoryParent').value = category.parentId;
        } else if (parent && parent.parentId) {
            // Inner category (parent is a sub-category)
            document.getElementById('categoryTypeGroup').style.display = 'block';
            setCategoryType('inner');
            document.getElementById('catParentMain').value = parent.parentId;
            onCatParentMainChange();
            // Set after populating
            setTimeout(() => {
                document.getElementById('catParentSub').value = category.parentId;
                document.getElementById('categoryParent').value = category.parentId;
            }, 50);
        }
    }
    
    openModal('categoryModal');
}

function handleCategorySubmit(e) {
    e.preventDefault();

    const categoryId = document.getElementById('categoryId').value;
    const type = window._categoryType || 'main';
    
    // Determine parentId based on type
    let parentId = null;
    if (type === 'sub') {
        parentId = document.getElementById('catParentMain').value;
        if (!parentId) {
            showToast('يرجى اختيار القسم الرئيسي', 'error');
            return;
        }
        parentId = parseInt(parentId);
    } else if (type === 'inner') {
        parentId = document.getElementById('catParentSub').value;
        if (!parentId) {
            showToast('يرجى اختيار القسم الفرعي', 'error');
            return;
        }
        parentId = parseInt(parentId);
    }

    const categoryData = {
        id: categoryId ? parseInt(categoryId) : Date.now(),
        name: document.getElementById('categoryName').value,
        parentId: parentId,
        image: document.getElementById('categoryImage').value || 'assets/images/placeholder.png'
    };

    if (categoryId) {
        const index = categories.findIndex(c => c.id === parseInt(categoryId));
        if (index !== -1) {
            categories[index] = categoryData;
        }
    } else {
        // Check for duplicate names at the same level
        const duplicate = categories.find(c => c.name === categoryData.name && c.parentId === categoryData.parentId);
        if (duplicate) {
            showToast('يوجد قسم بنفس الاسم في هذا المستوى', 'error');
            return;
        }
        categories.push(categoryData);
    }

    saveData('adminCategories', categories);
    closeModal('categoryModal');
    
    const typeNames = { main: 'القسم الرئيسي', sub: 'القسم الفرعي', inner: 'القسم الداخلي' };
    showToast(categoryId ? `تم تعديل ${typeNames[type]} بنجاح` : `تم إضافة ${typeNames[type]} بنجاح`, 'success');
    renderCategories();
}

function confirmDeleteCategory(categoryId) {
    const hasChildren = categories.some(c => c.parentId === categoryId);
    const hasProducts = products.some(p => p.category == categoryId);

    if (hasChildren || hasProducts) {
        showToast('لا يمكن حذف القسم لوجود أقسام فرعية أو منتجات مرتبطة', 'error');
        return;
    }

    showDeleteConfirmation('هل أنت متأكد من حذف هذا القسم؟', function () {
        categories = categories.filter(c => c.id !== categoryId);
        saveData('adminCategories', categories);
        showToast('تم حذف القسم بنجاح', 'success');
        renderCategories();
    });
}

// ===== Brands =====
function renderBrands() {
    const container = document.getElementById('brandsGrid');
    if (!container) return;

    if (brands.length === 0) {
        container.innerHTML = '<div class="empty-state">لا توجد ماركات</div>';
        return;
    }

    container.innerHTML = brands.map(brand => `
        <div class="brand-card">
            <div class="brand-actions">
                <button class="btn-icon btn-edit" onclick="editBrand(${brand.id})" title="تعديل">
                    <img src="assets/icons/edit.svg" class="icon icon-white" alt="edit">
                </button>
                <button class="btn-icon btn-delete" onclick="confirmDeleteBrand(${brand.id})" title="حذف">
                    <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                </button>
            </div>
            <img src="${brand.image}" alt="${brand.name}">
            <h4>${brand.name}</h4>
            <p>${products.filter(p => p.brand_id === brand.id).length} منتج</p>
        </div>
    `).join('');
}

function openAddBrandModal() {
    document.getElementById('brandForm').reset();
    document.getElementById('brandId').value = '';
    document.getElementById('brandModalTitle').textContent = 'إضافة ماركة';
    resetImgUpload('brandImagePreviewImg', 'brandImagePlaceholder', 'brandImage');
    openModal('brandModal');
}


function editBrand(brandId) {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return;

    document.getElementById('brandId').value = brand.id;
    document.getElementById('brandName').value = brand.name;
    document.getElementById('brandLetter').value = brand.letter || '';
    document.getElementById('brandImage').value = brand.image || '';
    // Show existing image in preview
    restoreImgUpload('brandImagePreviewImg', 'brandImagePlaceholder', brand.image);

    document.getElementById('brandModalTitle').textContent = 'تعديل ماركة';
    openModal('brandModal');
}


function handleBrandSubmit(e) {
    e.preventDefault();

    const brandId = document.getElementById('brandId').value;

    const brandData = {
        id: brandId ? parseInt(brandId) : Date.now(),
        name: document.getElementById('brandName').value,
        letter: document.getElementById('brandLetter').value,
        image: document.getElementById('brandImage').value || ''
    };

    if (brandId) {
        const index = brands.findIndex(b => b.id === parseInt(brandId));
        if (index !== -1) brands[index] = brandData;
    } else {
        brands.push(brandData);
    }

    saveData('adminBrands', brands);
    closeModal('brandModal');
    showToast(brandId ? 'تم تعديل الماركة بنجاح' : 'تم إضافة الماركة بنجاح', 'success');
    renderBrands();
}

function confirmDeleteBrand(brandId) {
    const hasProducts = products.some(p => p.brand_id === brandId);

    if (hasProducts) {
        showToast('لا يمكن حذف الماركة لوجود منتجات مرتبطة', 'error');
        return;
    }

    showDeleteConfirmation('هل أنت متأكد من حذف هذه الماركة؟', function () {
        brands = brands.filter(b => b.id !== brandId);
        saveData('adminBrands', brands);
        showToast('تم حذف الماركة بنجاح', 'success');
        renderBrands();
    });
}

// ===== Skin Types =====
function renderSkinTypes() {
    const container = document.getElementById('skinTypesGrid');
    if (!container) return;

    if (skinTypes.length === 0) {
        container.innerHTML = '<div class="empty-state">لا توجد أنواع بشرة</div>';
        return;
    }

    container.innerHTML = skinTypes.map(type => `
        <div class="skin-type-card">
            <div class="brand-actions">
                <button class="btn-icon btn-edit" onclick="editSkinType(${type.id})" title="تعديل">
                    <img src="assets/icons/edit.svg" class="icon icon-white" alt="edit">
                </button>
                <button class="btn-icon btn-delete" onclick="confirmDeleteSkinType(${type.id})" title="حذف">
                    <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                </button>
            </div>
            <img src="${type.image}" alt="${type.name}">
            <h4>${type.name}</h4>
        </div>
    `).join('');
}

function openAddSkinTypeModal() {
    document.getElementById('skinTypeForm').reset();
    document.getElementById('skinTypeId').value = '';
    document.getElementById('skinTypeModalTitle').textContent = 'إضافة نوع بشرة';
    resetImgUpload('skinTypeImagePreviewImg', 'skinTypeImagePlaceholder', 'skinTypeImage');
    openModal('skinTypeModal');
}


function editSkinType(typeId) {
    const type = skinTypes.find(t => t.id === typeId);
    if (!type) return;

    document.getElementById('skinTypeId').value = type.id;
    document.getElementById('skinTypeName').value = type.name;
    document.getElementById('skinTypeImage').value = type.image || '';
    restoreImgUpload('skinTypeImagePreviewImg', 'skinTypeImagePlaceholder', type.image);

    document.getElementById('skinTypeModalTitle').textContent = 'تعديل نوع بشرة';
    openModal('skinTypeModal');
}


function handleSkinTypeSubmit(e) {
    e.preventDefault();

    const typeId = document.getElementById('skinTypeId').value;

    const typeData = {
        id: typeId ? parseInt(typeId) : Date.now(),
        name: document.getElementById('skinTypeName').value,
        image: document.getElementById('skinTypeImage').value || ''
    };

    if (typeId) {
        const index = skinTypes.findIndex(t => t.id === parseInt(typeId));
        if (index !== -1) skinTypes[index] = typeData;
    } else {
        skinTypes.push(typeData);
    }

    saveData('adminSkinTypes', skinTypes);
    closeModal('skinTypeModal');
    showToast(typeId ? 'تم تعديل نوع البشرة بنجاح' : 'تم إضافة نوع البشرة بنجاح', 'success');
    renderSkinTypes();
}

function confirmDeleteSkinType(typeId) {
    showDeleteConfirmation('هل أنت متأكد من حذف هذا النوع؟', function () {
        skinTypes = skinTypes.filter(t => t.id !== typeId);
        saveData('adminSkinTypes', skinTypes);
        showToast('تم حذف نوع البشرة بنجاح', 'success');
        renderSkinTypes();
    });
}

// ===== Offers =====
function renderOffers() {
    const container = document.getElementById('offersTable');
    if (!container) return;

    if (offers.length === 0) {
        container.innerHTML = '<tr><td colspan="7" class="empty-state">لا توجد عروض</td></tr>';
        return;
    }

    container.innerHTML = offers.map(offer => {
        const product = products.find(p => p.id === offer.productId);
        const isActive = new Date() >= new Date(offer.startDate) && new Date() <= new Date(offer.endDate);

        return `
            <tr>
                <td>${product?.name || 'منتج محذوف'}</td>
                <td>${offer.percentage}%</td>
                <td>${product ? Math.round(product.price * (1 - offer.percentage / 100)) + ' ر.س' : '-'}</td>
                <td>${offer.startDate}</td>
                <td>${offer.endDate}</td>
                <td><span class="status-badge ${isActive ? 'status-ready' : 'status-pending'}">${isActive ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                    <button class="btn-icon btn-edit" onclick="editOffer(${offer.id})" title="تعديل">
                        <img src="assets/icons/edit.svg" class="icon icon-white" alt="edit">
                    </button>
                    <button class="btn-icon btn-delete" onclick="confirmDeleteOffer(${offer.id})" title="حذف">
                        <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddOfferModal() {
    document.getElementById('offerForm').reset();
    document.getElementById('offerId').value = '';
    document.getElementById('offerModalTitle').textContent = 'إضافة عرض';
    // Reset product search
    document.getElementById('offerProductSearch').value = '';
    document.getElementById('offerProduct').value = '';
    document.getElementById('offerProductSelected').style.display = 'none';
    document.getElementById('offerProductSelected').textContent = '';
    document.getElementById('offerProductDropdown').style.display = 'none';
    openModal('offerModal');
}

function editOffer(offerId) {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    document.getElementById('offerId').value = offer.id;
    document.getElementById('offerPercentage').value = offer.percentage;
    document.getElementById('offerStartDate').value = offer.startDate;
    document.getElementById('offerEndDate').value = offer.endDate;

    // Restore product search
    const product = products.find(p => p.id === offer.productId);
    if (product) {
        document.getElementById('offerProductSearch').value = product.name;
        document.getElementById('offerProduct').value = product.id;
        const badge = document.getElementById('offerProductSelected');
        badge.textContent = product.name + ' - ' + product.price + ' ر.س';
        badge.style.display = 'flex';
    }
    document.getElementById('offerProductDropdown').style.display = 'none';

    document.getElementById('offerModalTitle').textContent = 'تعديل عرض';
    openModal('offerModal');
}

function handleOfferSubmit(e) {
    e.preventDefault();

    const offerId = document.getElementById('offerId').value;
    const productId = parseInt(document.getElementById('offerProduct').value);

    if (!productId) {
        showToast('يرجى اختيار منتج من قائمة البحث', 'error');
        document.getElementById('offerProductSearch').focus();
        return;
    }
    const percentage = parseInt(document.getElementById('offerPercentage').value);

    const offerData = {
        id: offerId ? parseInt(offerId) : Date.now(),
        productId: productId,
        percentage: percentage,
        startDate: document.getElementById('offerStartDate').value,
        endDate: document.getElementById('offerEndDate').value
    };

    // Update product price
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        const product = products[productIndex];
        if (!product.oldPrice) product.oldPrice = product.price;
        product.price = Math.round(product.oldPrice * (1 - percentage / 100));
        saveData('palmiraProducts', products);
    }

    if (offerId) {
        const index = offers.findIndex(o => o.id === parseInt(offerId));
        if (index !== -1) offers[index] = offerData;
    } else {
        offers.push(offerData);
    }

    saveData('adminOffers', offers);
    closeModal('offerModal');
    showToast(offerId ? 'تم تعديل العرض بنجاح' : 'تم إضافة العرض بنجاح', 'success');
    renderOffers();
}

function confirmDeleteOffer(offerId) {
    showDeleteConfirmation('هل أنت متأكد من حذف هذا العرض؟', function () {
        const offer = offers.find(o => o.id === offerId);

        // Restore product price
        if (offer) {
            const product = products.find(p => p.id === offer.productId);
            if (product && product.oldPrice) {
                product.price = product.oldPrice;
                product.oldPrice = null;
                saveData('palmiraProducts', products);
            }
        }

        offers = offers.filter(o => o.id !== offerId);
        saveData('adminOffers', offers);
        showToast('تم حذف العرض بنجاح', 'success');
        renderOffers();
    });
}

// ===== Banners =====
function renderBanners() {
    for (let i = 0; i < 3; i++) {
        const banner = banners.find(b => b.position === i) || { image: '', link: '' };
        document.getElementById(`banner${i}Url`).value = banner.image;
        document.getElementById(`banner${i}Link`).value = banner.link;
        // Restore image into the new upload preview
        restoreImgUpload(`banner${i}PreviewImg`, `banner${i}Placeholder`, banner.image);
    }
}

function updateBannerPreview(index, url) {
    // Legacy compatibility - uses new upload preview system
    restoreImgUpload(`banner${index}PreviewImg`, `banner${index}Placeholder`, url);
}

function saveBanners() {
    for (let i = 0; i < 3; i++) {
        const image = document.getElementById(`banner${i}Url`).value;
        const link = document.getElementById(`banner${i}Link`).value;

        const existingIndex = banners.findIndex(b => b.position === i);
        if (existingIndex !== -1) {
            banners[existingIndex].image = image;
            banners[existingIndex].link = link;
        } else {
            banners.push({
                id: Date.now() + i,
                position: i,
                image: image,
                link: link
            });
        }
    }

    saveData('adminBanners', banners);
    showToast('تم حفظ البنرات بنجاح', 'success');
}

// ===== Customers =====
function renderCustomers(page = 1, search = '') {
    const container = document.getElementById('customersTable');
    if (!container) return;

    let filteredCustomers = [...customers];

    if (search) {
        const query = search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.phone?.includes(query)
        );
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    if (paginatedCustomers.length === 0) {
        container.innerHTML = '<tr><td colspan="7" class="empty-state">لا يوجد عملاء</td></tr>';
        document.getElementById('customersPagination').innerHTML = '';
        return;
    }

    container.innerHTML = paginatedCustomers.map(customer => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone || '-'}</td>
            <td>${customer.ordersCount || 0}</td>
            <td>${customer.totalSpent || 0} ر.س</td>
            <td>${customer.createdAt || '-'}</td>
            <td>
                <button class="btn-icon btn-edit" onclick="viewCustomerOrders(${customer.id})" title="عرض الطلبات">
                    <img src="assets/icons/eye.svg" class="icon icon-white" alt="view">
                </button>
            </td>
        </tr>
    `).join('');

    renderPagination('customersPagination', filteredCustomers.length, page, (p) => renderCustomers(p, search));
}

function viewCustomerOrders(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const customerOrders = orders.filter(o => o.customerName === customer.name);

    let content = `
        <div class="order-details-section">
            <h4>معلومات العميل</h4>
            <p><strong>الاسم:</strong> ${customer.name}</p>
            <p><strong>الهاتف:</strong> ${customer.phone || '-'}</p>
            <p><strong>عدد الطلبات:</strong> ${customerOrders.length}</p>
        </div>
        <div class="order-details-section">
            <h4>الطلبات</h4>
    `;

    if (customerOrders.length === 0) {
        content += '<p>لا توجد طلبات</p>';
    } else {
        content += `<table class="data-table">
            <thead>
                <tr><th>رقم الطلب</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th></tr>
            </thead>
            <tbody>`;
        content += customerOrders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>${o.total} ر.س</td>
                <td><span class="status-badge status-${o.status}">${getStatusText(o.status)}</span></td>
                <td>${o.date}</td>
            </tr>
        `).join('');
        content += '</tbody></table>';
    }

    content += '</div>';

    document.getElementById('orderDetailsContent').innerHTML = content;
    document.getElementById('orderDetailsNumber').textContent = '- ' + customer.name;
    openModal('orderDetailsModal');
}

// ===== Users =====
function renderUsers() {
    const container = document.getElementById('usersTable');
    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = '<tr><td colspan="6" class="empty-state">لا يوجد مستخدمين</td></tr>';
        return;
    }

    container.innerHTML = users.map(user => `
        <tr>
            <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.role === 'admin' ? 'مشرف' : 'موظف'}</td>
            <td><span class="status-badge ${user.status === 'active' ? 'status-ready' : 'status-cancelled'}">${user.status === 'active' ? 'نشط' : 'معطل'}</span></td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ar-SA') : 'لم يسبق له'}</td>
            <td>
                <button class="btn-icon btn-edit" onclick="editUser(${user.id})" title="تعديل">
                    <img src="assets/icons/edit.svg" class="icon icon-white" alt="edit">
                </button>
                ${user.id !== currentUser?.id ? `
                <button class="btn-icon btn-delete" onclick="confirmDeleteUser(${user.id})" title="حذف">
                    <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function openAddUserModal() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModalTitle').textContent = 'إضافة مستخدم';
    document.getElementById('userPassword').required = true;
    openModal('userModal');
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('userId').value = user.id;
    document.getElementById('userFullName').value = user.fullName;
    document.getElementById('userUsername').value = user.username;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userPassword').value = '';
    document.getElementById('userPassword').required = false;

    document.getElementById('userModalTitle').textContent = 'تعديل مستخدم';
    openModal('userModal');
}

function handleUserSubmit(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const password = document.getElementById('userPassword').value;

    const userData = {
        id: userId ? parseInt(userId) : Date.now(),
        fullName: document.getElementById('userFullName').value,
        username: document.getElementById('userUsername').value,
        role: document.getElementById('userRole').value,
        status: 'active'
    };

    if (password) {
        userData.password = password;
    }

    if (userId) {
        const index = users.findIndex(u => u.id === parseInt(userId));
        if (index !== -1) {
            if (!password) userData.password = users[index].password;
            users[index] = userData;
        }
    } else {
        if (!password) {
            showToast('كلمة المرور مطلوبة', 'error');
            return;
        }
        users.push(userData);
    }

    saveData('adminUsers', users);
    closeModal('userModal');
    showToast(userId ? 'تم تعديل المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح', 'success');
    renderUsers();
}

function confirmDeleteUser(userId) {
    if (userId === currentUser?.id) {
        showToast('لا يمكنك حذف حسابك الحالي', 'error');
        return;
    }

    showDeleteConfirmation('هل أنت متأكد من حذف هذا المستخدم؟', function () {
        users = users.filter(u => u.id !== userId);
        saveData('adminUsers', users);
        showToast('تم حذف المستخدم بنجاح', 'success');
        renderUsers();
    });
}

// ===== Notifications =====
function renderNotifications() {
    const container = document.getElementById('notificationsList');
    if (!container) return;

    if (notifications.length === 0) {
        container.innerHTML = '<div class="empty-state">لا توجد إشعارات</div>';
        return;
    }

    container.innerHTML = notifications.slice().reverse().map(notif => `
        <div class="notification-item">
            <div class="notification-icon">
                <img src="assets/icons/notifications.svg" class="icon" alt="notification">
            </div>
            <div class="notification-content">
                <h4>${notif.title}</h4>
                <p>${notif.body}</p>
                <span class="notification-time">${new Date(notif.date).toLocaleString('ar-SA')}</span>
            </div>
        </div>
    `).join('');
}

function openSendNotificationModal() {
    document.getElementById('notificationForm').reset();
    openModal('notificationModal');
}

function handleNotificationSubmit(e) {
    e.preventDefault();

    addNotification({
        title: document.getElementById('notificationTitle').value,
        body: document.getElementById('notificationBody').value,
        target: document.getElementById('notificationTarget').value
    });

    closeModal('notificationModal');
    showToast('تم إرسال الإشعار بنجاح', 'success');
}

function addNotification(notification) {
    notification.id = Date.now();
    notification.date = new Date().toISOString();
    notifications.push(notification);
    saveData('adminNotifications', notifications);
    renderNotifications();

    // Update badge
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = notifications.filter(n => !n.read).length;
    }
}

// ===== Settings =====
function renderSettings() {
    document.getElementById('storeName').value = settings.storeName || '';
    document.getElementById('storePhone').value = settings.storePhone || '';
    document.getElementById('storeEmail').value = settings.storeEmail || '';
    document.getElementById('deliveryPrice').value = settings.deliveryPrice || 20;
    document.getElementById('storeAddress').value = settings.storeAddress || '';

    if (currentUser.role === 'admin') {
        populateUserSelectForSettings();
    }
}

function populateUserSelectForSettings() {
    const select = document.getElementById('passSettingUser');
    if (!select) return;

    select.innerHTML = '<option value="">اختر المستخدم...</option>' +
        users.map(u => `<option value="${u.id}">${u.fullName} (${u.username})</option>`).join('');
}

function handlePasswordChangeSubmit(e) {
    e.preventDefault();

    const userId = parseInt(document.getElementById('passSettingUser').value);
    const newPass = document.getElementById('passSettingNew').value;
    const confirmPass = document.getElementById('passSettingConfirm').value;

    if (!userId) {
        showToast('يرجى اختيار مستخدم', 'error');
        return;
    }

    if (newPass !== confirmPass) {
        showToast('كلمتا المرور غير متطابقتين', 'error');
        return;
    }

    if (newPass.length < 4) {
        showToast('كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'error');
        return;
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].password = newPass;
        saveData('adminUsers', users);
        showToast(`تم تغيير كلمة مرور ${users[userIndex].fullName} بنجاح`, 'success');
        
        // Reset form
        e.target.reset();
    } else {
        showToast('المستخدم غير موجود', 'error');
    }
}

function handleSettingsSubmit(e) {
    e.preventDefault();

    settings.storeName = document.getElementById('storeName').value;
    settings.storePhone = document.getElementById('storePhone').value;
    settings.storeEmail = document.getElementById('storeEmail').value;
    settings.deliveryPrice = parseFloat(document.getElementById('deliveryPrice').value);
    settings.storeAddress = document.getElementById('storeAddress').value;

    saveData('adminSettings', settings);
    showToast('تم حفظ الإعدادات بنجاح', 'success');
}

// ===== Helper Functions =====
function populateCategorySelects(selectedIds = []) {
    const mainSelect = document.getElementById('productCategoryMain');
    const subSelect = document.getElementById('productCategorySub');
    const innerSelect = document.getElementById('productCategoryInner');
    const subGroup = document.getElementById('subCategoryGroup');
    const innerGroup = document.getElementById('innerCategoryGroup');
    const row = document.getElementById('nestedCategoryRow');

    if (!mainSelect) return;

    const mainCategories = categories.filter(c => !c.parentId);
    mainSelect.innerHTML = '<option value="">اختر القسم الرئيسي</option>' +
        mainCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    subGroup.style.display = 'none';
    innerGroup.style.display = 'none';
    subSelect.innerHTML = '<option value="">اختر القسم الفرعي</option>';
    innerSelect.innerHTML = '<option value="">اختر القسم الداخلي</option>';
    if (row) row.style.display = 'none';

    if (selectedIds.length > 0) {
        mainSelect.value = selectedIds[0] || '';
        if (selectedIds[0]) populateSubCategories(selectedIds[0], selectedIds[1], selectedIds[2]);
    }
}

function populateSubCategories(parentId, selectedSub = null, selectedInner = null) {
    const subSelect = document.getElementById('productCategorySub');
    const subGroup = document.getElementById('subCategoryGroup');
    const innerSelect = document.getElementById('productCategoryInner');
    const innerGroup = document.getElementById('innerCategoryGroup');
    const row = document.getElementById('nestedCategoryRow');

    innerGroup.style.display = 'none';
    innerSelect.innerHTML = '<option value="">اختر القسم الداخلي</option>';

    if (!parentId) {
        subGroup.style.display = 'none';
        subSelect.innerHTML = '<option value="">اختر القسم الفرعي</option>';
        if (row) row.style.display = 'none';
        return;
    }

    const subCats = categories.filter(c => c.parentId == parentId);
    if (subCats.length > 0) {
        subSelect.innerHTML = '<option value="">اختر القسم الفرعي</option>' +
            subCats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        subGroup.style.display = 'block';
        if (row) row.style.display = 'flex';

        if (selectedSub) {
            subSelect.value = selectedSub;
            populateInnerCategories(selectedSub, selectedInner);
        }
    } else {
        subGroup.style.display = 'none';
        if (row) row.style.display = 'none';
    }
}

function populateInnerCategories(parentId, selectedInner = null) {
    const innerSelect = document.getElementById('productCategoryInner');
    const innerGroup = document.getElementById('innerCategoryGroup');

    if (!parentId) {
        innerGroup.style.display = 'none';
        innerSelect.innerHTML = '<option value="">اختر القسم الداخلي</option>';
        return;
    }

    const innerCats = categories.filter(c => c.parentId == parentId);
    if (innerCats.length > 0) {
        innerSelect.innerHTML = '<option value="">اختر القسم الداخلي</option>' +
            innerCats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        innerGroup.style.display = 'block';

        if (selectedInner) {
            innerSelect.value = selectedInner;
        }
    } else {
        innerGroup.style.display = 'none';
    }
}

function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    e.target.value = '';

    const maxFiles = 5;
    const maxSize = 2 * 1024 * 1024;

    if (window.tempProductFiles.length + files.length > maxFiles) {
        showToast(`لا يمكن رفع أكثر من ${maxFiles} صور`, 'warning');
        return;
    }

    for (const file of files) {
        if (file.size > maxSize) {
            showToast(`الصورة ${file.name} تتجاوز الحجم المسموح (2MB)`, 'error');
            continue;
        }
        // Store both the File object and a preview URL
        const previewUrl = URL.createObjectURL(file);
        window.tempProductFiles.push({
            file: file,
            previewUrl: previewUrl,
            name: file.name
        });
    }

    renderImagePreviews();
}

function renderImagePreviews() {
    const container = document.getElementById('productImagePreviews');
    if (!container) return;
    container.innerHTML = window.tempProductFiles.map((item, index) => {
        // Support both old string format and new object format
        const url = typeof item === 'string' ? item : item.previewUrl;
        const name = typeof item === 'string' ? '' : item.name;
        return `
        <div style="position: relative; width: 90px; height: 90px; border-radius: 10px; overflow: hidden; border: 2px solid #e0e0e0; background: #fafafa; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" title="${name}">
            <button type="button" onclick="removeTempImage(${index})" style="position: absolute; top: 3px; right: 3px; background: linear-gradient(135deg, #ff4444, #cc0000); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; box-shadow: 0 1px 4px rgba(0,0,0,0.3); transition: transform 0.15s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">✕</button>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.55); color: white; font-size: 9px; text-align: center; padding: 2px 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${index + 1}/${window.tempProductFiles.length}</div>
        </div>
    `;
    }).join('');
}

function removeTempImage(index) {
    const item = window.tempProductFiles[index];
    // Revoke the object URL to free memory
    if (item && typeof item === 'object' && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
    }
    window.tempProductFiles.splice(index, 1);
    renderImagePreviews();
}

function populateParentCategorySelect() {
    const select = document.getElementById('categoryParent');
    if (!select) return;

    const currentId = document.getElementById('categoryId').value;
    // Build a hierarchical list showing main and sub categories as potential parents
    let options = '<option value="">قسم رئيسي</option>';
    const mainCats = categories.filter(c => !c.parentId && c.id != currentId);
    mainCats.forEach(main => {
        options += `<option value="${main.id}">📁 ${main.name}</option>`;
        const subCats = categories.filter(c => c.parentId === main.id && c.id != currentId);
        subCats.forEach(sub => {
            options += `<option value="${sub.id}">&nbsp;&nbsp;&nbsp;📂 ${sub.name}</option>`;
        });
    });
    select.innerHTML = options;
}

function populateBrandSelect() {
    const select = document.getElementById('productBrand');
    if (!select) return;

    select.innerHTML = '<option value="">اختر الماركة</option>' +
        brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
}

function populateSkinTypeSelect() {
    const select = document.getElementById('productSkinType');
    if (!select) return;

    select.innerHTML = '<option value="">اختر نوع البشرة</option>' +
        skinTypes.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

// ===== Product Autocomplete for Offer Modal =====
function filterOfferProducts(query) {
    const dropdown = document.getElementById('offerProductDropdown');
    const trimmed = query.trim();

    // Filter products
    const matched = trimmed === ''
        ? products.slice(0, 20)  // show first 20 when empty
        : products.filter(p => p.name.includes(trimmed)).slice(0, 20);

    if (matched.length === 0) {
        dropdown.innerHTML = '<div class="product-search-no-results">لا توجد نتائج</div>';
    } else {
        dropdown.innerHTML = matched.map(p => {
            const img = (p.images && p.images[0]) || p.image || 'assets/images/placeholder.png';
            return `<div class="product-search-item" onclick="selectOfferProduct(${p.id}, '${p.name.replace(/'/g, "&apos;")}', ${p.price})">
                <img src="${img}" alt="${p.name}" onerror="this.src='assets/images/placeholder.png'">
                <div class="product-search-item-info">
                    <div class="product-search-item-name">${p.name}</div>
                    <div class="product-search-item-price">${p.price} ر.س</div>
                </div>
            </div>`;
        }).join('');
    }

    dropdown.style.display = 'block';
}

function selectOfferProduct(productId, productName, productPrice) {
    document.getElementById('offerProduct').value = productId;
    document.getElementById('offerProductSearch').value = productName;
    document.getElementById('offerProductDropdown').style.display = 'none';

    const badge = document.getElementById('offerProductSelected');
    badge.textContent = productName + ' - ' + productPrice + ' ر.س';
    badge.style.display = 'flex';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const wrap = document.querySelector('.product-search-wrap');
    if (wrap && !wrap.contains(e.target)) {
        const dd = document.getElementById('offerProductDropdown');
        if (dd) dd.style.display = 'none';
    }
});


function getCategoryName(categoryId) {
    const category = categories.find(c => c.id == categoryId);
    return category?.name || categoryId;
}

function getCategoryRoot(categoryId) {
    const category = categories.find(c => c.id == categoryId);
    if (!category) return null;
    if (!category.parentId) return category.id;
    return getCategoryRoot(category.parentId);
}

function getStatusText(status) {
    const texts = {
        pending: 'قيد المراجعة',
        processing: 'جاري التجهيز',
        ready: 'جاهز',
        delivered: 'تم التوصيل',
        cancelled: 'ملغي'
    };
    return texts[status] || status;
}

function getPaymentMethodText(method) {
    const texts = {
        cash: 'الدفع عند استلام الطلب',
        bank: 'تحويل بنكي',
        paytabs: 'ون كاش',
        jeib: 'جيب',
        flousk: 'فلوسك',
        transfer: 'تحويل بنكي',  // backward compatibility
        card: 'بطاقة ائتمان'     // backward compatibility
    };
    return texts[method] || method;
}

function getPaymentMethodIcon(method) {
    const icons = {
        cash: '💵',
        bank: '🏦',
        paytabs: '📱',
        jeib: '📲',
        flousk: '💳',
        transfer: '🏦',
        card: '💳'
    };
    return `<span style="font-size: 18px;">${icons[method] || '💰'}</span>`;
}

function isElectronicPayment(method) {
    return ['bank', 'paytabs', 'jeib', 'flousk'].includes(method);
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <img src="assets/icons/${type === 'success' ? 'success' : type === 'error' ? 'error' : 'warning'}.svg" class="icon" alt="${type}">
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

function showDeleteConfirmation(message, callback) {
    document.getElementById('deleteMessage').textContent = message;
    deleteCallback = callback;
    openModal('deleteModal');
}

function renderPagination(containerId, totalItems, currentPage, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    html += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" class="page-btn">«</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<button disabled>...</button>';
        }
    }

    html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" class="page-btn">»</button>`;
    container.innerHTML = html;

    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (!this.hasAttribute('disabled')) {
                const page = parseInt(this.getAttribute('data-page'));
                if (!isNaN(page)) callback(page);
            }
        });
    });
}

function viewImage(src) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div class="modal-content modal-large" style="padding: 0; background: transparent;" onclick="this.parentElement.remove()">
            <img src="${src}" style="max-width: 100%; max-height: 90vh; border-radius: 12px;" onclick="event.stopPropagation()">
        </div>
    `;
    document.body.appendChild(modal);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Notification Dropdown
function toggleNotificationsDropdown(btnElement) {
    let dropdown = document.getElementById('notificationsDropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'notificationsDropdown';
        dropdown.style.cssText = 'position: absolute; top: 100%; left: 0; width: 300px; background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); z-index: 1000; max-height: 400px; overflow-y: auto; display: none; margin-top: 10px; text-align: right; cursor: default;';
        btnElement.style.position = 'relative';
        btnElement.appendChild(dropdown);
    }

    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        let html = '<div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;"><strong>الإشعارات</strong><a href="#" onclick="navigateTo(\'notifications\'); document.getElementById(\'notificationsDropdown\').style.display = \'none\';" style="color: #f78686; font-size: 12px; text-decoration: none;">عرض الكل</a></div>';

        const recentNotifs = notifications.slice().reverse().slice(0, 5);

        if (recentNotifs.length) {
            recentNotifs.forEach(n => {
                html += `<div style="padding: 15px; border-bottom: 1px solid #eee; background: ${n.read ? 'white' : '#fef5f5'};">
                    <div style="font-weight: bold; margin-bottom: 5px; color: #333;">${n.title}</div>
                    <div style="color: #666; font-size: 13px;">${n.body}</div>
                    <div style="color: #999; font-size: 11px; margin-top: 5px;">${new Date(n.date).toLocaleString('ar-SA')}</div>
                </div>`;
            });
        } else {
            html += '<div style="padding: 20px; text-align: center; color: #999;">لا توجد إشعارات</div>';
        }

        dropdown.innerHTML = html;
        dropdown.style.display = 'block';

        let hasUnread = false;
        notifications.forEach(n => { if (!n.read) { n.read = true; hasUnread = true; } });
        if (hasUnread) {
            saveData('adminNotifications', notifications);
            const badge = document.getElementById('notificationBadge');
            if (badge) badge.textContent = '0';
        }
    }
}

document.addEventListener('click', function (e) {
    const notifDropdown = document.getElementById('notificationsDropdown');

    if (notifDropdown && !e.target.closest('#notificationBtn')) {
        notifDropdown.style.display = 'none';
    }
});

// ===== PWA =====
function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('pwaPrompt').style.display = 'block';
    });

    window.addEventListener('appinstalled', () => {
        document.getElementById('pwaPrompt').style.display = 'none';
        deferredPrompt = null;
    });
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showToast('تم تثبيت التطبيق بنجاح', 'success');
            }
            deferredPrompt = null;
        });
    }
    document.getElementById('pwaPrompt').style.display = 'none';
}

function dismissPWA() {
    document.getElementById('pwaPrompt').style.display = 'none';
}

// ============================================================
// ===== Currencies Management =================================
// ============================================================

function renderCurrencies(page = 1) {
    const search = (document.getElementById('currencySearch')?.value || '').trim().toLowerCase();

    let filtered = [...currencies];

    // Apply filter
    if (currencyFilter === 'active') {
        filtered = filtered.filter(c => c.status === 'active');
    } else if (currencyFilter === 'inactive') {
        filtered = filtered.filter(c => c.status === 'inactive');
    } else if (currencyFilter === 'default') {
        filtered = filtered.filter(c => c.isDefault);
    }

    // Apply search
    if (search) {
        filtered = filtered.filter(c =>
            c.name.includes(search) ||
            c.code.toLowerCase().includes(search) ||
            (c.symbol && c.symbol.includes(search))
        );
    }

    // Update stats
    updateCurrencyStats();

    const container = document.getElementById('currenciesTable');
    if (!container) return;

    const startIndex = (page - 1) * itemsPerPage;
    const paged = filtered.slice(startIndex, startIndex + itemsPerPage);

    if (paged.length === 0) {
        container.innerHTML = '<tr><td colspan="8" class="empty-state">لا توجد عملات مطابقة</td></tr>';
        document.getElementById('currenciesPagination').innerHTML = '';
        return;
    }

    container.innerHTML = paged.map(c => {
        const statusBadge = c.status === 'active'
            ? '<span class="status-badge status-ready">مفعّلة</span>'
            : '<span class="status-badge status-cancelled">معطّلة</span>';

        const defaultBadge = c.isDefault
            ? '<span class="default-badge">★ افتراضية</span>'
            : '<span class="not-default-badge">—</span>';

        const updatedDate = c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('ar-SA') : '-';

        const toggleBtn = c.status === 'active'
            ? `<button class="btn-toggle-active" onclick="toggleCurrencyStatus(${c.id})" title="تعطيل">✗</button>`
            : `<button class="btn-toggle-inactive" onclick="toggleCurrencyStatus(${c.id})" title="تفعيل">✓</button>`;

        const setDefaultBtn = c.isDefault
            ? `<button class="btn-set-default" disabled>افتراضية</button>`
            : `<button class="btn-set-default" onclick="setCurrencyDefault(${c.id})">تعيين افتراضية</button>`;

        return `
            <tr>
                <td><span style="color:var(--text-gray);font-size:13px;">#${c.id}</span></td>
                <td><strong>${c.name}</strong></td>
                <td><span class="code-pill">${c.code}</span>${c.symbol ? ` <span style="color:var(--text-gray);font-size:12px;">(${c.symbol})</span>` : ''}</td>
                <td><span class="rate-display">${Number(c.rate).toFixed(4)}</span></td>
                <td>${statusBadge}</td>
                <td>${defaultBadge}</td>
                <td style="font-size:13px;color:var(--text-gray);">${updatedDate}</td>
                <td>
                    <div class="curr-actions-wrap">
                        <button class="btn-icon btn-edit" onclick="editCurrency(${c.id})" title="تعديل">
                            <img src="assets/icons/edit.svg" class="icon icon-white" alt="edit">
                        </button>
                        ${toggleBtn}
                        ${setDefaultBtn}
                        <button class="btn-icon btn-delete" onclick="confirmDeleteCurrency(${c.id})" title="حذف">
                            <img src="assets/icons/delete.svg" class="icon icon-white" alt="delete">
                        </button>
                    </div>
                </td>
            </tr>`;
    }).join('');

    renderPagination('currenciesPagination', filtered.length, page, (p) => renderCurrencies(p));
}

function updateCurrencyStats() {
    const total = currencies.length;
    const active = currencies.filter(c => c.status === 'active').length;
    const def = currencies.find(c => c.isDefault);

    // Find latest updatedAt
    const latest = currencies.reduce((a, b) =>
        new Date(a.updatedAt || 0) > new Date(b.updatedAt || 0) ? a : b, currencies[0]);

    const el = (id) => document.getElementById(id);
    if (el('statTotalCurrencies')) el('statTotalCurrencies').textContent = total;
    if (el('statActiveCurrencies')) el('statActiveCurrencies').textContent = active;
    if (el('statDefaultCurrency')) el('statDefaultCurrency').textContent = def ? def.code : '-';
    if (el('statLastUpdate') && latest?.updatedAt) {
        el('statLastUpdate').textContent = new Date(latest.updatedAt).toLocaleDateString('ar-SA');
    }
}

function setCurrencyFilter(filter, btn) {
    currencyFilter = filter;
    document.querySelectorAll('.curr-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderCurrencies(1);
}

function openAddCurrencyModal() {
    document.getElementById('currencyForm').reset();
    document.getElementById('currencyId').value = '';
    document.getElementById('currencyModalTitle').textContent = 'إضافة عملة جديدة';
    document.getElementById('currencyIsDefault').checked = false;
    openModal('currencyModal');
}

function editCurrency(currencyId) {
    const currency = currencies.find(c => c.id === currencyId);
    if (!currency) return;

    document.getElementById('currencyId').value = currency.id;
    document.getElementById('currencyName').value = currency.name;
    document.getElementById('currencyCode').value = currency.code;
    document.getElementById('currencyRate').value = currency.rate;
    document.getElementById('currencySymbol').value = currency.symbol || '';
    document.getElementById('currencyStatus').value = currency.status;
    document.getElementById('currencyIsDefault').checked = currency.isDefault;
    document.getElementById('currencyModalTitle').textContent = 'تعديل عملة';
    openModal('currencyModal');
}

function handleCurrencySubmit(e) {
    e.preventDefault();

    const currId = document.getElementById('currencyId').value;
    const name = document.getElementById('currencyName').value.trim();
    const code = document.getElementById('currencyCode').value.trim().toUpperCase();
    const rate = parseFloat(document.getElementById('currencyRate').value);
    const symbol = document.getElementById('currencySymbol').value.trim();
    const status = document.getElementById('currencyStatus').value;
    const isDefault = document.getElementById('currencyIsDefault').checked;

    // Validation
    if (!name) { showToast('يرجى إدخال اسم العملة', 'error'); return; }
    if (!code || code.length < 2) { showToast('يرجى إدخال رمز العملة (2-5 أحرف)', 'error'); return; }
    if (isNaN(rate) || rate <= 0) { showToast('يرجى إدخال سعر صرف صحيح (أكبر من صفر)', 'error'); return; }

    // Check duplicate code (excluding current if editing)
    const duplicate = currencies.find(c => c.code === code && c.id !== parseInt(currId));
    if (duplicate) { showToast('رمز العملة موجود بالفعل', 'error'); return; }

    // If setting as default, unset others
    if (isDefault) {
        currencies.forEach(c => c.isDefault = false);
    }

    const currencyData = {
        id: currId ? parseInt(currId) : Date.now(),
        name,
        code,
        symbol,
        rate,
        status,
        isDefault,
        updatedAt: new Date().toISOString()
    };

    if (currId) {
        const idx = currencies.findIndex(c => c.id === parseInt(currId));
        if (idx !== -1) currencies[idx] = currencyData;
    } else {
        currencies.push(currencyData);
    }

    saveData('adminCurrencies', currencies);
    closeModal('currencyModal');
    showToast(currId ? 'تم تعديل العملة بنجاح' : 'تم إضافة العملة بنجاح', 'success');
    renderCurrencies();
}

function toggleCurrencyStatus(currencyId) {
    const idx = currencies.findIndex(c => c.id === currencyId);
    if (idx === -1) return;

    // Prevent deactivating the default currency
    if (currencies[idx].isDefault && currencies[idx].status === 'active') {
        showToast('لا يمكن تعطيل العملة الافتراضية', 'error');
        return;
    }

    currencies[idx].status = currencies[idx].status === 'active' ? 'inactive' : 'active';
    currencies[idx].updatedAt = new Date().toISOString();
    saveData('adminCurrencies', currencies);
    showToast(currencies[idx].status === 'active' ? 'تم تفعيل العملة' : 'تم تعطيل العملة', 'success');
    renderCurrencies();
}

function setCurrencyDefault(currencyId) {
    const currency = currencies.find(c => c.id === currencyId);
    if (!currency) return;

    if (currency.status !== 'active') {
        showToast('يجب أن تكون العملة مفعّلة لتعيينها افتراضية', 'error');
        return;
    }

    currencies.forEach(c => {
        c.isDefault = (c.id === currencyId);
        if (c.isDefault) c.updatedAt = new Date().toISOString();
    });
    saveData('adminCurrencies', currencies);
    showToast(`تم تعيين "${currency.name}" كعملة افتراضية`, 'success');
    renderCurrencies();
}

function confirmDeleteCurrency(currencyId) {
    const currency = currencies.find(c => c.id === currencyId);
    if (!currency) return;

    if (currency.isDefault) {
        showToast('لا يمكن حذف العملة الافتراضية', 'error');
        return;
    }

    showDeleteConfirmation(`هل أنت متأكد من حذف عملة "${currency.name}"؟`, function () {
        currencies = currencies.filter(c => c.id !== currencyId);
        saveData('adminCurrencies', currencies);
        showToast('تم حذف العملة بنجاح', 'success');
        renderCurrencies();
    });
}

// Register currency form event
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('currencyForm')?.addEventListener('submit', handleCurrencySubmit);
});
