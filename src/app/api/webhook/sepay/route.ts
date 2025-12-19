import { NextRequest, NextResponse } from "next/server";
import { SePayWebhook } from "@/types/donation";

// Force dynamic rendering (don't run at build time)
export const dynamic = 'force-dynamic';

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
    // SePay format examples:
    // - "NGUYEN VAN A chuyen tien"
    // - "Nuoi Bui Tuan Tu"
    // - "Ma GD: 123456 - NGUYEN VAN A"
    // - "FT25354419443518 Ung ho Bui Tuan Tu"
    let donorName = "Ẩn danh";
    
    if (payload.content) {
      const content = payload.content.trim();
      
      // Remove common prefixes/suffixes
      let cleanContent = content
        .replace(/^(MBVCB|FT)\.\d+\.?/i, '') // Remove MBVCB.123456 or FT123456
        .replace(/Ma GD:?\s*\w+/gi, '') // Remove Ma GD: ABC123
        .replace(/- Ma GD.*$/i, '') // Remove trailing "- Ma GD..."
        .trim();
      
      // Remove common keywords to isolate name
      const keywords = [
        'chuyen tien', 'chuyen khoan', 'ck', 
        'nuoi bui tuan tu', 'nuoi', 
        'ung ho', 'ungho', 'donate', 
        'bui tuan tu', 'buituantu',
        'gui tien', 'guitien'
      ];
      
      // Try to find name before or after keywords
      for (const keyword of keywords) {
        const regex = new RegExp(`(.+?)\\s*${keyword}|${keyword}\\s*(.+?)$`, 'i');
        const match = cleanContent.match(regex);
        if (match) {
          const extracted = (match[1] || match[2] || '').trim();
          if (extracted.length >= 3 && extracted.length <= 50) {
            // Basic validation: should contain letters
            if (/[a-zA-Z\u00C0-\u1EF9]/.test(extracted)) {
              donorName = extracted;
              break;
            }
          }
        }
      }
      
      // If no keyword match, try to extract from beginning (first 2-5 words)
      if (donorName === "Ẩn danh") {
        const words = cleanContent.split(/\s+/);
        if (words.length >= 2 && words.length <= 5) {
          const potentialName = words.slice(0, Math.min(4, words.length)).join(' ');
          if (potentialName.length >= 3 && /[a-zA-Z\u00C0-\u1EF9]/.test(potentialName)) {
            donorName = potentialName;
          }
        }
      }
    }

    // Parse transaction date with Vietnam timezone
    // SePay sends: "2025-12-19 23:36:00" in VN time (UTC+7)
    const parseVNDate = (dateString: string): Date => {
      // Format: "2025-12-19 23:36:00" → "2025-12-19T23:36:00+07:00"
      const isoString = dateString.replace(' ', 'T') + '+07:00';
      return new Date(isoString);
    };

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
      // Store both: original string and parsed Date
      transactionDate: payload.transactionDate, // Original string from SePay
      createdAt: parseVNDate(payload.transactionDate), // Parsed Date for sorting
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

