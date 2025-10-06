"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Users, DollarSign, PiggyBank } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatCard from "./_components/widget/StatCard";

// New chart components
import BarChartComponent from "./_components/widget/BarChartComponent";
import ChartPieSimple from "./_components/widget/PieChartComponent";
import axios from "axios";

// ====================================================================
// 1. NEW INTERFACES AND DATA TRANSFORMATION
// ====================================================================

// Interface matching the keys from your Spring Boot API response's 'data' object
interface ApiTransaction {
  createdAt: string;
  amount: number;
  txRef: string;
  id: string;
  status: "SUCCESS" | "PENDING" | "FAILED"; // Match server enum
}

// **UPDATED INTERFACE: Matches the new structure from the backend**
interface ApiBarChartData {
  labels: string[];
  dataset: {
    label: string;
    data: number[];
    color: string;
    backgroundColor: string | null;
  } | null;
}

interface ApiPaymentMethod {
  name: string;
  value: number;
}

interface ApiDashboardData {
  totalSavingAmount: number;
  totalLoanAmount: number;
  paymentMethodDistribution: ApiPaymentMethod[];
  recentTransactions: ApiTransaction[];
  totalMicrofinanceCount: number;
  // **KEY CHANGE HERE:** Use the new key and interface type
  monthlyRevenueData: ApiBarChartData;
  filteredTotalRevenue: number;
}

// Interface for the transformed data used by the UI components
interface UIMetric {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  changeType: "positive" | "negative" | "neutral";
}

// Interface for the table (we simplify the API transaction)
interface UITableTransaction {
  id: string;
  type: string; // "Saving" or "Loan" (derived from context/amount if needed)
  amount: number;
  member: string; // The API only gives us txRef/id, we'll use txRef as a placeholder for Member
  date: string;
  status: "Completed" | "Pending" | "Failed";
}

interface UIDashboardData {
  metrics: UIMetric[];
  // **KEY CHANGE HERE:** Use the new interface type
  monthlyRevenueData: ApiBarChartData;
  paymentMethods: ApiPaymentMethod[];
  recentTransactions: UITableTransaction[];
}

// ====================================================================
// 2. DATA MAPPING FUNCTIONS (No changes needed here)
// ====================================================================

const mapApiMetricsToUI = (data: ApiDashboardData): UIMetric[] => {
  return [
    {
      title: "Total Microfinance",
      value: data.totalMicrofinanceCount.toLocaleString(),
      icon: Users,
      description: "Total Microfinance Institutions served",
      changeType: "neutral",
    },
    {
      title: "Total Savings Amount",
      value: `ETB ${data.totalSavingAmount.toLocaleString()}`,
      icon: PiggyBank,
      description: `Total revenue: ETB ${data.filteredTotalRevenue.toLocaleString()}`,
      changeType: "positive", // Placeholder logic
    },
    {
      title: "Total Loan Amount",
      value: `ETB ${data.totalLoanAmount.toLocaleString()}`,
      icon: DollarSign,
      description: "Amount for loans disbursed",
      changeType: "negative", // Placeholder logic
    },
  ];
};

const mapApiTransactionsToUITable = (
  transactions: ApiTransaction[]
): UITableTransaction[] => {
  // NOTE: The API doesn't provide 'type' or 'member', so we use placeholders/derivations.
  return transactions.map((t) => ({
    id: t.id.substring(0, 10) + "...", // Shorten ID for display
    type: t.amount > 0 ? "SAVING" : "LOAN", // Placeholder: Assuming positive amount is SAVING, negative is LOAN
    amount: Math.abs(t.amount),
    member: t.txRef, // Using txRef as a placeholder for a member reference
    date: new Date(t.createdAt).toLocaleDateString(),
    status:
      t.status === "SUCCESS"
        ? "Completed"
        : t.status === "PENDING"
        ? "Pending"
        : "Failed",
  }));
};

// ====================================================================
// 4. API FETCHING LOGIC
// ====================================================================

const API_URL = "http://127.0.0.1:9090/api/v1/admin/dashboard";

export default function DashboardPage() {
  const [filter, setFilter] = useState("yearly");
  const [data, setData] = useState<UIDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine the API filter body based on the UI filter
  const getFilterBody = useCallback(() => {
    // This is a simplified filter. For a real app, you'd calculate dates.
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-indexed

    let filterType = "YEARLY";
    if (filter === "monthly") filterType = "MONTHLY";
    else if (filter === "daily") filterType = "DAILY";

    return {
      filterType: filterType,
      year: filterType === "YEARLY" ? year : undefined,
      month: filterType === "MONTHLY" ? month : undefined,
      // For daily/weekly, you'd calculate start/end date
    };
  }, [filter]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const filterBody = getFilterBody();

      try {
        const token = localStorage.getItem("token"); // **IMPORTANT: Replace with your actual token retrieval logic**

        // --- AXIOS IMPLEMENTATION START ---
        const response = await axios.post<{ data: ApiDashboardData }>( // Use axios.post for the POST request
          API_URL,
          filterBody, // Axios automatically serializes the body
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = response.data;

        // Map API data to UI data structure
        const uiData: UIDashboardData = {
          metrics: mapApiMetricsToUI(result.data),
          // **KEY MAPPING CHANGE HERE:** Use 'monthlyRevenueData'
          monthlyRevenueData: result.data.monthlyRevenueData,
          paymentMethods: result.data.paymentMethodDistribution,
          recentTransactions: mapApiTransactionsToUITable(
            result.data.recentTransactions
          ),
        };

        setData(uiData);
        // --- AXIOS IMPLEMENTATION END ---
      } catch (e) {
        console.error("Fetch error:", e);

        // Handle Axios specific error messages if needed
        let errorMessage =
          "Failed to fetch dashboard data. Check API and token.";
        if (axios.isAxiosError(e) && e.response) {
          errorMessage = `Failed to fetch dashboard data. Status: ${e.response.status}`;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, getFilterBody]);
  // ====================================================================
  // 5. MAIN DASHBOARD COMPONENT (Updated rendering logic)
  // ====================================================================

  const transactionColumns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      // NOTE: We use txRef for "Member" as a temporary proxy
      { header: "Reference", accessorKey: "member" },
      { header: "Type", accessorKey: "type" },
      { header: "Amount", accessorKey: "amount" },
      { header: "Date", accessorKey: "date" },
      { header: "Status", accessorKey: "status" },
    ],
    []
  );

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center p-6 min-h-[60vh] text-muted-foreground">
        <p>{isLoading ? "Loading Dashboard Data..." : error}</p>
      </div>
    );
  }

  // Destructure data. Note the change from 'monthlyVolume' to 'monthlyRevenueData'.
  const { metrics, monthlyRevenueData, paymentMethods, recentTransactions } =
    data;

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      {/* Filters */}
      <Tabs defaultValue="yearly" value={filter} onValueChange={setFilter}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          <TabsTrigger value="custom" disabled>
            Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stat Cards (Total Microfinance, Total Savings, Total Loans) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Charts (Monthly Volume Bar Chart & Payment Method Pie Chart) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Monthly Volume using BarChartComponent (4/7 columns) */}
        <div className="lg:col-span-4">
          {/* **CRITICAL CHANGE:** Pass 'labels' and 'dataset' from 'monthlyRevenueData' directly to the BarChartComponent.
           */}
          <BarChartComponent
            labels={monthlyRevenueData.labels}
            dataset={monthlyRevenueData.dataset}
          />
        </div>

        {/* Payment Method Distribution using ChartPieSimple (3/7 columns) */}
        <div className="lg:col-span-3">
          <ChartPieSimple
            pieChartData={{
              labels: paymentMethods.map((p) => p.name),
              datasets: [
                {
                  label: "Payment Method Distribution",
                  data: paymentMethods.map((p) => p.value),
                  // NOTE: Colors are not provided by API, so assign them dynamically or use defaults
                  backgroundColor: paymentMethods.map(
                    (_, index) =>
                      index === 0
                        ? "hsl(142.1 70.6% 45.3%)" // Green for first
                        : index === 1
                        ? "hsl(217.2 91.2% 59.8%)" // Blue for second
                        : `hsl(${(index * 50 + 10) % 360} 70% 50%)` // Dynamic HSL for others
                  ),
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions ({filter} View)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {transactionColumns.map((col) => (
                      <TableHead
                        key={col.accessorKey}
                        className="whitespace-nowrap"
                      >
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-primary">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.member}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "BORROWING"
                              ? "default"
                              : transaction.type === "SAVING"
                              ? "secondary"
                              : "outline"
                          }
                          className="whitespace-nowrap"
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {/* Currency formatting */}
                        {`ETB ${transaction.amount.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "Completed"
                              ? "success" // Assuming success variant exists
                              : transaction.status === "Pending"
                              ? "warning" // Assuming warning variant exists
                              : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
