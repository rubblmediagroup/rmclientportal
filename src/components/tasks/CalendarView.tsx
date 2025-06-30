import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onExportCalendar?: () => void;
}

export default function CalendarView({ tasks, onTaskClick, onExportCalendar }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get tasks for selected date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get tasks for selected date
  const selectedDateTasks = getTasksForDate(selectedDate);

  // Get all dates that have tasks
  const getDatesWithTasks = () => {
    const dates = new Set<string>();
    tasks.forEach(task => {
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        dates.add(date.toDateString());
      }
    });
    return dates;
  };

  const datesWithTasks = getDatesWithTasks();

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Title', 'Description', 'Status', 'Priority', 'Assignee', 'Due Date', 'Tags', 'Estimated Hours'].join(','),
      ...tasks.map(task => [
        `"${task.title}"`,
        `"${task.description || ''}"`,
        task.status,
        task.priority,
        task.assignee || '',
        task.dueDate || '',
        `"${task.tags.join(', ')}"`,
        task.estimatedHours || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Task Calendar</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                {onExportCalendar && (
                  <Button variant="outline" size="sm" onClick={onExportCalendar}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Calendar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border"
              modifiers={{
                hasTask: (date) => datesWithTasks.has(date.toDateString())
              }}
              modifiersStyles={{
                hasTask: { 
                  backgroundColor: 'hsl(var(--primary))', 
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tasks for selected date */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tasks for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No tasks scheduled for this date
                </p>
              ) : (
                selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onTaskClick?.(task)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        priorityColors[task.priority]
                      )} />
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {task.status.replace('-', ' ')}
                      </Badge>
                      {task.assignee && (
                        <span className="text-xs text-muted-foreground">
                          {task.assignee}
                        </span>
                      )}
                    </div>
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}