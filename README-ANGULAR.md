# تحويل المشروع إلى Angular 20

تم تحويل المشروع من React إلى Angular 20. اتبع الخطوات التالية:

## خطوات التثبيت والتشغيل

1. **تثبيت الحزم:**
```bash
npm install
```

2. **تشغيل المشروع:**
```bash
npm start
```

أو
```bash
ng serve --port 8080
```

3. **فتح المتصفح:**
افتح المتصفح على العنوان: http://localhost:8080

## ما تم تحويله:

✅ **Services (من Contexts):**
- `ThemeService` - إدارة الوضع الفاتح/الداكن
- `LanguageService` - إدارة اللغة (عربي/إنجليزي)
- `UserService` - إدارة المستخدم والأدوار
- `NotificationService` - إدارة الإشعارات

✅ **المكونات الأساسية:**
- `AppComponent` - المكون الرئيسي
- `LandingComponent` - صفحة الهبوط
- `ButtonComponent` - مكون الزر

✅ **التكوينات:**
- `angular.json` - تكوين Angular
- `tsconfig.json` - تكوين TypeScript
- `app.routes.ts` - المسارات

## ما يحتاج إلى إكمال:

⚠️ **المكونات المتبقية:**
- Navbar Component
- Login Component
- Register Component
- Dashboard Components (Citizen, Collector, Admin)
- باقي الصفحات والمكونات

⚠️ **UI Components:**
- Card Component
- Badge Component
- Dialog/Modal Components
- باقي مكونات UI

## ملاحظات:

- تم استخدام Angular Signals للـ state management
- تم استخدام Standalone Components
- تم الحفاظ على Tailwind CSS للتصميم
- يمكن إضافة Angular Material لاحقاً للـ UI Components

## المشاكل المعروفة:

- بعض المكونات تحتاج إلى تحويل من React إلى Angular
- UI Components تحتاج إلى إعادة كتابة أو استخدام Angular Material
- Icons تحتاج إلى استخدام مكتبة مناسبة (مثل lucide-angular أو Angular Material Icons)

