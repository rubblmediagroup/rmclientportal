import React, { useState } from 'react';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import KnowledgeBaseManager from '@/components/knowledge/KnowledgeBaseManager';
import BulkOperationsManager from '@/components/bulk/BulkOperationsManager';
import UndoRedoManager from '@/components/undo/UndoRedoManager';
import KeyboardShortcuts from '@/components/keyboard/KeyboardShortcuts';
import ConflictResolution from '@/components/conflict/ConflictResolution';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Save, CheckCircle } from 'lucide-react';

const KnowledgeBase = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState(new Date());

  // Mock data for bulk operations
  const mockItems = [
    { id: '1', title: 'Getting Started Guide', type: 'article' as const, status: 'published', lastModified: new Date().toISOString() },
    { id: '2', title: 'API Documentation', type: 'article' as const, status: 'draft', lastModified: new Date().toISOString() },
    { id: '3', title: 'Troubleshooting FAQ', type: 'article' as const, status: 'review', lastModified: new Date().toISOString() }
  ];

  const handleBulkAction = (action: string, itemIds: string[]) => {
    console.log(`Bulk ${action} on items:`, itemIds);
    // Add undo action
    if ((window as any).addUndoAction) {
      (window as any).addUndoAction({
        type: action,
        description: `Bulk ${action} on ${itemIds.length} items`,
        data: { action, itemIds },
        undoData: { originalItems: mockItems.filter(item => itemIds.includes(item.id)) }
      });
    }
  };

  const handleSave = () => {
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
    }, 1000);
  };

  const handleNewArticle = () => {
    console.log('Creating new article');
  };

  const handleSearch = () => {
    console.log('Opening search');
  };

  return (
    <div className="p-6 space-y-6">
      <BreadcrumbNavigation />
      
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-white border rounded-lg p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {autoSaveStatus === 'saving' ? (
              <Save className="w-4 h-4 text-blue-600 animate-pulse" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            <span className="text-sm text-gray-600">
              {autoSaveStatus === 'saving' ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Offline Mode
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Conflict Resolution */}
      <ConflictResolution />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <KnowledgeBaseManager />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full" size="sm" onClick={handleNewArticle}>
                  New Article
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Import Content
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Export All
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Articles created</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Articles updated</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Views this week</span>
                  <Badge variant="secondary">156</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Bulk Operations */}
      <BulkOperationsManager
        items={mockItems}
        onBulkAction={handleBulkAction}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
      />
      
      {/* Global Components */}
      <UndoRedoManager />
      <KeyboardShortcuts
        onNewProject={handleNewArticle}
        onSave={handleSave}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default KnowledgeBase;