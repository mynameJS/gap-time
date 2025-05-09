'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePlanUnloadGuard } from '@/hooks/usePlanUnloadGuard';
import usePlanStore from '@/store/usePlanInfoStore';

export default function PlanRouteGuard() {
  const { planInfo } = usePlanStore();
  const router = useRouter();

  usePlanUnloadGuard();

  useEffect(() => {
    if (!planInfo) {
      router.replace('/');
    }
  }, [planInfo, router]);

  if (true) return null;
}
