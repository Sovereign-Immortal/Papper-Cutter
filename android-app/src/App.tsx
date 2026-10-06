import React from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { StatusBar } from './components/layout/StatusBar';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { HomeView } from './components/home/HomeView';
import { GroupDetailView } from './components/group/GroupDetailView';
import { AllExpensesView } from './components/expense/AllExpensesView';
import { ProfileView } from './components/profile/ProfileView';
import { AddExpenseSheet } from './components/expense/AddExpenseSheet';

const MainScreen: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="android-device-shell">
      {/* Android Top Status Bar */}
      <StatusBar />

      {/* Main Scrollable Screen Content */}
      <main className="app-screen-content">
        {activeTab === 'Home' && <HomeView />}
        {activeTab === 'Groups' && <GroupDetailView />}
        {activeTab === 'Expenses' && <AllExpensesView />}
        {activeTab === 'Profile' && <ProfileView />}
      </main>

      {/* Pill Navigation Bar */}
      <BottomNavBar />

      {/* Add Expense Modal Bottom Sheet */}
      <AddExpenseSheet />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
