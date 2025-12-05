/**
 * パラメータスライダーコンポーネント
 * 分布のパラメータをインタラクティブに調整
 */
"use client";

import type { DistributionParameter } from "@/types/distribution";

interface ParameterSliderProps {
  parameter: DistributionParameter;
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
}

export default function ParameterSlider({
  parameter,
  value,
  onChange,
  onCommit,
}: ParameterSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleMouseUp = () => {
    onCommit?.();
  };

  const handleTouchEnd = () => {
    onCommit?.();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-900">
          {parameter.label}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={parameter.step}
          min={parameter.min_value}
          max={parameter.max_value}
          className="w-20 px-2.5 py-1 text-sm text-right font-mono border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      <input
        type="range"
        min={parameter.min_value}
        max={parameter.max_value}
        step={parameter.step}
        value={value}
        onChange={handleChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
      />

      <div className="flex justify-between text-xs text-gray-500 font-mono">
        <span>{parameter.min_value}</span>
        <span>{parameter.max_value}</span>
      </div>
    </div>
  );
}
