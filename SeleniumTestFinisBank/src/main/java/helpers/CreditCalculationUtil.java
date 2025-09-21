package helpers;

import java.math.RoundingMode;
import java.text.DecimalFormat;

public class CreditCalculationUtil {

    private static final double FIXED_INTEREST_RATE = 4.09; // %4.09 aylık faiz
    private static final double KKDF_RATE = 0.15;           // %15 KKDF
    private static final double BSMV_RATE = 0.15;           // %15 BSMV

    // "1,234.56" gibi 2 ondalık gösterim (binlik ayırıcı + nokta ondalık)
    private static final DecimalFormat CURRENCY_FORMAT;
    static {
        CURRENCY_FORMAT = new DecimalFormat("#,##0.00");
        CURRENCY_FORMAT.setRoundingMode(RoundingMode.HALF_UP);
    }

    /**
     * Frontend ile tam uyumlu aylık ödeme hesaplama (String döndürür, 2 ondalık)
     * Formül mantığı:
     *   i = (FIXED_INTEREST_RATE * (1 + KKDF_RATE + BSMV_RATE)) / 100
     *   Aylık faktör = 1 + i
     *   Payment = P * i * (1+i)^n / ((1+i)^n - 1)
     */
    public static String calculateMonthlyPayment(double loanAmount, int loanTermMonths) {
        // Guard clauses
        if (loanAmount <= 0 || loanTermMonths <= 0) {
            return "0.00";
        }

        // Aylık efektif faiz
        double i = (FIXED_INTEREST_RATE * (1 + KKDF_RATE + BSMV_RATE)) / 100.0;
        if (i <= 0) {
            return "0.00";
        }

        double onePlusIToN = Math.pow(1 + i, loanTermMonths);
        double denominator = onePlusIToN - 1.0;
        if (denominator == 0.0) {
            return "0.00";
        }

        double payment = loanAmount * i * onePlusIToN / denominator;

        // 2 ondalık, HALF_UP
        return CURRENCY_FORMAT.format(payment);
    }

    // Eğer sayısal double’a ihtiyaç olursa bu yardımcı metodu da kullanabilirsiniz:
    public static double calculateMonthlyPaymentAsDouble(double loanAmount, int loanTermMonths) {
        if (loanAmount <= 0 || loanTermMonths <= 0) return 0.0;
        double i = (FIXED_INTEREST_RATE * (1 + KKDF_RATE + BSMV_RATE)) / 100.0;
        if (i <= 0) return 0.0;

        double onePlusIToN = Math.pow(1 + i, loanTermMonths);
        double denominator = onePlusIToN - 1.0;
        if (denominator == 0.0) return 0.0;

        double payment = loanAmount * i * onePlusIToN / denominator;

        // 2 ondalığa yuvarlanmış double (HALF_UP)
        return Math.round(payment * 100.0) / 100.0;
    }
}
