
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TimeSeriesData, PredictionData } from "@/types/PatientData";
import { generatePredictions } from "@/utils/dataProcessing";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

interface PredictionModelProps {
  timeSeriesData: TimeSeriesData[];
}

const PredictionModel = ({ timeSeriesData }: PredictionModelProps) => {
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [uniqueAreas, setUniqueAreas] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique areas
    const areas = new Set<string>();
    timeSeriesData.forEach((item) => areas.add(item.area));
    setUniqueAreas(Array.from(areas));
    
    // Set default area if available
    if (areas.size > 0 && !selectedArea) {
      const firstArea = Array.from(areas)[0];
      setSelectedArea(firstArea);
    }
  }, [timeSeriesData]);

  const handleGeneratePrediction = () => {
    if (!selectedArea) return;
    
    // Get historical data for the area
    const areaData = timeSeriesData.filter(d => d.area === selectedArea);
    if (areaData.length === 0) return;
    
    // Process historical data for charting
    const historicalByDate: { [date: string]: number } = {};
    areaData.forEach(d => {
      historicalByDate[d.date] = (historicalByDate[d.date] || 0) + d.count;
    });
    
    const historicalData = Object.entries(historicalByDate)
      .map(([date, count]) => ({
        date,
        patients: count,
        type: 'historical'
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Generate predictions (simple model for demo)
    const forecastData = generatePredictions(timeSeriesData, selectedArea)
      .map(d => ({
        date: d.date,
        patients: d.prediction,
        type: 'prediction'
      }));
    
    // Combine both datasets
    setPredictions([...historicalData, ...forecastData]);
  };

  useEffect(() => {
    if (selectedArea) {
      handleGeneratePrediction();
    }
  }, [selectedArea]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle>Patient Growth Prediction</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={selectedArea}
              onValueChange={setSelectedArea}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {uniqueAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGeneratePrediction}>Refresh</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {predictions.length > 0 ? (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={predictions}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickFormatter={formatDate}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={formatDate}
                  formatter={(value: number) => [`${value} patients`, "Patient Count"]}
                />
                <Legend />
                <ReferenceLine x={predictions.find(d => d.type === 'prediction')?.date} 
                  stroke="red" 
                  strokeDasharray="3 3" 
                  label={{ value: "Prediction Start", position: "top" }} />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#1A73E8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Patients"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[350px] text-gray-400">
            {timeSeriesData.length === 0
              ? "Upload patient data to see predictions"
              : "Select an area to generate predictions"}
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {selectedArea ? `Showing 6-month prediction for ${selectedArea} based on historical data` : ""}
        </p>
        <p className="text-xs text-gray-400 italic mt-1">
          Note: This is a simplified prediction model. In a real application, machine learning models would provide more accurate forecasting.
        </p>
      </CardContent>
    </Card>
  );
};

export default PredictionModel;
