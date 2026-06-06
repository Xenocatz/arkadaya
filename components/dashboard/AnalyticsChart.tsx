"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface AnalyticsChartItem {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsChartProps {
  data: AnalyticsChartItem[];
  total: number;
  efficiency: string;
}

const AnalyticsChart = ({
  data,
  total,
  efficiency,
}: AnalyticsChartProps) => {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-50 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-900">Analisis Pengiriman</h2>
        <p className="text-sm text-gray-500">
          Persentase status pengiriman saat ini
        </p>
      </div>

      <div className="min-h-75 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm font-medium text-gray-700">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase text-gray-400">
            Total Paket
          </p>
          <p className="text-xl font-bold text-navy-900">{total}</p>
        </div>
        <div className="border-l border-gray-100 text-center">
          <p className="text-xs font-semibold uppercase text-gray-400">
            Efisiensi
          </p>
          <p className="text-xl font-bold text-green-600">{efficiency}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
