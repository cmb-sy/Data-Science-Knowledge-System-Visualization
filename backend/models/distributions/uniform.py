import numpy as np

from .base import (
    DistributionType,
    CategoryType,
    DistributionParameter,
    DistributionInfo,
    DistributionData,
)


class UniformDistribution:

    @staticmethod
    def get_info() -> DistributionInfo:
        return DistributionInfo(
            type=DistributionType.UNIFORM,
            name="一様分布",
            description="区間 [a, b] 上で等しい確率密度を持つ連続確率分布。全ての値が等確率で出現します。",
            category=CategoryType.CONTINUOUS,
            tags=["基本", "連続", "一様", "等確率"],
            formula_pdf=r"f(x) = \begin{cases} \frac{1}{b-a} & \text{if } a \leq x \leq b \\ 0 & \text{otherwise} \end{cases}",
            formula_cdf=r"F(x) = \begin{cases} 0 & \text{if } x < a \\ \frac{x-a}{b-a} & \text{if } a \leq x \leq b \\ 1 & \text{if } x > b \end{cases}",
            parameters=[
                DistributionParameter(
                    name="a",
                    label="下限 (a)",
                    description="分布の下限値。この値以上で一様に分布します。",
                    default_value=0.0,
                    min_value=-10.0,
                    max_value=10.0,
                    step=0.1,
                ),
                DistributionParameter(
                    name="b",
                    label="上限 (b)",
                    description="分布の上限値。この値以下で一様に分布します。",
                    default_value=1.0,
                    min_value=-10.0,
                    max_value=10.0,
                    step=0.1,
                ),
            ],
        )

    @staticmethod
    def calculate(a: float, b: float, num_points: int = 1000) -> DistributionData:
        if a >= b:
            raise ValueError("aはbより小さくなければなりません")

        margin = (b - a) * 0.2
        x = np.linspace(a - margin, b + margin, num_points)

        pdf = np.where((x >= a) & (x <= b), 1.0 / (b - a), 0.0)

        cdf = np.clip((x - a) / (b - a), 0.0, 1.0)

        mean = (a + b) / 2.0
        variance = ((b - a) ** 2) / 12.0
        std_dev = np.sqrt(variance)

        return DistributionData(
            x_values=x.tolist(),
            pdf_values=pdf.tolist(),
            cdf_values=cdf.tolist(),
            mean=float(mean),
            variance=float(variance),
            std_dev=float(std_dev),
        )
