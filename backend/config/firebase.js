import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Usually, initialized with serviceAccount json, but for dummy/sandbox mode
// we can mock it or use an empty cert if we are just demonstrating,
// however, to be functional, a valid service account json is strictly needed.
// For now, if the user provides FIREBASE_SERVICE_ACCOUNT_BASE64, we use it.
if (!admin.apps.length) {
    try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
            ? JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii'))
            : undefined;

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            console.warn("Firebase Admin SDK not fully initialized without service account. Using default locally instantiated (mock) app features may fail.");
            // Just initialize default empty for syntax without throwing if only types are needed, but runtime queries will fail.
            admin.initializeApp();
        }
    } catch (error) {
        console.error("Firebase config error:", error);
        admin.initializeApp();
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
