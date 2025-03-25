import { PlanInfo } from '@/types/interface';
import { create } from 'zustand';

interface PlanInfoState {
  planInfo: PlanInfo | null;
  setPlanInfo: (info: PlanInfo) => void;
  updatePlanInfo: (updates: Partial<PlanInfo>) => void;
}

const usePlanStore = create<PlanInfoState>(set => ({
  planInfo: null,
  setPlanInfo: info => set({ planInfo: info }),
  updatePlanInfo: updates =>
    set(state => ({
      planInfo: state.planInfo ? { ...state.planInfo, ...updates } : null,
    })),
}));

export default usePlanStore;
