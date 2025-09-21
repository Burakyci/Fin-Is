export interface CreditCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface CreditApplicationData {
  amount: string;
  term: string;
}

export class CreditService {
  private static readonly LOAN_RATE = 4.09;
  private static readonly KKDF_RATE = 0.15;
  private static readonly BSMV_RATE = 0.15;

  static calculatePayments(
    amount: string,
    term: string
  ): CreditCalculationResult {
    try {
      if (!amount || !term) {
        return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
      }

      const loanAmount = parseFloat(amount);
      const loanTerm = parseInt(term);

      if (
        isNaN(loanAmount) ||
        isNaN(loanTerm) ||
        loanAmount <= 0 ||
        loanTerm <= 0
      ) {
        return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
      }

      const rateCalculation =
        (this.LOAN_RATE * (1 + this.KKDF_RATE + this.BSMV_RATE)) / 100 + 1;
      const totalRate = Number((rateCalculation || 0).toFixed(11));

      if (!totalRate || totalRate <= 1) {
        return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
      }

      const numerator = Math.pow(totalRate, loanTerm) * (totalRate - 1);
      const denominator = Math.pow(totalRate, loanTerm) - 1;

      if (denominator === 0) {
        return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
      }

      const rawPayment = (numerator / denominator) * loanAmount;

      if (!rawPayment || isNaN(rawPayment) || !isFinite(rawPayment)) {
        return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
      }

      const monthlyPayment = Number((rawPayment || 0).toFixed(2));
      const totalPayment = monthlyPayment * loanTerm;
      const totalInterest = totalPayment - loanAmount;

      return {
        monthlyPayment: monthlyPayment || 0,
        totalPayment: totalPayment || 0,
        totalInterest: totalInterest || 0,
      };
    } catch (error) {
      console.error("Calculation error:", error);
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
    }
  }

  static async analyzeWithDecisionEngine(
    amount: string,
    term: string,
    currentUser: any
  ): Promise<any> {
    if (!amount || !term || !currentUser) {
      throw new Error("Gerekli bilgiler eksik");
    }

    try {
      const response = await fetch(
        "https://us-central1-finisbank.cloudfunctions.net/evaluate_credit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loan_amount: parseFloat(amount),
            loan_term_months: parseInt(term),
            monthly_income: 25000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Decision engine error:", error);
      throw new Error("Karar motoru hatası: " + (error as Error).message);
    }
  }

  static validateCreditApplication(
    amount: string,
    term: string
  ): { isValid: boolean; error?: string } {
    if (!amount || parseFloat(amount) < 1000) {
      return {
        isValid: false,
        error: "Minimum kredi tutarı 1.000 TL olmalıdır",
      };
    }

    if (!term || parseInt(term) < 3) {
      return { isValid: false, error: "Minimum vade 3 ay olmalıdır" };
    }

    if (parseFloat(amount) > 1000000) {
      return {
        isValid: false,
        error: "Maksimum kredi tutarı 1.000.000 TL olmalıdır",
      };
    }

    if (parseInt(term) > 240) {
      return { isValid: false, error: "Maksimum vade 240 ay olmalıdır" };
    }

    return { isValid: true };
  }
}
