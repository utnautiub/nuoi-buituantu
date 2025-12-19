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
    // Verify webhook with API Key (SePay format: "Authorization: Apikey YOUR_KEY")
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.SEPAY_WEBHOOK_SECRET;

    // SePay sends: "Apikey YOUR_KEY" or "Bearer YOUR_KEY"
    const isValidApiKey = authHeader === `Apikey ${expectedSecret}`;
    const isValidBearer = authHeader === `Bearer ${expectedSecret}`;

    if (!expectedSecret || (!isValidApiKey && !isValidBearer)) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload: SePayWebhook = await request.json();

    console.log("Received SePay webhook:", payload);

    // Validate required fields
    if (!payload.transferAmount || !payload.content) {
      return NextResponse.json(
        { success: false },
        { status: 400 }
      );
    }

    // Lazy import to avoid build-time execution
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();

    // Check if transaction already exists (prevent duplicate)
    const existingDoc = await db
      .collection("donations")
      .where("transactionId", "==", payload.id.toString())
      .limit(1)
      .get();

    if (!existingDoc.empty) {
      console.log("Transaction already processed:", payload.id);
      // Return 201 for success as per SePay docs
      return NextResponse.json(
        { success: true },
        { status: 201 }
      );
    }

    // Extract donor name from content
    // Example: "NGUYEN VAN A chuyen tien" or "chuyen tien NGUYEN VAN A"
    const contentUpper = payload.content.toUpperCase();
    let donorName = "Ẩn danh";
    
    // Try to extract name from beginning
    const nameMatch = contentUpper.match(/^([A-Z\s]+?)(?:CHUYEN|TIEN|NUOI|UNG HO|DONATE)/);
    if (nameMatch && nameMatch[1].trim().length > 2) {
      donorName = nameMatch[1].trim();
    }

    // Create donation record
    const donation = {
      transactionId: payload.id.toString(),
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

    // Return 201 for success as per SePay documentation
    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhook/sepay
 * Test endpoint to verify webhook is accessible
 */
export async function GET() {
  return NextResponse.json(
    { success: true },
    { status: 200 }
  );
}

