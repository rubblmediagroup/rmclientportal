import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ChangeRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ChangeRequestForm({ onSubmit, onCancel }: ChangeRequestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '1',
    projectName: 'Website Redesign',
    clientName: 'Current Client',
    priority: 'medium',
    submittedBy: 'Client User'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>New Change Request</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Request Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the change"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about the requested change"
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function ChangeRequestList({ requests, onSelectRequest, getStatusColor, getPriorityColor }: any) {
  return (
    <div className="space-y-4">
      {requests.map((request: any) => (
        <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectRequest(request.id)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{request.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">{request.projectName}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{request.clientName}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ChangeRequestWorkflow({ requests, onUpdateRequest }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <div>Workflow visualization coming soon</div>
          <div className="text-sm mt-2">Track requests through approval process</div>
        </div>
      </CardContent>
    </Card>
  );
}