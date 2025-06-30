import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Activity, 
  Clock, 
  Users, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Target
} from 'lucide-react';

interface Widget {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: any;
}

interface DashboardWidgetProps {
  widget: Widget;
  isEditing: boolean;
  onUpdate: (updates: Partial<Widget>) => void;
}

export function DashboardWidget({ widget, isEditing }: DashboardWidgetProps) {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'stats':
        return (
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+12% from last month</span>
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Revenue Chart</div>
              <div className="text-xs text-muted-foreground mt-1">$45,230 this month</div>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Project Alpha completed</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">New client onboarded</div>
                <div className="text-xs text-muted-foreground">4 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Meeting scheduled</div>
                <div className="text-xs text-muted-foreground">6 hours ago</div>
              </div>
            </div>
          </div>
        );
      
      case 'time-tracker':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Today's Time</span>
              <Badge variant="outline">7h 32m</Badge>
            </div>
            <Progress value={65} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Target: 8 hours (65% complete)
            </div>
          </div>
        );
      
      case 'team-performance':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Team Utilization</span>
              <span className="text-sm text-green-600">85%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>John Doe</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-1" />
              <div className="flex justify-between text-xs">
                <span>Jane Smith</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-1" />
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$45,230</div>
            <div className="text-sm text-muted-foreground">Monthly Revenue</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+8.2% vs last month</span>
            </div>
          </div>
        );
      
      case 'alerts':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">3 Overdue Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">2 Due Today</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-sm">Widget: {widget.type}</div>
              <div className="text-xs mt-1">Configure to display data</div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`h-full ${isEditing ? 'ring-1 ring-muted-foreground/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-full">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}