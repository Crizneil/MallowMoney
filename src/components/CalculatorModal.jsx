import { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';

const CalculatorModal = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [equationHtml, setEquationHtml] = useState('');

  const formatNumber = (numStr) => {
    if (numStr === 'Error') return 'Error';
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const handleNumber = (num) => {
    audioManager.playSFX('click');
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(prev => prev === '0' ? num : prev + num);
    }
  };

  const calculate = (o1, o2, op) => {
    const v1 = parseFloat(o1);
    const v2 = parseFloat(o2);
    if (op === '+') return v1 + v2;
    if (op === '-') return v1 - v2;
    if (op === '*') return v1 * v2;
    if (op === '/') return v1 / v2;
    return v2;
  };

  const handleOperator = (nextOperator) => {
    audioManager.playSFX('click');
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = calculate(prevValue, inputValue, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
    setEquationHtml(`${formatNumber(String(prevValue || inputValue))} ${nextOperator === '*' ? '×' : nextOperator === '/' ? '÷' : nextOperator}`);
  };

  const performCalculation = () => {
    audioManager.playSFX('click');
    if (!operator) return;

    const inputValue = parseFloat(display);
    const result = calculate(prevValue, inputValue, operator);

    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setEquationHtml('');
  };

  const clear = () => {
    audioManager.playSFX('click');
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setEquationHtml('');
  };

  const backspace = () => {
    audioManager.playSFX('click');
    if (waitingForOperand) return;
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const buttons = [
    { label: 'C', onClick: clear, className: 'text-red-500' },
    { label: '⌫', onClick: backspace, className: 'text-orange-500' },
    { label: '%', onClick: () => setDisplay(String(parseFloat(display) / 100)), className: 'text-mallow-light-blue' },
    { label: '÷', onClick: () => handleOperator('/'), className: 'text-mallow-light-blue' },
    { label: '7', onClick: () => handleNumber('7') },
    { label: '8', onClick: () => handleNumber('8') },
    { label: '9', onClick: () => handleNumber('9') },
    { label: '×', onClick: () => handleOperator('*'), className: 'text-mallow-light-blue' },
    { label: '4', onClick: () => handleNumber('4') },
    { label: '5', onClick: () => handleNumber('5') },
    { label: '6', onClick: () => handleNumber('6') },
    { label: '-', onClick: () => handleOperator('-'), className: 'text-mallow-light-blue' },
    { label: '1', onClick: () => handleNumber('1') },
    { label: '2', onClick: () => handleNumber('2') },
    { label: '3', onClick: () => handleNumber('3') },
    { label: '+', onClick: () => handleOperator('+'), className: 'text-mallow-light-blue' },
    { label: '0', onClick: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', onClick: () => !display.includes('.') && handleNumber('.') },
    { label: '=', onClick: performCalculation, className: 'bg-gradient-to-br from-mallow-light-pink to-orange-400 text-white rounded-xl shadow-lg' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end p-4 pb-8 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className="relative w-full max-w-sm bg-mallow-light-bg dark:bg-space-bg p-6 rounded-3xl shadow-2xl border-2 border-mallow-light-blue dark:border-white/10 pointer-events-auto mt-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-press-start text-mallow-light-text dark:text-white mt-1">CALCULATOR</h2>
              <button onClick={() => { audioManager.playSFX('click'); onClose(); }} className="p-2 opacity-40 hover:opacity-100 bg-black/5 dark:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Display */}
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 mb-4 flex flex-col items-end justify-end h-24">
              <span className="font-pixel text-[10px] opacity-40 mb-1">{equationHtml}</span>
              <span className="font-pixel text-3xl overflow-hidden truncate w-full text-right">{formatNumber(display)}</span>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.onClick}
                  className={`p-4 rounded-xl flex items-center justify-center font-bold text-xl transition-all shadow-sm active:scale-95 ${btn.className || 'bg-white dark:bg-[#1a1c24] border-2 border-black/5 dark:border-white/5 hover:border-black/10'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CalculatorModal;

