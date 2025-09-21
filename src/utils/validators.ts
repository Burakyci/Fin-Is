export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return { isValid: false, message: "Şifre en az 6 karakter olmalıdır" };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: "Şifre büyük ve küçük harf içermelidir",
      };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "Şifre en az bir rakam içermelidir" };
    }
    return { isValid: true };
  },

  phoneNumber: (phone: string): boolean => {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  },

  creditAmount: (amount: string): { isValid: boolean; message?: string } => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return { isValid: false, message: "Geçerli bir tutar giriniz" };
    }
    if (numAmount < 1000) {
      return {
        isValid: false,
        message: "Minimum kredi tutarı 1.000 TL olmalıdır",
      };
    }
    if (numAmount > 1000000) {
      return {
        isValid: false,
        message: "Maksimum kredi tutarı 1.000.000 TL olmalıdır",
      };
    }
    return { isValid: true };
  },

  creditTerm: (term: string): { isValid: boolean; message?: string } => {
    const numTerm = parseInt(term);
    if (isNaN(numTerm)) {
      return { isValid: false, message: "Geçerli bir vade giriniz" };
    }
    if (numTerm < 3) {
      return { isValid: false, message: "Minimum vade 3 ay olmalıdır" };
    }
    if (numTerm > 240) {
      return { isValid: false, message: "Maksimum vade 240 ay olmalıdır" };
    }
    return { isValid: true };
  },
};
