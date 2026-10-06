/**
 * Financial precision helper for integer minor currency units (paise for INR).
 * 1 INR = 100 paise.
 * 
 * In accordance with AGENTS.md principle #26, floating-point numbers
 * are NEVER used for ledger calculations or balance math.
 */
export class Money {
  readonly paise: number;

  constructor(paise: number) {
    this.paise = Math.round(paise);
  }

  static fromPaise(paise: number): Money {
    return new Money(paise);
  }

  static fromRupees(rupees: number): Money {
    return new Money(Math.round(rupees * 100));
  }

  static zero(): Money {
    return new Money(0);
  }

  isZero(): boolean {
    return this.paise === 0;
  }

  isPositive(): boolean {
    return this.paise > 0;
  }

  isNegative(): boolean {
    return this.paise < 0;
  }

  abs(): Money {
    return new Money(Math.abs(this.paise));
  }

  add(other: Money): Money {
    return new Money(this.paise + other.paise);
  }

  sub(other: Money): Money {
    return new Money(this.paise - other.paise);
  }

  toRupeesDecimal(): number {
    return this.paise / 100;
  }

  /**
   * Formats paise as standard Indian Rupee notation (e.g., "₹1,500.00" or "-₹250.50")
   */
  formatINR(includeSign = false): string {
    const isNeg = this.paise < 0;
    const absVal = Math.abs(this.paise);
    const rupees = Math.floor(absVal / 100);
    const paiseRemainder = absVal % 100;

    const formattedRupees = formatIndianNumber(rupees);
    const paiseStr = paiseRemainder.toString().padStart(2, '0');

    if (isNeg) {
      return `-₹${formattedRupees}.${paiseStr}`;
    }
    if (includeSign && this.paise > 0) {
      return `+₹${formattedRupees}.${paiseStr}`;
    }
    return `₹${formattedRupees}.${paiseStr}`;
  }

  toString(): string {
    return this.formatINR();
  }
}

/**
 * Formats a number with standard Indian grouping (first 3 digits from right, then groups of 2).
 * e.g., 100000 -> 1,00,000
 */
export function formatIndianNumber(num: number): string {
  const s = Math.abs(Math.floor(num)).toString();
  if (s.length <= 3) {
    return s;
  }
  const lastThree = s.slice(-3);
  const otherDigits = s.slice(0, -3);
  const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${formattedOther},${lastThree}`;
}
