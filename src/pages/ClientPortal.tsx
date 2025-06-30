import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, FileText, MessageSquare, Download, Calendar } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const ClientPortal = () => {
  const activeProjects = [
    { 
      name: "Website Redesign", 
      progress: 75, 
      status: "In Progress", 
      deadline: "Dec 15, 2024",
      description: "Complete overhaul of company website with modern design"
    },
    { 
      name: "Brand Guidelines", 
      progress: 90, 
      status: "Review", 
      deadline: "Dec 10, 2024",
      description: "Comprehensive brand identity guidelines document"
    },
  ];

  const recentFiles = [
    { name: "Logo_Final_v3.png", type: "Image", size: "2.4 MB", date: "2 days ago" },
    { name: "Brand_Guidelines_Draft.pdf", type: "PDF", size: "5.1 MB", date: "1 week ago" },
    { name: "Website_Mockup.fig", type: "Figma", size: "12.3 MB", date: "1 week ago" },
  ];

  const messages = [
    { from: "Sarah (Project Manager)", message: "Logo revisions are ready for review", time: "2 hours ago" },
    { from: "Mike (Designer)", message: "Uploaded new website mockups", time: "1 day ago" },
    { from: "Team Rubbl", message: "Project milestone completed!", time: "3 days ago" },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
            <p className="text-gray-600">Track your project progress and collaborate with your team</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Active Projects */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeProjects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={project.status === 'Review' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">Due: {project.deadline}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Files */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Files
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{file.name}</h4>
                        <p className="text-xs text-gray-600">{file.type} • {file.size} • {file.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{msg.from}</p>
                        <p className="text-gray-700 text-sm mt-1">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Messages
              </Button>
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
              <Button variant="outline" className="h-16 flex flex-col space-y-1">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Send Message</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-1">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Request Revision</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-1">
                <Download className="w-5 h-5" />
                <span className="text-sm">Download Files</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-1">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Book Meeting</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ClientPortal;