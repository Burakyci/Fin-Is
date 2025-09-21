import { CONSTANTS } from "./constants";

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  static createError(code: string, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }

  static handleFirebaseError(error: any): AppError {
    const { code, message } = error;

    switch (code) {
      case "auth/user-not-found":
        return this.createError("USER_NOT_FOUND", "Kullanıcı bulunamadı");
      case "auth/wrong-password":
        return this.createError("WRONG_PASSWORD", "Şifre hatalı");
      case "auth/email-already-in-use":
        return this.createError(
          "EMAIL_IN_USE",
          "Bu e-posta adresi zaten kullanımda"
        );
      case "auth/weak-password":
        return this.createError("WEAK_PASSWORD", "Şifre çok zayıf");
      case "auth/invalid-email":
        return this.createError("INVALID_EMAIL", "Geçersiz e-posta adresi");
      case "permission-denied":
        return this.createError(
          "PERMISSION_DENIED",
          "Bu işlem için yetkiniz yok"
        );
      case "unavailable":
        return this.createError(
          "SERVICE_UNAVAILABLE",
          "Servis şu anda kullanılamıyor"
        );
      default:
        return this.createError(
          "UNKNOWN_ERROR",
          message || CONSTANTS.MESSAGES.ERROR.UNKNOWN
        );
    }
  }

  static handleNetworkError(error: any): AppError {
    if (!navigator.onLine) {
      return this.createError(
        "OFFLINE",
        "İnternet bağlantınızı kontrol ediniz"
      );
    }

    if (error.name === "AbortError") {
      return this.createError("REQUEST_TIMEOUT", "İstek zaman aşımına uğradı");
    }

    return this.createError("NETWORK_ERROR", CONSTANTS.MESSAGES.ERROR.NETWORK);
  }

  static logError(error: AppError, context?: string): void {
    console.error(
      `[${error.timestamp.toISOString()}] ${context || "APP_ERROR"}:`,
      {
        code: error.code,
        message: error.message,
        details: error.details,
      }
    );
  }
}
