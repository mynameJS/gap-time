'use client';
import { useEffect, useRef, useState } from 'react';
import { removeUnloadGuard } from './usePlanUnloadGuard';

export default function usePreventPopStateLeave() {
  const isFirst = useRef(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const handlePopState = () => {
    setShowLeaveDialog(true);
  };

  const confirmLeave = () => {
    setShowLeaveDialog(false);
    window.removeEventListener('popstate', handlePopState);
    removeUnloadGuard();
    window.location.replace('/');
  };

  const cancelLeave = () => {
    window.history.pushState(null, '', window.location.href);
    setShowLeaveDialog(false);
  };

  useEffect(() => {
    if (!isFirst.current) {
      window.history.pushState(null, '', window.location.href);
      isFirst.current = true;
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return {
    showLeaveDialog,
    confirmLeave,
    cancelLeave,
  };
}
