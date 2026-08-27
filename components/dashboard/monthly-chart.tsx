'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface MonthlyChartProps {
  data: {
    month: string;
    count: number;
  }[];
}

export function MonthlyChart({
  data,
}: MonthlyChartProps) {
  const formattedData = data.map(
    (item) => ({
      ...item,
      month: formatMonth(item.month),
    }),
  );

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={formattedData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <Tooltip />

          <Bar
            dataKey="count"
            name="Applications"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatMonth(
  month: string,
) {
  const [year, monthNumber] =
    month.split('-');

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
  );

  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
    },
  );
}