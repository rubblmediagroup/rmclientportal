export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  projectId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  color?: string;
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: string;
}

export interface TaskFilter {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  projectId?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export type TaskView = 'kanban' | 'list' | 'grid' | 'calendar';

export interface TaskColumn {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
  tasks: Task[];
}