import { CONSTANTS } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export class DataValidator {
  static validateCreditApplication(data: any): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: any = {};

    const amount = parseFloat(data.amount);
    if (isNaN(amount)) {
      errors.push("Kredi tutarı geçerli bir sayı olmalıdır");
    } else if (amount < CONSTANTS.CREDIT.MIN_AMOUNT) {
      errors.push(
        `Minimum kredi tutarı ${CONSTANTS.CREDIT.MIN_AMOUNT.toLocaleString(
          "tr-TR"
        )} TL olmalıdır`
      );
    } else if (amount > CONSTANTS.CREDIT.MAX_AMOUNT) {
      errors.push(
        `Maksimum kredi tutarı ${CONSTANTS.CREDIT.MAX_AMOUNT.toLocaleString(
          "tr-TR"
        )} TL olmalıdır`
      );
    } else {
      sanitizedData.amount = amount;
    }

    const term = parseInt(data.term);
    if (isNaN(term)) {
      errors.push("Vade geçerli bir sayı olmalıdır");
    } else if (term < CONSTANTS.CREDIT.MIN_TERM) {
      errors.push(`Minimum vade ${CONSTANTS.CREDIT.MIN_TERM} ay olmalıdır`);
    } else if (term > CONSTANTS.CREDIT.MAX_TERM) {
      errors.push(`Maksimum vade ${CONSTANTS.CREDIT.MAX_TERM} ay olmalıdır`);
    } else {
      sanitizedData.term = term;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined,
    };
  }

  static validateUserRegistration(data: any): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: any = {};

    const name = data.name?.trim();
    if (!name || name.length < 2) {
      errors.push("Ad en az 2 karakter olmalıdır");
    } else if (name.length > 50) {
      errors.push("Ad en fazla 50 karakter olmalıdır");
    } else if (!/^[a-zA-ZğüşöçıĞÜŞÖÇİ\s]+$/.test(name)) {
      errors.push("Ad sadece harf ve boşluk içerebilir");
    } else {
      sanitizedData.name = name;
    }

    const email = data.email?.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.push("E-posta adresi gereklidir");
    } else if (!emailRegex.test(email)) {
      errors.push("Geçerli bir e-posta adresi giriniz");
    } else {
      sanitizedData.email = email;
    }

    if (data.password) {
      const passwordValidation = this.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }

    if (data.phoneNumber) {
      const phone = data.phoneNumber.replace(/\s+/g, "");
      const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
      if (!phoneRegex.test(phone)) {
        errors.push("Geçerli bir telefon numarası giriniz (05XX XXX XX XX)");
      } else {
        sanitizedData.phoneNumber = phone;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined,
    };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push("Şifre gereklidir");
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push("Şifre en az 8 karakter olmalıdır");
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Şifre en az bir küçük harf içermelidir");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Şifre en az bir büyük harf içermelidir");
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("Şifre en az bir rakam içermelidir");
    }

    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push("Şifre en az bir özel karakter içermelidir");
    }

    const commonPasswords = [
      "12345678",
      "password",
      "qwerty123",
      "admin123",
      "password123",
      "123456789",
      "welcome123",
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push(
        "Bu şifre çok yaygın kullanılmaktadır, daha güvenli bir şifre seçiniz"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  static validateBankingData(data: any): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: any = {};

    if (data.accountNumber) {
      const accountNumber = data.accountNumber.replace(/\s+/g, "");
      if (!/^(TR\d{24}|\d{4}-\d{6})$/.test(accountNumber)) {
        errors.push(
          "Geçerli bir hesap numarası giriniz (IBAN veya XXXX-XXXXXX formatında)"
        );
      } else {
        sanitizedData.accountNumber = accountNumber;
      }
    }

    if (data.balance !== undefined) {
      const balance = parseFloat(data.balance);
      if (isNaN(balance) || balance < 0) {
        errors.push("Bakiye sıfır veya pozitif bir değer olmalıdır");
      } else {
        sanitizedData.balance = balance;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined,
    };
  }
}
