
import React, { createContext, useContext, useState, useEffect } from "react";
import { PatientData } from "@/types/PatientData";

interface PatientDataContextType {
  patientData: PatientData[];
  setPatientData: React.Dispatch<React.SetStateAction<PatientData[]>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const PatientDataContext = createContext<PatientDataContextType>({
  patientData: [],
  setPatientData: () => {},
  theme: 'light',
  toggleTheme: () => {},
});

export const PatientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load patient data from localStorage if available
  const [patientData, setPatientData] = useState<PatientData[]>(() => {
    const savedData = localStorage.getItem('patientData');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' ? 'dark' : 'light');
  });

  // Save patient data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('patientData', JSON.stringify(patientData));
  }, [patientData]);
  
  // Update document class and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <PatientDataContext.Provider value={{ patientData, setPatientData, theme, toggleTheme }}>
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
