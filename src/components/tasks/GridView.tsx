import { Task } from "@/types/task";
import TaskCard from "./TaskCard";
import { cn } from "@/lib/utils";

interface GridViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  className?: string;
}

export default function GridView({ tasks, onTaskClick, className }: GridViewProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
      className
    )}>
      {tasks.map((task) => (
        <TaskCard 
          key={task.id}
          task={task} 
          onClick={() => onTaskClick?.(task)}
          className="h-fit"
        />
      ))}
      {tasks.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No tasks found matching your criteria.
        </div>
      )}
    </div>
  );
}