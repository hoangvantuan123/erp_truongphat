import { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next'
const SalesValuePieChart = ({ isDarkMode = false, dataChart, SMTermsKind }) => {
    const chartRef = useRef();
    const [showLegendPopup, setShowLegendPopup] = useState(false);
    const { t } = useTranslation()
    const formatNumber = (num) =>
        new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(num);

    const chartData = useMemo(() => {
        const seenRanking = new Set();

        return (dataChart || [])
            .filter(item => {
                const rank = item.Ranking;
                const value = Number(
                    SMTermsKind === 1077002 ? item.YearSalesAmt : item.ThisSalesAmt
                );
                if (!rank || seenRanking.has(rank) || value <= 0) return false;
                seenRanking.add(rank);
                return true;
            })
            .map((item, idx) => ({
                name: item.UMItemClassName || `${t('1489')} ${idx + 1}`,
                value: Number(
                    SMTermsKind === 1077002 ? item.YearSalesAmt : item.ThisSalesAmt
                ),
                itemStyle: {
                    decal: {
                        symbol: idx % 2 === 0 ? 'circle' : 'line',
                        dashArrayX: [1, 2],
                        dashArrayY: [2, 3],
                        color: 'rgba(0, 0, 0, 0.15)',
                        rotation: Math.PI / (2 + idx),
                    }
                }
            }));
    }, [dataChart, SMTermsKind]);


    const option = {
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>Giá trị: {c} ({d}%)',
        },
        legend: {
            orient: 'horizontal',
            bottom: 0,
            type: 'scroll',
            data: chartData.slice(0, 5).map(item => item.name),
            textStyle: {
                color: isDarkMode ? '#ddd' : '#333'
            }
        },
        series: [
            {
                name: t('5258'),
                type: 'pie',
                radius: ['40%', '70%'],
                label: {
                    show: true,
                    formatter: '{b}: {d}%',
                    color: isDarkMode ? '#eee' : '#333'
                },
                labelLine: { show: true },
                data: chartData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        ],
    };

    const handleDownload = () => {
        const echartsInstance = chartRef.current?.getEchartsInstance();
        if (!echartsInstance) return;
        const img = echartsInstance.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        });
        const link = document.createElement('a');
        link.href = img;
        link.download = 'pie-chart.png';
        link.click();
    };

    useEffect(() => {
        const chartEl = chartRef.current?.getEchartsInstance()?.getDom();
        if (!chartEl) return;
        const resizeObserver = new ResizeObserver(() => {
            chartRef.current?.getEchartsInstance()?.resize();
        });
        resizeObserver.observe(chartEl);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b">
                <span className="text-[10px] p-1 text-blue-600 font-medium uppercase">
                    {t('800001004')}
                </span>
                <div className="relative flex gap-2 items-center">
                    <button
                        onClick={() => setShowLegendPopup(prev => !prev)}
                        className="flex items-center gap-1 px-2 py-2 text-blue-600 text-xs hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                    >
                        {t('52171')}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1 px-2 py-2 text-emerald-600 text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded"
                    >
                        <Download size={14} />
                    </button>
                    {showLegendPopup && (
                        <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 dark:text-white shadow-lg border rounded w-64 max-h-60 overflow-auto p-2 text-sm">
                            <div className="font-semibold mb-2">{t('800001005')}</div>
                            <ul className="space-y-1">
                                {chartData.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between border-b pb-1 last:border-b-0"
                                    >
                                        <span title={item.name} className="truncate max-w-[140px]">{item.name}</span>
                                        <span className="font-medium">{formatNumber(item.value)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ReactECharts
                    option={option}
                    ref={chartRef}
                    notMerge
                    lazyUpdate
                    style={{ width: '100%', height: '100%' }}
                    theme={isDarkMode ? 'dark' : undefined}
                />
            </div>
        </div>
    );
};

export default SalesValuePieChart;
