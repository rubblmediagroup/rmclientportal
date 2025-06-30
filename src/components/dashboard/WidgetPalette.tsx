import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Target,
  Plus
} from 'lucide-react';

interface WidgetType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  size: { w: number; h: number };
}

const widgetTypes: WidgetType[] = [
  {
    id: 'stats',
    name: 'Stats Card',
    description: 'Display key metrics and KPIs',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'Analytics',
    size: { w: 3, h: 2 }
  },
  {
    id: 'chart',
    name: 'Interactive Chart',
    description: 'Line, bar, or pie charts',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'Analytics',
    size: { w: 6, h: 4 }
  },
  {
    id: 'activity',
    name: 'Activity Feed',
    description: 'Recent actions and updates',
    icon: <Activity className="h-4 w-4" />,
    category: 'Communication',
    size: { w: 4, h: 6 }
  },
  {
    id: 'time-tracker',
    name: 'Time Tracking',
    description: 'Current time entries and totals',
    icon: <Clock className="h-4 w-4" />,
    category: 'Productivity',
    size: { w: 4, h: 3 }
  },
  {
    id: 'team-performance',
    name: 'Team Performance',
    description: 'Team productivity metrics',
    icon: <Users className="h-4 w-4" />,
    category: 'Team',
    size: { w: 5, h: 4 }
  },
  {
    id: 'revenue',
    name: 'Revenue Tracking',
    description: 'Financial performance data',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'Finance',
    size: { w: 4, h: 3 }
  },
  {
    id: 'calendar',
    name: 'Calendar Widget',
    description: 'Upcoming events and deadlines',
    icon: <Calendar className="h-4 w-4" />,
    category: 'Schedule',
    size: { w: 4, h: 4 }
  },
  {
    id: 'alerts',
    name: 'Deadline Alerts',
    description: 'Critical deadlines and warnings',
    icon: <AlertTriangle className="h-4 w-4" />,
    category: 'Alerts',
    size: { w: 3, h: 2 }
  },
  {
    id: 'projects',
    name: 'Project List',
    description: 'Active projects overview',
    icon: <FileText className="h-4 w-4" />,
    category: 'Projects',
    size: { w: 6, h: 5 }
  },
  {
    id: 'goals',
    name: 'Goals Tracker',
    description: 'Progress towards objectives',
    icon: <Target className="h-4 w-4" />,
    category: 'Goals',
    size: { w: 4, h: 3 }
  }
];

const categories = [...new Set(widgetTypes.map(w => w.category))];

interface WidgetPaletteProps {
  onAddWidget: (widgetType: string) => void;
}

export function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const filteredWidgets = selectedCategory === 'All' 
    ? widgetTypes 
    : widgetTypes.filter(w => w.category === selectedCategory);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-3">Widget Library</h3>
        <div className="flex flex-wrap gap-1">
          <Badge 
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredWidgets.map(widget => (
            <Card key={widget.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="p-1 bg-primary/10 rounded">
                      {widget.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{widget.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {widget.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {widget.size.w}×{widget.size.h}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {widget.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddWidget(widget.id)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}