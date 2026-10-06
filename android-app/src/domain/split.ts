import type { UserId } from './types';

export class SplitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SplitError';
  }
}

/**
 * Computes equal split among participants.
 * Deterministically distributes remainder paise:
 * If remainder > 0, 1 extra paise is allocated first to the payer (if participating),
 * then to participants sorted lexicographically by ID.
 * Sum is guaranteed to strictly equal totalPaise.
 */
export function calculateEqualSplit(
  totalPaise: number,
  payer: UserId,
  participants: UserId[]
): Record<UserId, number> {
  if (totalPaise <= 0) {
    throw new SplitError('Expense amount must be positive');
  }
  if (participants.length === 0) {
    throw new SplitError('No participants provided');
  }

  const n = participants.length;
  const baseShare = Math.floor(totalPaise / n);
  let remainder = totalPaise % n;

  const sortedParticipants = [...participants].sort();
  const shares: Record<UserId, number> = {};

  // First assign 1 extra paise to payer if participating and remainder > 0
  if (remainder > 0 && participants.includes(payer)) {
    shares[payer] = baseShare + 1;
    remainder -= 1;
  }

  for (const p of sortedParticipants) {
    if (shares[p] !== undefined) {
      continue;
    }
    if (remainder > 0) {
      shares[p] = baseShare + 1;
      remainder -= 1;
    } else {
      shares[p] = baseShare;
    }
  }

  // Validate strict sum invariant
  const sum = Object.values(shares).reduce((a, b) => a + b, 0);
  if (sum !== totalPaise) {
    throw new SplitError(`Split invariant failed: sum ${sum} != total ${totalPaise}`);
  }

  return shares;
}

/**
 * Validates that an unequal split equals the total amount exactly.
 */
export function validateUnequalSplit(
  totalPaise: number,
  shares: Record<UserId, number>
): void {
  if (totalPaise <= 0) {
    throw new SplitError('Expense amount must be positive');
  }
  const userIds = Object.keys(shares);
  if (userIds.length === 0) {
    throw new SplitError('No participants provided');
  }
  const sum = Object.values(shares).reduce((a, b) => a + b, 0);
  if (sum !== totalPaise) {
    throw new SplitError(`Unequal shares sum (${sum}) does not match expense total (${totalPaise})`);
  }
}
