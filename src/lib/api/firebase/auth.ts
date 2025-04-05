import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './init';
import { FirebaseError } from 'firebase/app';
import { UserInfo } from '@/types/interface';

// 인증코드 이메일 전송
export async function sendVerificationCode(email: string, code: string) {
  try {
    const response = await fetch('/api/firebase/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '이메일 전송 실패');

    return true;
  } catch (error) {
    throw error;
  }
}

interface SignUpData {
  email: string;
  password: string;
  nickname: string;
}

// 회원가입
export const registerUser = async ({ email, password, nickname }: SignUpData) => {
  try {
    // 1. Authentication 등록
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Firestore에 유저 정보 저장
    await setDoc(doc(db, 'users', uid), {
      email,
      nickname,
      createdAt: serverTimestamp(),
    });

    return { success: true, uid };
  } catch (err) {
    if (err instanceof FirebaseError) {
      console.error('Firestore FirebaseError:', err.code, err.message);
    } else {
      console.error('Firestore Unknown Error:', err);
    }
  }
};

interface LoginData {
  email: string;
  password: string;
}

// 로그인
export const loginUser = async ({ email, password }: LoginData) => {
  try {
    // 1. Firebase Authentication으로 로그인
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;

    // 2. Firestore에서 유저 정보 가져오기
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    const userData = userDocSnap.data();

    // 3. 세션 스토리지에 사용자 정보 저장
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        email: user.email,
        nickname: userData.nickname,
        createdAt: userData.createdAt,
        uid,
      })
    );

    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error('로그인 중 문제가 발생했습니다.');
    }
  }
};

// 로그아웃
export const logoutUser = async () => {
  try {
    await signOut(auth);
    sessionStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return { success: false, message: '로그아웃에 실패했습니다.' };
  }
};

// 소셜로그인
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user.email) throw new Error('이메일 정보를 가져올 수 없습니다.');

    // Firestore에 유저 정보가 이미 있는지 확인
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // 새로 가입한 사용자일 경우 Firestore에 정보 저장
      await setDoc(userRef, {
        email: user.email,
        nickname: user.displayName || 'unknown',
        createdAt: serverTimestamp(),
        provider: 'google',
      });
    }

    const userData = userSnap.data();

    // 세션 스토리지에 사용자 정보 저장
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        email: user.email,
        nickname: userData?.nickname || user.displayName || 'unknown',
        uid: user.uid,
        provider: 'google',
      })
    );

    return { success: true };
  } catch (error: any) {
    console.error('Google 로그인 실패:', error);
    return { success: false, message: error.message || '소셜 로그인에 실패했습니다.' };
  }
};

// 유저 닉네임 업데이트
export const updateUserNickname = async (uid: string, nickname: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { nickname });

    // 세션스토리지 동기화
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      parsed.nickname = nickname;
      sessionStorage.setItem('user', JSON.stringify(parsed));
    }

    return { success: true };
  } catch (error) {
    console.error('닉네임 업데이트 실패:', error);
    return { success: false, message: '닉네임 업데이트에 실패했습니다.' };
  }
};

// 유저 정보 가져오기
export const getUserInfo = async (uid: string): Promise<UserInfo> => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }

  return snap.data() as UserInfo;
};

// 회원탈퇴
// 비밀번호 재인증 후 계정 삭제
// Google 로그인 계정은 비밀번호 재인증 없이 삭제 가능
export const deleteUserAccount = async ({
  email,
  password,
  uid,
  provider = 'password', // provider 기본값 'password'
}: {
  email: string;
  password?: string;
  uid: string;
  provider?: 'password' | 'google';
}) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('현재 로그인된 유저가 없습니다.');

    // 재인증 (로그인 방식에 따라 분기)
    if (provider === 'password') {
      if (!password) throw new Error('비밀번호가 필요합니다.');
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
    } else if (provider === 'google') {
      const googleProvider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, googleProvider);
    }

    // 인증 계정 삭제
    await deleteUser(user);

    // Firestore의 유저 문서 삭제
    await deleteDoc(doc(db, 'users', uid));

    // 세션스토리지 정리
    sessionStorage.clear();

    return { success: true };
  } catch (error: any) {
    console.error('회원탈퇴 오류:', error);
    return {
      success: false,
      message:
        error.code === 'auth/popup-closed-by-user'
          ? 'Google 인증 창이 닫혔습니다.'
          : error.message || '회원탈퇴에 실패했습니다.',
    };
  }
};
