
export interface PatientData {
  name: string;
  age: number;
  gender: string;
  area: string;
  visitDate: string;
}

export interface AreaCount {
  area: string;
  count: number;
}

export interface TimeSeriesData {
  date: string;
  area: string;
  count: number;
}

export interface PredictionData {
  date: string;
  prediction: number;
  upper: number;
  lower: number;
}
