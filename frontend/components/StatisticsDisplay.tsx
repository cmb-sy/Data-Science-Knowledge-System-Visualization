/**
 * 統計量表示コンポーネント
 * 平均、分散、標準偏差などを表示
 */
"use client";

interface StatisticsDisplayProps {
  mean: number;
  variance: number;
  stdDev: number;
}

export default function StatisticsDisplay({
  mean,
  variance,
  stdDev,
}: StatisticsDisplayProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(4);
  };

  const stats = [
    { label: "平均", symbol: "μ", value: mean },
    { label: "分散", symbol: "σ²", value: variance },
    { label: "標準偏差", symbol: "σ", value: stdDev },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">統計量</h2>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.symbol}
            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-sm text-gray-600">
              {stat.label} <span className="font-mono">({stat.symbol})</span>
            </span>
            <span className="text-sm font-mono font-semibold text-gray-900">
              {formatNumber(stat.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
