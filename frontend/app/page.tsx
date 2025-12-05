/**
 * トップページ - 確率分布・機械学習モデル一覧
 * カテゴリごとに階層的に表示し、タグでフィルタリング可能
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { DistributionInfo, CategoryType } from "@/types/distribution";
import { getDistributions } from "@/lib/api";
import { CATEGORY_LABELS } from "@/types/distribution";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [distributions, setDistributions] = useState<DistributionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 分布リストの取得
  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const data = await getDistributions();
        setDistributions(data);
      } catch (err) {
        console.error("Failed to fetch distributions:", err);
        setError(
          "確率分布の取得に失敗しました。バックエンドが起動しているか確認してください。"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDistributions();
  }, []);

  // 全てのユニークなタグを取得
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    distributions.forEach((dist) => {
      dist.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [distributions]);

  // カテゴリごとにグループ化
  const groupedDistributions = useMemo(() => {
    const filtered = distributions.filter((dist) => {
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) =>
          dist.tags.includes(tag)
        );
        if (!hasSelectedTag) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          dist.name.toLowerCase().includes(query) ||
          dist.description.toLowerCase().includes(query) ||
          dist.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });

    const grouped: Record<CategoryType, DistributionInfo[]> = {} as any;
    filtered.forEach((dist) => {
      if (!grouped[dist.category]) {
        grouped[dist.category] = [];
      }
      grouped[dist.category].push(dist);
    });

    return grouped;
  }, [distributions, selectedTags, searchQuery]);

  // タグの選択/解除
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="読み込み中..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        {/* ヘッダー */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  確率分布・機械学習モデル
                </h1>
              </div>

              {/* 検索ボックス */}
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* エラー表示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-900">
              {error}
            </div>
          )}

          {/* タグフィルター */}
          {allTags.length > 0 && (
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {selectedTags.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm text-gray-600">選択中:</span>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 text-white text-sm rounded-md"
                    >
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    クリア
                  </button>
                </div>
              )}
            </div>
          )}

          {/* カテゴリごとに分類表示 */}
          <div className="space-y-12">
            {Object.entries(groupedDistributions).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {CATEGORY_LABELS[category as CategoryType]}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {items.length}
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((dist) => (
                    <Link
                      key={dist.type}
                      href={`/${dist.type}`}
                      className="group block border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {dist.name}
                      </h3>

                      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                        {dist.description}
                      </p>

                      {dist.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {dist.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-sm text-gray-900 group-hover:translate-x-1 transition-transform inline-flex items-center">
                        詳しく見る
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* 結果が0件の場合 */}
          {Object.keys(groupedDistributions).length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">
                条件に一致する分布・モデルが見つかりませんでした
              </p>
              {(selectedTags.length > 0 || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setSearchQuery("");
                  }}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  フィルターをクリア
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
