export type UserId = string;
export type GroupId = string;
export type ExpenseId = string;
export type SettlementId = string;

export type Category = 
  | 'Food'
  | 'Travel'
  | 'Stay'
  | 'Tickets'
  | 'Groceries'
  | 'Utilities'
  | 'Shopping'
  | 'Entertainment'
  | 'Other';

export interface CategoryMeta {
  emoji: string;
  displayName: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Food: { emoji: '🍕', displayName: 'Food & Drinks' },
  Travel: { emoji: '🚕', displayName: 'Travel & Cabs' },
  Stay: { emoji: '🏨', displayName: 'Stay & Hotel' },
  Tickets: { emoji: '🎟️', displayName: 'Tickets & Activities' },
  Groceries: { emoji: '🛒', displayName: 'Groceries' },
  Utilities: { emoji: '⚡', displayName: 'Utilities & Bills' },
  Shopping: { emoji: '🛍️', displayName: 'Shopping' },
  Entertainment: { emoji: '🎉', displayName: 'Entertainment' },
  Other: { emoji: '💳', displayName: 'General' },
};

export type SplitType = 'Equal' | 'Unequal' | 'Percentage' | 'ItemBased';

export type SettlementStatus = 'Pending' | 'MarkedPaid' | 'Confirmed';

export interface User {
  id: UserId;
  name: string;
  email: string;
  upiId?: string;
}

export interface Group {
  id: GroupId;
  name: string;
  category: string;
  members: UserId[];
  createdAt: string;
}

export interface Expense {
  id: ExpenseId;
  groupId: GroupId;
  description: string;
  category: Category;
  amountPaise: number; // Stored in minor currency units (paise)
  paidBy: UserId;
  participants: UserId[];
  splitType: SplitType;
  splitShares: Record<UserId, number>; // user_id -> paise
  date: string;
  notes?: string;
}

export interface SettlementTransaction {
  id: SettlementId;
  groupId: GroupId;
  fromUser: UserId;
  toUser: UserId;
  amountPaise: number;
  status: SettlementStatus;
  upiUri?: string;
}

export interface MemberBalance {
  userId: UserId;
  totalContributedPaise: number;
  totalSharePaise: number;
  netBalancePaise: number;
}
