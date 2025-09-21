# Fin-Is Bankası - Kapsamlı Türk Bankacılık Uygulaması

# https://finisbank.web.app/

**React TypeScript • Firebase • Python • Test Otomasyonu**

**Finiş Bankası**, React TypeScript ve Vite ile geliştirilmiştir.

### Temel Özellikler

- **Güvenli Giriş Sistemi** - Firebase Authentication
- **Detaylı Kayıt** - Finansal profilleme ile
- **Hesap Yönetimi** - Banka hesap detayları
- **Bankacılık Ana Sayfası** - Temalı tasarım
- **AI Destekli Kredi Başvurusu** - Gerçek zamanlı hesaplamalar
- **Risk Değerlendirmesi** - Pure Python algoritmaları

---

## Özellikler

### Kredi Sistemi

- **Sabit %4.09 Faiz Oranı** - Türk bankacılık standartlarına uygun
- **8 Kategorili Skorlama** - Kapsamlı risk analizi
- **DTI Analizi** - Borç/gelir oranı hesaplaması
- **KKDF & BSMV Vergileri** - Otomatik hesaplama
- **Gerçek Zamanlı Sonuçlar** - Anında karar mekanizması

### Kullanıcı Yönetimi

- **Otomatik Hesap Numarası** - XXXX-XXXXXX formatında
- **Güvenli Oturum Yönetimi** - Firebase tabanlı

---

## Teknoloji Stack

### Frontend

| Teknoloji    | Versiyon | Açıklama                 |
| ------------ | -------- | ------------------------ |
| React        | 18.2.0   | UI kütüphanesi           |
| TypeScript   | 4.7.4    | Type güvenliği           |
| Vite         | 3.0.4    | Build aracı              |
| React Router | 7.8.2    | Yönlendirme              |
| Firebase     | 12.2.1   | Authentication & Storage |

### Backend

| Teknoloji          | Versiyon | Açıklama             |
| ------------------ | -------- | -------------------- |
| Python             | 3.13     | Backend dili         |
| Firebase Functions | Latest   | Serverless functions |
| Firebase Admin     | 6.4.0    | Backend Firebase SDK |
| Pure Python Math   | Native   | Risk hesaplamaları   |

### Test Otomasyonu

| Teknoloji     | Versiyon | Açıklama       |
| ------------- | -------- | -------------- |
| Java          | 19       | Test dili      |
| Selenium      | 4.1      | Web otomasyon  |
| TestNG        | 7.4      | Test framework |
| Maven         | 3.9+     | Build yönetimi |
| ExtentReports | 5.1.1    | HTML raporlar  |

---

## Sistem Mimarisi

### Multi-Service Mimarisi

## Test Otomasyon Projesi

### Test Kapsamı

Bu proje, **Finis Bankası Web arayüzü** üzerinde kapsamlı test otomasyonu sağlar. Modern test mühendisliği yaklaşımları kullanılarak **BDD (Behavior Driven Development)** metodolojisi ile geliştirilmiştir.

### Test Senaryoları

- **Mevduat Hesaplama Testleri** - Otomatik hesaplama doğrulama
- **Kredi Hesaplama Testleri** - Kapsamlı kredi hesaplama testleri
- **Ana Sayfa Navigasyonu** - UI ve navigasyon akışı testleri
- **End-to-End Senaryolar** - Giriş'ten işlem tamamlamaya kadar

### Test Mimarisi

#### Design Patterns

- **Page Object Model (POM)** - Sayfa aksiyonları modüler yapıda
- **Helper Classes** - Yeniden kullanılabilir bileşenler
- **Configuration Management** - Esnek ayarlar yönetimi

#### Test Yetenekleri

- **Çapraz Tarayıcı Testleri** - Chrome ve Firefox desteği
- **Görsel Test Raporları** - ExtentReports ile HTML çıktılar
- **Otomatik Ekran Görüntüsü** - Her test adımında screenshot
- **Akıllı Bekleme Stratejileri** - WaitHelper sınıfı ile
- **Scroll Yönetimi** - Otomatik sayfa kaydırma
- **Bankacılık Hesaplamaları** - Kredi hesaplama doğrulamaları

---

## Proje Yapısı

### Backend Yapısı

````
── __pycache__
│   └── main.cpython-313.pyc
├── main.py
├── models
│   ├── CreditApplicationModels.py
│   └── __pycache__
├── requirements.txt
├── scoring
│   ├── __init__.py
│   ├── __pycache__
│   ├── controls.json
│   └── engine.py
└── venv
    ├── bin
    ├── include
    ├── lib
    └── pyvenv.cfg


### Frontend Yapısı

.
├── App.css
├── App.tsx
├── components
│   ├── LazyComponents.tsx
│   └── Navigation
│   ├── Navigation.css
│   └── Navigation.tsx
├── config
│   └── firebase.ts
├── context
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks
│   ├── useDebounce.ts
│   └── useMemoizedCalculation.ts
├── index.tsx
├── pages
│   ├── Account
│   │   ├── Accont.module.css
│   │   └── index.tsx
│   ├── CreditApplication
│   │   ├── CreditApplication.module.css
│   │   └── index.tsx
│   ├── Home
│   │   ├── Home.module.css
│   │   └── index.tsx
│   ├── Login
│   │   ├── Login.module.css
│   │   └── index.tsx
│   └── Register
│   ├── Register.module.css
│   └── index.tsx
├── services
│   ├── creditService.ts
│   ├── decisionEngineService.ts
│   ├── formService.ts
│   ├── profileService.ts
│   └── userService.ts
├── styles
│   └── variables.css
├── types
│   └── index.ts
└── utils
├── accountUtils.ts
├── constants.ts
├── dataValidation.ts
├── errorHandler.ts
├── lazyLoading.ts
├── performanceMonitor.ts
├── securityHeaders.ts
└── validators.ts

---
### Test Yapısı

src/
├── main/java/
│   ├── Base/
│   │   ├── BasePage.java
│   │   ├── ExtentManager.java
│   │   └── WebDriverInstance.java
│   ├── helpers/
│   │   ├── LoanCalculator.java
│   │   ├── ScrollHelper.java
│   │   └── WaitHelper.java
│   ├── pageObjects/
│   │   ├── Homepage.java
│   │   ├── AccountPage.java
│   │   └── CreditApplicationPage.java
│   │   └── LoginPage.java
│.  │
│   └── drivers/
└── test/java/test/
    ├── CreditApplicationTest.java
    └── LoginTest.java





npm run dev
```

#### 3. Backend Kurulumu

```bash
cd functions
pip install -r requirements.txt
```

#### 4. Firebase Deploy

```bash
firebase deploy --only hosting
```

### Test Çalıştırma

```bash
# Maven ile test çalıştırma
mvn clean test

# Belirli test sınıfı çalıştırma
mvn test -Dtest=LoanCalculationTest
```

---

## Canlı Demo

**Canlı Site:** https://finisbank.web.app

### Demo Hesapları

- **Email:** test@test.com
- **Şifre:** asdasd

## Test Raporları

### Test Metrikleri

### Rapor Formatları

- **HTML Raporları** - ExtentReports ile detaylı görsel raporlar
- **Screenshot Dokümantasyonu** - Her test adımında görsel kanıt
- **Test Execution Analytics** - Kapsamlı analiz verileri
````
