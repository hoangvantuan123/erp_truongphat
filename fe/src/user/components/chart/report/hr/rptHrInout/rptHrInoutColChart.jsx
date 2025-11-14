import { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RptHrInoutColChart = ({ isDarkMode = false, dataChart }) => {
    const chartRef = useRef();
    const [showLegendPopup, setShowLegendPopup] = useState(false);
    const { t } = useTranslation();

    const formatNumber = (num) =>
        new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(num);

    const chartData = useMemo(() => {
        return (dataChart || []).map((item, idx) => {
            const ent = Number(item.EntCnt) || 0;
            const ret = Number(item.RetCnt) || 0;
            return {
                index: idx + 1,
                month: item.MonthName || `${t('460')} ${idx + 1}`,
                entCount: ent,
                retCount: ret,
                total: ent + ret,
            };
        });
    }, [dataChart]);

    const option = {
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        legend: {
            data: [
                t('21699'),
                t('21754'),
                t('35245')
            ],
            textStyle: {
                color: isDarkMode ? '#ddd' : '#333',
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            name: t('460'),
            data: chartData.map((item) => `${item.index}`), // dùng số thứ tự
            axisLabel: {
                color: isDarkMode ? '#ccc' : '#333',
            },
        },
        yAxis: {
            type: 'value',
            name: t('1628'),
            axisLabel: { color: isDarkMode ? '#ccc' : '#333' },
        },
        series: [
            {
                name: t('21699'), // Vào công ty
                type: 'bar',
                data: chartData.map((item) => item.entCount),
                itemStyle: { color: '#4caf50' },
                label: {
                    show: true,
                    position: 'top',
                    color: isDarkMode ? '#ccc' : '#333',
                    fontSize: 10,
                },
            },
            {
                name: t('21754'), // Thôi việc
                type: 'bar',
                data: chartData.map((item) => item.retCount),
                itemStyle: { color: '#f44336' },
                label: {
                    show: true,
                    position: 'top',
                    color: isDarkMode ? '#ccc' : '#333',
                    fontSize: 10,
                },
            },
            {
                name: t('35245'), // Tổng
                type: 'line',
                data: chartData.map((item) => item.total),
                itemStyle: { color: '#2196f3' },
                lineStyle: { width: 2 },
                symbol: 'circle',
                symbolSize: 6,
                label: {
                    show: true,
                    position: 'top',
                    color: isDarkMode ? '#ccc' : '#2196f3',
                    fontSize: 10,
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
        link.download = 'column-chart.png';
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
                    {t('800001008')}
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
                                        className="flex flex-col border-b pb-1 last:border-b-0"
                                    >
                                        <span>{item.month}</span>
                                        <div className="flex justify-between text-xs">
                                            <span>{t('21699')}:</span>
                                            <span className="font-medium">{formatNumber(item.entCount)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span>{t('21754')}:</span>
                                            <span className="font-medium">{formatNumber(item.retCount)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span>{t('35245')}:</span>
                                            <span className="font-medium">{formatNumber(item.total)}</span>
                                        </div>
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

export default RptHrInoutColChart;
