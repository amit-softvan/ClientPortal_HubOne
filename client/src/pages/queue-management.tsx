import { useState } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Download, 
  RefreshCw, 
  Play, 
  StickyNote, 
  Eye,
  Check,
  ChevronsUpDown,
  X
} from "lucide-react";
import { mockQueueItems, filterOptions } from "@/data/static-data";
import { QueueItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function QueueManagement() {
  const { toast } = useToast();
  const [queueItems, setQueueItems] = useState<QueueItem[]>(mockQueueItems);
  const [filters, setFilters] = useState({
    provider: "All Providers",
    portfolio: "All Portfolios",
    program: "All Programs",
    queue: "All Queues",
    disposition: "All Dispositions",
    insurance: [] as string[], // Changed to array for multi-select
    insuranceType: "All Types",
  });
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [note, setNote] = useState("");

  const handleMarkComplete = (item: QueueItem) => {
    setQueueItems(items => 
      items.map(qi => 
        qi.id === item.id 
          ? { ...qi, status: "completed", updatedAt: new Date() }
          : qi
      )
    );
    toast({
      title: "Task completed",
      description: `Task for ${item.patientName} has been marked as complete.`,
    });
  };

  const handleAddNote = (item: QueueItem) => {
    setSelectedItem(item);
    // Handle notes as array of note objects or fallback to empty string
    const lastNote = Array.isArray(item.notes) && item.notes.length > 0 
      ? item.notes[item.notes.length - 1]?.content || ""
      : "";
    setNote(lastNote);
    setShowNoteDialog(true);
  };

  const handleSaveNote = () => {
    if (selectedItem) {
      setQueueItems(items => 
        items.map(qi => 
          qi.id === selectedItem.id 
            ? { ...qi, notes: note, updatedAt: new Date() }
            : qi
        )
      );
      toast({
        title: "Note saved",
        description: `Note added for ${selectedItem.patientName}.`,
      });
    }
    setShowNoteDialog(false);
    setSelectedItem(null);
    setNote("");
  };

  const handleExport = () => {
    toast({
      title: "Exporting data",
      description: "Your queue data is being prepared for download...",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Data refreshed",
      description: "Queue data has been updated with the latest information.",
    });
  };

  const filteredItems = queueItems
    .filter(item => {
      // Apply completed filter first
      if (showCompleted) {
        if (item.status !== "completed") return false;
      } else {
        if (item.status === "completed") return false;
      }

      // Apply other filters
      return (
        (filters.provider === "All Providers" || item.provider === filters.provider) &&
        (filters.portfolio === "All Portfolios" || item.portfolio === filters.portfolio) &&
        (filters.program === "All Programs" || item.program === filters.program) &&
        (filters.queue === "All Queues" || item.queue === filters.queue) &&
        (filters.disposition === "All Dispositions" || item.disposition === filters.disposition) &&
        (filters.insurance.length === 0 || filters.insurance.includes(item.insurance)) &&
        (filters.insuranceType === "All Types" || item.insuranceType === filters.insuranceType)
      );
    })
    // Sort by requested date in descending order (most recent first)
    .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());

  return (
    <MainLayout title="Queue Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">Queue Management</h1>
          <p className="page-subtitle">
            Manage and track your assigned tasks and workflows
          </p>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
              <div>
                <Label className="text-sm font-medium">Provider</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between text-left font-normal"
                      data-testid="filter-provider"
                    >
                      {filters.provider || "Select provider..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search providers..." />
                      <CommandList>
                        <CommandEmpty>No provider found.</CommandEmpty>
                        <CommandGroup>
                          {filterOptions.providers.map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={(currentValue) => {
                                setFilters({...filters, provider: currentValue});
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  filters.provider === option ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {option}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium">Portfolio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between text-left font-normal"
                      data-testid="filter-portfolio"
                    >
                      {filters.portfolio || "Select portfolio..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search portfolios..." />
                      <CommandList>
                        <CommandEmpty>No portfolio found.</CommandEmpty>
                        <CommandGroup>
                          {filterOptions.portfolios.map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={(currentValue) => {
                                setFilters({...filters, portfolio: currentValue});
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  filters.portfolio === option ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {option}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium">Programs</Label>
                <Select 
                  value={filters.program} 
                  onValueChange={(value) => setFilters({...filters, program: value})}
                >
                  <SelectTrigger data-testid="filter-program">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.programs.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Queue</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between text-left font-normal"
                      data-testid="filter-queue"
                    >
                      {filters.queue || "Select queue..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search queues..." />
                      <CommandList>
                        <CommandEmpty>No queue found.</CommandEmpty>
                        <CommandGroup>
                          {filterOptions.queues.map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={(currentValue) => {
                                setFilters({...filters, queue: currentValue});
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  filters.queue === option ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {option}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium">Dispositions</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between text-left font-normal"
                      data-testid="filter-disposition"
                    >
                      {filters.disposition || "Select disposition..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search dispositions..." />
                      <CommandList>
                        <CommandEmpty>No disposition found.</CommandEmpty>
                        <CommandGroup>
                          {filterOptions.dispositions.map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={(currentValue) => {
                                setFilters({...filters, disposition: currentValue});
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  filters.disposition === option ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {option}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium">Insurance (Multi-select)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between text-left font-normal"
                      data-testid="filter-insurance"
                    >
                      {filters.insurance.length === 0
                        ? "Select insurance..."
                        : `${filters.insurance.length} selected`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search insurance..." />
                      <CommandList>
                        <CommandEmpty>No insurance found.</CommandEmpty>
                        <CommandGroup>
                          {filterOptions.insurances
                            .filter(option => option !== "All Insurance")
                            .map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={(currentValue) => {
                                const newInsurance = filters.insurance.includes(currentValue)
                                  ? filters.insurance.filter(item => item !== currentValue)
                                  : [...filters.insurance, currentValue];
                                setFilters({...filters, insurance: newInsurance});
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  filters.insurance.includes(option) ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {option}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {filters.insurance.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.insurance.map((insurance) => (
                      <div
                        key={insurance}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
                      >
                        {insurance}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-blue-900"
                          onClick={() => {
                            const newInsurance = filters.insurance.filter(item => item !== insurance);
                            setFilters({...filters, insurance: newInsurance});
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Insurance Type</Label>
                <Select 
                  value={filters.insuranceType} 
                  onValueChange={(value) => setFilters({...filters, insuranceType: value})}
                >
                  <SelectTrigger data-testid="filter-insurance-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.insuranceTypes.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
                  data-testid="checkbox-show-completed"
                />
                <Label htmlFor="show-completed" className="text-sm font-medium">
                  Show Completed
                </Label>
              </div>

              <div className="flex gap-3">
                <Button data-testid="button-apply-filters">
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilters({
                      provider: "All Providers",
                      portfolio: "All Portfolios",
                      program: "All Programs",
                      queue: "All Queues",
                      disposition: "All Dispositions",
                      insurance: [],
                      insuranceType: "All Types",
                    });
                    setShowCompleted(false);
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Items Table */}
        <Card className="dashboard-card">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                Queue Items ({filteredItems.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExport}
                  data-testid="button-export"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleRefresh}
                  data-testid="button-refresh"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Programs</TableHead>
                    <TableHead>Queue</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead>Disposition</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} data-testid={`queue-row-${item.id}`}>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{item.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.accountNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.dateOfBirth ? format(item.dateOfBirth, "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{item.provider}</TableCell>
                      <TableCell>{item.program}</TableCell>
                      <TableCell>{item.queue}</TableCell>
                      <TableCell>{item.portfolio}</TableCell>
                      <TableCell>{item.disposition}</TableCell>
                      <TableCell>
                        <div>
                          <div>{item.insurance}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {item.insuranceType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(item.requestedDate, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Link href={`/task-detail/${item.id}/view`}>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-view-${item.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddNote(item)}
                            data-testid={`button-note-${item.id}`}
                          >
                            <StickyNote className="h-4 w-4" />
                          </Button>
                          {item.status !== "completed" && (
                            <Link href={`/task-detail/${item.id}/start`}>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-start-task-${item.id}`}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note for {selectedItem?.patientName} ({selectedItem?.accountNumber})
            </DialogDescription>
          </DialogHeader>
          
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your note here..."
              className="mt-1"
              rows={4}
              data-testid="textarea-note"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNoteDialog(false)}
              data-testid="button-cancel-note"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNote} data-testid="button-save-note">
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
