import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamManagementDashboard } from '@/components/team/TeamManagementDashboard';
import { RolePermissionMatrix } from '@/components/team/RolePermissionMatrix';
import { GuestAccessManager } from '@/components/guest/GuestAccessManager';

const TeamManagement: React.FC = () => {
  const { clientId } = useParams();

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Team Dashboard</TabsTrigger>
          <TabsTrigger value="permissions">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="guests">Guest Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <TeamManagementDashboard clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6">
          <RolePermissionMatrix />
        </TabsContent>
        
        <TabsContent value="guests" className="mt-6">
          <GuestAccessManager projectId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;