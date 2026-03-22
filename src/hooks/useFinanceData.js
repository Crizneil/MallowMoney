import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';

const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: 'Utensils' },
  { name: 'Transport', icon: 'Car' },
  { name: 'Shopping', icon: 'ShoppingBag' },
  { name: 'Savings', icon: 'PiggyBank' }
];

const DEFAULT_ACCOUNTS = [
  { id: 'wallet', name: 'Cash Wallet', balance: 0 },
  { id: 'digital', name: 'Bank', balance: 0 }
];

export const useFinanceData = (user) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('mallow_transactions');
    if (saved) {
      let parsed = JSON.parse(saved);
      // Migration: Rename 'Pang Kape' to 'Savings' across all transaction history
      return parsed.map(tx => 
        tx.category && tx.category.toLowerCase() === 'pang kape' ? { ...tx, category: 'Savings' } : tx
      );
    }
    return [];
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
    if (saved) {
      let parsed = JSON.parse(saved);
      // Migration: Rename 'Pang Kape' to 'Savings' for the category item itself
      return parsed.map(cat => 
        cat.name.toLowerCase() === 'pang kape' ? { name: 'Savings', icon: 'PiggyBank' } : cat
      );
    }
    return DEFAULT_CATEGORIES;
  });

  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem('mallow_debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('mallow_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('mallow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mallow_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('mallow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mallow_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('mallow_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Sync from Firebase
  useEffect(() => {
    if (!user) return;

    // Sync Transactions
    const qTxs = query(collection(db, 'users', user.uid, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubTxs = onSnapshot(qTxs, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Sync Debts
    const qDebts = query(collection(db, 'users', user.uid, 'debts'), orderBy('createdAt', 'desc'));
    const unsubDebts = onSnapshot(qDebts, (snapshot) => {
      setDebts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Sync Subscriptions
    const qSubs = query(collection(db, 'users', user.uid, 'subscriptions'), orderBy('createdAt', 'desc'));
    const unsubSubs = onSnapshot(qSubs, (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTxs();
      unsubDebts();
      unsubSubs();
    };
  }, [user]);

  const addTransaction = async (transaction) => {
    const newTransaction = { 
      id: Date.now().toString(), 
      ...transaction, 
      accountId: transaction.accountId || 'wallet',
      date: transaction.date || new Date().toISOString(),
      createdAt: serverTimestamp()
    };

    if (!user) {
      delete newTransaction.createdAt;
      setTransactions(prev => [newTransaction, ...prev]);
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'expenses'), newTransaction);
    } catch (e) {
      console.error("Error adding transaction: ", e);
    }
  };

  const deleteTransaction = async (id) => {
    if (!user) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
    } catch (e) {
      console.error("Error deleting transaction: ", e);
    }
  };

  // Debts Helpers
  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: Date.now().toString(), createdAt: serverTimestamp(), status: 'active' };
    if (!user) {
      delete newDebt.createdAt;
      setDebts(prev => [newDebt, ...prev]);
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'debts'), newDebt);
    } catch (e) {
      console.error("Error adding debt: ", e);
    }
  };

  const updateDebt = async (id, updates) => {
    if (!user) {
      setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
      return;
    }
    try {
      await updateDoc(doc(db, 'users', user.uid, 'debts', id), updates);
    } catch (e) {
      console.error("Error updating debt: ", e);
    }
  };

  const deleteDebt = async (id) => {
    if (!user) {
      setDebts(prev => prev.filter(d => d.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'debts', id));
    } catch (e) {
      console.error("Error deleting debt: ", e);
    }
  };

  // Subscriptions Helpers
  const addSubscription = async (sub) => {
    const newSub = { ...sub, id: Date.now().toString(), createdAt: serverTimestamp() };
    if (!user) {
      delete newSub.createdAt;
      setSubscriptions(prev => [newSub, ...prev]);
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'subscriptions'), newSub);
    } catch (e) {
      console.error("Error adding subscription: ", e);
    }
  };

  const deleteSubscription = async (id) => {
    if (!user) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'subscriptions', id));
    } catch (e) {
      console.error("Error deleting subscription: ", e);
    }
  };

  const addAccount = (name) => {
    setAccounts(prev => [...prev, { id: Date.now().toString(), name, balance: 0 }]);
  };

  const addCategory = (name, icon) => {
    setCategories(prev => [...prev, { name: name.trim(), icon }]);
  };

  const deleteAccount = (id) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const deleteCategory = (name) => {
    const cleanName = name.trim().toLowerCase();
    setCategories(prev => prev.filter(cat => cat.name.trim().toLowerCase() !== cleanName));
  };

  const totalBalance = transactions.reduce((acc, t) => acc + Number(t.amount), 0);

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
    debts,
    subscriptions,
    addTransaction, 
    deleteTransaction, 
    addAccount,
    deleteAccount,
    addCategory,
    deleteCategory,
    addDebt,
    updateDebt,
    deleteDebt,
    addSubscription,
    deleteSubscription,
    balance: totalBalance 
  };
};

