'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CurrencyContext = createContext(null);

export const currencies = {
  IDR: { code: 'IDR', symbol: 'Rp', rate: 1, flag: '🇮🇩' },
  USD: { code: 'USD', symbol: '$', rate: 0.000059, flag: '🇺🇸' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 0.000086, flag: '🇦🇺' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(currencies.IDR);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('htb_currency');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && currencies[saved]) setCurrency(currencies[saved]);
    } catch { /* ignore */ }
  }, []);

  const changeCurrency = useCallback((code) => {
    if (currencies[code]) {
      setCurrency(currencies[code]);
      localStorage.setItem('htb_currency', code);
    }
  }, []);

  const formatPrice = useCallback((idrAmount) => {
    if (idrAmount === null || idrAmount === undefined) return '';
    
    const amount = idrAmount * currency.rate;
    
    if (currency.code === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(idrAmount);
    }

    // For USD/AUD show 2 decimal places or round if preferred
    return `${currency.symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }, [currency]);

  const value = {
    currency,
    changeCurrency,
    formatPrice,
    allCurrencies: Object.values(currencies)
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
