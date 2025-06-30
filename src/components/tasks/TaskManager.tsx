import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LayoutGrid, List, Calendar, Kanban } from "lucide-react";
import { Task, TaskFilter, TaskView } from "@/types/task";
import TaskFilters from "./TaskFilters";
import KanbanView from "./KanbanView";
import ListView from "./ListView";
import GridView from "./GridView";
import CalendarView from "./CalendarView";

interface TaskManagerProps {
  projectId?: string;
  userRole?: string;
}

// Mock data for development
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage Mockup',
    description: 'Create wireframes and high-fidelity mockups for the new homepage',
    status: 'in-progress',
    priority: 'high',
    assignee: 'John Doe',
    projectId: 'proj-1',
    dueDate: '2024-01-15',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    tags: ['design', 'ui/ux', 'homepage'],
    color: '#3b82f6',
    estimatedHours: 8,
    actualHours: 5
  },
  {
    id: '2',
    title: 'Implement User Authentication',
    description: 'Set up login/logout functionality with JWT tokens',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Jane Smith',
    projectId: 'proj-1',
    dueDate: '2024-01-20',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    tags: ['development', 'backend', 'auth'],
    color: '#ef4444',
    estimatedHours: 12
  },
  {
    id: '3',
    title: 'Content Strategy Review',
    description: 'Review and optimize content strategy for Q1',
    status: 'review',
    priority: 'medium',
    assignee: 'Mike Johnson',
    projectId: 'proj-2',
    dueDate: '2024-01-18',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-12',
    tags: ['content', 'strategy', 'marketing'],
    color: '#8b5cf6',
    estimatedHours: 6,
    actualHours: 4
  },
  {
    id: '4',
    title: 'Database Migration',
    description: 'Migrate legacy database to new schema',
    status: 'done',
    priority: 'low',
    assignee: 'Sarah Wilson',
    projectId: 'proj-1',
    dueDate: '2024-01-12',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
    tags: ['database', 'migration', 'backend'],
    color: '#10b981',
    estimatedHours: 16,
    actualHours: 14,
    completedAt: '2024-01-12'
  }
];

export default function TaskManager({ projectId, userRole = 'admin' }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filters, setFilters] = useState<TaskFilter>({});
  const [currentView, setCurrentView] = useState<TaskView>('kanban');

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (projectId && task.projectId !== projectId) return false;
    if (filters.status?.length && !filters.status.includes(task.status)) return false;
    if (filters.priority?.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee?.length && !filters.assignee.includes(task.assignee || '')) return false;
    if (filters.tags?.length && !filters.tags.some(tag => task.tags.includes(tag))) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    return true;
  });

  // Get available filter options
  const availableTags = Array.from(new Set(tasks.flatMap(task => task.tags)));
  const availableAssignees = Array.from(new Set(tasks.map(task => task.assignee).filter(Boolean)));

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
    // Handle task detail view
  };

  const handleAddTask = (status?: Task['status']) => {
    console.log('Add task with status:', status);
    // Handle new task creation
  };

  const handleExportCalendar = () => {
    // Generate iCal format for calendar export
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Rubbl Media//Task Manager//EN',
      ...filteredTasks.filter(task => task.dueDate).map(task => [
        'BEGIN:VEVENT',
        `UID:${task.id}@rubblmedia.com`,
        `DTSTART:${task.dueDate?.replace(/-/g, '')}T090000Z`,
        `DTEND:${task.dueDate?.replace(/-/g, '')}T100000Z`,
        `SUMMARY:${task.title}`,
        `DESCRIPTION:${task.description || ''}`,
        `STATUS:${task.status.toUpperCase()}`,
        'END:VEVENT'
      ].join('\n')),
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-calendar-${new Date().toISOString().split('T')[0]}.ics`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Manager</h2>
          <p className="text-muted-foreground">
            {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => handleAddTask()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
        availableAssignees={availableAssignees}
      />

      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as TaskView)}>
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <KanbanView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <ListView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="grid" className="mt-6">
          <GridView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onExportCalendar={handleExportCalendar}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}