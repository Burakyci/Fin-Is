import { useMemo } from "react";
import { CONSTANTS } from "../utils/constants";

interface CreditCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  isValid: boolean;
}

export function useMemoizedCalculation(
  amount: string,
  term: string
): CreditCalculationResult {
  return useMemo(() => {
    const loanAmount = parseFloat(amount);
    const loanTerm = parseInt(term);

    if (
      isNaN(loanAmount) ||
      isNaN(loanTerm) ||
      loanAmount <= 0 ||
      loanTerm <= 0
    ) {
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        isValid: false,
      };
    }

    const { BASE_RATE, KKDF_RATE, BSMV_RATE } = CONSTANTS.INTEREST;

    const totalRate = Number(
      ((BASE_RATE * (1 + KKDF_RATE + BSMV_RATE)) / 100 + 1).toFixed(11)
    );

    const monthlyPayment = Number(
      (
        ((Math.pow(totalRate, loanTerm) * (totalRate - 1)) /
          (Math.pow(totalRate, loanTerm) - 1)) *
        loanAmount
      ).toFixed(2)
    );

    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      isValid: true,
    };
  }, [amount, term]);
}
