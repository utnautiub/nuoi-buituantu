"use client";

import * as React from "react";
import { Search, ChevronDown, ExternalLink, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bank, VIETNAMESE_BANKS, searchBanks } from "@/lib/banks";
import { openBankingApp, openAppStore, getMobilePlatform } from "@/lib/deep-linking";
import Image from "next/image";

interface BankSelectorProps {
  onBankSelect?: (bank: Bank) => void;
}

export function BankSelector({ onBankSelect }: BankSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedBank, setSelectedBank] = React.useState<Bank | null>(null);
  const [filteredBanks, setFilteredBanks] = React.useState<Bank[]>(VIETNAMESE_BANKS);
  const [showInstructions, setShowInstructions] = React.useState(false);

  const platform = getMobilePlatform();
  const isMobile = platform !== "other";

  React.useEffect(() => {
    setFilteredBanks(searchBanks(searchQuery));
  }, [searchQuery]);

  const handleBankClick = async (bank: Bank) => {
    setSelectedBank(bank);
    onBankSelect?.(bank);

    if (isMobile) {
      const opened = await openBankingApp(bank);
      
      if (!opened) {
        setShowInstructions(true);
      }
    } else {
      // Desktop: Show instructions
      setShowInstructions(true);
    }
    
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Bank Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedBank ? (
              <>
                <Image
                  src={selectedBank.logo}
                  alt={selectedBank.shortName}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="font-medium">{selectedBank.shortName}</span>
              </>
            ) : (
              <span className="text-gray-500">Chọn ngân hàng của bạn</span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm ngân hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            {/* Bank List */}
            <div className="overflow-y-auto max-h-80">
              {filteredBanks.length > 0 ? (
                filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankClick(bank)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <Image
                      src={bank.logo}
                      alt={bank.shortName}
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{bank.shortName}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {bank.name}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  Không tìm thấy ngân hàng
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instructions Modal/Card */}
      {showInstructions && selectedBank && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-blue-900">
              Hướng dẫn chuyển khoản
            </h4>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm text-blue-800">
            {isMobile ? (
              <>
                <p>
                  <strong>Bước 1:</strong> Nếu app {selectedBank.shortName}{" "}
                  chưa mở, vui lòng mở thủ công
                </p>
                <p>
                  <strong>Bước 2:</strong> Sử dụng tính năng quét QR trong app
                </p>
                <p>
                  <strong>Bước 3:</strong> Quét mã QR đã lưu ở thư viện ảnh
                </p>
                <button
                  onClick={() => openAppStore(selectedBank)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Tải app {selectedBank.shortName}
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Bước 1:</strong> Mở app {selectedBank.shortName} trên
                  điện thoại
                </p>
                <p>
                  <strong>Bước 2:</strong> Chọn chức năng chuyển khoản/quét QR
                </p>
                <p>
                  <strong>Bước 3:</strong> Quét mã QR trên màn hình này
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



