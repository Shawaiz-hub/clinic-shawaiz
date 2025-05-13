
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaCount } from "@/types/PatientData";
import { MapPin, TrendingUp, Users } from "lucide-react";

interface RecommendationCardProps {
  bestArea: AreaCount | null;
  totalPatients: number;
}

const RecommendationCard = ({ bestArea, totalPatients }: RecommendationCardProps) => {
  if (!bestArea) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Best Area Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p>Upload patient data to get recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const percentage = ((bestArea.count / totalPatients) * 100).toFixed(1);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-700 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Best Area Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h3 className="text-2xl font-bold text-blue-800">{bestArea.area}</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Patient Count</span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xl font-semibold">{bestArea.count}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Percentage</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xl font-semibold">{percentage}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              Based on patient distribution analysis, <strong>{bestArea.area}</strong> is 
              the recommended location for a new clinic, with {bestArea.count} patients 
              ({percentage}% of total patients).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
