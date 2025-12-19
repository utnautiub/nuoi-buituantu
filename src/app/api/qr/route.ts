import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * GET /api/qr
 * Get QR code URL and bank info
 */
export async function GET(request: Request) {
  try {
    const accountNo = process.env.BANK_ACCOUNT_NO || "0123456789";
    const accountName = process.env.BANK_ACCOUNT_NAME || "BUI TUAN TU";
    const bankBin = process.env.BANK_BIN || "970422";
    const bankName = process.env.BANK_NAME || "MBBank";

    // Get query parameters for amount and description
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get("amount") || "";
    const description = searchParams.get("des") || "";

    // Generate SePay QR URL with qronly template
    // https://qr.sepay.vn/img?acc=SO_TAI_KHOAN&bank=NGAN_HANG&amount=SO_TIEN&des=NOI_DUNG&template=qronly
    const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(accountNo)}&bank=${encodeURIComponent(bankName)}&amount=${encodeURIComponent(amount)}&des=${encodeURIComponent(description)}&template=qronly`;

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

