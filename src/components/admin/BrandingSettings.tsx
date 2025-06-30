import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Palette, Code, Save } from 'lucide-react';

interface BrandingData {
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  customCSS: string;
  customJS: string;
}

interface BrandingSettingsProps {
  data: BrandingData;
  onSave: (data: BrandingData) => void;
}

const BrandingSettings = ({ data, onSave }: BrandingSettingsProps) => {
  const [brandingData, setBrandingData] = useState<BrandingData>(data);

  const handleInputChange = (field: keyof BrandingData, value: string) => {
    setBrandingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(brandingData);
  };

  const handleFileUpload = (field: 'logo' | 'favicon') => {
    // In a real app, this would handle file upload to storage
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          handleInputChange(field, result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Branding Settings</h2>
          <p className="text-gray-600">Customize your agency's branding and appearance</p>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="visual" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visual">Visual Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="custom">Custom Code</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Logo Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Logo</Label>
                  <div className="mt-2 space-y-3">
                    {brandingData.logo && (
                      <div className="w-32 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img 
                          src={brandingData.logo} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => handleFileUpload('logo')}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Logo URL (Alternative)</Label>
                  <Input
                    value={brandingData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Favicon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Favicon (16x16 or 32x32 px)</Label>
                  <div className="mt-2 space-y-3">
                    {brandingData.favicon && (
                      <div className="w-8 h-8 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img 
                          src={brandingData.favicon} 
                          alt="Favicon preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => handleFileUpload('favicon')}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Favicon URL (Alternative)</Label>
                  <Input
                    value={brandingData.favicon}
                    onChange={(e) => handleInputChange('favicon', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-3 mt-2">
                      <input
                        type="color"
                        value={brandingData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <Input
                        value={brandingData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center space-x-3 mt-2">
                      <input
                        type="color"
                        value={brandingData.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <Input
                        value={brandingData.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Color Preview</Label>
                    <div className="mt-2 space-y-2">
                      <div 
                        className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: brandingData.primaryColor }}
                      >
                        Primary Color
                      </div>
                      <div 
                        className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: brandingData.secondaryColor }}
                      >
                        Secondary Color
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Custom CSS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Custom CSS Code</Label>
                  <Textarea
                    value={brandingData.customCSS}
                    onChange={(e) => handleInputChange('customCSS', e.target.value)}
                    placeholder="/* Add your custom CSS here */
.custom-class {
  color: #333;
  font-size: 16px;
}"
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Custom JavaScript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Custom JavaScript Code</Label>
                  <Textarea
                    value={brandingData.customJS}
                    onChange={(e) => handleInputChange('customJS', e.target.value)}
                    placeholder="// Add your custom JavaScript here
console.log('Custom JS loaded');

// Example: Custom analytics
// gtag('config', 'GA_MEASUREMENT_ID');"
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandingSettings;