import type { Expense, Group, User } from '../domain/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'Harsh',
    name: 'Harsh Sharma',
    email: 'harsh@pappercutter.app',
    upiId: 'harsh@okaxis',
  },
  {
    id: 'Rahul',
    name: 'Rahul Verma',
    email: 'rahul@pappercutter.app',
    upiId: 'rahul@oksbi',
  },
  {
    id: 'Aman',
    name: 'Aman Gupta',
    email: 'aman@pappercutter.app',
    upiId: 'aman@paytm',
  },
  {
    id: 'Piyush',
    name: 'Piyush Jain',
    email: 'piyush@pappercutter.app',
    upiId: 'piyush@icici',
  },
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'grp-manali',
    name: 'Manali Trip 🏔️',
    category: 'Trip',
    members: ['Harsh', 'Rahul', 'Aman', 'Piyush'],
    createdAt: '2026-10-01',
  },
  {
    id: 'grp-room304',
    name: 'Room 304 🏠',
    category: 'Roommates',
    members: ['Harsh', 'Rahul'],
    createdAt: '2026-09-15',
  },
  {
    id: 'grp-college',
    name: 'College Fest 🎉',
    category: 'College',
    members: ['Harsh', 'Rahul', 'Aman', 'Piyush'],
    createdAt: '2026-09-28',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    groupId: 'grp-manali',
    description: 'Snow Crest Resort',
    category: 'Stay',
    amountPaise: 600000, // ₹6,000.00
    paidBy: 'Harsh',
    participants: ['Harsh', 'Rahul', 'Aman', 'Piyush'],
    splitType: 'Equal',
    splitShares: {
      Harsh: 150000,
      Rahul: 150000,
      Aman: 150000,
      Piyush: 150000,
    },
    date: 'Oct 02',
    notes: '3 nights valley view',
  },
  {
    id: 'exp-2',
    groupId: 'grp-manali',
    description: 'Cafe 1947 Riverside Dinner',
    category: 'Food',
    amountPaise: 180000, // ₹1,800.00
    paidBy: 'Rahul',
    participants: ['Harsh', 'Rahul', 'Aman', 'Piyush'],
    splitType: 'Equal',
    splitShares: {
      Harsh: 45000,
      Rahul: 45000,
      Aman: 45000,
      Piyush: 45000,
    },
    date: 'Oct 03',
  },
  {
    id: 'exp-3',
    groupId: 'grp-manali',
    description: 'Solang Valley Cab',
    category: 'Travel',
    amountPaise: 120000, // ₹1,200.00
    paidBy: 'Aman',
    participants: ['Harsh', 'Aman', 'Piyush'],
    splitType: 'Equal',
    splitShares: {
      Harsh: 40000,
      Aman: 40000,
      Piyush: 40000,
    },
    date: 'Oct 04',
  },
  {
    id: 'exp-4',
    groupId: 'grp-manali',
    description: 'Ropeway & Ski Tickets',
    category: 'Tickets',
    amountPaise: 200000, // ₹2,000.00
    paidBy: 'Piyush',
    participants: ['Harsh', 'Rahul', 'Aman', 'Piyush'],
    splitType: 'Equal',
    splitShares: {
      Harsh: 50000,
      Rahul: 50000,
      Aman: 50000,
      Piyush: 50000,
    },
    date: 'Oct 04',
  },
];
