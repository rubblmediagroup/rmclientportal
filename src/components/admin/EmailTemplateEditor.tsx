import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Save, Eye, Send } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'welcome' | 'project_update' | 'invoice' | 'reminder' | 'custom';
  htmlContent: string;
  textContent: string;
  variables: string[];
}

interface EmailTemplateEditorProps {
  templates: EmailTemplate[];
  onSave: (template: EmailTemplate) => void;
}

const EmailTemplateEditor = ({ templates, onSave }: EmailTemplateEditorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(templates[0] || null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  const templateTypes = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'project_update', label: 'Project Update' },
    { value: 'invoice', label: 'Invoice Notification' },
    { value: 'reminder', label: 'Reminder Email' },
    { value: 'custom', label: 'Custom Email' }
  ];

  const defaultVariables = [
    '{{client_name}}',
    '{{project_name}}',
    '{{agency_name}}',
    '{{date}}',
    '{{portal_url}}',
    '{{invoice_amount}}',
    '{{due_date}}'
  ];

  const handleTemplateChange = (field: keyof EmailTemplate, value: string) => {
    if (!selectedTemplate) return;
    
    const updated = { ...selectedTemplate, [field]: value };
    setSelectedTemplate(updated);
  };

  const handleSave = () => {
    if (selectedTemplate) {
      onSave(selectedTemplate);
    }
  };

  const createNewTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: 'New Template',
      subject: 'Subject Line',
      type: 'custom',
      htmlContent: '<div>Your HTML content here</div>',
      textContent: 'Your plain text content here',
      variables: []
    };
    setSelectedTemplate(newTemplate);
  };

  const insertVariable = (variable: string) => {
    if (!selectedTemplate) return;
    
    const field = activeTab === 'html' ? 'htmlContent' : 'textContent';
    const currentContent = selectedTemplate[field];
    const updated = currentContent + ' ' + variable;
    handleTemplateChange(field, updated);
  };

  const renderPreview = () => {
    if (!selectedTemplate) return null;
    
    const processedContent = selectedTemplate.htmlContent
      .replace(/{{client_name}}/g, 'John Doe')
      .replace(/{{project_name}}/g, 'Website Redesign')
      .replace(/{{agency_name}}/g, 'Rubbl Media')
      .replace(/{{date}}/g, new Date().toLocaleDateString())
      .replace(/{{portal_url}}/g, 'https://portal.rubblmedia.com')
      .replace(/{{invoice_amount}}/g, '$2,500.00')
      .replace(/{{due_date}}/g, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString());
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="border-b pb-2 mb-4">
          <div className="text-sm text-gray-600">Subject: {selectedTemplate.subject}</div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-gray-600">Create and manage email templates for client notifications</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={createNewTemplate}>
            <Mail className="w-4 h-4 mr-2" />
            New Template
          </Button>
          <Button 
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplate?.id === template.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedTemplate(template)}
              >
                {template.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Email Editor</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate && (
              <div className="space-y-6">
                {/* Template Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Template Name</Label>
                    <Input
                      value={selectedTemplate.name}
                      onChange={(e) => handleTemplateChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Template Type</Label>
                    <Select
                      value={selectedTemplate.type}
                      onValueChange={(value) => handleTemplateChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templateTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Subject Line</Label>
                    <Input
                      value={selectedTemplate.subject}
                      onChange={(e) => handleTemplateChange('subject', e.target.value)}
                    />
                  </div>
                </div>

                {previewMode ? (
                  renderPreview()
                ) : (
                  <div className="space-y-4">
                    {/* Variables */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Available Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {defaultVariables.map((variable) => (
                          <Button
                            key={variable}
                            size="sm"
                            variant="outline"
                            onClick={() => insertVariable(variable)}
                          >
                            {variable}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Content Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList>
                        <TabsTrigger value="html">HTML Content</TabsTrigger>
                        <TabsTrigger value="text">Plain Text</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="html" className="space-y-4">
                        <div>
                          <Label>HTML Content</Label>
                          <Textarea
                            value={selectedTemplate.htmlContent}
                            onChange={(e) => handleTemplateChange('htmlContent', e.target.value)}
                            rows={15}
                            className="font-mono text-sm"
                            placeholder="<div>Your HTML email content here...</div>"
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="text" className="space-y-4">
                        <div>
                          <Label>Plain Text Content</Label>
                          <Textarea
                            value={selectedTemplate.textContent}
                            onChange={(e) => handleTemplateChange('textContent', e.target.value)}
                            rows={15}
                            placeholder="Your plain text email content here..."
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;