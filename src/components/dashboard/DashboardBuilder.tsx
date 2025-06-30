import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, Plus, Settings, Eye, Save } from 'lucide-react';
import { WidgetPalette } from './WidgetPalette';
import { DashboardGrid } from './DashboardGrid';

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

interface DashboardLayout {
  id: string;
  name: string;
  widgets: Widget[];
  isDefault?: boolean;
}

export function DashboardBuilder() {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([
    {
      id: 'default',
      name: 'Default Dashboard',
      widgets: [
        { id: '1', type: 'stats', title: 'Total Projects', x: 0, y: 0, w: 3, h: 2 },
        { id: '2', type: 'chart', title: 'Revenue Chart', x: 3, y: 0, w: 6, h: 4 },
        { id: '3', type: 'activity', title: 'Recent Activity', x: 9, y: 0, w: 3, h: 6 }
      ],
      isDefault: true
    }
  ]);
  const [activeLayout, setActiveLayout] = useState('default');
  const [isEditing, setIsEditing] = useState(false);

  const currentLayout = layouts.find(l => l.id === activeLayout);

  const addWidget = (widgetType: string) => {
    if (!currentLayout) return;
    
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: widgetType,
      title: `New ${widgetType}`,
      x: 0,
      y: 0,
      w: 4,
      h: 3
    };

    const updatedLayouts = layouts.map(layout => 
      layout.id === activeLayout 
        ? { ...layout, widgets: [...layout.widgets, newWidget] }
        : layout
    );
    setLayouts(updatedLayouts);
  };

  const updateWidget = (widgetId: string, updates: Partial<Widget>) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === activeLayout 
        ? {
            ...layout,
            widgets: layout.widgets.map(w => 
              w.id === widgetId ? { ...w, ...updates } : w
            )
          }
        : layout
    );
    setLayouts(updatedLayouts);
  };

  const removeWidget = (widgetId: string) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === activeLayout 
        ? {
            ...layout,
            widgets: layout.widgets.filter(w => w.id !== widgetId)
          }
        : layout
    );
    setLayouts(updatedLayouts);
  };

  const saveDashboard = () => {
    localStorage.setItem('rubbl_dashboard_layouts', JSON.stringify(layouts));
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Layout className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Dashboard Builder</h1>
          {currentLayout && (
            <Badge variant="outline">{currentLayout.name}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
            {isEditing ? 'Save' : 'Edit'}
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {isEditing && (
          <div className="w-80 border-r bg-muted/30">
            <WidgetPalette onAddWidget={addWidget} />
          </div>
        )}
        
        <div className="flex-1 p-4">
          {currentLayout && (
            <DashboardGrid
              widgets={currentLayout.widgets}
              isEditing={isEditing}
              onUpdateWidget={updateWidget}
              onRemoveWidget={removeWidget}
            />
          )}
        </div>
      </div>
    </div>
  );
}