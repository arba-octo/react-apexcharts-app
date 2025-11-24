// Тип для одного варианта-легенды
export interface TVariation {
    id?: number;
    name: string;
}

// Тип для исходных данных из БД, на основании которых рассчитывается одна точка на диаграмме
export interface TDataPoint {
    date: string;
    visits: Record<string, number>;
    conversions: Record<string, number>;
}
// Тип для всех исходных данных из БД
export  interface TDatas {
    variations: TVariation[];
    data: TDataPoint[];
}

// Тип для одной точки на диаграмме (значения по оси Х и Y)
export type TSeriesPoint = [number, number];

// Тип для всей диаграммы одного варианта
export interface TSeries {
    name: string;
    data: TSeriesPoint[];
    color: string;
};

// Тип для всех диаграмм всех вариантов
export type TAllSeries = TSeries[];

export type TTheme = "light" | "dark";

export type TTooltipItem = {
    name: string;
    value: number;
    color: string;
};

export type TLineStyle = 'line' | 'smooth' | 'area';

