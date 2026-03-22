import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, where, setDoc } from 'firebase/firestore';

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
  const [nickname, setNicknameState] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Sync Profile (Nickname)
  useEffect(() => {
    if (!user) {
      setNicknameState('');
      setLoadingProfile(false);
      return;
    }

    const unsubProfile = onSnapshot(doc(db, 'users', user.uid, 'profile', 'info'), (snapshot) => {
      if (snapshot.exists()) {
        setNicknameState(snapshot.data().nickname || '');
      }
      setLoadingProfile(false);
    });

    return () => unsubProfile();
  }, [user]);

  const updateNickname = async (name) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'profile', 'info'), { 
        nickname: name,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error("Error updating nickname:", e);
    }
  };

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
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Sync Debts
    const qDebts = query(collection(db, 'users', user.uid, 'debts'), orderBy('createdAt', 'desc'));
    const unsubDebts = onSnapshot(qDebts, (snapshot) => {
      setDebts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Sync Subscriptions
    const qSubs = query(collection(db, 'users', user.uid, 'subscriptions'), orderBy('createdAt', 'desc'));
    const unsubSubs = onSnapshot(qSubs, (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
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
      await addDoc(collection(db, 'users', user.uid, 'expenses'), {
        ...newTransaction,
        userId: user.uid // Explicitly include userId for easier querying/rules
      });
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
      const { id, ...firebaseData } = newDebt;
      await addDoc(collection(db, 'users', user.uid, 'debts'), {
        ...firebaseData,
        userId: user.uid // Explicitly include userId for easier querying/rules
      });
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

  // Subscriptions Helpers
  const addSubscription = async (sub) => {
    const newSub = { ...sub, id: Date.now().toString(), createdAt: serverTimestamp() };
    if (!user) {
      delete newSub.createdAt;
      setSubscriptions(prev => [newSub, ...prev]);
      return;
    }
    try {
      const { id, ...firebaseData } = newSub;
      await addDoc(collection(db, 'users', user.uid, 'subscriptions'), {
        ...firebaseData,
        userId: user.uid // Explicitly include userId for easier querying/rules
      });
    } catch (e) {
      console.error("Error adding subscription: ", e);
    }
  };

  const deleteDebt = async (id) => {
    if (!user || !user.uid) {
      console.error("[Firebase] Cannot delete: user.uid is missing!", user);
      if (!user) {
        setDebts(prev => prev.filter(d => d.id !== id));
      } else {
        alert("Error: Missing user ID. Please try logging out and in again.");
      }
      return;
    }
    try {
      const debtRef = doc(db, 'users', user.uid, 'debts', id);
      console.log(`[Firebase] Path to delete: users/${user.uid}/debts/${id}`);
      await deleteDoc(debtRef);
      console.log(`[Firebase] Successfully deleted debt ${id}`);
      alert("Utang deleted successfully! 💸");
    } catch (e) {
      console.error(`[Firebase Error] Debt deletion failed:`, e.code, e.message);
      alert(`Hindi mabura ang utang.\nError: ${e.code}\nMessage: ${e.message}`);
    }
  };

  const deleteSubscription = async (id) => {
    if (!user || !user.uid) {
      console.error("[Firebase] Cannot delete sub: user.uid is missing!", user);
      if (!user) {
        setSubscriptions(prev => prev.filter(s => s.id !== id));
      } else {
        alert("Error: Missing user ID. Please try logging out and in again.");
      }
      return;
    }
    try {
      const subRef = doc(db, 'users', user.uid, 'subscriptions', id);
      console.log(`[Firebase] Path to delete: users/${user.uid}/subscriptions/${id}`);
      await deleteDoc(subRef);
      console.log(`[Firebase] Successfully deleted sub ${id}`);
      alert("Subscription record cleared! 🗓️");
    } catch (e) {
      console.error(`[Firebase Error] Subscription deletion failed:`, e.code, e.message);
      alert(`Hindi mabura ang subscription.\nError: ${e.code}\nMessage: ${e.message}`);
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

  const totalBalance = useMemo(() => 
    transactions.reduce((acc, t) => acc + Number(t.amount), 0),
    [transactions]
  );

  const accountsWithBalances = useMemo(() => 
    accounts.map(acc => ({
      ...acc,
      balance: transactions
        .filter(t => t.accountId === acc.id)
        .reduce((sum, t) => sum + Number(t.amount), 0)
    })),
    [accounts, transactions]
  );

  return { 
    transactions, 
    accounts: accountsWithBalances, 
    categories,
    debts,
    subscriptions,
    nickname,
    loadingProfile,
    updateNickname,
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
