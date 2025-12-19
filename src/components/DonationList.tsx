"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { Donation } from "@/types/donation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DonationListProps {
  donations: Donation[];
  isLoading?: boolean;
}

export function DonationList({ donations, isLoading }: DonationListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Sao kê donation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-shimmer h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Sao kê donation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có donation nào</p>
            <p className="text-sm mt-1">Hãy là người đầu tiên! 💚</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Sao kê donation ({donations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-800">
                    {donation.donorName || "Ẩn danh"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {donation.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-primary">
                    {formatCurrency(donation.amount)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {donation.bankName}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-green-200">
                <span>#{donation.transactionId}</span>
                <span>{formatDate(donation.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

