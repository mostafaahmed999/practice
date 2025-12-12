import { Injectable, signal, effect } from '@angular/core';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navbar
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  myRequests: { en: "My Requests", ar: "طلباتي" },
  rewards: { en: "Rewards", ar: "المكافآت" },
  citizenPanel: { en: "Citizen Panel", ar: "لوحة المواطن" },
  collectorPanel: { en: "Collector Panel", ar: "لوحة الجامع" },
  notifications: { en: "Notifications", ar: "الإشعارات" },
  profile: { en: "Profile", ar: "الملف الشخصي" },
  viewProfile: { en: "View Profile", ar: "عرض الملف" },
  switchRole: { en: "Switch Role", ar: "تبديل الدور" },
  addRole: { en: "Add Role", ar: "إضافة دور" },
  settings: { en: "Settings", ar: "الإعدادات" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  login: { en: "Login", ar: "تسجيل الدخول" },
  register: { en: "Register", ar: "التسجيل" },
  getStarted: { en: "Get Started", ar: "ابدأ الآن" },
  home: { en: "Home", ar: "الرئيسية" },
  
  // Landing
  heroTitle: { en: "Recycle Smart, Live Green", ar: "أعد التدوير بذكاء، عش بخضرة" },
  heroSubtitle: { en: "Connect with local collectors and turn your recyclables into rewards", ar: "تواصل مع الجامعين المحليين وحوّل مخلفاتك القابلة للتدوير إلى مكافآت" },
  learnMore: { en: "Learn More", ar: "اعرف المزيد" },
  
  // Dashboard
  citizenDashboard: { en: "Citizen Dashboard", ar: "لوحة تحكم المواطن" },
  collectorDashboard: { en: "Collector Dashboard", ar: "لوحة تحكم الجامع" },
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة تحكم المدير" },
  createRequest: { en: "Create Collection Request", ar: "إنشاء طلب جمع" },
  totalCollections: { en: "Total Collections", ar: "إجمالي عمليات الجمع" },
  co2Saved: { en: "CO₂ Saved", ar: "ثاني أكسيد الكربون الموفر" },
  rewardPoints: { en: "Reward Points", ar: "نقاط المكافآت" },
  recentRequests: { en: "Recent Collection Requests", ar: "طلبات الجمع الأخيرة" },
  
  // Status
  completed: { en: "Completed", ar: "مكتمل" },
  pending: { en: "Pending", ar: "قيد الانتظار" },
  inProgress: { en: "In Progress", ar: "قيد التنفيذ" },
  cancelled: { en: "Cancelled", ar: "ملغى" },
  
  // Modal
  pickupLocation: { en: "Pickup Location", ar: "موقع الاستلام" },
  clickToSelect: { en: "Click to select your location", ar: "انقر لتحديد موقعك" },
  materialsToCollect: { en: "Materials to Collect", ar: "المواد المراد جمعها" },
  plastic: { en: "Plastic", ar: "بلاستيك" },
  paper: { en: "Paper", ar: "ورق" },
  glass: { en: "Glass", ar: "زجاج" },
  metal: { en: "Metal", ar: "معدن" },
  estimatedQuantity: { en: "Estimated Quantity (kg)", ar: "الكمية التقديرية (كجم)" },
  preferredTime: { en: "Preferred Time", ar: "الوقت المفضل" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  submitRequest: { en: "Submit Request", ar: "إرسال الطلب" },
  
  // Role Selection
  selectRole: { en: "Select Your Role", ar: "اختر دورك" },
  citizen: { en: "Citizen", ar: "مواطن" },
  collector: { en: "Collector", ar: "جامع" },
  citizenDesc: { en: "Request waste collection and earn rewards", ar: "اطلب جمع النفايات واكسب المكافآت" },
  collectorDesc: { en: "Collect recyclables and earn money", ar: "اجمع المواد القابلة للتدوير واكسب المال" },
  
  // Form Fields
  firstName: { en: "First Name", ar: "الاسم الأول" },
  lastName: { en: "Last Name", ar: "الاسم الأخير" },
  address: { en: "Address", ar: "العنوان" },
  city: { en: "City", ar: "المدينة" },
  phoneNumber: { en: "Phone Number", ar: "رقم الهاتف" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  avatar: { en: "Avatar", ar: "الصورة الشخصية" },
  vehicleType: { en: "Vehicle Type", ar: "نوع المركبة" },
  serviceArea: { en: "Service Area", ar: "منطقة الخدمة" },
  nationalId: { en: "National ID", ar: "رقم الهوية" },
  availability: { en: "Availability", ar: "التوفر" },
  
  // Rewards
  totalPoints: { en: "Total Points", ar: "إجمالي النقاط" },
  redeemRewards: { en: "Redeem Rewards", ar: "استبدال المكافآت" },
  pointHistory: { en: "Point History", ar: "سجل النقاط" },
  
  // Badges
  greenWarrior: { en: "Green Warrior", ar: "المحارب الأخضر" },
  topRecycler: { en: "Top Recycler", ar: "أفضل معيد تدوير" },
  weeklyEcoHero: { en: "Weekly Eco Hero", ar: "بطل البيئة الأسبوعي" },
  
  // Profile
  editProfile: { en: "Edit Profile", ar: "تعديل الملف" },
  saveChanges: { en: "Save Changes", ar: "حفظ التغييرات" },
  accountInformation: { en: "Account Information", ar: "معلومات الحساب" },
  personalDetails: { en: "Your personal details", ar: "تفاصيلك الشخصية" },
  notProvided: { en: "Not provided", ar: "لم يتم تحديده" },
  mapLocation: { en: "Your Location", ar: "موقعك" },
  coordinates: { en: "Coordinates", ar: "الإحداثيات" },
  
  // Auth
  confirmEmail: { en: "Confirm Email", ar: "تأكيد البريد الإلكتروني" },
  forgotPassword: { en: "Forgot Password?", ar: "هل نسيت كلمة المرور؟" },
  resetPassword: { en: "Reset Password", ar: "إعادة تعيين كلمة المرور" },
  password: { en: "Password", ar: "كلمة المرور" },
  confirmPassword: { en: "Confirm Password", ar: "تأكيد كلمة المرور" },
  orContinueWith: { en: "Or continue with", ar: "أو تابع مع" },
  noAccount: { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
  haveAccount: { en: "Already have an account?", ar: "هل لديك حساب بالفعل؟" },
  rememberMe: { en: "Remember me", ar: "تذكرني" },
  
  // Common UI
  loading: { en: "Loading...", ar: "جاري التحميل..." },
  saving: { en: "Saving...", ar: "جاري الحفظ..." },
  success: { en: "Success", ar: "نجح" },
  error: { en: "Error", ar: "خطأ" },
  warning: { en: "Warning", ar: "تحذير" },
  info: { en: "Information", ar: "معلومة" },
  close: { en: "Close", ar: "إغلاق" },
  save: { en: "Save", ar: "حفظ" },
  delete: { en: "Delete", ar: "حذف" },
  edit: { en: "Edit", ar: "تعديل" },
  add: { en: "Add", ar: "إضافة" },
  search: { en: "Search", ar: "بحث" },
  filter: { en: "Filter", ar: "تصفية" },
  sort: { en: "Sort", ar: "ترتيب" },
  noResults: { en: "No results found", ar: "لم يتم العثور على نتائج" },
  manageAccount: { en: "Manage your account information", ar: "إدارة معلومات حسابك" },
  security: { en: "Security", ar: "الأمان" },
  changePassword: { en: "Change Password", ar: "تغيير كلمة المرور" },
  twoFactor: { en: "Two-Factor Authentication", ar: "المصادقة الثنائية" },
  enable: { en: "Enable", ar: "تفعيل" },
  lastChanged: { en: "Last changed", ar: "آخر تغيير" },
  daysAgo: { en: "days ago", ar: "منذ أيام" },
  addExtraLayer: { en: "Add an extra layer of security", ar: "أضف طبقة حماية إضافية" },
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly languageKey = 'language';
  private translationCache = new Map<string, string>();
  private lastLanguage: Language = 'en';
  
  language = signal<Language>(this.getInitialLanguage());
  direction = signal<Direction>('ltr');

  constructor() {
    effect(() => {
      const lang = this.language();
      const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';
      this.direction.set(dir);
      
      // Clear cache when language changes
      if (lang !== this.lastLanguage) {
        this.translationCache.clear();
        this.lastLanguage = lang;
      }
      
      if (typeof document !== 'undefined') {
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        localStorage.setItem(this.languageKey, lang);
      }
    });
  }

  private getInitialLanguage(): Language {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.languageKey);
      if (stored === 'ar' || stored === 'en') {
        return stored;
      }
      // Default to Arabic
      return 'ar';
    }
    return 'ar';
  }

  toggleLanguage(): void {
    this.language.update(prev => prev === 'en' ? 'ar' : 'en');
  }
  
  setLanguage(lang: Language): void {
    if (lang !== this.language()) {
      this.language.set(lang);
    }
  }
  
  getLanguage(): Language {
    return this.language();
  }
  
  getDirection(): Direction {
    return this.direction();
  }

  /**
   * Get translation for a key with memoization
   * Returns the translation in the current language, or the key if not found
   */
  t(key: string): string {
    // Check cache first
    if (this.translationCache.has(key)) {
      return this.translationCache.get(key)!;
    }

    const translation = translations[key];
    let result: string;
    
    if (!translation) {
      result = key;
    } else {
      result = translation[this.language()] || translation['en'] || key;
    }
    
    // Store in cache
    this.translationCache.set(key, result);
    return result;
  }
  
  /**
   * Get all available translations for a key
   */
  getAllTranslations(key: string): { en: string; ar: string } | null {
    const translation = translations[key];
    return translation || null;
  }
  
  /**
   * Check if a key exists in translations
   */
  hasTranslation(key: string): boolean {
    return key in translations;
  }
}

