"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Data untuk chart donut
const DATA_CHART = [
  { name: "Selesai", value: 45, color: "#22c55e" }, // Green
  { name: "Dalam Pengiriman", value: 30, color: "#3b82f6" }, // Blue
  { name: "Terkirim", value: 20, color: "#eab308" }, // Yellow
  { name: "Pending", value: 5, color: "#ec4899" }, // Pink
];

/**
 * Komponen AnalyticsChart untuk menampilkan grafik donut statistik.
 * Menggunakan library recharts.
 */
const AnalyticsChart = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-900">Analisis Pengiriman</h2>
        <p className="text-sm text-gray-500">
          Persentase status pengiriman bulan ini
        </p>
      </div>

      <div className="flex-1 min-h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA_CHART}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value">
              {DATA_CHART.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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

      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase font-semibold">
            Total Paket
          </p>
          <p className="text-xl font-bold text-navy-900">1,284</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-semibold">
            Efisiensi
          </p>
          <p className="text-xl font-bold text-green-600">+12.5%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
