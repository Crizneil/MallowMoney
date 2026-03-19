import { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: 'Utensils' },
  { name: 'Transport', icon: 'Car' },
  { name: 'Shopping', icon: 'ShoppingBag' },
  { name: 'Health', icon: 'Heart' },
  { name: 'Income', icon: 'TrendingUp' }
];

const DEFAULT_ACCOUNTS = [
  { id: 'wallet', name: 'Cash Wallet', balance: 0 },
  { id: 'digital', name: 'Bank', balance: 0 }
];

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('mallow_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('mallow_accounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Rename 'Digital Bank' to 'Bank'
      return parsed.map(acc => 
        acc.name === 'Digital Bank' ? { ...acc, name: 'Bank' } : acc
      );
    }
    return DEFAULT_ACCOUNTS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mallow_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('mallow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mallow_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('mallow_categories', JSON.stringify(categories));
  }, [categories]);

  const addTransaction = (transaction) => {
    const newTransaction = { 
      id: Date.now(), 
      ...transaction, 
      accountId: transaction.accountId || 'wallet',
      date: transaction.date || new Date().toISOString() 
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addAccount = (name) => {
    setAccounts(prev => [...prev, { id: Date.now().toString(), name, balance: 0 }]);
  };

  const addCategory = (name, icon) => {
    setCategories(prev => [...prev, { name, icon }]);
  };

  const totalBalance = transactions.reduce((acc, t) => acc + Number(t.amount), 0);

  // Calculate balances per account
  const accountsWithBalances = accounts.map(acc => ({
    ...acc,
    balance: transactions
      .filter(t => t.accountId === acc.id)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }));

  return { 
    transactions, 
    accounts: accountsWithBalances, 
    categories,
    addTransaction, 
    deleteTransaction, 
    addAccount,
    addCategory,
    balance: totalBalance 
  };
};
