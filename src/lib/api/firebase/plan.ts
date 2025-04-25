import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { ScheduleBlock, PlanWithSchedule } from '@/types/interface';
import { db } from './init';

// 생성 일정 데이터 추가
export async function addPlanToUser(uid: string, newPlan: ScheduleBlock[], creationAddress: string) {
  try {
    const plansRef = collection(db, 'users', uid, 'plans');
    await addDoc(plansRef, {
      createdAt: serverTimestamp(),
      creationAddress: creationAddress, // 일정 생성 시 위치 저장
      planName: null,
      schedule: newPlan, // ✅ 이 안에 배열로 저장하면 Firestore 허용
    });
    console.log('일정 저장 성공');
  } catch (error) {
    console.error('일정 저장 실패:', error);
  }
}

// 사용자 일정 데이터 가져오기
// 🔥 최신순 정렬
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
        createdAddress: data.creationAddress,
        planName: data.planName,
        schedule,
      });
    });

    return result;
  } catch (error) {
    console.error('일정 불러오기 실패:', error);
    return [];
  }
}

// 사용자 일정 데이터 가져오기 (createdAt 기준);
export const getPlanByCreatedAt = async (uid: string, createdAt: number): Promise<PlanWithSchedule | null> => {
  try {
    const plansRef = collection(db, 'users', uid, 'plans');
    const q = query(plansRef, where('createdAt', '==', createdAt));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      schedule: data.schedule,
      createdAt: data.createdAt,
      createdAddress: data.creationAddress,
      planName: data.planName,
    };
  } catch (error) {
    console.error('🔥 getPlanByCreatedAt 오류:', error);
    return null;
  }
};

// 사용자 특정 일정 데이터 삭제하기
export const deletePlanByCreatedAt = async (uid: string, createdAt: string) => {
  try {
    const plansRef = collection(db, 'users', uid, 'plans');

    // ✅ string → Date → Timestamp 변환
    const timestamp = Timestamp.fromDate(new Date(createdAt));

    const q = query(plansRef, where('createdAt', '==', timestamp));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return;
    }

    const targetDoc = querySnapshot.docs[0];
    await deleteDoc(doc(db, 'users', uid, 'plans', targetDoc.id));
  } catch (error) {
    console.error('🔥 deletePlanByCreatedAt 오류:', error);
  }
};

// 사용자 특정 일정의 제목 수정하기
export const updatePlanNameByCreatedAt = async (uid: string, createdAt: string, newName: string) => {
  try {
    const plansRef = collection(db, 'users', uid, 'plans');

    // ✅ string → Date → Timestamp 변환
    const timestamp = Timestamp.fromDate(new Date(createdAt));

    const q = query(plansRef, where('createdAt', '==', timestamp));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('🛑 해당 일정이 존재하지 않습니다.');
      return;
    }

    const targetDoc = querySnapshot.docs[0];

    await updateDoc(doc(db, 'users', uid, 'plans', targetDoc.id), {
      planName: newName,
    });

    console.log('✅ 일정 이름이 수정되었습니다.');
  } catch (error) {
    console.error('🔥 updatePlanNameByCreatedAt 오류:', error);
  }
};
