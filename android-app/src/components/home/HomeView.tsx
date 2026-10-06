import React from 'react';
import { useApp } from '../../state/AppContext';
import { Money } from '../../domain/money';
import { CATEGORY_META } from '../../domain/types';

export const HomeView: React.FC = () => {
  const {
    currentUser,
    groups,
    selectedGroupId,
    setSelectedGroupId,
    setActiveTab,
    setGroupSubTab,
    userNetBalancePaise,
    expenses,
    selectedGroup,
  } = useApp();

  const netMoney = Money.fromPaise(userNetBalancePaise);
  const isOwed = userNetBalancePaise >= 0;

  const recentExpenses = expenses
    .filter((e) => e.groupId === selectedGroupId)
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* Top Welcome Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          marginTop: '4px',
        }}
      >
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Good morning 👋
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            {currentUser.name}
          </h2>
        </div>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: 'var(--primary-dark)',
            fontSize: '15px',
          }}
        >
          HS
        </div>
      </div>

      {/* Group Balance Cushion Card */}
      <div className="balance-cushion">
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Your Net Balance
        </p>
        <div
          className="balance-amount"
          style={{ color: isOwed ? 'var(--credit-text)' : 'var(--debt-text)' }}
        >
          {netMoney.formatINR()}
        </div>
        <div className={`pill-badge ${isOwed ? 'credit' : 'debt'}`}>
          {isOwed ? (
            <span>🟢 You are owed across groups</span>
          ) : (
            <span>🔴 You owe group members</span>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setActiveTab('Groups');
              setGroupSubTab('Settle');
            }}
          >
            <span>⚡ Settle Up</span>
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              setActiveTab('Groups');
              setGroupSubTab('Analytics');
            }}
          >
            <span>📊 Analytics</span>
          </button>
        </div>
      </div>

      {/* Active Groups Carousel */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Active Groups</h3>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('Groups')}
          >
            See All ({groups.length})
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'none',
          }}
        >
          {groups.map((grp) => {
            const isSelected = grp.id === selectedGroupId;
            const emoji = grp.name.includes('Manali')
              ? '🏔️'
              : grp.name.includes('Room')
              ? '🏠'
              : '🎉';

            return (
              <div
                key={grp.id}
                className="warm-card"
                style={{
                  minWidth: '170px',
                  marginBottom: 0,
                  padding: '14px',
                  cursor: 'pointer',
                  border: isSelected
                    ? '2px solid var(--primary)'
                    : '1px solid var(--surface-border)',
                  background: isSelected ? 'var(--surface-low)' : 'var(--surface-card)',
                  transition: 'transform 0.15s ease',
                }}
                onClick={() => {
                  setSelectedGroupId(grp.id);
                  setActiveTab('Groups');
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{emoji}</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>
                  {grp.name}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {grp.members.length} members
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Expenses List */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Recent Expenses</h3>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
            {selectedGroup.name}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentExpenses.length === 0 ? (
            <div
              className="warm-card"
              style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}
            >
              No expenses yet in this group.
            </div>
          ) : (
            recentExpenses.map((exp) => {
              const meta = CATEGORY_META[exp.category];
              const expMoney = Money.fromPaise(exp.amountPaise);

              return (
                <div
                  key={exp.id}
                  className="warm-card"
                  style={{
                    marginBottom: 0,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: 'var(--surface-low)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    >
                      {meta?.emoji || '💳'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>
                        {exp.description}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Paid by <strong>{exp.paidBy}</strong> • {exp.date}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800 }}>
                      {expMoney.formatINR()}
                    </span>
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        marginTop: '2px',
                      }}
                    >
                      Equal split
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
