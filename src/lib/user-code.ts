/**
 * User code generation and management
 * Generates unique codes for users to identify their donations
 */

import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Generate a short code from user ID
 * Format: BTT-XXXXXX (6 alphanumeric chars)
 */
function generateShortCode(uid: string): string {
  // Use first 8 chars of uid hash
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    const char = uid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to base36 and take first 6 chars
  const code = Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padStart(6, '0');
  return `BTT-${code}`;
}

/**
 * Get or create user code
 * Returns format: "BTT-ABC123"
 */
export async function getUserCode(userId: string): Promise<string> {
  try {
    const codeDocRef = doc(db, "user_codes", userId);
    const codeDoc = await getDoc(codeDocRef);
    
    if (codeDoc.exists()) {
      return codeDoc.data().code;
    }
    
    // Generate new code
    const code = generateShortCode(userId);
    
    // Save to Firestore
    await setDoc(codeDocRef, {
      code,
      userId,
      createdAt: new Date(),
    });
    
    return code;
  } catch (error) {
    console.error("Failed to get user code:", error);
    // Fallback: generate code without saving
    return generateShortCode(userId);
  }
}

/**
 * Extract user code from description
 * Looks for pattern: "BTT-XXXXXX" or "BTTXXXXXX"
 */
export function extractUserCode(description: string): string | null {
  if (!description) return null;
  
  // Match "BTT-XXXXXX" or "BTTXXXXXX" (case insensitive)
  const match = description.match(/BTT[-]?([A-Z0-9]{6})/i);
  if (match) {
    return `BTT-${match[1].toUpperCase()}`;
  }
  
  return null;
}

/**
 * Get userId from code
 */
export async function getUserIdFromCode(code: string): Promise<string | null> {
  try {
    // Query user_codes collection by code
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    
    const q = query(
      collection(db, "user_codes"),
      where("code", "==", code.toUpperCase())
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data().userId;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to get userId from code:", error);
    return null;
  }
}


