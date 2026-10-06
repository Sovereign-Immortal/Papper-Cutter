import React from 'react';
import { useApp } from '../../state/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, groups } = useApp();

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      <div
        style={{
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          fontWeight: 800,
          color: 'var(--primary-dark)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {initials}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{currentUser.name}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{currentUser.email}</p>
        {currentUser.upiId && (
          <div style={{ marginTop: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--primary-dark)',
                background: 'var(--primary-light)',
                padding: '5px 12px',
                borderRadius: '9999px',
                fontWeight: 700,
              }}
            >
              UPI: {currentUser.upiId}
            </span>
          </div>
        )}
      </div>

      {/* Account Info Cards */}
      <div className="warm-card" style={{ width: '100%', marginTop: '8px', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
          Preferences
        </h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Default Currency</span>
          <strong style={{ color: 'var(--text-main)' }}>INR (₹)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Active Groups</span>
          <strong style={{ color: 'var(--primary)' }}>{groups.length} groups</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Settlement Engine</span>
          <strong style={{ color: 'var(--credit-text)' }}>Min-Flow Optimized (O(N log N))</strong>
        </div>
      </div>

      <div className="warm-card" style={{ width: '100%', marginBottom: 0 }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
          App Information
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Papper Cutter v0.1.0 • Warm Pastel Harmony Edition
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Precision integer minor units accounting with instant UPI settlement.
        </p>
      </div>
    </div>
  );
};
