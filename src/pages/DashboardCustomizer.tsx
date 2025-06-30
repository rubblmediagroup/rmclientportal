import React from 'react';
import { DashboardBuilder } from '@/components/dashboard/DashboardBuilder';

export function DashboardCustomizer() {
  return (
    <div className="h-screen">
      <DashboardBuilder />
    </div>
  );
}

export function ProgressTracker() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Progress Tracking</h1>
      <div className="text-center py-8 text-muted-foreground">
        <div>Progress tracking dashboard</div>
        <div className="text-sm mt-2">Visual progress indicators and analytics</div>
      </div>
    </div>
  );
}

export function ChangeRequests() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Change Requests</h1>
      <div className="text-center py-8 text-muted-foreground">
        <div>Change request management</div>
        <div className="text-sm mt-2">Submit and track project changes</div>
      </div>
    </div>
  );
}