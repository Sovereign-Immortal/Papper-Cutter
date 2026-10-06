import type { GroupId, SettlementTransaction, UserId } from './types';

export interface SettlementPlan {
  transactions: SettlementTransaction[];
  initialTransactionsCount: number;
  optimizedTransactionsCount: number;
}

/**
 * Generates minimal settlement transactions to clear all net debts.
 * 
 * In accordance with PRD FR-4.2:
 * 1. Partitions members into Creditors (net > 0) and Debtors (net < 0).
 * 2. Greedily matches the largest debtor with the largest creditor.
 * 3. Minimizes total inter-member payments down to the theoretical minimum (at most N - 1 transactions).
 * 4. Deterministic sorting ensures stable reproducible settlement plans.
 */
export function generateSettlementPlan(
  groupId: GroupId,
  netBalances: Record<UserId, number>,
  memberUpiMap: Record<UserId, string>
): SettlementPlan {
  interface Party {
    userId: UserId;
    amount: number;
  }

  const creditors: Party[] = [];
  const debtors: Party[] = [];

  for (const [userId, net] of Object.entries(netBalances)) {
    if (net > 0) {
      creditors.push({ userId, amount: net });
    } else if (net < 0) {
      debtors.push({ userId, amount: -net });
    }
  }

  // Sort descending by amount, break ties deterministically by userId
  creditors.sort((a, b) => b.amount - a.amount || a.userId.localeCompare(b.userId));
  debtors.sort((a, b) => b.amount - a.amount || a.userId.localeCompare(b.userId));

  const transactions: SettlementTransaction[] = [];
  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const cred = creditors[cIdx];
    const debt = debtors[dIdx];

    const transferPaise = Math.min(cred.amount, debt.amount);

    if (transferPaise > 0) {
      const credUpi = memberUpiMap[cred.userId];
      let upiUri: string | undefined;

      if (credUpi) {
        const amtDecimal = (transferPaise / 100).toFixed(2);
        upiUri = `upi://pay?pa=${encodeURIComponent(credUpi)}&pn=${encodeURIComponent(cred.userId)}&am=${amtDecimal}&cu=INR&tn=${encodeURIComponent('Papper Cutter Settlement')}`;
      }

      transactions.push({
        id: `settle-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        groupId,
        fromUser: debt.userId,
        toUser: cred.userId,
        amountPaise: transferPaise,
        status: 'Pending',
        upiUri,
      });

      cred.amount -= transferPaise;
      debt.amount -= transferPaise;
    }

    if (cred.amount === 0) {
      cIdx += 1;
    }
    if (debt.amount === 0) {
      dIdx += 1;
    }
  }

  const initialCount = debtors.length * creditors.length;
  const optimizedCount = transactions.length;

  return {
    transactions,
    initialTransactionsCount: Math.max(initialCount, optimizedCount),
    optimizedTransactionsCount: optimizedCount,
  };
}
