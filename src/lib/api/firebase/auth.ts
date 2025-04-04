import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './init';
import { FirebaseError } from 'firebase/app';

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
