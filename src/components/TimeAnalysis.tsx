
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeSeriesData } from "@/types/PatientData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TimeAnalysisProps {
  timeSeriesData: TimeSeriesData[];
}

const TimeAnalysis = ({ timeSeriesData }: TimeAnalysisProps) => {
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const uniqueAreas = useMemo(() => {
    const areas = new Set<string>();
    timeSeriesData.forEach((item) => areas.add(item.area));
    return ["all", ...Array.from(areas)];
  }, [timeSeriesData]);

  const processedData = useMemo(() => {
    // Group by date
    const groupedByDate: { [key: string]: { [key: string]: number } } = {};
    
    timeSeriesData.forEach((item) => {
      if (!groupedByDate[item.date]) {
        groupedByDate[item.date] = {};
      }
      groupedByDate[item.date][item.area] = item.count;
    });

    // Create chart data
    return Object.entries(groupedByDate)
      .map(([date, areas]) => {
        const dataPoint: { [key: string]: any } = { date };
        
        // For all areas
        if (selectedArea === "all") {
          Object.entries(areas).forEach(([area, count]) => {
            dataPoint[area] = count;
          });
        } 
        // For specific area
        else {
          dataPoint[selectedArea] = areas[selectedArea] || 0;
        }
        
        // Add total for all view
        if (selectedArea === "all") {
          dataPoint.total = Object.values(areas).reduce((sum: number, count: number) => sum + count, 0);
        }
        
        return dataPoint;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [timeSeriesData, selectedArea]);

  // Generate lines for chart
  const generateLines = () => {
    if (selectedArea === "all") {
      // Create a line for each area plus a total line
      const areaSet = new Set<string>();
      timeSeriesData.forEach((item) => areaSet.add(item.area));
      const areas = Array.from(areaSet);
      
      return [
        <Line
          key="total"
          type="monotone"
          dataKey="total"
          stroke="#1A73E8"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Total"
        />,
        ...areas.map((area, index) => (
          <Line
            key={area}
            type="monotone"
            dataKey={area}
            stroke={`hsl(${(index * 30) % 360}, 70%, 50%)`}
            strokeWidth={1.5}
            dot={{ r: 3 }}
            name={area}
          />
        )),
      ];
    } else {
      // Create a single line for the selected area
      return [
        <Line
          key={selectedArea}
          type="monotone"
          dataKey={selectedArea}
          stroke="#1A73E8"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name={selectedArea}
        />,
      ];
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Time-Based Patient Analysis</CardTitle>
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
                  {area === "all" ? "All Areas" : area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                tickFormatter={(date) => {
                  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  });
                  return formattedDate;
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => {
                  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  });
                  return `Date: ${formattedDate}`;
                }}
                formatter={(value: number, name: string) => {
                  return [`${value} patients`, name === "total" ? "Total" : name];
                }}
              />
              <Legend />
              {generateLines()}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {selectedArea === "all"
            ? "Showing patient trends across all areas over time"
            : `Showing patient trends for ${selectedArea} over time`}
        </p>
      </CardContent>
    </Card>
  );
};

export default TimeAnalysis;
