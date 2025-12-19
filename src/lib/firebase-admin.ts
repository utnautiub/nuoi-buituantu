/**
 * Firebase Admin SDK Configuration (Server-side only)
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App;
let adminDb: Firestore;

/**
 * Initialize Firebase Admin SDK
 * This should only be called on the server side
 */
export function getAdminApp(): App {
  if (adminApp) return adminApp;

  if (getApps().length === 0) {
    // Check if credentials exist (prevent build-time errors)
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
      throw new Error(
        "Firebase Admin credentials not found. Please set FIREBASE_ADMIN_PROJECT_ID environment variable."
      );
    }

    // Parse the private key (handle escaped newlines)
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    );

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  return adminApp;
}

/**
 * Get Firestore Admin instance
 */
export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

