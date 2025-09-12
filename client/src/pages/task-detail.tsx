import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Edit, Calendar, User, FileText, CreditCard, Shield, Hospital, Stethoscope, StickyNote, MapPin, Building, Phone, Clock, Activity, AlertTriangle, ListTodo, Users } from "lucide-react";
import { mockQueueItems, mockUsers } from "@/data/static-data";
import { QueueItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInYears } from "date-fns";
import { Link } from "wouter";

export default function TaskDetail() {
  const { toast } = useToast();
  const [, params] = useRoute("/task-detail/:id/:mode");
  const [originalTask, setOriginalTask] = useState<QueueItem | null>(null);
  const [currentTask, setCurrentTask] = useState<QueueItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Extract primitive values to avoid object dependency issues
  const id = params?.id;
  const mode = params?.mode;

  // Effect 1: Load task when id changes
  useEffect(() => {
    if (!id) return;
    
    const foundTask = mockQueueItems.find(item => item.id === id);
    if (!foundTask) return;
    
    setOriginalTask(foundTask);
    // Only reset currentTask if we're loading a different task
    setCurrentTask(prev => (prev?.id === foundTask.id ? prev : { ...foundTask }));
  }, [id]);

  // Effect 2: Set mode flags when mode changes
  useEffect(() => {
    setIsReadOnly(mode === "view");
    setIsEditing(mode === "start");
  }, [mode]);

  const handleSave = () => {
    if (currentTask) {
      // In a real app, this would save to the backend
      // For now, just update the local state and show success
      toast({
        title: "Task Updated",
        description: `Changes for ${currentTask.patientName} have been saved successfully.`,
      });
      setIsEditing(false);
    }
  };

  const updateTaskField = (field: keyof QueueItem, value: any) => {
    if (currentTask) {
      setCurrentTask(prev => prev ? ({ ...prev, [field]: value }) : null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!originalTask || !currentTask) {
    return <MainLayout title="Task Detail">Loading...</MainLayout>;
  }

  const assignedUser = mockUsers.find(user => user.id === originalTask.assignedTo);

  return (
    <MainLayout title="Task Detail">
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/queue-management">
            <Button variant="outline" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Queue
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Task Detail</h1>
            <p className="text-muted-foreground">
              {isReadOnly ? "Viewing task details" : "Editing task details"}
            </p>
          </div>
        </div>

        {/* Task Header Card - Three Section Layout */}
        <Card className="overflow-hidden">
          <div className="task-header p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Section - Patient Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5" />
                  <span className="font-semibold text-lg">Patient Information</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h2 className="text-xl font-bold" data-testid="task-patient-name">
                      {currentTask.patientName} 
                      {currentTask.patientId && <span className="text-white/80"> [#{currentTask.patientId}]</span>}
                    </h2>
                  </div>
                  
                  {currentTask.dateOfBirth && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(currentTask.dateOfBirth, "MM/dd/yyyy")} 
                        (Age: {differenceInYears(new Date(), currentTask.dateOfBirth)})
                      </span>
                    </div>
                  )}
                  
                  {currentTask.insurancePolicyNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>Policy: {currentTask.insurancePolicyNumber}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    <span>{currentTask.insurance}</span>
                  </div>
                  
                  <div className="text-sm text-white/80">
                    {currentTask.accountNumber && (
                      <span data-testid="task-account-number">Account: {currentTask.accountNumber}</span>
                    )}
                  </div>
                  
                  {currentTask.providerNpi && (
                    <div className="text-sm text-white/80">
                      Provider: {currentTask.provider} ({currentTask.providerNpi})
                    </div>
                  )}
                </div>
              </div>

              {/* Center Section - Provider/Location Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold text-lg">Provider/Location</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="font-medium">{currentTask.provider}</div>
                    {currentTask.providerLocation && (
                      <div className="text-sm text-white/80">{currentTask.providerLocation}</div>
                    )}
                  </div>
                  
                  {currentTask.providerCity && currentTask.providerState && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{currentTask.providerCity}, {currentTask.providerState}</span>
                    </div>
                  )}
                  
                  {currentTask.providerPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{currentTask.providerPhone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Hospital className="h-4 w-4" />
                    <span>{currentTask.portfolio}</span>
                  </div>
                </div>
              </div>

              {/* Right Section - Queue Status Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold text-lg">Queue Status</span>
                </div>
                
                <div className="space-y-2">
                  {currentTask.providerPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{currentTask.providerPhone}</span>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4" />
                      <span>Status: {currentTask.status}</span>
                      <StatusBadge status={currentTask.status} />
                    </div>
                    <div className="text-xs text-white/70">
                      {format(currentTask.requestedDate, "MM/dd/yyyy hh:mm a")}
                    </div>
                  </div>
                  
                  {currentTask.priority && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        {currentTask.priority}
                        {currentTask.urgencyHours && ` - ${currentTask.urgencyHours}h`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <ListTodo className="h-4 w-4" />
                    <span>{currentTask.queue}</span>
                  </div>
                  
                  <div className="text-sm">
                    <Badge variant="secondary" data-testid="task-program">
                      {currentTask.program}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            {!isReadOnly && (
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/20">
                {!isEditing ? (
                  <Button 
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                    data-testid="button-edit-task"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      data-testid="button-cancel-edit"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      data-testid="button-save-task"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="customer" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-7 min-w-[800px]">
              <TabsTrigger value="customer" data-testid="tab-customer">
                <User className="h-4 w-4 mr-2" />
                Customer Info
              </TabsTrigger>
              <TabsTrigger value="insurance" data-testid="tab-insurance">
                <Shield className="h-4 w-4 mr-2" />
                Insurance
              </TabsTrigger>
              <TabsTrigger value="ev-data" data-testid="tab-ev-data">
                <Hospital className="h-4 w-4 mr-2" />
                EV Data
              </TabsTrigger>
              <TabsTrigger value="pa-data" data-testid="tab-pa-data">
                <CreditCard className="h-4 w-4 mr-2" />
                PA Data
              </TabsTrigger>
              <TabsTrigger value="provider" data-testid="tab-provider">
                <Stethoscope className="h-4 w-4 mr-2" />
                Provider
              </TabsTrigger>
              <TabsTrigger value="records" data-testid="tab-records">
                <FileText className="h-4 w-4 mr-2" />
                Records
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">
                <StickyNote className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Customer Information Tab */}
          <TabsContent value="customer" className="mt-6">
            <div className="space-y-6">
              {/* Patient Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Identification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input 
                        value={currentTask.firstName || ""} 
                        onChange={(e) => updateTaskField('firstName', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label>Middle Name</Label>
                      <Input 
                        value={currentTask.middleName || ""} 
                        onChange={(e) => updateTaskField('middleName', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-middle-name"
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input 
                        value={currentTask.lastName || ""} 
                        onChange={(e) => updateTaskField('lastName', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Patient ID</Label>
                      <Input 
                        value={currentTask.patientId || ""} 
                        onChange={(e) => updateTaskField('patientId', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-patient-id"
                      />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input 
                        value={currentTask.accountNumber} 
                        onChange={(e) => updateTaskField('accountNumber', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-account-number"
                      />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input 
                        value={currentTask.dateOfBirth ? format(currentTask.dateOfBirth, "yyyy-MM-dd") : ""} 
                        type="date"
                        onChange={(e) => updateTaskField('dateOfBirth', e.target.value ? new Date(e.target.value) : null)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-date-of-birth"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Home Address</Label>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <div>
                          <Label>Street Address</Label>
                          <Input 
                            value={currentTask.homeAddress?.street || ""} 
                            onChange={(e) => updateTaskField('homeAddress', { ...(currentTask.homeAddress || {}), street: e.target.value })}
                            disabled={isReadOnly || !isEditing}
                            data-testid="input-home-street"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>City</Label>
                            <Input 
                              value={currentTask.homeAddress?.city || ""} 
                              onChange={(e) => updateTaskField('homeAddress', { ...(currentTask.homeAddress || {}), city: e.target.value })}
                              disabled={isReadOnly || !isEditing}
                              data-testid="input-home-city"
                            />
                          </div>
                          <div>
                            <Label>State</Label>
                            <Input 
                              value={currentTask.homeAddress?.state || ""} 
                              onChange={(e) => updateTaskField('homeAddress', { ...(currentTask.homeAddress || {}), state: e.target.value })}
                              disabled={isReadOnly || !isEditing}
                              data-testid="input-home-state"
                            />
                          </div>
                          <div>
                            <Label>ZIP Code</Label>
                            <Input 
                              value={currentTask.homeAddress?.zipCode || ""} 
                              onChange={(e) => updateTaskField('homeAddress', { ...(currentTask.homeAddress || {}), zipCode: e.target.value })}
                              disabled={isReadOnly || !isEditing}
                              data-testid="input-home-zip"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold">Mailing Address (if different)</Label>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <div>
                          <Label>Street Address</Label>
                          <Input 
                            value={currentTask.mailingAddress?.street || ""} 
                            onChange={(e) => updateTaskField('mailingAddress', { ...(currentTask.mailingAddress || {}), street: e.target.value })}
                            disabled={isReadOnly || !isEditing}
                            placeholder="Same as home address if empty"
                            data-testid="input-mailing-street"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>City</Label>
                            <Input 
                              value={currentTask.mailingAddress?.city || ""} 
                              onChange={(e) => updateTaskField('mailingAddress', { ...(currentTask.mailingAddress || {}), city: e.target.value })}
                              disabled={isReadOnly || !isEditing}
                              data-testid="input-mailing-city"
                            />
                          </div>
                          <div>
                            <Label>State</Label>
                            <Input 
                              value={currentTask.mailingAddress?.state || ""} 
                              onChange={(e) => updateTaskField('mailingAddress', { ...(currentTask.mailingAddress || {}), state: e.target.value })}
                              disabled={isReadOnly || !isEditing}
                              data-testid="input-mailing-state"
                            />
                          </div>
                          <div>
                            <Label>ZIP Code</Label>
                            <Input 
                              value={currentTask.mailingAddress?.zipCode || ""} 
                              onChange={(e) => updateTaskField('mailingAddress', { ...(currentTask.mailingAddress || {}), zipCode: e.target.value })}
                              disabled={isReadOnly || !isEditing}
                              data-testid="input-mailing-zip"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Primary Phone</Label>
                      <Input 
                        value={currentTask.primaryPhone || ""} 
                        onChange={(e) => updateTaskField('primaryPhone', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="(555) 123-4567"
                        data-testid="input-primary-phone"
                      />
                    </div>
                    <div>
                      <Label>Secondary Phone</Label>
                      <Input 
                        value={currentTask.secondaryPhone || ""} 
                        onChange={(e) => updateTaskField('secondaryPhone', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="(555) 123-4567"
                        data-testid="input-secondary-phone"
                      />
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input 
                        value={currentTask.emailAddress || ""} 
                        onChange={(e) => updateTaskField('emailAddress', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        type="email"
                        placeholder="patient@example.com"
                        data-testid="input-email-address"
                      />
                    </div>
                    <div>
                      <Label>Emergency Contact</Label>
                      <Input 
                        value={currentTask.emergencyContact || ""} 
                        onChange={(e) => updateTaskField('emergencyContact', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Name and relationship"
                        data-testid="input-emergency-contact"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Program Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Program & Enrollment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Program</Label>
                      <Input 
                        value={currentTask.program} 
                        onChange={(e) => updateTaskField('program', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-program"
                      />
                    </div>
                    <div>
                      <Label>Portfolio</Label>
                      <Input 
                        value={currentTask.portfolio} 
                        onChange={(e) => updateTaskField('portfolio', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-portfolio"
                      />
                    </div>
                    <div>
                      <Label>Enrollment Date</Label>
                      <Input 
                        value={currentTask.programInfo?.enrollmentDate || ""} 
                        type="date"
                        onChange={(e) => updateTaskField('programInfo', { ...(currentTask.programInfo || {}), enrollmentDate: e.target.value })}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-enrollment-date"
                      />
                    </div>
                    <div>
                      <Label>Eligibility Status</Label>
                      <Input 
                        value={currentTask.programInfo?.eligibilityStatus || ""} 
                        onChange={(e) => updateTaskField('programInfo', { ...(currentTask.programInfo || {}), eligibilityStatus: e.target.value })}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-eligibility-status"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Coverage Details</Label>
                      <Textarea 
                        value={currentTask.programInfo?.coverageDetails || ""} 
                        onChange={(e) => updateTaskField('programInfo', { ...(currentTask.programInfo || {}), coverageDetails: e.target.value })}
                        disabled={isReadOnly || !isEditing}
                        rows={3}
                        placeholder="Enter program coverage and benefit details..."
                        data-testid="textarea-coverage-details"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ICD Codes & Medical Classifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    ICD Codes & Medical Classifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {currentTask.icdCodes && currentTask.icdCodes.length > 0 ? (
                      currentTask.icdCodes.map((icd: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                            <div>
                              <Label className="text-xs">ICD Code</Label>
                              <Input
                                value={icd.code || ""}
                                onChange={(e) => {
                                  const newCodes = [...(currentTask.icdCodes || [])];
                                  newCodes[index] = { ...newCodes[index], code: e.target.value };
                                  updateTaskField('icdCodes', newCodes);
                                }}
                                disabled={isReadOnly || !isEditing}
                                placeholder="ICD-10 Code"
                                data-testid={`input-icd-code-${index}`}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Description</Label>
                              <Input
                                value={icd.description || ""}
                                onChange={(e) => {
                                  const newCodes = [...(currentTask.icdCodes || [])];
                                  newCodes[index] = { ...newCodes[index], description: e.target.value };
                                  updateTaskField('icdCodes', newCodes);
                                }}
                                disabled={isReadOnly || !isEditing}
                                placeholder="Diagnosis description"
                                data-testid={`input-icd-description-${index}`}
                              />
                            </div>
                          </div>
                          {(isEditing && !isReadOnly) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newCodes = currentTask.icdCodes?.filter((_, i) => i !== index) || [];
                                updateTaskField('icdCodes', newCodes);
                              }}
                              data-testid={`button-remove-icd-${index}`}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-center py-4">
                        No ICD codes assigned. Click "Add ICD Code" to add medical classifications.
                      </div>
                    )}
                    
                    {(isEditing && !isReadOnly) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newCodes = [...(currentTask.icdCodes || []), { code: "", description: "" }];
                          updateTaskField('icdCodes', newCodes);
                        }}
                        data-testid="button-add-icd-code"
                      >
                        + Add ICD Code
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Program Enrollment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Program Enrollment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Program</th>
                          <th className="text-left p-2 font-semibold">Portfolio</th>
                          <th className="text-left p-2 font-semibold">Enrollment Date</th>
                          <th className="text-left p-2 font-semibold">Status</th>
                          <th className="text-left p-2 font-semibold">Coverage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTask.programEnrollments && currentTask.programEnrollments.length > 0 ? (
                          currentTask.programEnrollments.map((enrollment: any, index: number) => (
                            <tr key={index} className="border-b" data-testid={`row-program-enrollment-${index}`}>
                              <td className="p-2">{enrollment.program || currentTask.program}</td>
                              <td className="p-2">{enrollment.portfolio || currentTask.portfolio}</td>
                              <td className="p-2">{enrollment.enrollmentDate || 'Not specified'}</td>
                              <td className="p-2">
                                <Badge variant={enrollment.eligibilityStatus === 'Active' ? 'default' : 'secondary'}>
                                  {enrollment.eligibilityStatus || 'Active'}
                                </Badge>
                              </td>
                              <td className="p-2 max-w-xs truncate" title={enrollment.coverageDetails}>
                                {enrollment.coverageDetails || 'Standard coverage'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                              <div className="space-y-2">
                                <p>Current enrollment based on task information:</p>
                                <div className="bg-muted p-3 rounded">
                                  <strong>{currentTask.program}</strong> • {currentTask.portfolio} • Active
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="mt-6">
            <div className="space-y-6">
              {/* Primary Insurance Company */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Primary Insurance Company
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Insurance Provider</Label>
                      <Input 
                        value={currentTask.insurance} 
                        onChange={(e) => updateTaskField('insurance', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="e.g., Aetna, Blue Cross Blue Shield"
                        data-testid="input-insurance-provider"
                      />
                    </div>
                    <div>
                      <Label>Insurance Type</Label>
                      <Input 
                        value={currentTask.insuranceType} 
                        onChange={(e) => updateTaskField('insuranceType', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="e.g., HMO, PPO, Medicare"
                        data-testid="input-insurance-type"
                      />
                    </div>
                    <div>
                      <Label>Plan Name</Label>
                      <Input 
                        value={currentTask.insurancePlanName || ""} 
                        onChange={(e) => updateTaskField('insurancePlanName', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="e.g., Gold Plus Plan"
                        data-testid="input-insurance-plan-name"
                      />
                    </div>
                    <div>
                      <Label>Network Status</Label>
                      <Input 
                        value={currentTask.networkStatus || ""} 
                        onChange={(e) => updateTaskField('networkStatus', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="e.g., In-Network, Out-of-Network"
                        data-testid="input-network-status"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Policy & Coverage Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Policy & Coverage Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Policy Number</Label>
                      <Input 
                        value={currentTask.insurancePolicyNumber || ""} 
                        onChange={(e) => updateTaskField('insurancePolicyNumber', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Policy identification number"
                        data-testid="input-policy-number"
                      />
                    </div>
                    <div>
                      <Label>Group Number</Label>
                      <Input 
                        value={currentTask.insuranceGroupNumber || ""} 
                        onChange={(e) => updateTaskField('insuranceGroupNumber', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Group/employer identifier"
                        data-testid="input-group-number"
                      />
                    </div>
                    <div>
                      <Label>Coverage Start Date</Label>
                      <Input 
                        value={currentTask.coverageStartDate || ""} 
                        type="date"
                        onChange={(e) => updateTaskField('coverageStartDate', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-coverage-start-date"
                      />
                    </div>
                    <div>
                      <Label>Coverage End Date</Label>
                      <Input 
                        value={currentTask.coverageEndDate || ""} 
                        type="date"
                        onChange={(e) => updateTaskField('coverageEndDate', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-coverage-end-date"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Annual Deductible</Label>
                      <Input 
                        value={currentTask.annualDeductible || ""} 
                        onChange={(e) => updateTaskField('annualDeductible', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="$0.00"
                        data-testid="input-annual-deductible"
                      />
                    </div>
                    <div>
                      <Label>Deductible Met</Label>
                      <Input 
                        value={currentTask.deductibleMet || ""} 
                        onChange={(e) => updateTaskField('deductibleMet', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="$0.00"
                        data-testid="input-deductible-met"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Coverage Details</Label>
                      <Textarea 
                        value={currentTask.coverageDetails || ""} 
                        onChange={(e) => updateTaskField('coverageDetails', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        rows={3}
                        placeholder="Enter detailed insurance coverage information..."
                        data-testid="textarea-coverage-details"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cardholder Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Cardholder Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Primary Cardholder Name</Label>
                      <Input 
                        value={currentTask.primaryCardholderName || ""} 
                        onChange={(e) => updateTaskField('primaryCardholderName', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Full name on insurance card"
                        data-testid="input-primary-cardholder-name"
                      />
                    </div>
                    <div>
                      <Label>Relationship to Patient</Label>
                      <Input 
                        value={currentTask.cardholderRelationship || ""} 
                        onChange={(e) => updateTaskField('cardholderRelationship', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="e.g., Self, Spouse, Parent, Child"
                        data-testid="input-cardholder-relationship"
                      />
                    </div>
                    <div>
                      <Label>Cardholder Date of Birth</Label>
                      <Input 
                        value={currentTask.cardholderDateOfBirth || ""} 
                        type="date"
                        onChange={(e) => updateTaskField('cardholderDateOfBirth', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        data-testid="input-cardholder-dob"
                      />
                    </div>
                    <div>
                      <Label>Employer/Plan Sponsor</Label>
                      <Input 
                        value={currentTask.employerPlanSponsor || ""} 
                        onChange={(e) => updateTaskField('employerPlanSponsor', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Employer or organization"
                        data-testid="input-employer-sponsor"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits & Authorization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Benefits & Authorization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Office Visit Copay</Label>
                      <Input 
                        value={currentTask.officeVisitCopay || ""} 
                        onChange={(e) => updateTaskField('officeVisitCopay', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="$0.00"
                        data-testid="input-office-copay"
                      />
                    </div>
                    <div>
                      <Label>Specialist Copay</Label>
                      <Input 
                        value={currentTask.specialistCopay || ""} 
                        onChange={(e) => updateTaskField('specialistCopay', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="$0.00"
                        data-testid="input-specialist-copay"
                      />
                    </div>
                    <div>
                      <Label>Prior Authorization Required</Label>
                      <Input 
                        value={currentTask.priorAuthRequired || ""} 
                        onChange={(e) => updateTaskField('priorAuthRequired', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Yes/No or specific services"
                        data-testid="input-prior-auth-required"
                      />
                    </div>
                    <div>
                      <Label>Referral Required</Label>
                      <Input 
                        value={currentTask.referralRequired || ""} 
                        onChange={(e) => updateTaskField('referralRequired', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Yes/No or specific services"
                        data-testid="input-referral-required"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Benefit Notes</Label>
                      <Textarea 
                        value={currentTask.benefitNotes || ""} 
                        onChange={(e) => updateTaskField('benefitNotes', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        rows={3}
                        placeholder="Additional benefit information, limitations, or special requirements..."
                        data-testid="textarea-benefit-notes"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Insurance (if applicable) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Secondary Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Secondary Insurance Provider</Label>
                      <Input 
                        value={currentTask.secondaryInsurance || ""} 
                        onChange={(e) => updateTaskField('secondaryInsurance', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Leave empty if no secondary coverage"
                        data-testid="input-secondary-insurance"
                      />
                    </div>
                    <div>
                      <Label>Secondary Policy Number</Label>
                      <Input 
                        value={currentTask.secondaryPolicyNumber || ""} 
                        onChange={(e) => updateTaskField('secondaryPolicyNumber', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Secondary policy ID"
                        data-testid="input-secondary-policy-number"
                      />
                    </div>
                    <div>
                      <Label>Coordination of Benefits</Label>
                      <Input 
                        value={currentTask.coordinationOfBenefits || ""} 
                        onChange={(e) => updateTaskField('coordinationOfBenefits', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="Primary/Secondary billing order"
                        data-testid="input-coordination-benefits"
                      />
                    </div>
                    <div>
                      <Label>Secondary Coverage Type</Label>
                      <Input 
                        value={currentTask.secondaryCoverageType || ""} 
                        onChange={(e) => updateTaskField('secondaryCoverageType', e.target.value)}
                        disabled={isReadOnly || !isEditing}
                        placeholder="e.g., Medicare, Medicaid, Supplemental"
                        data-testid="input-secondary-coverage-type"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* EV Data Tab */}
          <TabsContent value="ev-data" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Electronic Visit Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Visit Type</Label>
                    <Input 
                      placeholder="Enter visit type..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-visit-type"
                    />
                  </div>
                  <div>
                    <Label>Visit Date</Label>
                    <Input 
                      type="date"
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-visit-date"
                    />
                  </div>
                  <div>
                    <Label>Visit Status</Label>
                    <Input 
                      placeholder="Enter visit status..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-visit-status"
                    />
                  </div>
                  <div>
                    <Label>Verification Status</Label>
                    <Input 
                      placeholder="Enter verification status..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-verification-status"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PA Data Tab */}
          <TabsContent value="pa-data" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Prior Authorization Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>PA Request ID</Label>
                    <Input 
                      placeholder="Enter PA request ID..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-pa-request-id"
                    />
                  </div>
                  <div>
                    <Label>Submission Date</Label>
                    <Input 
                      type="date"
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-submission-date"
                    />
                  </div>
                  <div>
                    <Label>PA Status</Label>
                    <Input 
                      placeholder="Enter PA status..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-pa-status"
                    />
                  </div>
                  <div>
                    <Label>Authorization Number</Label>
                    <Input 
                      placeholder="Enter authorization number..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-auth-number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Provider Tab */}
          <TabsContent value="provider" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Provider Name</Label>
                    <Input 
                      value={currentTask.provider} 
                      onChange={(e) => updateTaskField('provider', e.target.value)}
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-provider-name"
                    />
                  </div>
                  <div>
                    <Label>Provider NPI</Label>
                    <Input 
                      placeholder="Enter provider NPI..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-provider-npi"
                    />
                  </div>
                  <div>
                    <Label>Specialty</Label>
                    <Input 
                      placeholder="Enter provider specialty..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-provider-specialty"
                    />
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <Input 
                      placeholder="Enter provider contact..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-provider-contact"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Record Type</Label>
                    <Input 
                      placeholder="Enter record type..."
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-record-type"
                    />
                  </div>
                  <div>
                    <Label>Record Details</Label>
                    <Textarea 
                      placeholder="Enter record details..."
                      disabled={isReadOnly || !isEditing}
                      rows={6}
                      data-testid="textarea-record-details"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Notes</Label>
                  <Textarea 
                    value={Array.isArray(currentTask.notes) ? currentTask.notes.map(n => n.content).join('\n') : ""}
                    onChange={(e) => updateTaskField('notes', [{ id: Date.now().toString(), content: e.target.value, user: 'Current User', timestamp: new Date().toISOString() }])}
                    placeholder="Add notes about this task..."
                    disabled={isReadOnly || !isEditing}
                    rows={8}
                    data-testid="textarea-task-notes"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Queue</Label>
                    <Input 
                      value={currentTask.queue} 
                      onChange={(e) => updateTaskField('queue', e.target.value)}
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-queue"
                    />
                  </div>
                  <div>
                    <Label>Disposition</Label>
                    <Input 
                      value={currentTask.disposition} 
                      onChange={(e) => updateTaskField('disposition', e.target.value)}
                      disabled={isReadOnly || !isEditing}
                      data-testid="input-disposition"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}