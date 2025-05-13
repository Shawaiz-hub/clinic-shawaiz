
import React, { useState } from "react";
import { PatientData, AreaCount, TimeSeriesData } from "@/types/PatientData";
import FileUpload from "@/components/FileUpload";
import PatientTable from "@/components/PatientTable";
import AreaDistribution from "@/components/AreaDistribution";
import TimeAnalysis from "@/components/TimeAnalysis";
import PredictionModel from "@/components/PredictionModel";
import RecommendationCard from "@/components/RecommendationCard";
import { getAreaCounts, getTimeSeriesData, getBestAreaRecommendation } from "@/utils/dataProcessing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePatientData } from "@/contexts/PatientDataContext";

const Index = () => {
  const { patientData, setPatientData } = usePatientData();
  const [areaCounts, setAreaCounts] = useState<AreaCount[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [bestArea, setBestArea] = useState<AreaCount | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleDataUploaded = (data: PatientData[]) => {
    setPatientData(data);
    
    // Process data for visualizations
    const areaCountsData = getAreaCounts(data);
    setAreaCounts(areaCountsData);
    
    // Process time series data
    const timeSeriesResult = getTimeSeriesData(data);
    setTimeSeriesData(timeSeriesResult);
    
    // Get best area recommendation
    setBestArea(getBestAreaRecommendation(areaCountsData));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                Clinic Location Analysis Dashboard
              </h1>
              <p className="text-gray-500">
                Analyze patient data to find the optimal location for a new clinic
              </p>
            </div>
            <div className="flex items-center gap-4">
              {patientData.length > 0 && (
                <span className="text-sm text-gray-500">{patientData.length} patients analyzed</span>
              )}
              <Link to="/excel-management">
                <Button variant="outline">Manage Excel Data</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6">
          <FileUpload onDataUploaded={handleDataUploaded} />
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="data">Patient Data</TabsTrigger>
              <TabsTrigger value="analysis">Advanced Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              {patientData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <AreaDistribution areaCounts={areaCounts} />
                    </div>
                    <div>
                      <RecommendationCard bestArea={bestArea} totalPatients={patientData.length} />
                    </div>
                  </div>
                  
                  <TimeAnalysis timeSeriesData={timeSeriesData} />
                </>
              ) : (
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Welcome to the Clinic Location Analysis Dashboard
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
                    Upload your patient Excel file to analyze distribution patterns and identify the 
                    optimal location for your new clinic. The dashboard will process your data and 
                    provide insights through visualizations and predictive analytics.
                  </p>
                  <div className="max-w-md mx-auto p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-700">Required Excel Columns:</h3>
                    <ul className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      <li>• Name: Patient's name</li>
                      <li>• Age: Patient's age</li>
                      <li>• Gender: Male/Female/Other</li>
                      <li>• Area: Residential area</li>
                      <li>• Visit Date: Appointment date</li>
                    </ul>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="data">
              <PatientTable data={patientData} />
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-6">
              <PredictionModel timeSeriesData={timeSeriesData} />
              {patientData.length > 0 && (
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-3">Analysis Insights</h3>
                  <p className="text-gray-600 mb-4">
                    Based on the patient data analysis, here are some key insights:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>
                        The highest concentration of patients is from <strong>{bestArea?.area}</strong> with {bestArea?.count} patients.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>
                        Patient distribution across areas shows {areaCounts.length} distinct residential areas.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>
                        Time trend analysis reveals patterns in patient visits that can help with staffing and resource allocation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>
                        Prediction models suggest potential growth in patient numbers for targeted areas.
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t mt-10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 Clinic Location Analysis Dashboard</p>
            <p>Data visualizations powered by Recharts</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
