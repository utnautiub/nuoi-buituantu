/**
 * Utilities to match and claim donations for logged-in users
 */

import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

/**
 * Claim a donation for the current user
 * This updates the donation document with userId
 */
export async function claimDonation(
  donationId: string,
  userId: string,
  transactionId?: string
): Promise<boolean> {
  try {
    const donationRef = doc(db, "donations", donationId);
    const donationDoc = await getDoc(donationRef);
    
    if (!donationDoc.exists()) {
      console.error("Donation not found:", donationId);
      return false;
    }
    
    const donationData = donationDoc.data();
    
    // Check if already claimed by another user
    if (donationData.userId && donationData.userId !== userId) {
      console.error("Donation already claimed by another user");
      return false;
    }
    
    // Update donation with userId
    await updateDoc(donationRef, {
      userId,
      updatedAt: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error("Failed to claim donation:", error);
    return false;
  }
}

/**
 * Auto-match donations based on transactionId from localStorage
 * This is called when user logs in
 */
export async function autoMatchDonations(
  userId: string,
  transactionIds: string[]
): Promise<number> {
  if (transactionIds.length === 0) return 0;
  
  let matchedCount = 0;
  
  try {
    // Get all donations that match transactionIds and don't have userId yet
    const { collection, query, where, getDocs, updateDoc, doc } = await import("firebase/firestore");
    
    // Query donations by transactionId
    // Note: Firestore doesn't support "in" queries with more than 10 items
    // So we'll batch them
    const batches = [];
    for (let i = 0; i < transactionIds.length; i += 10) {
      batches.push(transactionIds.slice(i, i + 10));
    }
    
    for (const batch of batches) {
      const q = query(
        collection(db, "donations"),
        where("transactionId", "in", batch)
      );
      
      const snapshot = await getDocs(q);
      
      for (const donationDoc of snapshot.docs) {
        const data = donationDoc.data();
        // Only update if userId is not set or is null
        if (!data.userId) {
          await updateDoc(doc(db, "donations", donationDoc.id), {
            userId,
            updatedAt: new Date(),
          });
          matchedCount++;
        }
      }
    }
  } catch (error) {
    console.error("Failed to auto-match donations:", error);
  }
  
  return matchedCount;
}

