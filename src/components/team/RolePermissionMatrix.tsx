import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TeamRole, Permission } from '@/types/team';
import { Save, Plus, Trash2 } from 'lucide-react';

interface RolePermissionMatrixProps {
  onSave?: (roles: TeamRole[]) => void;
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({ onSave }) => {
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedRoles = JSON.parse(localStorage.getItem('rubbl_team_roles') || '[]');
      const savedPermissions = JSON.parse(localStorage.getItem('rubbl_team_permissions') || '[]');
      
      setRoles(savedRoles.length ? savedRoles : getDefaultRoles());
      setPermissions(savedPermissions.length ? savedPermissions : getDefaultPermissions());
    } catch (error) {
      console.error('Error loading role data:', error);
      setRoles(getDefaultRoles());
      setPermissions(getDefaultPermissions());
    }
  };

  const getDefaultRoles = (): TeamRole[] => [
    { id: '1', name: 'Client Admin', description: 'Full access to all features', permissions: [], level: 5, color: '#ef4444' },
    { id: '2', name: 'Client Manager', description: 'Project management access', permissions: [], level: 4, color: '#f97316' },
    { id: '3', name: 'Client Viewer', description: 'Read-only access', permissions: [], level: 2, color: '#22c55e' },
    { id: '4', name: 'External Stakeholder', description: 'Limited project access', permissions: [], level: 1, color: '#6366f1' },
  ];

  const getDefaultPermissions = (): Permission[] => [
    { id: 'project_view', name: 'View Projects', category: 'project', description: 'View project details and progress' },
    { id: 'project_edit', name: 'Edit Projects', category: 'project', description: 'Modify project settings and details' },
    { id: 'file_download', name: 'Download Files', category: 'file', description: 'Download project files and assets' },
    { id: 'file_upload', name: 'Upload Files', category: 'file', description: 'Upload files to projects' },
    { id: 'budget_view', name: 'View Budget', category: 'budget', description: 'View project budget and costs' },
    { id: 'timeline_view', name: 'View Timeline', category: 'timeline', description: 'View project timeline and milestones' },
    { id: 'team_manage', name: 'Manage Team', category: 'team', description: 'Invite and manage team members' },
    { id: 'admin_access', name: 'Admin Access', category: 'admin', description: 'Full administrative access' },
  ];

  const hasPermission = (roleId: string, permissionId: string): boolean => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.some(p => p.id === permissionId) || false;
  };

  const togglePermission = (roleId: string, permission: Permission) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.some(p => p.id === permission.id);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p.id !== permission.id)
            : [...role.permissions, permission]
        };
      }
      return role;
    }));
  };

  const saveChanges = () => {
    try {
      localStorage.setItem('rubbl_team_roles', JSON.stringify(roles));
      localStorage.setItem('rubbl_team_permissions', JSON.stringify(permissions));
      onSave?.(roles);
      alert('Permissions saved successfully!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions');
    }
  };

  const getPermissionsByCategory = () => {
    const categories = permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    return categories;
  };

  const permissionCategories = getPermissionsByCategory();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Role Permission Matrix</h2>
          <p className="text-muted-foreground">Configure permissions for each role</p>
        </div>
        <Button onClick={saveChanges}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 font-medium">Permission</th>
                  {roles.map(role => (
                    <th key={role.id} className="text-center p-2 min-w-[120px]">
                      <div className="flex flex-col items-center gap-1">
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: role.color + '20', color: role.color }}
                        >
                          {role.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Level {role.level}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                  <React.Fragment key={category}>
                    <tr>
                      <td colSpan={roles.length + 1} className="p-2 font-medium text-sm bg-muted/50 capitalize">
                        {category} Permissions
                      </td>
                    </tr>
                    {categoryPermissions.map(permission => (
                      <tr key={permission.id} className="border-b">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-muted-foreground">{permission.description}</div>
                          </div>
                        </td>
                        {roles.map(role => (
                          <td key={role.id} className="p-2 text-center">
                            <Switch
                              checked={hasPermission(role.id, permission.id)}
                              onCheckedChange={() => togglePermission(role.id, permission)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map(role => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: role.color }}
                />
                {role.name}
                <Badge variant="outline">Level {role.level}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Permissions ({role.permissions.length})</Label>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No permissions assigned</span>
                  ) : (
                    role.permissions.map(permission => (
                      <Badge key={permission.id} variant="secondary" className="text-xs">
                        {permission.name}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};