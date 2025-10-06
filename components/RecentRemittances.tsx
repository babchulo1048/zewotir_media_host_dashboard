"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable } from "./table/DataTable";

interface RecentPayment {
  id: string;
  payer: string;
  payee: string;
  amount: number;
  paymentMethod: string;
  status: string;
}

const columns = [
  { accessorKey: "id", header: "Transaction ID" },
  { accessorKey: "sender", header: "Sender" },
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "channel", header: "Channel" },
  { accessorKey: "status", header: "Status" },
];

export default function RecentPayments({ data }: { data: RecentPayment[] }) {
  return (
    <Card>
      <div className="p-7">
        <div className="flex md:flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Recent Remittances
          </CardTitle>
        </div>
      </div>
      <CardContent className="space-y-4">
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
