
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

interface PatientTableProps {
  data: PatientData[];
}

const PatientTable = ({ data }: PatientTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = data.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <TableCell>{patient.visitDate}</TableCell>
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
