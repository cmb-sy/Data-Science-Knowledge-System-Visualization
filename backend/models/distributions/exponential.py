"""
指数分布の実装
"""

import numpy as np
from scipy import stats

from .base import (
    DistributionType,
    CategoryType,
    DistributionParameter,
    DistributionInfo,
    DistributionData,
)


class ExponentialDistribution:
    """指数分布の実装"""

    @staticmethod
    def get_info() -> DistributionInfo:
        """指数分布の情報を取得"""
        return DistributionInfo(
            type=DistributionType.EXPONENTIAL,
            name="指数分布",
            description="待ち時間や寿命を表す連続確率分布。ある事象が発生するまでの時間をモデル化します。",
            category=CategoryType.CONTINUOUS,
            tags=["基本", "連続", "指数", "待ち時間"],
            formula_pdf=r"f(x) = \begin{cases} \lambda e^{-\lambda x} & \text{if } x \geq 0 \\ 0 & \text{otherwise} \end{cases}",
            formula_cdf=r"F(x) = \begin{cases} 0 & \text{if } x < 0 \\ 1 - e^{-\lambda x} & \text{if } x \geq 0 \end{cases}",
            parameters=[
                DistributionParameter(
                    name="lambda_",
                    label="レート (λ)",
                    description="単位時間あたりの事象発生率。大きいほど事象が頻繁に発生します。",
                    default_value=1.0,
                    min_value=0.1,
                    max_value=10.0,
                    step=0.1,
                ),
            ],
        )

    @staticmethod
    def calculate(lambda_: float, num_points: int = 1000) -> DistributionData:
        """
        指数分布のデータを計算

        Args:
            lambda_: レートパラメータ（λ）
            num_points: グラフのデータポイント数

        Returns:
            DistributionData: グラフ描画用のデータ
        """
        if lambda_ <= 0:
            raise ValueError("レート (λ) は正の値でなければなりません")

        # scipy.statsを使用して指数分布を生成
        dist = stats.expon(scale=1 / lambda_)

        # x軸の値を生成（平均の5倍程度まで表示）
        mean_val = 1 / lambda_
        x_max = mean_val * 5
        x = np.linspace(0, x_max, num_points)

        # PDFとCDFを計算
        pdf = dist.pdf(x)
        cdf = dist.cdf(x)

        # 統計量を計算
        mean = dist.mean()
        variance = dist.var()
        std_dev = dist.std()

        return DistributionData(
            x_values=x.tolist(),
            pdf_values=pdf.tolist(),
            cdf_values=cdf.tolist(),
            mean=float(mean),
            variance=float(variance),
            std_dev=float(std_dev),
        )
