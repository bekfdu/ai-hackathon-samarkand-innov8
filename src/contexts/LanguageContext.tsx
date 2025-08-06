import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uz' | 'en' | 'ru' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    // Welcome page
    'app.title': 'EduCheck – Insholarni avtomatik tekshirish',
    'welcome.start': 'Boshlash',
    'welcome.instruction': 'Inshoni rasm shaklida yuklang, natijani kuting',
    'welcome.description': 'Qo\'lyozma insholaringizni yuklang va avtomatik grammatik tahlil oling',
    
    // Auth page
    'auth.login': 'Kirish',
    'auth.signup': 'Ro\'yxatdan o\'tish',
    'auth.email': 'Email manzil',
    'auth.password': 'Parol',
    'auth.selectType': 'Foydalanuvchi turini tanlang',
    'auth.teacher': 'O\'qituvchi',
    'auth.student': 'O\'quvchi',
    'auth.google': 'Google orqali kirish',
    
    // Upload page
    'upload.title': 'Insho yuklash',
    'upload.dragDrop': 'Faylni bu yerga sudrab tashlang yoki',
    'upload.selectFile': 'Fayl tanlash',
    'upload.takePhoto': 'Rasm olish',
    'upload.analyze': 'Tahlil qilish',
    'upload.analyzing': 'Tahlil qilinmoqda...',
    
    // Results page
    'results.title': 'Tahlil natijalari',
    'results.score': 'Baho',
    'results.errors': 'Xatolar',
    'results.suggestions': 'Tavsiyalar',
    
    // History page
    'history.title': 'Tarix',
    'history.average': 'O\'rtacha baho',
    'history.progress': 'Haftalik o\'sish',
    
    // Profile page
    'profile.title': 'Profil',
    'profile.name': 'Ism',
    'profile.email': 'Email',
    'profile.role': 'Rol',
    'profile.subscription': 'Obuna',
    
    // Navigation
    'nav.upload': 'Yuklash',
    'nav.history': 'Tarix',
    'nav.profile': 'Profil',
    'nav.logout': 'Chiqish',
    
    // Camera
    'camera.take': 'Rasm olish',
    'camera.retake': 'Qayta olish',
    'camera.use': 'Ishlatish',
    'camera.cancel': 'Bekor qilish',
  },
  en: {
    // Welcome page
    'app.title': 'EduCheck – Automated Essay Checking',
    'welcome.start': 'Start',
    'welcome.instruction': 'Upload your essay as an image and get results',
    'welcome.description': 'Upload your handwritten essays and get automated grammar analysis',
    
    // Auth page
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.selectType': 'Select user type',
    'auth.teacher': 'Teacher',
    'auth.student': 'Student',
    'auth.google': 'Sign in with Google',
    
    // Upload page
    'upload.title': 'Upload Essay',
    'upload.dragDrop': 'Drag and drop your file here or',
    'upload.selectFile': 'Select File',
    'upload.takePhoto': 'Take Photo',
    'upload.analyze': 'Analyze',
    'upload.analyzing': 'Analyzing...',
    
    // Results page
    'results.title': 'Analysis Results',
    'results.score': 'Score',
    'results.errors': 'Errors',
    'results.suggestions': 'Suggestions',
    
    // History page
    'history.title': 'History',
    'history.average': 'Average Score',
    'history.progress': 'Weekly Progress',
    
    // Profile page
    'profile.title': 'Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.role': 'Role',
    'profile.subscription': 'Subscription',
    
    // Navigation
    'nav.upload': 'Upload',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Camera
    'camera.take': 'Take Photo',
    'camera.retake': 'Retake',
    'camera.use': 'Use Photo',
    'camera.cancel': 'Cancel',
  },
  ru: {
    // Welcome page
    'app.title': 'EduCheck – Автоматическая проверка сочинений',
    'welcome.start': 'Начать',
    'welcome.instruction': 'Загрузите сочинение как изображение и получите результаты',
    'welcome.description': 'Загрузите рукописные сочинения и получите автоматический грамматический анализ',
    
    // Auth page
    'auth.login': 'Войти',
    'auth.signup': 'Регистрация',
    'auth.email': 'Email адрес',
    'auth.password': 'Пароль',
    'auth.selectType': 'Выберите тип пользователя',
    'auth.teacher': 'Учитель',
    'auth.student': 'Ученик',
    'auth.google': 'Войти через Google',
    
    // Upload page
    'upload.title': 'Загрузить сочинение',
    'upload.dragDrop': 'Перетащите файл сюда или',
    'upload.selectFile': 'Выбрать файл',
    'upload.takePhoto': 'Сделать фото',
    'upload.analyze': 'Анализировать',
    'upload.analyzing': 'Анализируем...',
    
    // Results page
    'results.title': 'Результаты анализа',
    'results.score': 'Оценка',
    'results.errors': 'Ошибки',
    'results.suggestions': 'Рекомендации',
    
    // History page
    'history.title': 'История',
    'history.average': 'Средняя оценка',
    'history.progress': 'Недельный прогресс',
    
    // Profile page
    'profile.title': 'Профиль',
    'profile.name': 'Имя',
    'profile.email': 'Email',
    'profile.role': 'Роль',
    'profile.subscription': 'Подписка',
    
    // Navigation
    'nav.upload': 'Загрузка',
    'nav.history': 'История',
    'nav.profile': 'Профиль',
    'nav.logout': 'Выйти',
    
    // Camera
    'camera.take': 'Сделать фото',
    'camera.retake': 'Переснять',
    'camera.use': 'Использовать',
    'camera.cancel': 'Отмена',
  },
  tr: {
    // Welcome page
    'app.title': 'EduCheck – Otomatik Kompozisyon Kontrolü',
    'welcome.start': 'Başla',
    'welcome.instruction': 'Kompozisyonunuzu resim olarak yükleyin ve sonuçları alın',
    'welcome.description': 'El yazısı kompozisyonlarınızı yükleyin ve otomatik gramer analizi alın',
    
    // Auth page
    'auth.login': 'Giriş',
    'auth.signup': 'Kayıt Ol',
    'auth.email': 'Email adresi',
    'auth.password': 'Şifre',
    'auth.selectType': 'Kullanıcı tipini seçin',
    'auth.teacher': 'Öğretmen',
    'auth.student': 'Öğrenci',
    'auth.google': 'Google ile giriş',
    
    // Upload page
    'upload.title': 'Kompozisyon Yükle',
    'upload.dragDrop': 'Dosyayı buraya sürükleyin veya',
    'upload.selectFile': 'Dosya Seç',
    'upload.takePhoto': 'Fotoğraf Çek',
    'upload.analyze': 'Analiz Et',
    'upload.analyzing': 'Analiz ediliyor...',
    
    // Results page
    'results.title': 'Analiz Sonuçları',
    'results.score': 'Puan',
    'results.errors': 'Hatalar',
    'results.suggestions': 'Öneriler',
    
    // History page
    'history.title': 'Geçmiş',
    'history.average': 'Ortalama Puan',
    'history.progress': 'Haftalık İlerleme',
    
    // Profile page
    'profile.title': 'Profil',
    'profile.name': 'İsim',
    'profile.email': 'Email',
    'profile.role': 'Rol',
    'profile.subscription': 'Abonelik',
    
    // Navigation
    'nav.upload': 'Yükle',
    'nav.history': 'Geçmiş',
    'nav.profile': 'Profil',
    'nav.logout': 'Çıkış',
    
    // Camera
    'camera.take': 'Fotoğraf Çek',
    'camera.retake': 'Tekrar Çek',
    'camera.use': 'Kullan',
    'camera.cancel': 'İptal',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};