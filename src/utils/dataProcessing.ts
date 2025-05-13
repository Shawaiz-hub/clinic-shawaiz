
import { PatientData, AreaCount, TimeSeriesData } from "@/types/PatientData";

// Process patient data to get counts by area
export const getAreaCounts = (data: PatientData[]): AreaCount[] => {
  const areaCounts: { [key: string]: number } = {};
  
  data.forEach(patient => {
    if (areaCounts[patient.area]) {
      areaCounts[patient.area]++;
    } else {
      areaCounts[patient.area] = 1;
    }
  });

  return Object.entries(areaCounts).map(([area, count]) => ({
    area,
    count
  }));
};

// Get time series data by month and area
export const getTimeSeriesData = (data: PatientData[]): TimeSeriesData[] => {
  const timeSeriesData: { [key: string]: { [key: string]: number } } = {};
  
  data.forEach(patient => {
    const date = new Date(patient.visitDate);
    const monthYear = date.toISOString().slice(0, 7); // YYYY-MM format
    
    if (!timeSeriesData[monthYear]) {
      timeSeriesData[monthYear] = {};
    }
    
    if (timeSeriesData[monthYear][patient.area]) {
      timeSeriesData[monthYear][patient.area]++;
    } else {
      timeSeriesData[monthYear][patient.area] = 1;
    }
  });
  
  const result: TimeSeriesData[] = [];
  
  Object.entries(timeSeriesData).forEach(([date, areas]) => {
    Object.entries(areas).forEach(([area, count]) => {
      result.push({
        date,
        area,
        count
      });
    });
  });
  
  return result;
};

// Get best area recommendation based on patient counts
export const getBestAreaRecommendation = (areaCounts: AreaCount[]): AreaCount | null => {
  if (!areaCounts.length) return null;
  
  return areaCounts.reduce((max, current) => 
    current.count > max.count ? current : max, 
    areaCounts[0]
  );
};

// Generate basic predictions (in real app would use ML model)
export const generatePredictions = (
  timeSeriesData: TimeSeriesData[], 
  area: string
): { date: string; prediction: number }[] => {
  const areaData = timeSeriesData.filter(d => d.area === area);
  
  // For demo purposes, we'll generate a simple linear growth model
  // In a real app, you'd use Prophet or other ML model here
  const lastDataPoint = areaData[areaData.length - 1];
  const result = [];
  
  if (!lastDataPoint) return [];
  
  const baseValue = lastDataPoint.count;
  const baseDate = new Date(lastDataPoint.date);
  
  // Generate predictions for the next 6 months with a synthetic growth rate
  for (let i = 1; i <= 6; i++) {
    const nextMonth = new Date(baseDate);
    nextMonth.setMonth(baseDate.getMonth() + i);
    
    // Add a simple growth factor (10% month-over-month)
    const prediction = Math.round(baseValue * (1 + 0.1 * i));
    
    result.push({
      date: nextMonth.toISOString().slice(0, 7),
      prediction
    });
  }
  
  return result;
};
