import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GuestToken } from '@/types/team';
import { Shield, Clock, Eye, Download, MessageCircle, AlertTriangle } from 'lucide-react';

const GuestPortal: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [guestData, setGuestData] = useState<GuestToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      validateAndLoadGuestData(token);
    }
  }, [token]);

  const validateAndLoadGuestData = (tokenString: string) => {
    try {
      const allTokens = JSON.parse(localStorage.getItem('rubbl_guest_tokens') || '[]');
      const guestToken = allTokens.find((t: GuestToken) => t.token === tokenString);
      
      if (!guestToken) {
        setError('Invalid or expired access token');
        setLoading(false);
        return;
      }

      // Check if token is active
      if (!guestToken.isActive) {
        setError('This access token has been revoked');
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (new Date(guestToken.expiresAt) < new Date()) {
        setError('This access token has expired');
        setLoading(false);
        return;
      }

      // Check usage limit
      if (guestToken.usageLimit && guestToken.usageCount >= guestToken.usageLimit) {
        setError('This access token has reached its usage limit');
        setLoading(false);
        return;
      }

      // Update usage count
      const updatedTokens = allTokens.map((t: GuestToken) => 
        t.token === tokenString 
          ? { ...t, usageCount: t.usageCount + 1 }
          : t
      );
      localStorage.setItem('rubbl_guest_tokens', JSON.stringify(updatedTokens));
      
      setGuestData({ ...guestToken, usageCount: guestToken.usageCount + 1 });
    } catch (error) {
      console.error('Error validating guest token:', error);
      setError('Error validating access token');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getAccessTypeDescription = (type: string) => {
    switch (type) {
      case 'project': return 'Full project access with specified permissions';
      case 'file': return 'Access to specific files and documents';
      case 'time-limited': return 'Time-restricted access to resources';
      case 'feature-limited': return 'Limited feature access';
      default: return 'Guest access with custom permissions';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="text-sm text-gray-600 mt-4">
              If you believe this is an error, please contact the person who shared this link with you.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!guestData) {
    return null;
  }

  const timeRemaining = Math.ceil((new Date(guestData.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const usageRemaining = guestData.usageLimit ? guestData.usageLimit - guestData.usageCount : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Guest Access Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {guestData.guestInfo.name}</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Guest Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Access Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Access Type</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{guestData.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {getAccessTypeDescription(guestData.type)}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Permissions</Label>
                  <div className="mt-2 space-y-2">
                    {guestData.permissions.length === 0 ? (
                      <p className="text-sm text-gray-500">No specific permissions set</p>
                    ) : (
                      guestData.permissions.map(permission => (
                        <div key={permission} className="flex items-center gap-2">
                          {getPermissionIcon(permission)}
                          <span className="text-sm capitalize">{permission}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Expires in {timeRemaining} days</span>
                  </div>
                  {usageRemaining !== null && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Eye className="h-4 w-4" />
                      <span>{usageRemaining} uses remaining</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Your Guest Access</h3>
                  <p className="text-gray-600 mb-6">
                    You have {guestData.type} access with the permissions listed on the left.
                    The specific resources available to you will be displayed here based on your access level.
                  </p>
                  
                  {/* Placeholder for actual content based on permissions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {guestData.permissions.includes('view') && (
                      <Card className="p-4">
                        <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium">View Access</h4>
                        <p className="text-sm text-gray-600">Browse and view available content</p>
                      </Card>
                    )}
                    
                    {guestData.permissions.includes('download') && (
                      <Card className="p-4">
                        <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium">Download Access</h4>
                        <p className="text-sm text-gray-600">Download files and resources</p>
                      </Card>
                    )}
                    
                    {guestData.permissions.includes('comment') && (
                      <Card className="p-4">
                        <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium">Comment Access</h4>
                        <p className="text-sm text-gray-600">Leave comments and feedback</p>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}

export default GuestPortal;