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
type PageSide = 'left' | 'right';

interface BookContextValue {
  // Desktop — spread-level navigation
  currentSpread: number;
  targetSpread: number;
  totalSpreads: number;
  goToSpread: (n: number, side?: PageSide) => void;
  nextSpread: () => void;
  prevSpread: () => void;

  // Mobile — page-level navigation
  currentPage: number;
  targetPage: number;
  totalPages: number;
  currentPageSide: PageSide;
  goToPage: (n: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Shared flip animation state (desktop and mobile are never both mounted,
  // so a single lock/timer serves both navigation modes)
  isFlipping: boolean;
  flipDirection: FlipDirection;
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
  const totalPages = totalSpreads * 2;

  const [currentSpread, setCurrentSpread] = useState(1);
  const [targetSpread, setTargetSpread] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [targetPage, setTargetPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>('forward');

  const currentPageSide: PageSide = currentPage % 2 === 1 ? 'left' : 'right';

  // Holds the pending setTimeout so we can clear it if the component unmounts
  // mid-flip (avoids state updates on unmounted components). Shared by both
  // spread-level and page-level navigation since only one is active at a time.
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSpread = useCallback(
    (n: number, side: PageSide = 'left') => {
      // Guard: already animating, same page, or out of range
      if (isFlipping) return;
      if (n === currentSpread) return;
      if (n < 1 || n > totalSpreads) return;

      const direction: FlipDirection = n > currentSpread ? 'forward' : 'backward';
      const correspondingPage = side === 'left' ? (n - 1) * 2 + 1 : (n - 1) * 2 + 2;

      setFlipDirection(direction);
      setTargetSpread(n);
      setTargetPage(correspondingPage);
      setIsFlipping(true);

      // Clear any stale timer (safety net)
      if (flipTimerRef.current !== null) {
        clearTimeout(flipTimerRef.current);
      }

      flipTimerRef.current = setTimeout(() => {
        setCurrentSpread(n);
        setCurrentPage(correspondingPage);
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

  const goToPage = useCallback(
    (n: number) => {
      // Guard: already animating, same page, or out of range
      if (isFlipping) return;
      if (n === currentPage) return;
      if (n < 1 || n > totalPages) return;

      const direction: FlipDirection = n > currentPage ? 'forward' : 'backward';
      const correspondingSpread = Math.ceil(n / 2);

      setFlipDirection(direction);
      setTargetPage(n);
      setTargetSpread(correspondingSpread);
      setIsFlipping(true);

      // Clear any stale timer (safety net)
      if (flipTimerRef.current !== null) {
        clearTimeout(flipTimerRef.current);
      }

      flipTimerRef.current = setTimeout(() => {
        setCurrentPage(n);
        setCurrentSpread(correspondingSpread);
        setIsFlipping(false);
        flipTimerRef.current = null;
      }, FLIP_DURATION_MS);
    },
    [currentPage, isFlipping, totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [goToPage, currentPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [goToPage, currentPage]);

  const value = useMemo<BookContextValue>(
    () => ({
      currentSpread,
      targetSpread,
      totalSpreads,
      goToSpread,
      nextSpread,
      prevSpread,
      currentPage,
      targetPage,
      totalPages,
      currentPageSide,
      goToPage,
      nextPage,
      prevPage,
      isFlipping,
      flipDirection,
    }),
    [
      currentSpread,
      targetSpread,
      totalSpreads,
      goToSpread,
      nextSpread,
      prevSpread,
      currentPage,
      targetPage,
      totalPages,
      currentPageSide,
      goToPage,
      nextPage,
      prevPage,
      isFlipping,
      flipDirection,
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