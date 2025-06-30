import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';

interface ProjectProgress {
  id: string;
  name: string;
  overallProgress: number;
  taskProgress: number;
  timeProgress: number;
  budgetProgress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  dueDate: string;
  milestones: {
    id: string;
    name: string;
    completed: boolean;
    dueDate: string;
  }[];
}

interface ProgressTimelineProps {
  project: ProjectProgress;
}

export function ProgressTimeline({ project }: ProgressTimelineProps) {
  const getMilestoneStatus = (milestone: any, index: number) => {
    if (milestone.completed) return 'completed';
    if (index === 0 || project.milestones[index - 1]?.completed) return 'current';
    return 'upcoming';
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'current':
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'current': return 'bg-blue-600';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project Timeline - {project.name}</span>
          <Badge variant={project.status === 'on-track' ? 'default' : 'destructive'}>
            {project.status.replace('-', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span>{project.overallProgress}%</span>
            </div>
            <Progress value={project.overallProgress} className="h-3" />
          </div>

          {/* Milestone Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {project.milestones.map((milestone, index) => {
                const status = getMilestoneStatus(milestone, index);
                return (
                  <div key={milestone.id} className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center ${getStatusColor(status)}`}>
                      {getMilestoneIcon(status)}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          status === 'completed' ? 'text-green-700' : 
                          status === 'current' ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {milestone.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                          {status === 'completed' && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Completed
                            </Badge>
                          )}
                          {status === 'current' && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {status === 'current' && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>65%</span>
                          </div>
                          <Progress value={65} className="h-1" />
                        </div>
                      )}
                      
                      {index < project.milestones.length - 1 && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span>Next: {project.milestones[index + 1].name}</span>
                            <span className="text-xs">({new Date(project.milestones[index + 1].dueDate).toLocaleDateString()})</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Tasks</div>
              <div className="text-lg font-semibold">{project.taskProgress}%</div>
              <Progress value={project.taskProgress} className="h-1 mt-1" />
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="text-lg font-semibold">{project.timeProgress}%</div>
              <Progress value={project.timeProgress} className="h-1 mt-1" />
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Budget</div>
              <div className="text-lg font-semibold">{project.budgetProgress}%</div>
              <Progress value={project.budgetProgress} className="h-1 mt-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}