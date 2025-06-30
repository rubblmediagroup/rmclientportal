import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamMember, TeamRole } from '@/types/team';
import { UserPlus, Mail, Send } from 'lucide-react';

interface TeamInvitationWizardProps {
  onInvite?: (member: Partial<TeamMember>) => void;
  onClose?: () => void;
}

export const TeamInvitationWizard: React.FC<TeamInvitationWizardProps> = ({ onInvite, onClose }) => {
  const [step, setStep] = useState(1);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    message: ''
  });

  const roles = [
    { id: '1', name: 'Client Admin', description: 'Full access' },
    { id: '2', name: 'Client Manager', description: 'Project management' },
    { id: '3', name: 'Client Viewer', description: 'View only' },
    { id: '4', name: 'External Stakeholder', description: 'Limited access' }
  ];

  const handleInvite = () => {
    const newMember: Partial<TeamMember> = {
      id: `member_${Date.now()}`,
      name: inviteData.name,
      email: inviteData.email,
      role: roles.find(r => r.id === inviteData.role) as TeamRole,
      status: 'pending',
      permissions: [],
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      department: inviteData.department
    };

    // Save to localStorage
    try {
      const existingMembers = JSON.parse(localStorage.getItem('rubbl_team_members') || '[]');
      const updatedMembers = [...existingMembers, newMember];
      localStorage.setItem('rubbl_team_members', JSON.stringify(updatedMembers));
      
      onInvite?.(newMember);
      alert(`Invitation sent to ${inviteData.email}`);
      onClose?.();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error sending invitation');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite Team Member
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={inviteData.name}
                  onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Input
                id="department"
                value={inviteData.department}
                onChange={(e) => setInviteData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter department"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setStep(2)}
                disabled={!inviteData.name || !inviteData.email || !inviteData.role}
              >
                Next: Customize Message
              </Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Invitation Message</Label>
              <textarea
                id="message"
                className="w-full p-3 border rounded-md min-h-[100px]"
                value={inviteData.message}
                onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message to the invitation..."
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Invitation Preview</h4>
              <div className="text-sm text-gray-600">
                <p><strong>To:</strong> {inviteData.name} ({inviteData.email})</p>
                <p><strong>Role:</strong> {roles.find(r => r.id === inviteData.role)?.name}</p>
                {inviteData.department && <p><strong>Department:</strong> {inviteData.department}</p>}
                {inviteData.message && (
                  <div className="mt-2">
                    <strong>Message:</strong>
                    <p className="mt-1 italic">{inviteData.message}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleInvite} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};