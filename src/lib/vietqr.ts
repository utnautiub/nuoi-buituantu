/**
 * VietQR API Integration
 * Docs: https://www.vietqr.io/danh-sach-api
 */

export interface VietQRParams {
  accountNo: string;
  accountName: string;
  acqId: string; // Bank BIN
  amount?: number;
  addInfo?: string;
  format?: "text" | "binary";
  template?: "compact" | "compact2" | "print" | "qr_only";
}

/**
 * Generate VietQR URL
 */
export function generateVietQRUrl(params: VietQRParams): string {
  const {
    accountNo,
    accountName,
    acqId,
    amount = 0,
    addInfo = "",
    format = "text",
    template = "compact2",
  } = params;

  const baseUrl = "https://img.vietqr.io/image";
  
  // URL format: https://img.vietqr.io/image/[ACQ_ID]-[ACCOUNT_NO]-[TEMPLATE].png
  let url = `${baseUrl}/${acqId}-${accountNo}-${template}.png`;
  
  const queryParams = new URLSearchParams();
  
  if (amount > 0) {
    queryParams.append("amount", amount.toString());
  }
  
  if (addInfo) {
    queryParams.append("addInfo", addInfo);
  }
  
  queryParams.append("accountName", accountName);
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
}

/**
 * Generate VietQR API v2 (Quick Link)
 */
export function generateVietQRQuickLink(params: VietQRParams): string {
  const {
    accountNo,
    accountName,
    acqId,
    amount = 0,
    addInfo = "",
  } = params;

  const baseUrl = "https://api.vietqr.io/v2/generate";
  
  return `${baseUrl}?acqId=${acqId}&accountNo=${accountNo}&accountName=${encodeURIComponent(accountName)}&amount=${amount}&addInfo=${encodeURIComponent(addInfo)}`;
}

/**
 * Fetch QR code as data URL
 */
export async function fetchQRAsDataUrl(qrUrl: string): Promise<string> {
  try {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to fetch QR code:", error);
    throw error;
  }
}



