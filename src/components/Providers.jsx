'use client';

import { CurrencyProvider } from '../context/CurrencyContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { BookingProvider } from '../context/BookingContext';

export default function Providers({ children }) {
  return (
    <CurrencyProvider>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <BookingProvider>{children}</BookingProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </CurrencyProvider>
  );
}
