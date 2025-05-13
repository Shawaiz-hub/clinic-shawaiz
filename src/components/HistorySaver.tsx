
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { PatientData } from '@/types/PatientData';
import { usePatientData } from '@/contexts/PatientDataContext';
import { History, FileUp, Trash2 } from 'lucide-react';

interface UploadHistory {
  id: string;
  date: string;
  recordCount: number;
  data: PatientData[];
}

const HistorySaver = () => {
  const { patientData, setPatientData } = usePatientData();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<UploadHistory[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('uploadHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing upload history:", error);
      }
    }
  }, []);

  // Save current data to history
  const saveToHistory = () => {
    if (patientData.length === 0) {
      toast.error("No data to save in history");
      return;
    }
    
    const newEntry: UploadHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      recordCount: patientData.length,
      data: [...patientData]
    };
    
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
    toast.success("Current data saved to history");
  };

  // Load data from history
  const loadFromHistory = (entry: UploadHistory) => {
    setPatientData(entry.data);
    setOpen(false);
    toast.success(`Loaded ${entry.recordCount} records from history`);
  };

  // Delete entry from history
  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
    toast.success("Entry removed from history");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={saveToHistory}
        >
          <FileUp className="h-4 w-4" />
          <span>Save to History</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => setOpen(true)}
        >
          <History className="h-4 w-4" />
          <span>View History</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload History</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[300px] pr-4">
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div 
                    key={entry.id}
                    className="p-3 border rounded-md hover:bg-accent cursor-pointer flex justify-between items-center"
                    onClick={() => loadFromHistory(entry)}
                  >
                    <div>
                      <p className="font-medium">{entry.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.recordCount} records
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => deleteFromHistory(entry.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No history available yet
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistorySaver;
