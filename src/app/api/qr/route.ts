import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * GET /api/qr
 * Get QR code URL and bank info
 */
export async function GET() {
  try {
    const accountNo = process.env.BANK_ACCOUNT_NO || "0123456789";
    const accountName = process.env.BANK_ACCOUNT_NAME || "BUI TUAN TU";
    const bankBin = process.env.BANK_BIN || "970422";
    const bankName = process.env.BANK_NAME || "MBBank";

    // Generate VietQR URL
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png?addInfo=${encodeURIComponent("Nuôi Bùi Tuấn Tú")}&accountName=${encodeURIComponent(accountName)}`;

    return NextResponse.json({
      success: true,
      qrUrl,
      bankInfo: {
        accountNo,
        accountName,
        bankBin,
        bankName,
      },
    });
  } catch (error) {
    console.error("Failed to generate QR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate QR code",
      },
      { status: 500 }
    );
  }
}

