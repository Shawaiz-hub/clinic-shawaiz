
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Download, Edit, Trash2, Plus } from "lucide-react";

interface ExcelManagementProps {
  data: PatientData[];
  onDataUpdate: (data: PatientData[]) => void;
}

const ExcelManagement = ({ data, onDataUpdate }: ExcelManagementProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [editedPatient, setEditedPatient] = useState<PatientData>({
    name: "",
    age: 0,
    gender: "",
    area: "",
    visitDate: ""
  });

  // Handle editing a patient
  const handleEdit = (patient: PatientData) => {
    setSelectedPatient(patient);
    setEditedPatient({ ...patient });
    setEditOpen(true);
  };

  // Handle adding a new patient
  const handleAddNew = () => {
    setEditedPatient({
      name: "",
      age: 0,
      gender: "",
      area: "",
      visitDate: new Date().toISOString().split('T')[0]
    });
    setAddOpen(true);
  };

  // Handle deleting a patient
  const handleDelete = (patient: PatientData) => {
    const updatedData = data.filter(p => p !== patient);
    onDataUpdate(updatedData);
    toast.success("Patient record deleted successfully");
  };

  // Save edited patient data
  const saveEditedPatient = () => {
    if (selectedPatient) {
      const updatedData = data.map(patient => 
        patient === selectedPatient ? editedPatient : patient
      );
      onDataUpdate(updatedData);
      setEditOpen(false);
      toast.success("Patient record updated successfully");
    }
  };

  // Save new patient data
  const saveNewPatient = () => {
    if (validatePatient(editedPatient)) {
      const updatedData = [...data, editedPatient];
      onDataUpdate(updatedData);
      setAddOpen(false);
      toast.success("Patient record added successfully");
    }
  };

  // Validate patient data
  const validatePatient = (patient: PatientData): boolean => {
    if (!patient.name) {
      toast.error("Patient name is required");
      return false;
    }
    if (patient.age <= 0) {
      toast.error("Age must be a positive number");
      return false;
    }
    if (!patient.gender) {
      toast.error("Gender is required");
      return false;
    }
    if (!patient.area) {
      toast.error("Area is required");
      return false;
    }
    if (!patient.visitDate) {
      toast.error("Visit date is required");
      return false;
    }
    return true;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  // Download Excel file
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(patient => ({
      Name: patient.name,
      Age: patient.age,
      Gender: patient.gender,
      Area: patient.area,
      'Visit Date': patient.visitDate
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    
    // Generate Excel file
    XLSX.writeFile(workbook, "patient_data.xlsx");
    toast.success("Excel file downloaded successfully");
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Excel Management</h2>
        <div className="space-x-2">
          <Button 
            onClick={handleAddNew} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Patient
          </Button>
          <Button 
            onClick={handleDownload} 
            variant="outline"
            disabled={data.length === 0}
          >
            <Download className="mr-2 h-4 w-4" /> Download Excel
          </Button>
        </div>
      </div>

      {/* Patient Table */}
      <ScrollArea className="h-[500px] border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((patient, index) => (
                <TableRow key={`${patient.name}-${index}`}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.area}</TableCell>
                  <TableCell>{patient.visitDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(patient)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(patient)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No patient data available. Upload or add patient records.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={editedPatient.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">Age</label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={editedPatient.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                <Input
                  id="gender"
                  name="gender"
                  value={editedPatient.gender}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">Area</label>
                <Input
                  id="area"
                  name="area"
                  value={editedPatient.area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label htmlFor="visitDate" className="text-sm font-medium">Visit Date</label>
                <Input
                  id="visitDate"
                  name="visitDate"
                  type="date"
                  value={editedPatient.visitDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedPatient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={editedPatient.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">Age</label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={editedPatient.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                <Input
                  id="gender"
                  name="gender"
                  value={editedPatient.gender}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">Area</label>
                <Input
                  id="area"
                  name="area"
                  value={editedPatient.area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label htmlFor="visitDate" className="text-sm font-medium">Visit Date</label>
                <Input
                  id="visitDate"
                  name="visitDate"
                  type="date"
                  value={editedPatient.visitDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={saveNewPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExcelManagement;
