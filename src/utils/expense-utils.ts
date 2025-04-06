
import { ExpenseItem } from "@/store/useExpenseStore";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getExpenseCategories = (): string[] => [
  'Food',
  'Transportation',
  'Housing',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Travel',
  'Healthcare',
  'Education',
  'Other',
];

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Food':
      return 'utensils';
    case 'Transportation':
      return 'car';
    case 'Housing':
      return 'home';
    case 'Entertainment':
      return 'film';
    case 'Utilities':
      return 'lightbulb';
    case 'Shopping':
      return 'shopping-bag';
    case 'Travel':
      return 'plane';
    case 'Healthcare':
      return 'heart';
    case 'Education':
      return 'book';
    default:
      return 'file';
  }
};
