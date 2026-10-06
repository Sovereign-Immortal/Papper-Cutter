import React from 'react';
import { useApp } from '../../state/AppContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddExpenseOpen } = useApp();

  return (
    <nav className="android-nav-bar" aria-label="Main Navigation">
      <button
        type="button"
        className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`}
        onClick={() => setActiveTab('Home')}
      >
        <span style={{ fontSize: '18px' }}>🏠</span>
        <span>Home</span>
      </button>

      <button
        type="button"
        className={`nav-item ${activeTab === 'Groups' ? 'active' : ''}`}
        onClick={() => setActiveTab('Groups')}
      >
        <span style={{ fontSize: '18px' }}>👥</span>
        <span>Groups</span>
      </button>

      {/* Floating Add Expense Center Pill */}
      <button
        type="button"
        className="nav-item-center"
        onClick={() => setIsAddExpenseOpen(true)}
        aria-label="Add Expense"
      >
        +
      </button>

      <button
        type="button"
        className={`nav-item ${activeTab === 'Expenses' ? 'active' : ''}`}
        onClick={() => setActiveTab('Expenses')}
      >
        <span style={{ fontSize: '18px' }}>💸</span>
        <span>Expenses</span>
      </button>

      <button
        type="button"
        className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('Profile')}
      >
        <span style={{ fontSize: '18px' }}>👤</span>
        <span>Profile</span>
      </button>
    </nav>
  );
};
