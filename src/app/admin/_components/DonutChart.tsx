"use client";

import { FC } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

interface DonutChartProps {
  data: { employeeName?: string; totalDone: number }[];
  title?: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DD0",
  "#FF6B6B",
  "#4BC0C0",
  "#FF6384",
];

const DonutChart: FC<DonutChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) return <p>No data available.</p>;

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="totalDone"
            nameKey="employeeName"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={3}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}`, "Total Done"]}
            contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
          />
          {title && (
            <Label
              value={title}
              position="center"
              className="text-lg font-bold"
            />
          )}
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
