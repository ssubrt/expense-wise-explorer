import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ExpenseItem {
  id: string;
  groupId: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  timestamp: number;
  paidBy: User;
  splitType: 'equal' | 'custom';
  splitDetails: {
    userId: string;
    amount: number;
  }[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  members: User[];
  expenses: string[]; // Array of expense IDs
}

interface ExpenseState {
  currentUser: User;
  users: User[];
  groups: Group[];
  expenses: Record<string, ExpenseItem>;
  
  // Actions
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'expenses'>) => string;
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'timestamp'>) => void;
  getGroupExpenses: (groupId: string) => ExpenseItem[];
  calculateBalance: (userId: string, groupId?: string) => number;
  calculateBalanceWithUser: (userId: string, otherUserId: string) => number;
}

// Mock data for development
const mockUsers: User[] = [
  { id: '1', name: 'Current User', email: 'user@example.com' },
  { id: '2', name: 'John Doe', email: 'john@example.com' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '4', name: 'Bob Johnson', email: 'bob@example.com' },
];

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      currentUser: mockUsers[0],
      users: mockUsers,
      groups: [],
      expenses: {},

      addGroup: (groupData) => {
        const id = uuidv4();
        
        set((state) => ({
          groups: [
            ...state.groups,
            {
              id,
              name: groupData.name,
              description: groupData.description,
              createdAt: Date.now(),
              members: groupData.members,
              expenses: [],
            },
          ],
        }));
        
        return id;
      },

      addExpense: (expenseData) => {
        const id = uuidv4();
        const timestamp = Date.now();

        set((state) => {
          // Find the group
          const groupIndex = state.groups.findIndex(g => g.id === expenseData.groupId);
          
          if (groupIndex === -1) return state;
          
          const updatedGroups = [...state.groups];
          updatedGroups[groupIndex] = {
            ...updatedGroups[groupIndex],
            expenses: [...updatedGroups[groupIndex].expenses, id],
          };

          return {
            groups: updatedGroups,
            expenses: {
              ...state.expenses,
              [id]: {
                id,
                timestamp,
                ...expenseData,
              },
            },
          };
        });
      },

      getGroupExpenses: (groupId) => {
        const state = get();
        const group = state.groups.find(g => g.id === groupId);
        
        if (!group) return [];
        
        return group.expenses.map(id => state.expenses[id]).filter(Boolean);
      },

      calculateBalance: (userId, groupId) => {
        const state = get();
        let totalBalance = 0;
        
        const relevantExpenses = groupId 
          ? state.getGroupExpenses(groupId)
          : Object.values(state.expenses);
          
        relevantExpenses.forEach(expense => {
          // If current user paid
          if (expense.paidBy.id === userId) {
            // Add what others owe to the user
            expense.splitDetails.forEach(split => {
              if (split.userId !== userId) {
                totalBalance += split.amount;
              }
            });
          } else {
            // Subtract what user owes to others
            const userSplit = expense.splitDetails.find(split => split.userId === userId);
            if (userSplit) {
              totalBalance -= userSplit.amount;
            }
          }
        });
        
        return totalBalance;
      },

      calculateBalanceWithUser: (userId, otherUserId) => {
        const state = get();
        let balance = 0;
        
        Object.values(state.expenses).forEach(expense => {
          if (expense.paidBy.id === userId) {
            // Current user paid, check if other user owes
            const otherUserSplit = expense.splitDetails.find(split => split.userId === otherUserId);
            if (otherUserSplit) {
              balance += otherUserSplit.amount;
            }
          } else if (expense.paidBy.id === otherUserId) {
            // Other user paid, check if current user owes
            const userSplit = expense.splitDetails.find(split => split.userId === userId);
            if (userSplit) {
              balance -= userSplit.amount;
            }
          }
        });
        
        return balance;
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
