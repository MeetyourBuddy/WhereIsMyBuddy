import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to scroll to top of page on mount or route change
 * @param dependencies - Additional dependencies to trigger scroll (e.g., step changes)
 */
export const useScrollToTop = (dependencies: any[] = []) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location.pathname, ...dependencies]);
};

/**
 * Hook to scroll to top immediately (without smooth behavior)
 * Useful for preventing scroll issues when inputs auto-focus
 */
export const useScrollToTopImmediate = (dependencies: any[] = []) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0);
  }, [location.pathname, ...dependencies]);
};

