import { db } from './init';
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { ScheduleBlock, PlanWithSchedule } from '@/types/interface';

// 생성 일정 데이터 추가
export async function addPlanToUser(uid: string, newPlan: ScheduleBlock[]) {
  try {
    const plansRef = collection(db, 'users', uid, 'plans');
    await addDoc(plansRef, {
      createdAt: serverTimestamp(),
      schedule: newPlan, // ✅ 이 안에 배열로 저장하면 Firestore 허용
    });
    console.log('일정 저장 성공');
  } catch (error) {
    console.error('일정 저장 실패:', error);
  }
}

export async function getUserPlansWithSchedule(uid: string): Promise<PlanWithSchedule[]> {
  try {
    const plansRef = collection(db, 'users', uid, 'plans');
    const q = query(plansRef, orderBy('createdAt', 'desc')); // 🔥 최신순 정렬

    const snapshot = await getDocs(q);

    const result: PlanWithSchedule[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      const createdAtTimestamp = data.createdAt as Timestamp;
      const schedule = Array.isArray(data.schedule) ? (data.schedule as ScheduleBlock[]) : [];

      result.push({
        createdAt: createdAtTimestamp?.toDate().toISOString() ?? '',
        schedule,
      });
    });

    return result;
  } catch (error) {
    console.error('일정 불러오기 실패:', error);
    return [];
  }
}
