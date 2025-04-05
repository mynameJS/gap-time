import { create } from 'zustand';
import { ScheduleBlock } from '@/types/interface';

interface SelectedPlanState {
  selectedPlan: ScheduleBlock[] | null;
  setSelectedPlan: (plan: ScheduleBlock[]) => void;
  clearSelectedPlan: () => void;
}

const useSelectedPlanStore = create<SelectedPlanState>(set => ({
  selectedPlan: null,
  setSelectedPlan: plan => set({ selectedPlan: plan }),
  clearSelectedPlan: () => set({ selectedPlan: null }),
}));

export default useSelectedPlanStore;
