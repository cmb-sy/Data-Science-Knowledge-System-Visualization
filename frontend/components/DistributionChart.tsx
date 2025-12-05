/**
 * 確率分布グラフコンポーネント
 * RechartsでPDFとCDFを描画
 */
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DistributionData } from "@/types/distribution";

interface DistributionChartProps {
  data: DistributionData;
  showPDF?: boolean;
  showCDF?: boolean;
}

export default function DistributionChart({
  data,
  showPDF = true,
  showCDF = true,
}: DistributionChartProps) {
  // Rechartsで使用するデータ形式に変換
  const chartData = data.x_values.map((x, index) => ({
    x: parseFloat(x.toFixed(4)),
    pdf: parseFloat(data.pdf_values[index].toFixed(6)),
    cdf: parseFloat(data.cdf_values[index].toFixed(6)),
  }));

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="x"
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
              padding: "8px 12px",
            }}
            formatter={(value: number) => value.toFixed(6)}
            labelStyle={{ color: "#6b7280", marginBottom: "4px" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "16px",
              fontSize: "13px",
            }}
            iconType="line"
          />

          {showPDF && (
            <Line
              type="monotone"
              dataKey="pdf"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="PDF"
              isAnimationActive={false}
            />
          )}

          {showCDF && (
            <Line
              type="monotone"
              dataKey="cdf"
              stroke="#64748b"
              strokeWidth={2}
              dot={false}
              name="CDF"
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
