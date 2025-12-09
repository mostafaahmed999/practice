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
  address: { en: "Address", ar: "العنوان" },
  city: { en: "City", ar: "المدينة" },
  phoneNumber: { en: "Phone Number", ar: "رقم الهاتف" },
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
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly languageKey = 'language';
  language = signal<Language>(this.getInitialLanguage());
  direction = signal<Direction>('ltr');

  constructor() {
    effect(() => {
      const lang = this.language();
      const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';
      this.direction.set(dir);
      
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
      return (stored as Language) || 'en';
    }
    return 'en';
  }

  toggleLanguage(): void {
    this.language.update(prev => prev === 'en' ? 'ar' : 'en');
  }

  t(key: string): string {
    const translation = translations[key];
    if (!translation) return key;
    return translation[this.language()];
  }
}

