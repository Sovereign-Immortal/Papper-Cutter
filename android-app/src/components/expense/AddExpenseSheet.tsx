import React, { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { CATEGORY_META, type Category, type SplitType, type UserId } from '../../domain/types';
import { calculateEqualSplit } from '../../domain/split';

function tryParseAiPrompt(prompt: string, users: { id: string; name: string }[]) {
  const lower = prompt.toLowerCase();
  let amount: number | null = null;

  for (const token of lower.split(/\s+/)) {
    const clean = token.replace(/[^0-9.]/g, '');
    const val = parseFloat(clean);
    if (!isNaN(val) && val > 0) {
      amount = val;
      break;
    }
  }

  let cat: Category = 'Food';
  if (lower.includes('dinner') || lower.includes('food') || lower.includes('lunch') || lower.includes('cafe') || lower.includes('pizza') || lower.includes('burger')) {
    cat = 'Food';
  } else if (lower.includes('cab') || lower.includes('taxi') || lower.includes('uber') || lower.includes('travel') || lower.includes('ola') || lower.includes('petrol')) {
    cat = 'Travel';
  } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort') || lower.includes('room') || lower.includes('airbnb')) {
    cat = 'Stay';
  } else if (lower.includes('ticket') || lower.includes('ski') || lower.includes('pass') || lower.includes('entry') || lower.includes('movie')) {
    cat = 'Tickets';
  } else if (lower.includes('grocery') || lower.includes('milk') || lower.includes('mart') || lower.includes('veggie')) {
    cat = 'Groceries';
  }

  let desc = 'Group Expense';
  if (lower.includes('dinner')) desc = 'Riverside Dinner';
  else if (lower.includes('cab')) desc = 'Valley Cab';
  else if (lower.includes('hotel') || lower.includes('resort')) desc = 'Resort Stay';
  else if (lower.includes('ticket') || lower.includes('ski')) desc = 'Ski & Activity Tickets';
  else if (lower.includes('cafe')) desc = 'Riverside Cafe';

  let foundPayer: UserId | null = null;
  for (const u of users) {
    if (lower.includes(u.name.toLowerCase()) || lower.includes(u.id.toLowerCase())) {
      foundPayer = u.id;
      break;
    }
  }

  return { amount, desc, cat, payer: foundPayer };
}

export const AddExpenseSheet: React.FC = () => {
  const {
    selectedGroup,
    users,
    currentUserId,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    addExpense,
  } = useApp();

  const [aiPrompt, setAiPrompt] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [descStr, setDescStr] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [payerId, setPayerId] = useState<UserId>(currentUserId);
  const [splitType] = useState<SplitType>('Equal');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAddExpenseOpen) return null;

  const handleAiInput = (text: string) => {
    setAiPrompt(text);
    const parsed = tryParseAiPrompt(text, users);
    if (parsed.amount) {
      setAmountStr(parsed.amount.toString());
    }
    if (parsed.desc) {
      setDescStr(parsed.desc);
    }
    if (parsed.cat) {
      setCategory(parsed.cat);
    }
    if (parsed.payer) {
      setPayerId(parsed.payer);
    }
  };

  const handleSave = () => {
    setErrorMsg(null);
    const rawAmt = parseFloat(amountStr.trim());
    if (isNaN(rawAmt) || rawAmt <= 0) {
      setErrorMsg('Please enter a valid amount greater than ₹0');
      return;
    }

    const desc = descStr.trim() || 'Shared Expense';
    const amountPaise = Math.round(rawAmt * 100);

    try {
      const splitShares = calculateEqualSplit(
        amountPaise,
        payerId,
        selectedGroup.members
      );

      addExpense({
        groupId: selectedGroup.id,
        description: desc,
        category,
        amountPaise,
        paidBy: payerId,
        participants: selectedGroup.members,
        splitType,
        splitShares,
        date: 'Today',
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Split calculation error');
    }
  };

  // Preview each participant's estimated share
  const previewAmt = parseFloat(amountStr) || 0;
  const previewShare =
    previewAmt > 0 && selectedGroup.members.length > 0
      ? (previewAmt / selectedGroup.members.length).toFixed(2)
      : '0.00';

  return (
    <div
      className="bottom-sheet-backdrop"
      onClick={() => setIsAddExpenseOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Add Expense</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Adding to <strong>{selectedGroup.name}</strong>
            </p>
          </div>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
            onClick={() => setIsAddExpenseOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* AI Natural Language Input Box */}
        <div
          style={{
            background: 'var(--surface-low)',
            borderRadius: '18px',
            padding: '12px',
            marginBottom: '16px',
            border: '1.5px dashed var(--primary)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <span style={{ fontSize: '15px' }}>✨</span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--primary-dark)',
              }}
            >
              AI Smart Entry
            </span>
          </div>
          <input
            style={{
              width: '100%',
              background: 'white',
              border: '1px solid var(--surface-border)',
              borderRadius: '12px',
              padding: '9px 12px',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            placeholder="e.g. Rahul paid 1800 for dinner for all of us"
            value={aiPrompt}
            onChange={(e) => handleAiInput(e.target.value)}
          />

          {/* Quick AI Suggestion Chips */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginTop: '8px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {[
              { label: '🍕 Dinner ₹1,800', prompt: 'Rahul paid 1800 for riverside dinner' },
              { label: '🚕 Solang Cab ₹1,200', prompt: 'Aman paid 1200 for valley cab' },
              { label: '☕ Cafe ₹450', prompt: 'Harsh paid 450 for coffee and snacks' },
              { label: '🏨 Resort ₹6,000', prompt: 'Harsh paid 6000 for resort stay' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                style={{
                  background: 'white',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  color: 'var(--text-main)',
                }}
                onClick={() => handleAiInput(chip.prompt)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div
            style={{
              background: 'var(--debt-bg)',
              border: '1px solid var(--debt-border)',
              color: 'var(--debt-text)',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              marginBottom: '12px',
              fontWeight: 600,
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Amount Focus */}
        <div style={{ textAlign: 'center', margin: '14px 0' }}>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            ENTER AMOUNT (₹)
          </p>
          <input
            type="number"
            step="any"
            style={{
              fontSize: '38px',
              fontWeight: 800,
              border: 'none',
              background: 'transparent',
              textAlign: 'center',
              width: '100%',
              outline: 'none',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
            }}
            placeholder="0.00"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
          />
          {previewAmt > 0 && (
            <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
              ≈ ₹{previewShare} each ({selectedGroup.members.length} members)
            </p>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '14px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            DESCRIPTION
          </label>
          <input
            style={{
              width: '100%',
              background: 'white',
              border: '1.5px solid var(--surface-border)',
              borderRadius: '14px',
              padding: '10px 14px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            placeholder="What was this for? (e.g. Dinner, Cab, Tickets)"
            value={descStr}
            onChange={(e) => setDescStr(e.target.value)}
          />
        </div>

        {/* Paid By Selector */}
        <div style={{ marginBottom: '14px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            PAID BY
          </label>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            {users.map((u) => {
              const isSelected = payerId === u.id;
              return (
                <button
                  key={u.id}
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
                  onClick={() => setPayerId(u.id)}
                >
                  {u.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Selector */}
        <div style={{ marginBottom: '22px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            CATEGORY
          </label>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            {(Object.keys(CATEGORY_META) as Category[]).map((catKey) => {
              const meta = CATEGORY_META[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  style={{
                    padding: '7px 14px',
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
                  onClick={() => setCategory(catKey)}
                >
                  {meta.emoji} {catKey}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
        >
          <span>Save Expense</span>
        </button>
      </div>
    </div>
  );
};
