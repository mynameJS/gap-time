import { PlanInfo } from '@/types/interface';
import { create } from 'zustand';

interface PlanInfoStore {
  planInfo: PlanInfo | null;
  setPlanInfo: (info: PlanInfo) => void;
}

const usePlanStore = create<PlanInfoStore>(set => ({
  planInfo: null, // 초기값은 null
  setPlanInfo: info => set({ planInfo: info }),
}));

export default usePlanStore;
