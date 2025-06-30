import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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

interface ProgressComparisonProps {
  projects: ProjectProgress[];
}

export function ProgressComparison({ projects }: ProgressComparisonProps) {
  const chartData = projects.map(project => ({
    name: project.name,
    overall: project.overallProgress,
    tasks: project.taskProgress,
    time: project.timeProgress,
    budget: project.budgetProgress
  }));

  const radarData = projects.map(project => ({
    project: project.name,
    Tasks: project.taskProgress,
    Time: project.timeProgress,
    Budget: project.budgetProgress,
    Overall: project.overallProgress
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600';
      case 'at-risk': return 'text-orange-600';
      case 'delayed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'on-track' ? 'default' : status === 'at-risk' ? 'secondary' : 'destructive';
    return (
      <Badge variant={variant}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project.status)}
                    <span className="text-sm text-muted-foreground">
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Overall</div>
                    <div className="flex items-center gap-2">
                      <Progress value={project.overallProgress} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-12">{project.overallProgress}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tasks</div>
                    <div className="flex items-center gap-2">
                      <Progress value={project.taskProgress} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-12">{project.taskProgress}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Time</div>
                    <div className="flex items-center gap-2">
                      <Progress value={project.timeProgress} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-12">{project.timeProgress}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Budget</div>
                    <div className="flex items-center gap-2">
                      <Progress value={project.budgetProgress} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-12">{project.budgetProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Metrics Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="overall" fill="#3b82f6" name="Overall" />
                <Bar dataKey="tasks" fill="#10b981" name="Tasks" />
                <Bar dataKey="time" fill="#f59e0b" name="Time" />
                <Bar dataKey="budget" fill="#ef4444" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData[0] ? [radarData[0]] : []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Progress"
                  dataKey="Tasks"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Time"
                  dataKey="Time"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Budget"
                  dataKey="Budget"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.1}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}