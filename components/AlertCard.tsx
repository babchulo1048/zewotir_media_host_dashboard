// AlertCard.tsx

"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Sender {
  rank: number;
  name: string;
  transactions: number;
  volume: string;
}

interface Props {
  topSenders: Sender[];
}

const AlertCard = ({ topSenders }: Props) => {
  return (
    <Card>
      <div className="p-7">
        <div className="flex md:flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Top Senders by Remittance Volume
          </CardTitle>
        </div>
      </div>

      <CardContent className="space-y-4">
        {topSenders.map((sender, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/dashboard/senders/${sender.rank}`}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {sender.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium">{sender.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Rank #{sender.rank}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border-gray-200">
                  {sender.transactions} Transactions
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Total Volume: {sender.volume}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Total Transactions: {sender.transactions}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertCard;
