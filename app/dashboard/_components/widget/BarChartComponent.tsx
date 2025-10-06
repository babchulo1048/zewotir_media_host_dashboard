// BarChartComponent.tsx

"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  labels: string[];
  dataset: {
    label: string;
    data: number[];
    color: string;
    backgroundColor: string | null;
  } | null;
}

const BarChartComponent = ({ labels, dataset }: Props) => {
  const chartData =
    dataset && labels.length
      ? labels.map((label, index) => ({
          month: label,
          volume: dataset.data[index],
        }))
      : [];

  const averageVolume =
    chartData.reduce((acc, curr) => acc + curr.volume, 0) /
    (chartData.length || 1);

  const chartConfig = {
    volume: {
      label: dataset?.label || "Revenue Volume (Birr)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Volume Trends</CardTitle>
        <CardDescription>Revenue volume data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `${value.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(value) =>
                    `$${Number(value).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}`
                  }
                />
              }
            />
            <Bar dataKey="volume" fill="var(--color-volume)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average volume: ${Math.round(averageVolume).toLocaleString()}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default BarChartComponent;
