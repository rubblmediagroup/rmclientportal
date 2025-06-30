import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, UserPlus, Activity, Settings } from 'lucide-react';
import { TeamMember, TeamRole } from '@/types/team';

interface TeamManagementDashboardProps {
  clientId?: string;
}

export const TeamManagementDashboard: React.FC<TeamManagementDashboardProps> = ({ clientId }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamRoles, setTeamRoles] = useState<TeamRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [clientId]);

  const loadTeamData = () => {
    try {
      const members = JSON.parse(localStorage.getItem('rubbl_team_members') || '[]');
      const roles = JSON.parse(localStorage.getItem('rubbl_team_roles') || '[]');
      
      // Filter by client if specified
      const filteredMembers = clientId 
        ? members.filter((m: TeamMember) => m.id.includes(clientId))
        : members;
      
      setTeamMembers(filteredMembers);
      setTeamRoles(roles.length ? roles : getDefaultRoles());
    } catch (error) {
      console.error('Error loading team data:', error);
      setTeamRoles(getDefaultRoles());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRoles = (): TeamRole[] => [
    { id: '1', name: 'Client Admin', description: 'Full access', permissions: [], level: 5, color: '#ef4444' },
    { id: '2', name: 'Client Manager', description: 'Project management', permissions: [], level: 4, color: '#f97316' },
    { id: '3', name: 'Client Viewer', description: 'View only', permissions: [], level: 2, color: '#22c55e' },
    { id: '4', name: 'External Stakeholder', description: 'Limited access', permissions: [], level: 1, color: '#6366f1' },
  ];

  const getRoleStats = () => {
    const stats = teamRoles.map(role => ({
      role: role.name,
      count: teamMembers.filter(m => m.role.id === role.id).length,
      color: role.color
    }));
    return stats;
  };

  if (loading) {
    return <div className="p-6">Loading team data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage team members and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamRoles.length}</div>
            <p className="text-xs text-muted-foreground">Role types configured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getRoleStats().map(stat => (
                <div key={stat.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="text-sm">{stat.role}</span>
                  </div>
                  <Badge variant="secondary">{stat.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No team members found. Start by inviting your first team member.
              </div>
            ) : (
              teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: member.role.color + '20', color: member.role.color }}
                    >
                      {member.role.name}
                    </Badge>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};