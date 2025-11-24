import { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import rawDatas from '../../data.json';

import type { TDatas, TTheme, TLineStyle } from '../types';
import buildSeries from './buildSeries';
import buildOptions, { CHART_ID } from "./buildOptions.tsx";
import styles from "./ApexCharts.module.css";

const defaultDatas = rawDatas as TDatas;

type ApexChartProps = {
    datas?: TDatas;
    theme?: TTheme;
};

function ApexChart({ datas = defaultDatas, theme = 'light' }: ApexChartProps) {
    const series = useMemo(() => buildSeries(datas), [datas]);
    const [lineStyle, setLineStyle] = useState<TLineStyle>('line');
    const options = useMemo(
        () => buildOptions(lineStyle, theme),
        [lineStyle, theme]
    );

    const handleExportPng = async () => {
        try {
            const result = await ApexCharts.exec(CHART_ID, 'dataURI');
            if (!result || !result.imgURI) return;

            const link = document.createElement('a');
            link.href = result.imgURI;
            link.download = 'chart.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('Export to PNG failed', e);
        }
    };

    const chartType: 'line' | 'area' =
        lineStyle === 'area' ? 'area' : 'line';

    return (
        <div className={styles.chart} style={{ fontFamily: 'Roboto, sans-serif' }}>

            {/* верхняя панель */}
            <div className={styles["chart__top-panel"]}>

                {/* левая панель — фильтры */}
                <div className={styles.chart__panel_left}>
                    <select className={styles["chart__panel_left"]}>
                        <option>All variations selected</option>
                    </select>

                    <select className={styles["chart__select-filter"]}>
                        <option>Day</option>
                    </select>
                </div>

                {/* правая панель — настройки */}
                <div className={styles["chart__panel_right"]}>
                    <select
                        className={styles["chart__select-filter"]}
                        value={lineStyle}
                        onChange={(e) => setLineStyle(e.target.value as TLineStyle)}
                    >
                        <option value="line">Line style: line</option>
                        <option value="smooth">Line style: smooth</option>
                        <option value="area">Line style: area</option>
                    </select>

                            <button className={styles["chart__icon-btn"]}>⤢</button>
                    <button className={styles["chart__icon-btn"]}>−</button>
                    <button className={styles["chart__icon-btn"]}>＋</button>
                    <button className={styles["chart__icon-btn"]}>↻</button>
                    <button
                        className={styles["chart__icon-btn"]}
                        onClick={handleExportPng}
                        title="Export to PNG"
                    >
                        PNG
                    </button>
                </div>
            </div>

            {/* карточка графика */}
            <div className={styles.chart__card}>
                <ReactApexChart
                    key={theme + lineStyle}
                    options={options}
                    series={series}
                    type={chartType}
                    height={350}
                />
            </div>
        </div>
    );
}


            export default ApexChart;