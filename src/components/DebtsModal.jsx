import { useState } from 'react';
import { X, Clock, Repeat, Plus, Trash2, User, Landmark, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';
import ConfirmModal from './ConfirmModal';

const DebtsModal = ({ 
  isOpen, 
  onClose, 
  debts = [], 
  subscriptions = [], 
  addDebt, 
  updateDebt, 
  deleteDebt, 
  addSubscription, 
  deleteSubscription,
  addTransaction
}) => {
  const [activeTab, setActiveTab] = useState('utang'); // 'utang' or 'subs'
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { id, name, type, data }

  // Form States - Debt
  const [debtType, setDebtType] = useState('owe'); // 'owe' (you owe) or 'owed' (they owe you)
  const [debtPerson, setDebtPerson] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDueDate, setDebtDueDate] = useState('');

  // Form States - Subscription
  const [subName, setSubName] = useState('');
  const [subAmount, setSubAmount] = useState('');
  const [subFreq, setSubFreq] = useState('Monthly');

  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!debtPerson || !debtAmount) return;
    audioManager.playSFX('click');
    addDebt({
      type: debtType,
      person: debtPerson,
      amount: parseFloat(debtAmount),
      balance: parseFloat(debtAmount),
      dueDate: debtDueDate,
      status: 'active'
    });
    setDebtPerson('');
    setDebtAmount('');
    setDebtDueDate('');
    setShowAddForm(false);
  };

  const handleAddSub = (e) => {
    e.preventDefault();
    if (!subName || !subAmount) return;
    audioManager.playSFX('click');
    addSubscription({
      name: subName,
      amount: parseFloat(subAmount),
      frequency: subFreq,
      nextDate: new Date().toISOString()
    });
    setSubName('');
    setSubAmount('');
    setShowAddForm(false);
  };

  const handleSettleDebt = (debt, amount) => {
    audioManager.playSFX('click');
    const newBalance = debt.balance - amount;
    const updates = { 
      balance: newBalance,
      status: newBalance <= 0 ? 'settled' : 'active'
    };
    updateDebt(debt.id, updates);

    // Automatically log a transaction for this payment
    addTransaction({
      amount: debt.type === 'owe' ? -amount : amount,
      category: 'Debt Payment',
      note: `${debt.type === 'owe' ? 'Paid' : 'Received from'} ${debt.person}`,
      type: debt.type === 'owe' ? 'expense' : 'income'
    });
  };

  const logSubPayment = (sub) => {
    audioManager.playSFX('click');
    addTransaction({
      amount: -sub.amount,
      category: 'Subscription',
      note: `Subscription: ${sub.name}`,
      type: 'expense'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-mallow-light-bg dark:bg-space-bg p-0 rounded-3xl shadow-2xl border-2 border-mallow-light-blue dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 pb-2 relative z-10 flex justify-between items-center">
              <div className="flex space-x-4">
                <button 
                  onClick={() => { audioManager.playSFX('click'); setActiveTab('utang'); setShowAddForm(false); }}
                  className={`font-press-start text-[11px] pb-2 border-b-2 transition-all font-bold ${activeTab === 'utang' ? 'border-mallow-light-pink text-mallow-light-pink' : 'border-transparent opacity-40'}`}
                >
                  UTANG
                </button>
                <button 
                  onClick={() => { audioManager.playSFX('click'); setActiveTab('subs'); setShowAddForm(false); }}
                  className={`font-press-start text-[11px] pb-2 border-b-2 transition-all font-bold ${activeTab === 'subs' ? 'border-mallow-light-blue text-mallow-light-blue' : 'border-transparent opacity-40'}`}
                >
                  SUBS
                </button>
              </div>
              <button onClick={() => { audioManager.playSFX('click'); onClose(); }} className="p-2 opacity-40 hover:opacity-100 bg-black/5 dark:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4 custom-scrollbar">
              
              {/* Content Toggle */}
              {!showAddForm ? (
                <>
                  {/* UTANG LIST */}
                  {activeTab === 'utang' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                         <span className="font-pixel text-[11px] opacity-40 uppercase font-bold tracking-tight">Aking Listahan</span>
                         <button 
                          onClick={() => { audioManager.playSFX('click'); setShowAddForm(true); }}
                          className="flex items-center space-x-1 text-mallow-light-pink font-bold text-xs bg-mallow-light-pink/10 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                         >
                           <Plus size={14} />
                           <span>DAGDAG</span>
                         </button>
                      </div>
                      
                      {debts.length === 0 ? (
                        <div className="text-center py-10 opacity-30">
                          <Clock size={40} className="mx-auto mb-2" />
                          <p className="font-pixel text-[10px]">Wala pang utang.</p>
                        </div>
                      ) : (
                        debts.map(debt => (
                          <div key={debt.id} className={`p-4 rounded-2xl border-2 transition-all ${debt.status === 'settled' ? 'bg-black/5 dark:bg-white/5 border-transparent opacity-60' : 'bg-white dark:bg-[#1a1c24] border-mallow-light-pink/10 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${debt.type === 'owe' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                  {debt.type === 'owe' ? <Landmark size={18} /> : <User size={18} />}
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm">{debt.person}</h4>
                                  <p className="text-[11px] opacity-50 uppercase font-pixel font-bold tracking-tight">{debt.type === 'owe' ? 'Utang ko' : 'Pautang ko'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-pixel text-sm">₱{debt.balance.toLocaleString()}</p>
                                <p className="text-[10px] opacity-40">mula sa ₱{debt.amount.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              {debt.status === 'active' && (
                                <button 
                                  onClick={() => {
                                    audioManager.playSFX('click');
                                    setConfirmAction({
                                      id: debt.id,
                                      name: debt.person,
                                      type: 'settle',
                                      data: debt
                                    });
                                  }}
                                  className="flex-1 bg-mallow-light-pink text-white py-2 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center justify-center space-x-2"
                                >
                                  <CheckCircle size={14} />
                                  <span>SETTLE & CLEAR</span>
                                </button>
                              )}
                              {debt.status === 'settled' && (
                                <button 
                                  onClick={() => {
                                    audioManager.playSFX('click');
                                    setConfirmAction({
                                      id: debt.id,
                                      name: debt.person,
                                      type: 'delete_settled',
                                      data: debt
                                    });
                                  }}
                                  className="flex-1 bg-black/5 dark:bg-white/5 text-mallow-light-text/40 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                                >
                                  CLEAR FROM LIST
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SUBSCRIPTIONS LIST */}
                  {activeTab === 'subs' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                         <span className="font-pixel text-[11px] opacity-40 uppercase font-bold tracking-tight">Recurring Bills</span>
                         <button 
                          onClick={() => { audioManager.playSFX('click'); setShowAddForm(true); }}
                          className="flex items-center space-x-1 text-mallow-light-blue font-bold text-xs bg-mallow-light-blue/10 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                         >
                           <Plus size={14} />
                           <span>DAGDAG</span>
                         </button>
                      </div>

                      {subscriptions.length === 0 ? (
                        <div className="text-center py-10 opacity-30">
                          <Repeat size={40} className="mx-auto mb-2" />
                          <p className="font-pixel text-[10px]">Wala pang subs.</p>
                        </div>
                      ) : (
                        subscriptions.map(sub => (
                          <div key={sub.id} className="p-4 bg-white dark:bg-[#1a1c24] border-2 border-mallow-light-blue/10 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-mallow-light-blue/10 text-mallow-light-blue rounded-lg">
                                  <Repeat size={18} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm">{sub.name}</h4>
                                  <p className="text-[11px] opacity-50 uppercase font-pixel tracking-tight font-bold">{sub.frequency}</p>
                                </div>
                              </div>
                              <p className="font-pixel text-sm text-mallow-light-blue">₱{sub.amount.toLocaleString()}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  audioManager.playSFX('click');
                                  setConfirmAction({
                                    id: sub.id,
                                    name: sub.name,
                                    type: 'pay',
                                    data: sub
                                  });
                                }}
                                className="flex-1 bg-mallow-light-blue text-white py-2 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-sm"
                              >
                                <Repeat size={14} />
                                <span>LOG & CLEAR</span>
                              </button>
                            </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                </>
              ) : (
                /* ADD FORMS */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 pt-4"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <button 
                      onClick={() => setShowAddForm(false)}
                      className="text-[10px] font-pixel opacity-40 uppercase hover:opacity-100"
                    >
                      ← Bumalik
                    </button>
                    <h3 className="font-bold text-sm uppercase">Add New {activeTab === 'utang' ? 'Debt' : 'Sub'}</h3>
                  </div>

                  {activeTab === 'utang' ? (
                    <form onSubmit={handleAddDebt} className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setDebtType('owe')}
                          className={`py-2 rounded-lg font-pixel text-[10px] transition-all ${debtType === 'owe' ? 'bg-white dark:bg-[#1a1c24] shadow-sm text-mallow-light-pink' : 'opacity-40'}`}
                        >
                          UTANG KO
                        </button>
                        <button 
                          type="button"
                          onClick={() => setDebtType('owed')}
                          className={`py-2 rounded-lg font-pixel text-[10px] transition-all ${debtType === 'owed' ? 'bg-white dark:bg-[#1a1c24] shadow-sm text-green-500' : 'opacity-40'}`}
                        >
                          PAUTANG KO
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] font-pixel opacity-40 mb-1 uppercase pl-1">Pangalan</label>
                        <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 border border-transparent focus-within:border-mallow-light-pink transition-all">
                          <User size={16} className="opacity-30 mr-3" />
                          <input 
                            type="text" 
                            value={debtPerson}
                            onChange={(e) => setDebtPerson(e.target.value)}
                            placeholder="Sino?" 
                            className="bg-transparent w-full focus:outline-none font-bold text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-pixel opacity-40 mb-1 uppercase pl-1">Halaga</label>
                        <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 border border-transparent focus-within:border-mallow-light-pink transition-all">
                          <span className="font-bold opacity-30 mr-3">₱</span>
                          <input 
                            type="number" 
                            value={debtAmount}
                            onChange={(e) => setDebtAmount(e.target.value)}
                            placeholder="0.00" 
                            className="bg-transparent w-full focus:outline-none font-bold text-sm"
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-mallow-light-pink text-white font-press-start text-[10px] py-4 rounded-xl shadow-lg active:scale-95 transition-all">
                        RECORD UTANG
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleAddSub} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-pixel opacity-40 mb-1 uppercase pl-1">Serbisyo</label>
                        <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 border border-transparent focus-within:border-mallow-light-blue transition-all">
                          <Repeat size={16} className="opacity-30 mr-3" />
                          <input 
                            type="text" 
                            value={subName}
                            onChange={(e) => setSubName(e.target.value)}
                            placeholder="e.g. Netflix, Spotify" 
                            className="bg-transparent w-full focus:outline-none font-bold text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-pixel opacity-40 mb-1 uppercase pl-1">Halaga kada buwan</label>
                        <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 border border-transparent focus-within:border-mallow-light-blue transition-all">
                          <span className="font-bold opacity-30 mr-3">₱</span>
                          <input 
                            type="number" 
                            value={subAmount}
                            onChange={(e) => setSubAmount(e.target.value)}
                            placeholder="0.00" 
                            className="bg-transparent w-full focus:outline-none font-bold text-sm"
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-mallow-light-blue text-white font-press-start text-[10px] py-4 rounded-xl shadow-lg active:scale-95 transition-all">
                        RECORD SUBS
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

            </div>

            {/* Bottom Accent */}
            <div className={`h-1.5 w-full transition-colors ${activeTab === 'utang' ? 'bg-mallow-light-pink' : 'bg-mallow-light-blue'}`} />
          </motion.div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction.type === 'settle') {
            handleSettleDebt(confirmAction.data, confirmAction.data.balance);
            deleteDebt(confirmAction.id);
          } else if (confirmAction.type === 'pay') {
            logSubPayment(confirmAction.data);
            deleteSubscription(confirmAction.id);
          } else if (confirmAction.type === 'delete_settled') {
            deleteDebt(confirmAction.id);
          }
          setConfirmAction(null);
        }}
        title={
          confirmAction?.type === 'settle' ? 'SETTLE & BURAHIN?' :
          confirmAction?.type === 'pay' ? 'LOG PAYMENT & BURAHIN?' :
          'BURAHIN SA LISTAHAN?'
        }
        message={
          confirmAction?.type === 'settle' ? `Sigurado ka bang nais mong i-settle at burahin ang utang ni "${confirmAction?.name}"?` :
          confirmAction?.type === 'pay' ? `Sigurado ka bang nais mong i-log ang payment at burahin ang subscription na "${confirmAction?.name}"?` :
          `Sigurado ka bang nais mong burahin ang record ni "${confirmAction?.name}"?`
        }
        danger={confirmAction?.type === 'delete_settled'}
        confirmText="SIGE"
        cancelText="HINDI"
      />
    </AnimatePresence>
  );
};

export default DebtsModal;

