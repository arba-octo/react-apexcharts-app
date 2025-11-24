import type {TLineStyle, TTooltipItem, TTheme} from "../types.ts";
import type { ApexOptions } from 'apexcharts';
import styles from "./ApexCharts.module.css";
export const CHART_ID = 'conversion-chart';

const buildOptions = (lineStyle: TLineStyle, theme: TTheme): ApexOptions => {
    const isDark = theme === 'dark';
    const chartType: 'line' | 'area' = lineStyle === 'area' ? 'area' : 'line';
    function formatPercent(value: number) {
        return `${value.toFixed(2).replace('.', ',')}%`;
    }

    return {
        chart: {
            id: CHART_ID,
            type: chartType,
            height: 350,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: true,
            },
            background: 'var(--chart-bg)',
            foreColor: 'var(--chart-text)',
        },
        stroke: {
            curve: lineStyle === 'smooth' ? 'smooth' : 'straight',
            width: 2,
        },
        fill: {
            type: lineStyle === 'area' ? 'solid' : 'none',
            opacity: lineStyle === 'area' ? 0.15 : 1,
        },
        theme: {
            mode: isDark ? 'dark' : 'light',
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 0,
        },
        // цвета серий – под макет
        colors: ['#FF8346', '#3838E7', '#5E5D67', '#999999'],
        grid: {
            borderColor: 'var(--chart-grid)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false, // только горизонтальные линии
                },
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'MMM',
            },
            tooltip: {
                enabled: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            min: 0,
            max: 40,
            tickAmount: 4,
            labels: {
                formatter: (val) => `${val.toFixed(0)}%`,
            },
            axisBorder: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        tooltip: {
            shared: true,
            intersect: false,
            custom: (opts) => {
                const { series, dataPointIndex, w } = opts;

                if (dataPointIndex < 0) return '';

                // дата из первой серии (x одинаковый для всех)
                const ts = w.globals.seriesX[0][dataPointIndex];
                const d = new Date(ts);
                const dateStr = d.toLocaleDateString('en-GB');

                // собираем данные по всем сериям в текущей точке
                const items: TTooltipItem[] = w.globals.series.map((_: number[], seriesIndex: number) => {
                    const name = w.globals.seriesNames[seriesIndex];
                    const value = series[seriesIndex][dataPointIndex] ?? 0;
                    const color = w.globals.colors[seriesIndex];
                    return { name, value, color };
                });

                // сортируем по убыванию и помечаем лидера (для кубка)
                items.sort((a, b) => b.value - a.value);
                const maxValue = items[0]?.value ?? 0;

                const rows = items
                    .map((item) => {
                        const isWinner = item.value === maxValue;
                        return `
              <div class="${styles.tooltipRow}">
                <div class="${styles.tooltipRow__left}">
                  <span class="${styles.cl1}" style="background:${item.color};"></span>
                  <span>${item.name}</span>
                  ${
                            isWinner
                                ? '<img src="../../public/best.png"></img>'
                                : ''
                        }
                </div>
                <div class="${styles.tooltipRow__right}">
                  ${formatPercent(item.value)}
                </div>
              </div>
            `;
                    })
                    .join('');

                return `
          <div class="${styles.cl2}">
            <div class="${styles.cl3}">
              <span>📅</span>
              <span>${dateStr}</span>
            </div>
            ${rows}
          </div>
        `;
            },
        },
    }
};

export default buildOptions;



