"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

interface PieChartProps {
  pieChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export default function ChartPieSimple({ pieChartData }: PieChartProps) {
  const dataset = pieChartData.datasets?.[0];

  if (!dataset || !dataset.data || !pieChartData.labels.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No data</CardTitle>
          <CardDescription>Pie chart has no data to show</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartData = pieChartData.labels.map((label, index) => ({
    name: label,
    value: dataset.data[index] ?? 0,
    fill: dataset.backgroundColor?.[index] ?? "#8884d8", // fallback only if color missing
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{dataset.label}</CardTitle>
        <CardDescription>Payment Channels</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Distribution by channel
        </div>
      </CardFooter>
    </Card>
  );
}
