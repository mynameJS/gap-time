'use client';
import { useEffect } from 'react';

let removeUnloadGuard: () => void = () => {};

export function usePlanUnloadGuard() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    removeUnloadGuard = () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

export { removeUnloadGuard };
