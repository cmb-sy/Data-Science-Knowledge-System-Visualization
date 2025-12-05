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

    @staticmethod
    def get_info() -> DistributionInfo:
        return DistributionInfo(
            type=DistributionType.EXPONENTIAL,
            name="指数分布",
            description="待ち時間や寿命を表す連続確率分布。ある事象が発生するまでの時間をモデル化します。",
            category=CategoryType.CONTINUOUS,
            tags=["連続型確率分布"],
            formula_pdf=r"f(x) = \begin{cases} \lambda e^{-\lambda x} & \text{if } x \geq 0 \\ 0 & \text{otherwise} \end{cases}",
            formula_cdf=r"F(x) = \begin{cases} 0 & \text{if } x < 0 \\ 1 - e^{-\lambda x} & \text{if } x \geq 0 \end{cases}",
            parameters=[
                DistributionParameter(
                    name="lambda_",
                    label="λ",
                    description="単位時間あたりの事象発生率。大きいほど事象が頻繁に発生する。",
                    default_value=1.0,
                    min_value=0.1,
                    max_value=10.0,
                    step=0.1,
                ),
            ],
        )

    @staticmethod
    def calculate(lambda_: float, num_points: int = 1000) -> DistributionData:
        if lambda_ <= 0:
            raise ValueError("λは正の値でなければなりません")

        mean = 1.0 / lambda_
        variance = 1.0 / (lambda_**2)
        std_dev = 1.0 / lambda_

        x_max = mean * 5
        x = np.linspace(0, x_max, num_points)

        pdf = lambda_ * np.exp(-lambda_ * x)
        cdf = 1 - np.exp(-lambda_ * x)

        return DistributionData(
            x_values=x.tolist(),
            pdf_values=pdf.tolist(),
            cdf_values=cdf.tolist(),
            mean=float(mean),
            variance=float(variance),
            std_dev=float(std_dev),
        )
