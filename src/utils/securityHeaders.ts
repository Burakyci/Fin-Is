export const SECURITY_HEADERS = {
  CSP: {
    directives: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://finisbank.firebaseapp.com https://firestore.googleapis.com https://us-central1-finisbank.cloudfunctions.net",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },

  ADDITIONAL_HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=(self)",
    ].join(", "),
  },
};

export function applySecurityHeaders(headers: any = {}): any {
  return {
    ...headers,
    "Content-Security-Policy": SECURITY_HEADERS.CSP.directives,
    ...SECURITY_HEADERS.ADDITIONAL_HEADERS,
  };
}

export function validateOrigin(origin: string): boolean {
  const allowedOrigins = [
    "https://finisbank.web.app",
    "https://finisbank.firebaseapp.com",
    "http://localhost:5000", // Development only
    "https://localhost:5000",
  ];

  return allowedOrigins.includes(origin);
}
