import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, User } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface ListViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800"
};

export default function ListView({ tasks, onTaskClick }: ListViewProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onTaskClick?.(task)}
            >
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {task.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[task.status]} variant="secondary">
                  {task.status.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={priorityColors[task.priority]} variant="secondary">
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {task.assignee.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                {task.dueDate ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No due date</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {task.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{task.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {task.estimatedHours && (
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{task.actualHours || 0}/{task.estimatedHours}h</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found matching your criteria.
        </div>
      )}
    </div>
  );
}