import type { Expense, MemberBalance, SettlementTransaction, UserId } from './types';

/**
 * Computes net balances for all group members given a list of expenses and settlement transactions.
 * 
 * In accordance with PRD FR-4.1:
 * Net Balance_i = \sum Contributions_i - \sum Shares_i + \sum Sent_Settlements_i - \sum Received_Settlements_i
 * 
 * Positive net balance: Member is owed money (creditor)
 * Negative net balance: Member owes money (debtor)
 * Zero: Settled
 */
export function calculateGroupBalances(
  members: UserId[],
  expenses: Expense[],
  settlements: SettlementTransaction[]
): Record<UserId, MemberBalance> {
  const contributions: Record<UserId, number> = {};
  const shares: Record<UserId, number> = {};
  const settlementsSent: Record<UserId, number> = {};
  const settlementsReceived: Record<UserId, number> = {};

  for (const m of members) {
    contributions[m] = 0;
    shares[m] = 0;
    settlementsSent[m] = 0;
    settlementsReceived[m] = 0;
  }

  // Tally expenses
  for (const exp of expenses) {
    if (contributions[exp.paidBy] !== undefined) {
      contributions[exp.paidBy] += exp.amountPaise;
    } else {
      contributions[exp.paidBy] = exp.amountPaise;
    }

    for (const [participant, shareAmount] of Object.entries(exp.splitShares)) {
      if (shares[participant] !== undefined) {
        shares[participant] += shareAmount;
      } else {
        shares[participant] = shareAmount;
      }
    }
  }

  // Tally settlements (only if MarkedPaid or Confirmed)
  for (const st of settlements) {
    if (st.status === 'MarkedPaid' || st.status === 'Confirmed') {
      settlementsSent[st.fromUser] = (settlementsSent[st.fromUser] || 0) + st.amountPaise;
      settlementsReceived[st.toUser] = (settlementsReceived[st.toUser] || 0) + st.amountPaise;
    }
  }

  const result: Record<UserId, MemberBalance> = {};
  for (const m of members) {
    const contrib = contributions[m] || 0;
    const share = shares[m] || 0;
    const sent = settlementsSent[m] || 0;
    const received = settlementsReceived[m] || 0;

    const net = (contrib - share) + (sent - received);

    result[m] = {
      userId: m,
      totalContributedPaise: contrib,
      totalSharePaise: share,
      netBalancePaise: net,
    };
  }

  return result;
}
