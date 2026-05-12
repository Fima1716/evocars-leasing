export const CALCULATOR_DEFAULTS = {
  annualRate: 15,
  minDown: 10,
  maxDown: 49,
  stepDown: 5,
  minTerm: 12,
  maxTerm: 60,
  stepTerm: 6,
} as const;

/**
 * Annuity payment formula:
 * M = P * [r * (1 + r)^n] / [(1 + r)^n - 1]
 *
 * P = price after down payment
 * r = monthly interest rate
 * n = term in months
 */
export function calculateMonthlyPayment(
  price: number,
  downPaymentPercent: number,
  termMonths: number,
  annualRate: number = CALCULATOR_DEFAULTS.annualRate
): number {
  const downPayment = price * (downPaymentPercent / 100);
  const principal = price - downPayment;
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) return principal / termMonths;

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return Math.round(principal * (monthlyRate * factor) / (factor - 1));
}

export function calculateTotalCost(
  price: number,
  downPaymentPercent: number,
  termMonths: number,
  annualRate: number = CALCULATOR_DEFAULTS.annualRate
) {
  const downPayment = Math.round(price * (downPaymentPercent / 100));
  const monthly = calculateMonthlyPayment(price, downPaymentPercent, termMonths, annualRate);
  const totalPayments = monthly * termMonths;
  const overpayment = totalPayments + downPayment - price;

  return {
    downPayment,
    monthlyPayment: monthly,
    totalPayments,
    totalCost: totalPayments + downPayment,
    overpayment,
  };
}
