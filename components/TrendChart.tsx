"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface TrendData {
  month: string;
  hours: number;
}

interface TrendChartProps {
  data: TrendData[];
  title?: string;
  color?: string;
}

export default function TrendChart({
  data,
  title = "Tren Jam Kompensasi",
  color = "#008C9D",
}: TrendChartProps) {
  return (
    <div className="h-full w-full space-y-4">
      {title && (
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="var(--chart-grid)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "600" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "600" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                borderRadius: "16px",
                border: "1px solid var(--chart-tooltip-border)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                padding: "12px",
              }}
              itemStyle={{ color: color, fontWeight: "800", fontSize: "14px" }}
              labelStyle={{ color: "#64748b", marginBottom: "4px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}
              cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke={color}
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorHours)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
