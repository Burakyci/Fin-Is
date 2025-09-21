export const CONSTANTS = {
  INTEREST: {
    BASE_RATE: 4.09, // %4.09 base monthly rate
    KKDF_RATE: 0.15, // %15 Resource Utilization Support Fund
    BSMV_RATE: 0.15, // %15 Banking and Insurance Transactions Tax
  },

  CREDIT: {
    MIN_AMOUNT: 1000,
    MAX_AMOUNT: 1000000,
    MIN_TERM: 3,
    MAX_TERM: 240,
  },

  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    MAX_RETRIES: 3,
  },

  API: {
    // LOCALURL: "http://localhost:8081",
    LOCALURL:
      "https://us-central1-finisbank.cloudfunctions.net/credit_decision",
  },

  COLLECTIONS: {
    USERS: "users",
    CREDIT_APPLICATIONS: "creditApplications",
    ACTIVE_CREDITS: "activeCredits",
    USER_PROFILES: "userProfiles",
  },

  MESSAGES: {
    SUCCESS: {
      REGISTRATION: "Hesabınız başarıyla oluşturuldu!",
      LOGIN: "Giriş başarılı!",
      CREDIT_APPROVED: "Krediniz onaylandı!",
      BALANCE_UPDATED: "Hesap bakiyeniz güncellendi!",
    },
    ERROR: {
      NETWORK: "Bağlantı hatası. Lütfen tekrar deneyiniz.",
      AUTH_FAILED: "Giriş bilgileri hatalı.",
      INSUFFICIENT_DATA: "Eksik bilgi. Lütfen tüm alanları doldurunuz.",
      CREDIT_REJECTED: "Kredi başvurunuz reddedildi.",
      UNKNOWN: "Beklenmeyen bir hata oluştu.",
    },
  },
};
