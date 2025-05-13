
import React, { useState } from "react";
import { PatientData } from "@/types/PatientData";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface PatientTableProps {
  data: PatientData[];
}

const PatientTable = ({ data }: PatientTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = data.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date function
  const formatVisitDate = (dateString: string) => {
    if (!dateString) return "-";
    
    // Handle Excel serial numbers (which are days since 1900-01-01)
    if (!isNaN(Number(dateString))) {
      // Convert Excel date serial to JavaScript Date
      // Excel's epoch starts on 1900-01-01, but there's a leap year bug
      // where Excel incorrectly assumes 1900 is a leap year
      const excelEpoch = new Date(1899, 11, 30);
      const daysToAdd = Number(dateString);
      const date = new Date(excelEpoch);
      date.setDate(date.getDate() + daysToAdd);
      
      return format(date, "MMM dd, yyyy");
    }
    
    // Try to parse as regular date string
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, "MMM dd, yyyy");
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
    
    // Return original if we can't parse it
    return dateString;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Patient Data</h2>
        <Input
          placeholder="Search by name or area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <ScrollArea className="h-[300px] border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Visit Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((patient, index) => (
                <TableRow key={`${patient.name}-${index}`}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.area}</TableCell>
                  <TableCell>{formatVisitDate(patient.visitDate)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {data.length === 0 
                    ? "No patient data uploaded yet." 
                    : "No matches found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="text-sm text-gray-500">
        Showing {filteredData.length} of {data.length} patients
      </div>
    </div>
  );
};

export default PatientTable;
