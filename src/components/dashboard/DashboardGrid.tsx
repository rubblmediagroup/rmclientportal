import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Move } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';

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

interface DashboardGridProps {
  widgets: Widget[];
  isEditing: boolean;
  onUpdateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  onRemoveWidget: (widgetId: string) => void;
}

export function DashboardGrid({ widgets, isEditing, onUpdateWidget, onRemoveWidget }: DashboardGridProps) {
  const gridCols = 12;
  const rowHeight = 80;

  const getGridStyle = (widget: Widget) => ({
    gridColumn: `${widget.x + 1} / span ${widget.w}`,
    gridRow: `${widget.y + 1} / span ${widget.h}`,
    minHeight: `${widget.h * rowHeight}px`
  });

  return (
    <div className="h-full">
      <div 
        className="grid gap-4 h-full"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridAutoRows: `${rowHeight}px`
        }}
      >
        {widgets.map(widget => (
          <div
            key={widget.id}
            style={getGridStyle(widget)}
            className={`relative group ${
              isEditing ? 'ring-2 ring-dashed ring-muted-foreground/20' : ''
            }`}
          >
            {isEditing && (
              <div className="absolute -top-2 -right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 w-6 p-0"
                  onClick={() => onRemoveWidget(widget.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    // Widget settings modal would open here
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {isEditing && (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="outline" className="text-xs">
                  <Move className="h-3 w-3 mr-1" />
                  {widget.w}×{widget.h}
                </Badge>
              </div>
            )}

            <DashboardWidget
              widget={widget}
              isEditing={isEditing}
              onUpdate={(updates) => onUpdateWidget(widget.id, updates)}
            />
          </div>
        ))}
      </div>
      
      {widgets.length === 0 && (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <div className="text-muted-foreground mb-2">
              No widgets added yet
            </div>
            <div className="text-sm text-muted-foreground">
              {isEditing 
                ? 'Add widgets from the palette on the left'
                : 'Click Edit to start customizing your dashboard'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}