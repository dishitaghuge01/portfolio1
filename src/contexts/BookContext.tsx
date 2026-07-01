import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FlipDirection = 'forward' | 'backward';

interface BookContextValue {
  currentSpread: number;
  targetSpread: number;
  totalSpreads: number;
  isFlipping: boolean;
  flipDirection: FlipDirection;
  goToSpread: (n: number) => void;
  nextSpread: () => void;
  prevSpread: () => void;
}

interface BookProviderProps {
  children: React.ReactNode;
  totalSpreads: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BookContext = createContext<BookContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const FLIP_DURATION_MS = 600;

export const BookProvider: React.FC<BookProviderProps> = ({
  children,
  totalSpreads,
}) => {
  const [currentSpread, setCurrentSpread] = useState(1);
  const [targetSpread, setTargetSpread] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>('forward');

  // Holds the pending setTimeout so we can clear it if the component unmounts
  // mid-flip (avoids state updates on unmounted components).
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSpread = useCallback(
    (n: number) => {
      // Guard: already animating, same page, or out of range
      if (isFlipping) return;
      if (n === currentSpread) return;
      if (n < 1 || n > totalSpreads) return;

      const direction: FlipDirection = n > currentSpread ? 'forward' : 'backward';
      setFlipDirection(direction);
      setTargetSpread(n);
      setIsFlipping(true);

      // Clear any stale timer (safety net)
      if (flipTimerRef.current !== null) {
        clearTimeout(flipTimerRef.current);
      }

      flipTimerRef.current = setTimeout(() => {
        setCurrentSpread(n);
        setIsFlipping(false);
        flipTimerRef.current = null;
      }, FLIP_DURATION_MS);
    },
    [currentSpread, isFlipping, totalSpreads],
  );

  const nextSpread = useCallback(() => {
    goToSpread(currentSpread + 1);
  }, [goToSpread, currentSpread]);

  const prevSpread = useCallback(() => {
    goToSpread(currentSpread - 1);
  }, [goToSpread, currentSpread]);

  const value = useMemo<BookContextValue>(
    () => ({
      currentSpread,
      targetSpread,
      totalSpreads,
      isFlipping,
      flipDirection,
      goToSpread,
      nextSpread,
      prevSpread,
    }),
    [
      currentSpread,
      targetSpread,
      totalSpreads,
      isFlipping,
      flipDirection,
      goToSpread,
      nextSpread,
      prevSpread,
    ],
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

// ─── Consumer hook ────────────────────────────────────────────────────────────

export const useBook = (): BookContextValue => {
  const ctx = useContext(BookContext);
  if (ctx === null) {
    throw new Error('useBook must be used within a <BookProvider>.');
  }
  return ctx;
};