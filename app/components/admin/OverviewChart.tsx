'use client';

import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
  },
];

type BarChartOverviewProps = {
  isAnimationActive?: boolean;
  salesData: {
    month: string;
    totalSales: number;
  }[];
};

const BarChartOverview = ({
  isAnimationActive,
  salesData,
}: BarChartOverviewProps) => (
  <ResponsiveContainer width='100%' height={350}>
    <BarChart
      data={salesData}
      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray='0 0' vertical={false} stroke='#eee' />
      <XAxis
        dataKey='month'
        tick={{ fill: 'currentColor', fontSize: 14 }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{ fill: 'currentColor', fontSize: 14 }}
        axisLine={false}
        tickLine={false}
      />
      <Bar
        dataKey='totalSales'
        fill='#FFB300'
        radius={[4, 4, 0, 0]}
        isAnimationActive={isAnimationActive}
      />
    </BarChart>
  </ResponsiveContainer>
);

export default BarChartOverview;
