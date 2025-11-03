"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Layers,
  BookOpen,
  Mail,
  LayoutDashboard as DashboardIcon,
} from "lucide-react"; // Import new icons

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
import Link from "next/link"; // Use Link for navigation
// Assume StatCard is correctly implemented to use UIMetric
import StatCard from "./_components/widget/StatCard";
// No need for Tabs, BarChartComponent, ChartPieSimple, or axios for static view

// ====================================================================
// 1. INTERFACES (REPEATED FOR CLARITY - Put these in a types file in production)
// ====================================================================

interface ApiCountData {
  totalActiveAssets: number;
  totalPublishedArticles: number;
  newInquiriesLast7Days: number;
}

interface UIMetric {
  title: string;
  value: string;
  icon: React.ElementType; // LucideIcon
  description: string;
  url: string;
}

interface UIRecentActivity {
  id: number;
  title: string;
  type: "Portfolio" | "Blog" | "Inquiry";
  date: string;
  status: "Active" | "Draft" | "New";
}

interface UIDashboardData {
  metrics: UIMetric[];
  recentActivity: UIRecentActivity[];
}

// ====================================================================
// 2. STATIC DATA DEFINITION (REPEATED FOR CLARITY)
// ====================================================================

const STATIC_API_DATA: ApiCountData = {
  totalActiveAssets: 42,
  totalPublishedArticles: 18,
  newInquiriesLast7Days: 5,
};

const STATIC_RECENT_ACTIVITY: UIRecentActivity[] = [
  {
    id: 9,
    title: "New Client Inquiry: Booking for VO",
    type: "Inquiry",
    date: "2025-10-31",
    status: "New",
  },
  {
    id: 1,
    title: "The Art of Voice-Over: Masterclass",
    type: "Blog",
    date: "2025-10-29",
    status: "Active",
  },
  {
    id: 5,
    title: "Corporate Presentation Voice-Over",
    type: "Portfolio",
    date: "2025-10-28",
    status: "Active",
  },
  {
    id: 10,
    title: "Draft Article: Media Production 101",
    type: "Blog",
    date: "2025-10-27",
    status: "Draft",
  },
  {
    id: 2,
    title: "Charcoal Portrait Series (Art)",
    type: "Portfolio",
    date: "2025-10-25",
    status: "Active",
  },
];

const mapApiDataToUIData = (data: ApiCountData): UIMetric[] => {
  return [
    {
      title: "Total Portfolio Assets",
      value: data.totalActiveAssets.toLocaleString(),
      icon: Layers,
      description: "Media, Voice-Over, and Art currently active.",
      url: "/admin/portfolio",
    },
    {
      title: "Total Published Articles",
      value: data.totalPublishedArticles.toLocaleString(),
      icon: BookOpen,
      description: "Articles available on the public blog.",
      url: "/admin/blog",
    },
    {
      title: "New Inquiries (7 Days)",
      value: data.newInquiriesLast7Days.toLocaleString(),
      icon: Mail,
      description: "New contacts requiring follow-up.",
      url: "/admin/inquiries",
    },
  ];
};

const STATIC_DASHBOARD_DATA: UIDashboardData = {
  metrics: mapApiDataToUIData(STATIC_API_DATA),
  recentActivity: STATIC_RECENT_ACTIVITY,
};

// ====================================================================
// 4. MAIN DASHBOARD COMPONENT (Stripped for Portfolio)
// ====================================================================

export default function DashboardPage() {
  // Use a state hook to hold the dashboard data, initially using static data
  const [data, setData] = useState<UIDashboardData | null>(
    STATIC_DASHBOARD_DATA
  );
  const [isLoading, setIsLoading] = useState(false); // Set to false for static view

  // NOTE: For the static view, we skip all useEffect/axios logic.
  // When we implement the API, we will uncomment the useEffect hook here.

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center p-6 min-h-[60vh] text-muted-foreground">
        <p>{isLoading ? "Loading Dashboard Data..." : "Error loading data."}</p>
      </div>
    );
  }

  const { metrics, recentActivity } = data;

  const getStatusVariant = (status: UIRecentActivity["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Draft":
        return "secondary";
      case "New":
        return "success" as any; // Assuming 'success' variant exists in your Badge
      default:
        return "outline";
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      {/* Welcome Header */}
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Mr Zick!</h1>
      </div>

      {/* Stat Cards (Metrics) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((stat) => (
          // Link the whole card to the relevant page
          <Link
            href={stat.url}
            key={stat.title}
            className="hover:opacity-90 transition-opacity"
          >
            {/* StatCard needs to accept the UIMetric structure */}
            <StatCard stat={stat} />
          </Link>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity & Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {activity.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {activity.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getStatusVariant(activity.status)}>
                          {activity.status}
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

// NOTE: You must ensure your StatCard component uses the UIMetric interface correctly.
// For example, StatCard might look like this:
/*
const StatCard = ({ stat }: { stat: UIMetric }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
      <stat.icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{stat.value}</div>
      <p className="text-xs text-muted-foreground">{stat.description}</p>
    </CardContent>
  </Card>
);
*/
