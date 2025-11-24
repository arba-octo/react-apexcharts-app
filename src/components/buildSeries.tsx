import type {TAllSeries, TDataPoint, TDatas, TSeries, TSeriesPoint} from "../types";

// Компонент, который рассчитывает данные и собирает их для дальнейшей отрисовки диаграмм по всем вариантам
function buildSeries (datas: TDatas): TAllSeries {
    return datas.variations.map((variant): TSeries => {
        const key = variant.id !== undefined ? String(variant.id) : "0";

        const allPoints: TSeriesPoint[] = datas.data.map((point: TDataPoint) => {
            const datePoint = new Date(point.date).getTime(); // значение на координате Х
            const visitsPoint = point.visits[key] ?? 0;
            const convPoint = point.conversions[key] ?? 0;
            const resultPoint = visitsPoint > 0 ? (convPoint / visitsPoint) * 100 : 0; // значение на координате y

            return [datePoint, Number(resultPoint.toFixed(2))];
        });

        let color = '#5E5D67';
        if (variant.name === 'Variation A') color = '#3838E7';
        if (variant.name === 'Variation B') color = '#FF8346';
        if (variant.name === 'Variation C') color = '#999999';

        return {
            name: variant.name, // названпе варианта
            data: allPoints, // все данные для диаграммы по текущему варианту
            color, // цвет диаграммы варианта
        };
    });
};

export default buildSeries;