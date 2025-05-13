
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Download, Edit, Trash2, Plus, ArrowLeft, Moon, Sun } from "lucide-react";
import { usePatientData } from "@/contexts/PatientDataContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Logo from "@/components/Logo";
import HistorySaver from "@/components/HistorySaver";

const ExcelManagement = () => {
  const { patientData, setPatientData, theme, toggleTheme } = usePatientData();
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

  // Format date function for displaying
  const formatVisitDate = (dateString: string) => {
    if (!dateString) return "-";
    
    // Handle Excel serial numbers
    if (!isNaN(Number(dateString))) {
      const excelEpoch = new Date(1899, 11, 30);
      const daysToAdd = Number(dateString);
      const date = new Date(excelEpoch);
      date.setDate(date.getDate() + daysToAdd);
      
      return format(date, "yyyy-MM-dd");
    }
    
    // Try to parse as regular date string
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, "yyyy-MM-dd");
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
    
    return dateString;
  };

  // Handle editing a patient
  const handleEdit = (patient: PatientData) => {
    setSelectedPatient(patient);
    
    // Format the date for the input field
    const formattedPatient = {
      ...patient,
      visitDate: formatVisitDate(patient.visitDate)
    };
    
    setEditedPatient(formattedPatient);
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
    const updatedData = patientData.filter(p => p !== patient);
    setPatientData(updatedData);
    toast.success("Patient record deleted successfully");
  };

  // Save edited patient data
  const saveEditedPatient = () => {
    if (selectedPatient) {
      const updatedData = patientData.map(patient => 
        patient === selectedPatient ? editedPatient : patient
      );
      setPatientData(updatedData);
      setEditOpen(false);
      toast.success("Patient record updated successfully");
    }
  };

  // Save new patient data
  const saveNewPatient = () => {
    if (validatePatient(editedPatient)) {
      const updatedData = [...patientData, editedPatient];
      setPatientData(updatedData);
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
    const worksheet = XLSX.utils.json_to_sheet(patientData.map(patient => ({
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 bg-gradient-to-br from-background to-secondary">
      {/* Electric-inspired background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-circuit-pattern bg-repeat"></div>
      </div>
      
      <div className="relative z-10 container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Logo />
              <h2 className="text-2xl font-bold font-heading">Excel Management</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={handleAddNew} 
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Patient
            </Button>
            <Button 
              onClick={handleDownload} 
              variant="outline"
              disabled={patientData.length === 0}
            >
              <Download className="mr-2 h-4 w-4" /> Download Excel
            </Button>
          </div>
        </div>
        
        {/* History Saver */}
        <div className="flex justify-end">
          <HistorySaver />
        </div>

        {/* Patient Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted z-10">
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
                {patientData.length > 0 ? (
                  patientData.map((patient, index) => (
                    <TableRow key={`${patient.name}-${index}`}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.area}</TableCell>
                      <TableCell>{formatVisitDate(patient.visitDate)}</TableCell>
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
        </div>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-heading">Edit Patient Record</DialogTitle>
              <DialogDescription>Make changes to the patient information below.</DialogDescription>
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
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-heading">Add New Patient</DialogTitle>
              <DialogDescription>Enter the patient information below.</DialogDescription>
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
        
        {/* Footer */}
        <footer className="bg-card border-t mt-10 p-4 rounded-lg">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 Clinic Location Analysis Dashboard by <span className="font-bold text-primary">Shawaiz (Data Scientist)</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExcelManagement;
