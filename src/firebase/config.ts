// Firebase Configuration
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

type FirebaseConfigKeys =
    | 'apiKey'
    | 'authDomain'
    | 'projectId'
    | 'storageBucket'
    | 'messagingSenderId'
    | 'appId';

const firebaseConfig: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
};

export const missingFirebaseKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key as FirebaseConfigKeys);

export const isFirebaseConfigured = missingFirebaseKeys.length === 0;
export const firebaseConfigError = !isFirebaseConfigured
    ? `Missing Firebase environment variable(s): ${missingFirebaseKeys.join(', ')}`
    : null;

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;

export default firebaseApp;
