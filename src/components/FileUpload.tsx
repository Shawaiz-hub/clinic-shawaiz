
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientData } from "@/types/PatientData";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataUploaded: (data: PatientData[]) => void;
}

const FileUpload = ({ onDataUploaded }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const processFile = (file: File) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Process data to match our expected structure
        const processedData: PatientData[] = jsonData.map((row: any) => ({
          name: row.Name || '',
          age: parseInt(row.Age) || 0,
          gender: row.Gender || '',
          area: row.Area || '',
          visitDate: row['Visit Date'] || ''
        }));

        onDataUploaded(processedData);
        toast.success(`Successfully loaded ${processedData.length} patient records`);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast.error('Error processing Excel file. Please check the format.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file');
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        processFile(file);
      } else {
        toast.error('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <Input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
      />
      <Button 
        onClick={handleClick} 
        disabled={loading} 
        className="bg-blue-600 hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Upload Patient Data (Excel)'}
      </Button>
      <p className="text-sm text-gray-500">
        Upload Excel file with columns: Name, Age, Gender, Area, Visit Date
      </p>
    </div>
  );
};

export default FileUpload;
