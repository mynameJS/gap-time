import { create } from 'zustand';
import { PlanInfo } from '@/types/interface';

interface PlanInfoState {
  planInfo: PlanInfo | null;
  setPlanInfo: (info: PlanInfo | null) => void;
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
