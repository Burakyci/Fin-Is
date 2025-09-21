export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
}

export interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  bankAccountNumber?: string;
  balance?: number;
  creditScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditApplication {
  id?: string;
  userId: string;
  amount: number;
  term: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  status: "pending" | "approved" | "rejected" | "processing";
  applicationDate: Date;
  decision?: CreditDecision;
}

export interface CreditDecision {
  approved: boolean;
  riskScore: number;
  decisionReason: string;
  recommendedAmount: number;
  conditions: string[];
  factors: string[];
  timestamp: string;
}

export interface ActiveCredit {
  id?: string;
  userId: string;
  amount: number;
  term: number;
  monthlyPayment: number;
  remainingAmount: number;
  remainingMonths: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "defaulted";
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Theme {
  name: "light" | "dark";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
}
