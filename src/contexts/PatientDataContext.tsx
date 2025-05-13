
import React, { createContext, useState } from "react";
import { PatientData } from "@/types/PatientData";

interface PatientDataContextType {
  patientData: PatientData[];
  setPatientData: React.Dispatch<React.SetStateAction<PatientData[]>>;
}

export const PatientDataContext = createContext<PatientDataContextType>({
  patientData: [],
  setPatientData: () => {},
});

export const PatientDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  
  return (
    <PatientDataContext.Provider value={{ patientData, setPatientData }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => {
  const context = React.useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error("usePatientData must be used within a PatientDataProvider");
  }
  return context;
};
