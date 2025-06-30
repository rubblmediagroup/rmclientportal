import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette, Layout, Mail } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import BrandingSettings from '@/components/admin/BrandingSettings';
import PageBuilder from '@/components/admin/PageBuilder';
import EmailTemplateEditor from '@/components/admin/EmailTemplateEditor';

const AdminSettings = () => {
  // Mock data for branding settings
  const [brandingData, setBrandingData] = useState({
    logo: '',
    favicon: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    customCSS: '',
    customJS: ''
  });

  // Mock data for login page blocks
  const [loginPageBlocks, setLoginPageBlocks] = useState([
    {
      id: '1',
      type: 'text' as const,
      content: { text: '<h1>Welcome to Your Project Portal</h1>' },
      styles: {}
    },
    {
      id: '2',
      type: 'text' as const,
      content: { text: '<p>Access your projects, files, and collaborate with our team.</p>' },
      styles: {}
    }
  ]);

  // Mock data for client dashboard blocks
  const [clientDashboardBlocks, setClientDashboardBlocks] = useState([
    {
      id: '1',
      type: 'text' as const,
      content: { text: '<h2>Your Project Dashboard</h2>' },
      styles: {}
    }
  ]);

  // Mock email templates
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to {{agency_name}} Portal',
      type: 'welcome' as const,
      htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #3B82F6;">Welcome {{client_name}}!</h1>
  <p>We're excited to have you on board. Your project portal is now ready.</p>
  <p><strong>Project:</strong> {{project_name}}</p>
  <p><a href="{{portal_url}}" style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Your Portal</a></p>
  <p>Best regards,<br>{{agency_name}} Team</p>
</div>`,
      textContent: `Welcome {{client_name}}!\n\nWe're excited to have you on board. Your project portal is now ready.\n\nProject: {{project_name}}\n\nAccess your portal: {{portal_url}}\n\nBest regards,\n{{agency_name}} Team`,
      variables: ['client_name', 'agency_name', 'project_name', 'portal_url']
    },
    {
      id: '2',
      name: 'Project Update',
      subject: 'Project Update: {{project_name}}',
      type: 'project_update' as const,
      htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #10B981;">Project Update</h1>
  <p>Hi {{client_name}},</p>
  <p>We have an update on your project: <strong>{{project_name}}</strong></p>
  <p>Please check your portal for the latest updates and files.</p>
  <p><a href="{{portal_url}}" style="background: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Update</a></p>
</div>`,
      textContent: `Hi {{client_name}},\n\nWe have an update on your project: {{project_name}}\n\nPlease check your portal for the latest updates and files.\n\nView update: {{portal_url}}`,
      variables: ['client_name', 'project_name', 'portal_url']
    }
  ]);

  const handleBrandingSave = (data: typeof brandingData) => {
    setBrandingData(data);
    console.log('Branding saved:', data);
  };

  const handleLoginPageSave = (blocks: typeof loginPageBlocks) => {
    setLoginPageBlocks(blocks);
    console.log('Login page saved:', blocks);
  };

  const handleClientDashboardSave = (blocks: typeof clientDashboardBlocks) => {
    setClientDashboardBlocks(blocks);
    console.log('Client dashboard saved:', blocks);
  };

  const handleEmailTemplateSave = (template: typeof emailTemplates[0]) => {
    setEmailTemplates(prev => {
      const existing = prev.find(t => t.id === template.id);
      if (existing) {
        return prev.map(t => t.id === template.id ? template : t);
      } else {
        return [...prev, template];
      }
    });
    console.log('Email template saved:', template);
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Agency Settings</h1>
          <p className="text-gray-600">Customize your agency portal, branding, and client experience</p>
        </div>

        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="branding" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Branding</span>
            </TabsTrigger>
            <TabsTrigger value="login-page" className="flex items-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>Login Page</span>
            </TabsTrigger>
            <TabsTrigger value="client-dashboard" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Client Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="email-templates" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="branding">
            <Card>
              <CardContent className="p-6">
                <BrandingSettings 
                  data={brandingData}
                  onSave={handleBrandingSave}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login-page">
            <Card>
              <CardHeader>
                <CardTitle>Login Page Designer</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[800px]">
                  <PageBuilder
                    title="Login Page Layout"
                    blocks={loginPageBlocks}
                    onSave={handleLoginPageSave}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client-dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Client Dashboard Designer</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[800px]">
                  <PageBuilder
                    title="Client Dashboard Layout"
                    blocks={clientDashboardBlocks}
                    onSave={handleClientDashboardSave}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-templates">
            <Card>
              <CardContent className="p-6">
                <EmailTemplateEditor
                  templates={emailTemplates}
                  onSave={handleEmailTemplateSave}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminSettings;