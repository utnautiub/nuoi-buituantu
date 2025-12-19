import { NextRequest, NextResponse } from "next/server";
import { SePayWebhook } from "@/types/donation";

// Force dynamic rendering (don't run at build time)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * POST /api/webhook/sepay
 * Receive webhook from SePay
 * 
 * SePay Webhook Documentation:
 * https://sepay.vn/tai-lieu-tich-hop
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.SEPAY_WEBHOOK_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload: SePayWebhook = await request.json();

    console.log("Received SePay webhook:", payload);

    // Validate required fields
    if (!payload.transferAmount || !payload.content) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Lazy import to avoid build-time execution
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();

    // Check if transaction already exists
    const existingDoc = await db
      .collection("donations")
      .where("transactionId", "==", payload.id)
      .limit(1)
      .get();

    if (!existingDoc.empty) {
      console.log("Transaction already processed:", payload.id);
      return NextResponse.json({
        success: true,
        message: "Transaction already processed",
      });
    }

    // Extract donor name from content (if exists)
    // Example content: "NGUYEN VAN A chuyen tien"
    const contentUpper = payload.content.toUpperCase();
    let donorName = "Ẩn danh";
    
    // Try to extract name (simple pattern matching)
    const nameMatch = contentUpper.match(/^([A-Z\s]+?)(?:CHUYEN|TIEN|NUOI|UNG HO)/);
    if (nameMatch && nameMatch[1].trim().length > 2) {
      donorName = nameMatch[1].trim();
    }

    // Create donation record
    const donation = {
      transactionId: payload.id,
      amount: payload.transferAmount,
      description: payload.content,
      donorName,
      gateway: "sepay",
      bankAccount: payload.accountNumber,
      bankName: payload.gateway || "Unknown",
      status: "completed",
      createdAt: new Date(payload.transactionDate),
      metadata: {
        code: payload.code,
        transferType: payload.transferType,
        accumulated: payload.accumulated,
        referenceCode: payload.referenceCode,
        rawDescription: payload.description,
      },
    };

    // Save to Firestore
    await db.collection("donations").add(donation);

    console.log("Donation saved successfully:", donation);

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhook/sepay
 * Test endpoint to verify webhook is accessible
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "SePay webhook endpoint is ready",
    timestamp: new Date().toISOString(),
  });
}

