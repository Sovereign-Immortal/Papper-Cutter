import React from 'react';
import { useApp } from '../../state/AppContext';
import { Money } from '../../domain/money';
import { CATEGORY_META, type Category, type SettlementTransaction } from '../../domain/types';

export const GroupDetailView: React.FC = () => {
  const {
    selectedGroup,
    groupSubTab,
    setGroupSubTab,
    expenses,
    groupBalances,
    settlementPlan,
    totalGroupSpentPaise,
    currentUser,
    users,
    markSettlementPaid,
  } = useApp();

  const groupExpenses = expenses.filter((e) => e.groupId === selectedGroup.id);
  const totalSpentMoney = Money.fromPaise(totalGroupSpentPaise);
  const userShareMoney = Money.fromPaise(
    groupBalances[currentUser.id]?.totalSharePaise || 0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Group Pulse Header Card */}
      <div
        className="warm-card"
        style={{
          background: 'linear-gradient(135deg, #FFF8F4 0%, #F5F0FF 100%)',
          marginBottom: '6px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>
              {selectedGroup.name}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {selectedGroup.members.length} members • Created {selectedGroup.createdAt}
            </p>
          </div>
          <div
            className="pill-badge"
            style={{ background: 'white', border: '1px solid var(--surface-border)' }}
          >
            <span>{selectedGroup.category === 'Trip' ? '🏔️ Trip' : '🏠 Group'}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(239, 232, 223, 0.85)',
          }}
        >
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
              TOTAL SPENT
            </p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {totalSpentMoney.formatINR()}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
              YOUR SHARE
            </p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {userShareMoney.formatINR()}
            </p>
          </div>
        </div>
      </div>

      {/* Pill Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--surface-high)',
          padding: '4px',
          borderRadius: 'var(--radius-pill)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {(
          [
            { id: 'Expenses', label: 'Expenses' },
            { id: 'Balances', label: 'Balances' },
            { id: 'Settle', label: 'Smart Settle' },
            { id: 'Analytics', label: 'Analytics' },
            { id: 'Members', label: 'Members' },
          ] as const
        ).map((tab) => {
          const isActive = groupSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 600,
                border: 'none',
                background: isActive ? 'white' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setGroupSubTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Content */}
      {groupSubTab === 'Expenses' && (
        <GroupExpensesTab expenses={groupExpenses} />
      )}

      {groupSubTab === 'Balances' && (
        <GroupBalancesTab balances={groupBalances} users={users} />
      )}

      {groupSubTab === 'Settle' && (
        <SmartSettleTab
          settlementPlan={settlementPlan}
          onMarkPaid={markSettlementPaid}
        />
      )}

      {groupSubTab === 'Analytics' && (
        <GroupAnalyticsTab
          expenses={groupExpenses}
          totalSpentPaise={totalGroupSpentPaise}
        />
      )}

      {groupSubTab === 'Members' && (
        <GroupMembersTab
          members={selectedGroup.members}
          users={users}
        />
      )}
    </div>
  );
};

/* --- Subtab Components --- */

const GroupExpensesTab: React.FC<{ expenses: ReturnType<typeof useApp>['expenses'] }> = ({
  expenses,
}) => {
  if (expenses.length === 0) {
    return (
      <div className="warm-card" style={{ textAlign: 'center', padding: '32px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          No expenses recorded yet in this group.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {expenses.map((exp) => {
        const meta = CATEGORY_META[exp.category];
        const expMoney = Money.fromPaise(exp.amountPaise);

        return (
          <div
            key={exp.id}
            className="warm-card"
            style={{
              padding: '14px 16px',
              marginBottom: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'var(--surface-low)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                {meta?.emoji || '💳'}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{exp.description}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Paid by <strong>{exp.paidBy}</strong> • {exp.date}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '15px', fontWeight: 800 }}>{expMoney.formatINR()}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {exp.participants.length} people
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const GroupBalancesTab: React.FC<{
  balances: ReturnType<typeof useApp>['groupBalances'];
  users: ReturnType<typeof useApp>['users'];
}> = ({ balances, users }) => {
  const sorted = Object.values(balances).sort(
    (a, b) => b.netBalancePaise - a.netBalancePaise
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {sorted.map((mb) => {
        const netMoney = Money.fromPaise(mb.netBalancePaise);
        const contribMoney = Money.fromPaise(mb.totalContributedPaise);
        const shareMoney = Money.fromPaise(mb.totalSharePaise);
        const isPos = mb.netBalancePaise > 0;
        const isZero = mb.netBalancePaise === 0;
        const userObj = users.find((u) => u.id === mb.userId);

        return (
          <div
            key={mb.userId}
            className="warm-card"
            style={{
              padding: '14px 16px',
              marginBottom: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700 }}>
                {userObj?.name || mb.userId}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Paid {contribMoney.formatINR()} • Share {shareMoney.formatINR()}
              </p>
            </div>
            <div>
              {isPos ? (
                <div className="pill-badge credit">
                  <span>+{netMoney.formatINR()}</span>
                </div>
              ) : isZero ? (
                <div className="pill-badge" style={{ background: '#F1EFEA', color: 'var(--text-muted)' }}>
                  <span>Settled ✓</span>
                </div>
              ) : (
                <div className="pill-badge debt">
                  <span>{netMoney.formatINR()}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SmartSettleTab: React.FC<{
  settlementPlan: ReturnType<typeof useApp>['settlementPlan'];
  onMarkPaid: (tx: SettlementTransaction) => void;
}> = ({ settlementPlan, onMarkPaid }) => {
  if (settlementPlan.transactions.length === 0) {
    return (
      <div
        className="warm-card"
        style={{
          textAlign: 'center',
          padding: '36px 20px',
          background: 'linear-gradient(135deg, #FAF7F2 0%, #E8F8F0 100%)',
          border: '1px solid var(--credit-border)',
        }}
      >
        <div style={{ fontSize: '38px', marginBottom: '8px' }}>🎉</div>
        <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--credit-text)', marginBottom: '4px' }}>
          All Settled Up!
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Everyone in this group is completely even. No pending transactions.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Debt Simplification Highlight Card */}
      <div
        className="warm-card"
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #E8F8F0 100%)',
          border: '1px solid var(--credit-border)',
          marginBottom: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '26px' }}>✨</span>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--credit-text)' }}>
              Reduced to {settlementPlan.optimizedTransactionsCount} Payments
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Optimized down from {settlementPlan.initialTransactionsCount} circular transfers using min-flow matching
            </p>
          </div>
        </div>
      </div>

      {/* Settlement Cards */}
      {settlementPlan.transactions.map((tx) => {
        const amtMoney = Money.fromPaise(tx.amountPaise);

        return (
          <div key={tx.id} className="warm-card" style={{ padding: '16px', marginBottom: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '15px', fontWeight: 800 }}>{tx.fromUser}</span>
                <span style={{ color: 'var(--text-muted)', margin: '0 6px', fontSize: '13px' }}>
                  owes
                </span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
                  {tx.toUser}
                </span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>
                {amtMoney.formatINR()}
              </span>
            </div>

            {/* UPI Deep-Link Action Button & Mark Paid */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {tx.upiUri ? (
                <a
                  href={tx.upiUri}
                  className="btn-primary"
                  style={{
                    padding: '10px 14px',
                    fontSize: '13px',
                    flex: 2,
                    textDecoration: 'none',
                  }}
                >
                  <span>📲 Pay via UPI</span>
                </a>
              ) : null}
              <button
                type="button"
                className="btn-secondary"
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  flex: 1,
                  justifyContent: 'center',
                }}
                onClick={() => onMarkPaid(tx)}
              >
                <span>Mark Paid ✓</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const GroupAnalyticsTab: React.FC<{
  expenses: ReturnType<typeof useApp>['expenses'];
  totalSpentPaise: number;
}> = ({ expenses, totalSpentPaise }) => {
  const catMap: Partial<Record<Category, number>> = {};
  for (const e of expenses) {
    catMap[e.category] = (catMap[e.category] || 0) + e.amountPaise;
  }

  const categories = Object.entries(catMap) as [Category, number][];
  categories.sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="warm-card" style={{ marginBottom: 0 }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>
          Spending by Category
        </h4>
        {categories.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No expenses recorded yet.</p>
        ) : (
          categories.map(([cat, amountPaise]) => {
            const meta = CATEGORY_META[cat];
            const pct = totalSpentPaise > 0 ? Math.round((amountPaise * 100) / totalSpentPaise) : 0;
            const catMoney = Money.fromPaise(amountPaise);

            return (
              <div key={cat} style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  <span>
                    {meta?.emoji} {meta?.displayName || cat}
                  </span>
                  <span>
                    {pct}% ({catMoney.formatINR()})
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    width: '100%',
                    background: 'var(--surface-high)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'var(--primary)',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const GroupMembersTab: React.FC<{
  members: string[];
  users: ReturnType<typeof useApp>['users'];
}> = ({ members, users }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {members.map((mId) => {
        const u = users.find((user) => user.id === mId);
        const name = u?.name || mId;
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <div
            key={mId}
            className="warm-card"
            style={{
              padding: '14px 16px',
              marginBottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                }}
              >
                {initials}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {u?.email || `${mId.toLowerCase()}@pappercutter.app`}
                </p>
              </div>
            </div>
            <div>
              {u?.upiId ? (
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--primary-dark)',
                    background: 'var(--primary-light)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                >
                  {u.upiId}
                </span>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Member</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
