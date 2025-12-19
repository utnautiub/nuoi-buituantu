import { NextRequest, NextResponse } from "next/server";
import { Donation } from "@/types/donation";

// Force dynamic rendering (don't run at build time)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * GET /api/donations
 * Fetch all donations (public)
 */
export async function GET(request: NextRequest) {
  try {
    // Lazy import to avoid build-time execution
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    
    // Fetch donations from Firestore
    const donationsRef = db.collection("donations");
    
    // Simple query without index requirement (temporary)
    // TODO: Create composite index for status + createdAt query
    const snapshot = await donationsRef
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    
    // Filter by status in memory (temporary workaround)
    // Remove this after creating Firestore index

    const donations: Donation[] = [];
    let totalAmount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Filter by status (temporary until index is created)
      if (data.status !== "completed") return;
      
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

