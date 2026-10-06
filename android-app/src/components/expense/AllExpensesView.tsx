import React, { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { Money } from '../../domain/money';
import { CATEGORY_META } from '../../domain/types';

export const AllExpensesView: React.FC = () => {
  const { expenses } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filteredExpenses = expenses.filter((e) => {
    if (selectedFilter === 'All') return true;
    return e.category === selectedFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>All Expenses</h2>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
          {filteredExpenses.length} total
        </span>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {['All', 'Food', 'Travel', 'Stay', 'Tickets', 'Groceries'].map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: isSelected
                  ? '1.5px solid var(--primary)'
                  : '1px solid var(--surface-border)',
                background: isSelected ? 'var(--primary-light)' : 'white',
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 600,
                color: isSelected ? 'var(--primary-dark)' : 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredExpenses.length === 0 ? (
          <div
            className="warm-card"
            style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}
          >
            No expenses found for this category.
          </div>
        ) : (
          filteredExpenses.map((exp) => {
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
                      <strong>{exp.paidBy}</strong> paid • {exp.date}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800 }}>
                    {expMoney.formatINR()}
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {exp.participants.length} people
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
