import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatCard {
  title: string;
  description: string;
  icon: LucideIcon | React.ElementType; // 👈 allow any React component
  value: string;
  percentageChange?: number;
}

interface Props {
  stat: StatCard;
}

const StatCard = ({ stat }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-bold">{stat.value}</h1>
        <p className="text-xs text-muted-foreground">
          {stat.percentageChange}

          <span className="text-sm px-2 text-muted-foreground">
            {stat.description}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
