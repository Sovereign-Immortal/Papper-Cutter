import React, { createContext, useState, useMemo } from 'react';
import type { Expense, Group, SettlementStatus, SettlementTransaction, User, UserId } from '../domain/types';
import { calculateGroupBalances } from '../domain/balance';
import { generateSettlementPlan, type SettlementPlan } from '../domain/settlement';
import { INITIAL_EXPENSES, INITIAL_GROUPS, INITIAL_USERS } from './sampleData';

export type AppTab = 'Home' | 'Groups' | 'Expenses' | 'Profile';
export type GroupSubTab = 'Expenses' | 'Balances' | 'Settle' | 'Analytics' | 'Members';

interface AppContextType {
  users: User[];
  currentUserId: UserId;
  currentUser: User;
  groups: Group[];
  selectedGroupId: string;
  selectedGroup: Group;
  setSelectedGroupId: (id: string) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  groupSubTab: GroupSubTab;
  setGroupSubTab: (tab: GroupSubTab) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  expenses: Expense[];
  settlements: SettlementTransaction[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  markSettlementPaid: (transaction: SettlementTransaction) => void;
  
  // Computed values
  groupBalances: ReturnType<typeof calculateGroupBalances>;
  settlementPlan: SettlementPlan;
  totalGroupSpentPaise: number;
  userNetBalancePaise: number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUserId] = useState<UserId>('Harsh');
  const [groups] = useState<Group[]>(INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp-manali');
  const [activeTab, setActiveTab] = useState<AppTab>('Home');
  const [groupSubTab, setGroupSubTab] = useState<GroupSubTab>('Expenses');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [settlements, setSettlements] = useState<SettlementTransaction[]>([]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const selectedGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId) || groups[0];
  }, [groups, selectedGroupId]);

  const groupExpenses = useMemo(() => {
    return expenses.filter((e) => e.groupId === selectedGroupId);
  }, [expenses, selectedGroupId]);

  const groupBalances = useMemo(() => {
    return calculateGroupBalances(selectedGroup.members, groupExpenses, settlements);
  }, [selectedGroup, groupExpenses, settlements]);

  const userUpiMap = useMemo(() => {
    const map: Record<UserId, string> = {};
    for (const u of users) {
      if (u.upiId) {
        map[u.id] = u.upiId;
      }
    }
    return map;
  }, [users]);

  const settlementPlan = useMemo(() => {
    const netMap: Record<UserId, number> = {};
    for (const [uid, b] of Object.entries(groupBalances)) {
      netMap[uid] = b.netBalancePaise;
    }
    return generateSettlementPlan(selectedGroupId, netMap, userUpiMap);
  }, [selectedGroupId, groupBalances, userUpiMap]);

  const totalGroupSpentPaise = useMemo(() => {
    return groupExpenses.reduce((sum, e) => sum + e.amountPaise, 0);
  }, [groupExpenses]);

  const userNetBalancePaise = useMemo(() => {
    return groupBalances[currentUserId]?.netBalancePaise ?? 0;
  }, [groupBalances, currentUserId]);

  const addExpense = (newExpData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...newExpData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setIsAddExpenseOpen(false);
  };

  const markSettlementPaid = (tx: SettlementTransaction) => {
    const confirmedTx: SettlementTransaction = {
      ...tx,
      id: `settled-${Date.now()}`,
      status: 'MarkedPaid' as SettlementStatus,
    };
    setSettlements((prev) => [...prev, confirmedTx]);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUserId,
        currentUser,
        groups,
        selectedGroupId,
        selectedGroup,
        setSelectedGroupId,
        activeTab,
        setActiveTab,
        groupSubTab,
        setGroupSubTab,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        expenses,
        settlements,
        addExpense,
        markSettlementPaid,
        groupBalances,
        settlementPlan,
        totalGroupSpentPaise,
        userNetBalancePaise,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { useApp } from './useApp';
