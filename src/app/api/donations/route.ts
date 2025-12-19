import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { Donation } from "@/types/donation";

/**
 * GET /api/donations
 * Fetch all donations (public)
 */
export async function GET(request: NextRequest) {
  try {
    const db = getAdminDb();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    
    // Fetch donations from Firestore
    const donationsRef = db.collection("donations");
    const snapshot = await donationsRef
      .where("status", "==", "completed")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const donations: Donation[] = [];
    let totalAmount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const donation: Donation = {
        id: doc.id,
        transactionId: data.transactionId,
        amount: data.amount,
        description: data.description,
        donorName: data.donorName,
        gateway: data.gateway,
        bankAccount: data.bankAccount,
        bankName: data.bankName,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        metadata: data.metadata,
      };
      donations.push(donation);
      totalAmount += donation.amount;
    });

    return NextResponse.json({
      success: true,
      donations,
      totalDonations: donations.length,
      totalAmount,
    });
  } catch (error) {
    console.error("Failed to fetch donations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch donations",
      },
      { status: 500 }
    );
  }
}

