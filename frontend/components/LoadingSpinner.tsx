/**
 * ローディングスピナーコンポーネント
 */
"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingSpinner({
  size = "md",
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-gray-300 border-t-gray-900 ${sizeClasses[size]}`}
      ></div>
      {message && <p className="mt-3 text-gray-600 text-sm">{message}</p>}
    </div>
  );
}
