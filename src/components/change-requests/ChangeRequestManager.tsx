import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ChangeRequestForm } from './ChangeRequestForm';
import { ChangeRequestList } from './ChangeRequestList';
import { ChangeRequestWorkflow } from './ChangeRequestWorkflow';

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  clientName: string;
  status: 'submitted' | 'review' | 'estimation' | 'approved' | 'rejected' | 'implementation' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  estimatedCost: number;
  impactAssessment: {
    timeline: number; // days
    budget: number; // percentage
    complexity: 'low' | 'medium' | 'high';
  };
  submittedAt: string;
  submittedBy: string;
  assignedTo?: string;
  attachments: string[];
}

const mockChangeRequests: ChangeRequest[] = [
  {
    id: '1',
    title: 'Add Contact Form to Homepage',
    description: 'Client wants to add a contact form to the homepage for better lead generation.',
    projectId: '1',
    projectName: 'Website Redesign',
    clientName: 'Acme Corp',
    status: 'review',
    priority: 'medium',
    estimatedHours: 8,
    estimatedCost: 800,
    impactAssessment: {
      timeline: 3,
      budget: 5,
      complexity: 'low'
    },
    submittedAt: '2024-01-15T10:00:00Z',
    submittedBy: 'John Client',
    assignedTo: 'Jane Developer',
    attachments: ['mockup.png']
  },
  {
    id: '2',
    title: 'Change Brand Colors',
    description: 'Update the primary brand color from blue to green across all pages.',
    projectId: '1',
    projectName: 'Website Redesign',
    clientName: 'Acme Corp',
    status: 'approved',
    priority: 'high',
    estimatedHours: 12,
    estimatedCost: 1200,
    impactAssessment: {
      timeline: 5,
      budget: 8,
      complexity: 'medium'
    },
    submittedAt: '2024-01-12T14:30:00Z',
    submittedBy: 'Sarah Client',
    assignedTo: 'Mike Designer',
    attachments: ['brand-guide.pdf', 'color-palette.png']
  }
];

export function ChangeRequestManager() {
  const [requests, setRequests] = useState<ChangeRequest[]>(mockChangeRequests);
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'estimation': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'implementation': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);

  const statusCounts = {
    all: requests.length,
    submitted: requests.filter(r => r.status === 'submitted').length,
    review: requests.filter(r => r.status === 'review').length,
    approved: requests.filter(r => r.status === 'approved').length,
    implementation: requests.filter(r => r.status === 'implementation').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  const handleSubmitRequest = (requestData: any) => {
    const newRequest: ChangeRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
      impactAssessment: {
        timeline: 0,
        budget: 0,
        complexity: 'low' as const
      },
      estimatedHours: 0,
      estimatedCost: 0,
      attachments: []
    };
    setRequests([...requests, newRequest]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Change Request Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('all')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{statusCounts.all}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('submitted')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.submitted}</div>
            <div className="text-sm text-muted-foreground">Submitted</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('review')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.review}</div>
            <div className="text-sm text-muted-foreground">In Review</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('approved')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('implementation')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{statusCounts.implementation}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('completed')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Request List</TabsTrigger>
          <TabsTrigger value="workflow">Workflow View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ChangeRequestList 
            requests={filteredRequests}
            onSelectRequest={setSelectedRequest}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        </TabsContent>
        
        <TabsContent value="workflow">
          <ChangeRequestWorkflow 
            requests={requests}
            onUpdateRequest={(id, updates) => {
              setRequests(requests.map(r => r.id === id ? { ...r, ...updates } : r));
            }}
          />
        </TabsContent>
      </Tabs>

      {showForm && (
        <ChangeRequestForm
          onSubmit={handleSubmitRequest}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}