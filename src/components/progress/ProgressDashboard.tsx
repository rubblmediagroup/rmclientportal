import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ProgressTimeline } from './ProgressTimeline';
import { ProgressComparison } from './ProgressComparison';

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

const mockProjects: ProjectProgress[] = [
  {
    id: '1',
    name: 'Website Redesign',
    overallProgress: 75,
    taskProgress: 80,
    timeProgress: 70,
    budgetProgress: 65,
    status: 'on-track',
    dueDate: '2024-02-15',
    milestones: [
      { id: '1', name: 'Design Phase', completed: true, dueDate: '2024-01-15' },
      { id: '2', name: 'Development', completed: false, dueDate: '2024-02-01' },
      { id: '3', name: 'Testing', completed: false, dueDate: '2024-02-10' }
    ]
  },
  {
    id: '2',
    name: 'Brand Identity',
    overallProgress: 45,
    taskProgress: 50,
    timeProgress: 40,
    budgetProgress: 35,
    status: 'at-risk',
    dueDate: '2024-01-30',
    milestones: [
      { id: '1', name: 'Research', completed: true, dueDate: '2024-01-10' },
      { id: '2', name: 'Concept Development', completed: false, dueDate: '2024-01-20' },
      { id: '3', name: 'Final Design', completed: false, dueDate: '2024-01-28' }
    ]
  }
];

export function ProgressDashboard() {
  const [selectedProject, setSelectedProject] = useState<string>('1');
  
  const project = mockProjects.find(p => p.id === selectedProject);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600';
      case 'at-risk': return 'text-orange-600';
      case 'delayed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'delayed': return <Clock className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progress Dashboard</h1>
        <div className="flex gap-2">
          {mockProjects.map(project => (
            <Button
              key={project.id}
              variant={selectedProject === project.id ? 'default' : 'outline'}
              onClick={() => setSelectedProject(project.id)}
            >
              {project.name}
            </Button>
          ))}
        </div>
      </div>

      {project && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{project.overallProgress}%</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(project.status)}
                    <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <Progress value={project.overallProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Task Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{project.taskProgress}%</div>
                <Progress value={project.taskProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  12 of 15 tasks completed
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{project.timeProgress}%</div>
                <Progress value={project.timeProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  84h of 120h allocated
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{project.budgetProgress}%</div>
                <Progress value={project.budgetProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  $6,500 of $10,000 spent
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="comparison">Project Comparison</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline">
          {project && <ProgressTimeline project={project} />}
        </TabsContent>
        
        <TabsContent value="comparison">
          <ProgressComparison projects={mockProjects} />
        </TabsContent>
        
        <TabsContent value="forecasting">
          <Card>
            <CardHeader>
              <CardTitle>Progress Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <div>Forecasting analytics coming soon</div>
                <div className="text-sm mt-2">Predictive insights based on current progress</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}