import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Task, TaskColumn } from "@/types/task";
import TaskCard from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
}

const defaultColumns: TaskColumn[] = [
  { id: 'todo', title: 'To Do', status: 'todo', color: '#6b7280', tasks: [] },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: '#3b82f6', tasks: [] },
  { id: 'review', title: 'Review', status: 'review', color: '#8b5cf6', tasks: [] },
  { id: 'done', title: 'Done', status: 'done', color: '#10b981', tasks: [] }
];

export default function KanbanView({ tasks, onTaskClick, onAddTask }: KanbanViewProps) {
  const [columns] = useState<TaskColumn[]>(() => {
    return defaultColumns.map(col => ({
      ...col,
      tasks: tasks.filter(task => task.status === col.status)
    }));
  });

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    // Task status update would be handled by parent component
    console.log(`Move task ${taskId} to ${status}`);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  {column.title}
                  <Badge variant="secondary" className="ml-2">
                    {column.tasks.length}
                  </Badge>
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onAddTask?.(column.status)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent 
              className="space-y-3 min-h-[200px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className="cursor-move"
                >
                  <TaskCard 
                    task={task} 
                    onClick={() => onTaskClick?.(task)}
                    className="hover:shadow-lg transition-shadow"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}