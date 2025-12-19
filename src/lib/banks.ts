/**
 * Bank data for Vietnam
 * Source: VietQR supported banks
 */

export interface Bank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  swiftCode?: string;
  // Deep link schemes for mobile apps
  iosScheme?: string;
  androidPackage?: string;
  universalLink?: string;
}

export const VIETNAMESE_BANKS: Bank[] = [
  {
    id: "mbbank",
    name: "Ngân hàng Quân Đội",
    code: "MB",
    bin: "970422",
    shortName: "MBBank",
    logo: "https://api.vietqr.io/img/MB.png",
    swiftCode: "MSCBVNVX",
    iosScheme: "mbmobilebanking://",
    androidPackage: "com.mbmobile",
  },
  {
    id: "vietcombank",
    name: "Ngân hàng Ngoại Thương Việt Nam",
    code: "VCB",
    bin: "970436",
    shortName: "Vietcombank",
    logo: "https://api.vietqr.io/img/VCB.png",
    swiftCode: "BFTVVNVX",
    iosScheme: "vcbdigibank://",
    androidPackage: "com.VCB",
  },
  {
    id: "vietinbank",
    name: "Ngân hàng Công Thương Việt Nam",
    code: "CTG",
    bin: "970415",
    shortName: "VietinBank",
    logo: "https://api.vietqr.io/img/CTG.png",
    swiftCode: "ICBVVNVX",
    iosScheme: "vietinbank://",
    androidPackage: "com.vietinbank.ipay",
  },
  {
    id: "bidv",
    name: "Ngân hàng Đầu Tư và Phát Triển Việt Nam",
    code: "BIDV",
    bin: "970418",
    shortName: "BIDV",
    logo: "https://api.vietqr.io/img/BIDV.png",
    swiftCode: "BIDVVNVX",
    iosScheme: "bidvsmartbanking://",
    androidPackage: "com.vnpay.bidv",
  },
  {
    id: "agribank",
    name: "Ngân hàng Nông Nghiệp và Phát Triển Nông Thôn",
    code: "VBA",
    bin: "970405",
    shortName: "Agribank",
    logo: "https://api.vietqr.io/img/VBA.png",
    swiftCode: "VBAAVNVX",
    iosScheme: "agribank://",
    androidPackage: "com.vnpay.Agribank3g",
  },
  {
    id: "techcombank",
    name: "Ngân hàng Kỹ Thương Việt Nam",
    code: "TCB",
    bin: "970407",
    shortName: "Techcombank",
    logo: "https://api.vietqr.io/img/TCB.png",
    swiftCode: "VTCBVNVX",
    iosScheme: "techcombank://",
    androidPackage: "com.techcombank.bb.app",
  },
  {
    id: "acb",
    name: "Ngân hàng Á Châu",
    code: "ACB",
    bin: "970416",
    shortName: "ACB",
    logo: "https://api.vietqr.io/img/ACB.png",
    swiftCode: "ASCBVNVX",
    iosScheme: "acbapp://",
    androidPackage: "mobile.acb.com.vn",
  },
  {
    id: "vpbank",
    name: "Ngân hàng Việt Nam Thịnh Vượng",
    code: "VPB",
    bin: "970432",
    shortName: "VPBank",
    logo: "https://api.vietqr.io/img/VPB.png",
    swiftCode: "VPBKVNVX",
    iosScheme: "vpbankonline://",
    androidPackage: "com.vnpay.vpbankonline",
  },
  {
    id: "tpbank",
    name: "Ngân hàng Tiên Phong",
    code: "TPB",
    bin: "970423",
    shortName: "TPBank",
    logo: "https://api.vietqr.io/img/TPB.png",
    swiftCode: "TPBVVNVX",
    iosScheme: "tpbank://",
    androidPackage: "com.tpb.mb.gpblandroid",
  },
  {
    id: "sacombank",
    name: "Ngân hàng Sài Gòn Thương Tín",
    code: "STB",
    bin: "970403",
    shortName: "Sacombank",
    logo: "https://api.vietqr.io/img/STB.png",
    swiftCode: "SGTTVNVX",
    iosScheme: "sacombank://",
    androidPackage: "com.sacombank.mbanking",
  },
  {
    id: "hdbank",
    name: "Ngân hàng Phát Triển Thành Phố Hồ Chí Minh",
    code: "HDB",
    bin: "970437",
    shortName: "HDBank",
    logo: "https://api.vietqr.io/img/HDB.png",
    swiftCode: "HDBCVNVX",
    iosScheme: "hdbank://",
    androidPackage: "com.vnpay.hdbank",
  },
  {
    id: "shb",
    name: "Ngân hàng Sài Gòn - Hà Nội",
    code: "SHB",
    bin: "970443",
    shortName: "SHB",
    logo: "https://api.vietqr.io/img/SHB.png",
    swiftCode: "SHBAVNVX",
    iosScheme: "shb://",
    androidPackage: "vn.shb.mbanking",
  },
  {
    id: "msb",
    name: "Ngân hàng Hàng Hải Việt Nam",
    code: "MSB",
    bin: "970426",
    shortName: "MSB",
    logo: "https://api.vietqr.io/img/MSB.png",
    swiftCode: "MCOBVNVX",
    iosScheme: "msb://",
    androidPackage: "com.msb.mbanking",
  },
  {
    id: "ocb",
    name: "Ngân hàng Phương Đông",
    code: "OCB",
    bin: "970448",
    shortName: "OCB",
    logo: "https://api.vietqr.io/img/OCB.png",
    swiftCode: "ORCOVNVX",
    iosScheme: "ocb://",
    androidPackage: "vn.com.ocb.mobilebanking",
  },
  {
    id: "seabank",
    name: "Ngân hàng TNHH MTV Đông Nam Á",
    code: "SEAB",
    bin: "970440",
    shortName: "SeABank",
    logo: "https://api.vietqr.io/img/SEAB.png",
    swiftCode: "SEAVVNVX",
    iosScheme: "seabank://",
    androidPackage: "vn.seabank.mb",
  },
];

/**
 * Search banks by name or code
 */
export function searchBanks(query: string): Bank[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return VIETNAMESE_BANKS;

  return VIETNAMESE_BANKS.filter(
    (bank) =>
      bank.name.toLowerCase().includes(lowerQuery) ||
      bank.shortName.toLowerCase().includes(lowerQuery) ||
      bank.code.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get bank by BIN or code
 */
export function getBankByBin(bin: string): Bank | undefined {
  return VIETNAMESE_BANKS.find((bank) => bank.bin === bin);
}

export function getBankByCode(code: string): Bank | undefined {
  return VIETNAMESE_BANKS.find(
    (bank) => bank.code.toLowerCase() === code.toLowerCase()
  );
}

