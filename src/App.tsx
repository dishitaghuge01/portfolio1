import React, { useEffect, useState } from 'react';
import { BookProvider } from './contexts/BookContext';
import { spreadsMeta } from './data/spreads';
import Book from './components/book/Book';
import LampChain from './components/book/LampChain';
import type { Theme } from './types/index';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  // Sync theme to document root so CSS token selectors fire
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <BookProvider totalSpreads={spreadsMeta.length}>
        <Book />
      </BookProvider>

      <LampChain theme={theme} onToggle={toggleTheme} />
    </>
  );
};

export default App;