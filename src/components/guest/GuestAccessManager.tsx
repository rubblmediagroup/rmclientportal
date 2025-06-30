import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GuestToken } from '@/types/team';
import { Link, Clock, Users, Shield, Plus, Copy } from 'lucide-react';

interface GuestAccessManagerProps {
  projectId?: string;
}

export const GuestAccessManager: React.FC<GuestAccessManagerProps> = ({ projectId }) => {
  const [tokens, setTokens] = useState<GuestToken[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newToken, setNewToken] = useState({
    type: 'project' as const,
    guestName: '',
    guestEmail: '',
    guestCompany: '',
    permissions: [] as string[],
    expiresIn: '7', // days
    usageLimit: 0
  });

  useEffect(() => {
    loadTokens();
  }, [projectId]);

  const loadTokens = () => {
    try {
      const savedTokens = JSON.parse(localStorage.getItem('rubbl_guest_tokens') || '[]');
      const filteredTokens = projectId 
        ? savedTokens.filter((t: GuestToken) => t.id.includes(projectId))
        : savedTokens;
      setTokens(filteredTokens);
    } catch (error) {
      console.error('Error loading guest tokens:', error);
    }
  };

  const generateToken = (): string => {
    return 'guest_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  };

  const createGuestToken = () => {
    if (!newToken.guestName || !newToken.guestEmail) {
      alert('Please fill in required fields');
      return;
    }

    const token: GuestToken = {
      id: `${projectId || 'global'}_${Date.now()}`,
      token: generateToken(),
      type: newToken.type,
      permissions: newToken.permissions,
      expiresAt: new Date(Date.now() + parseInt(newToken.expiresIn) * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: newToken.usageLimit || undefined,
      usageCount: 0,
      createdBy: 'current_user',
      createdAt: new Date().toISOString(),
      isActive: true,
      guestInfo: {
        name: newToken.guestName,
        email: newToken.guestEmail,
        company: newToken.guestCompany || undefined
      }
    };

    const updatedTokens = [...tokens, token];
    setTokens(updatedTokens);
    
    try {
      const allTokens = JSON.parse(localStorage.getItem('rubbl_guest_tokens') || '[]');
      const newAllTokens = [...allTokens, token];
      localStorage.setItem('rubbl_guest_tokens', JSON.stringify(newAllTokens));
    } catch (error) {
      console.error('Error saving token:', error);
    }

    setShowCreateForm(false);
    setNewToken({
      type: 'project',
      guestName: '',
      guestEmail: '',
      guestCompany: '',
      permissions: [],
      expiresIn: '7',
      usageLimit: 0
    });
  };

  const revokeToken = (tokenId: string) => {
    const updatedTokens = tokens.map(t => 
      t.id === tokenId ? { ...t, isActive: false } : t
    );
    setTokens(updatedTokens);
    
    try {
      const allTokens = JSON.parse(localStorage.getItem('rubbl_guest_tokens') || '[]');
      const updatedAllTokens = allTokens.map((t: GuestToken) => 
        t.id === tokenId ? { ...t, isActive: false } : t
      );
      localStorage.setItem('rubbl_guest_tokens', JSON.stringify(updatedAllTokens));
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  };

  const copyGuestLink = (token: string) => {
    const guestUrl = `${window.location.origin}/guest/${token}`;
    navigator.clipboard.writeText(guestUrl);
    alert('Guest link copied to clipboard!');
  };

  const getTokenStats = () => {
    const active = tokens.filter(t => t.isActive).length;
    const expired = tokens.filter(t => new Date(t.expiresAt) < new Date()).length;
    const totalUsage = tokens.reduce((sum, t) => sum + t.usageCount, 0);
    return { active, expired, totalUsage };
  };

  const stats = getTokenStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Guest Access Management</h2>
          <p className="text-muted-foreground">Create and manage temporary access tokens</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Guest Access
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
          </CardContent>
        </Card>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Guest Access Token</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestName">Guest Name *</Label>
                <Input
                  id="guestName"
                  value={newToken.guestName}
                  onChange={(e) => setNewToken(prev => ({ ...prev, guestName: e.target.value }))}
                  placeholder="Enter guest name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Guest Email *</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={newToken.guestEmail}
                  onChange={(e) => setNewToken(prev => ({ ...prev, guestEmail: e.target.value }))}
                  placeholder="Enter guest email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestCompany">Company (Optional)</Label>
                <Input
                  id="guestCompany"
                  value={newToken.guestCompany}
                  onChange={(e) => setNewToken(prev => ({ ...prev, guestCompany: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenType">Access Type</Label>
                <Select value={newToken.type} onValueChange={(value: any) => setNewToken(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Project Access</SelectItem>
                    <SelectItem value="file">File Access</SelectItem>
                    <SelectItem value="time-limited">Time Limited</SelectItem>
                    <SelectItem value="feature-limited">Feature Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresIn">Expires In (Days)</Label>
                <Select value={newToken.expiresIn} onValueChange={(value) => setNewToken(prev => ({ ...prev, expiresIn: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit (0 = Unlimited)</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={newToken.usageLimit}
                  onChange={(e) => setNewToken(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createGuestToken}>Create Token</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Guest Access Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tokens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No guest tokens created yet.
              </div>
            ) : (
              tokens.map(token => {
                const isExpired = new Date(token.expiresAt) < new Date();
                const isOverLimit = token.usageLimit && token.usageCount >= token.usageLimit;
                
                return (
                  <div key={token.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{token.guestInfo.name}</span>
                        <Badge variant={token.isActive && !isExpired && !isOverLimit ? 'default' : 'secondary'}>
                          {!token.isActive ? 'Revoked' : isExpired ? 'Expired' : isOverLimit ? 'Limit Reached' : 'Active'}
                        </Badge>
                        <Badge variant="outline">{token.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {token.guestInfo.email} • Expires: {new Date(token.expiresAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Usage: {token.usageCount}{token.usageLimit ? `/${token.usageLimit}` : ''}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyGuestLink(token.token)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {token.isActive && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeToken(token.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};