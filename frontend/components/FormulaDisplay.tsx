/**
 * 数式表示コンポーネント
 * LaTeX形式の数式をKaTeXで描画
 */
"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface FormulaDisplayProps {
  formula: string;
  label: string;
  displayMode?: boolean;
}

export default function FormulaDisplay({
  formula,
  label,
  displayMode = true,
}: FormulaDisplayProps) {
  const formulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formulaRef.current && formula) {
      try {
        katex.render(formula, formulaRef.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
      }
    }
  }, [formula, displayMode]);

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{label}</h3>
      <div
        ref={formulaRef}
        className="text-center py-3 overflow-x-auto"
        style={{ fontSize: "1.1em" }}
      />
    </div>
  );
}
