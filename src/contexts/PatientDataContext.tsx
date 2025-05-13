
import React, { createContext, useContext, useState } from "react";
import { PatientData } from "@/types/PatientData";

interface PatientDataContextType {
  patientData: PatientData[];
  setPatientData: React.Dispatch<React.SetStateAction<PatientData[]>>;
}

export const PatientDataContext = createContext<PatientDataContextType>({
  patientData: [],
  setPatientData: () => {},
});

export const PatientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  
  return (
    <PatientDataContext.Provider value={{ patientData, setPatientData }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => {
  const context = useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error("usePatientData must be used within a PatientDataProvider");
  }
  return context;
};
