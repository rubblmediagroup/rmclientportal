import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, FolderOpen, DollarSign, Plus, Bell, UserPlus } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const AdminDashboard = () => {
  const stats = [
    { title: "Active Projects", value: "12", icon: FolderOpen, change: "+2 this week" },
    { title: "Total Clients", value: "34", icon: Users, change: "+5 this month" },
    { title: "Revenue", value: "$45,230", icon: DollarSign, change: "+12% vs last month" },
    { title: "Team Members", value: "8", icon: Users, change: "2 new hires" },
  ];

  const recentProjects = [
    { name: "Website Redesign", client: "TechCorp", status: "In Progress", priority: "High" },
    { name: "Brand Identity", client: "StartupXYZ", status: "Review", priority: "Medium" },
    { name: "SEO Campaign", client: "LocalBiz", status: "Completed", priority: "Low" },
  ];

  const recentActivity = [
    { action: "New project created", user: "John Doe", time: "2 hours ago" },
    { action: "Invoice sent to client", user: "Sarah Smith", time: "4 hours ago" },
    { action: "File uploaded", user: "Mike Johnson", time: "6 hours ago" },
  ];

  const handleCreateClient = () => {
    console.log('Create client clicked');
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agency Dashboard</h1>
            <p className="text-gray-600">Manage your agency operations and client projects</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button 
              onClick={handleCreateClient}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Client Account
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Projects
                <Button variant="ghost" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.client}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                      <Badge variant={project.priority === 'High' ? 'destructive' : project.priority === 'Medium' ? 'default' : 'secondary'}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">by {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <FolderOpen className="w-6 h-6" />
                <span>New Project</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={handleCreateClient}
              >
                <UserPlus className="w-6 h-6" />
                <span>Create Client</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <DollarSign className="w-6 h-6" />
                <span>Create Invoice</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;