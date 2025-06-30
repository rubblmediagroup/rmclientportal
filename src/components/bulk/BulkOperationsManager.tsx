import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Archive, 
  Trash2, 
  Download, 
  Edit, 
  Users, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { BulkOperation } from '@/types/knowledge';

interface BulkItem {
  id: string;
  title: string;
  type: 'project' | 'client' | 'article' | 'task';
  status: string;
  lastModified: string;
}

interface BulkOperationsManagerProps {
  items: BulkItem[];
  onBulkAction: (action: string, itemIds: string[]) => void;
  selectedItems: string[];
  onSelectionChange: (itemIds: string[]) => void;
}

const BulkOperationsManager: React.FC<BulkOperationsManagerProps> = ({
  items,
  onBulkAction,
  selectedItems,
  onSelectionChange
}) => {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [showOperations, setShowOperations] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rubbl_bulk_operations');
    if (stored) {
      setOperations(JSON.parse(stored));
    }
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(items.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    }
  };

  const executeBulkOperation = (action: string) => {
    if (selectedItems.length === 0) return;

    const operation: BulkOperation = {
      id: Date.now().toString(),
      type: action as any,
      itemIds: [...selectedItems],
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString()
    };

    const updatedOperations = [...operations, operation];
    setOperations(updatedOperations);
    localStorage.setItem('rubbl_bulk_operations', JSON.stringify(updatedOperations));
    setShowOperations(true);

    // Simulate operation progress
    simulateProgress(operation.id);
    onBulkAction(action, selectedItems);
    onSelectionChange([]);
  };

  const simulateProgress = (operationId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        updateOperationStatus(operationId, 'completed');
      }
      updateOperationProgress(operationId, progress);
    }, 500);
  };

  const updateOperationProgress = (operationId: string, progress: number) => {
    setOperations(prev => 
      prev.map(op => 
        op.id === operationId 
          ? { ...op, progress: Math.min(progress, 100) }
          : op
      )
    );
  };

  const updateOperationStatus = (operationId: string, status: BulkOperation['status']) => {
    setOperations(prev => {
      const updated = prev.map(op => 
        op.id === operationId ? { ...op, status } : op
      );
      localStorage.setItem('rubbl_bulk_operations', JSON.stringify(updated));
      return updated;
    });
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'archive': return <Archive className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      case 'assign': return <Users className="w-4 h-4" />;
      default: return <Edit className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const activeOperations = operations.filter(op => op.status === 'processing');
  const completedOperations = operations.filter(op => op.status === 'completed');

  return (
    <div className="space-y-4">
      {/* Selection Header */}
      {selectedItems.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {selectedItems.length} selected
                </Badge>
                <span className="text-sm text-gray-600">
                  Bulk actions available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => executeBulkOperation('archive')}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => executeBulkOperation('export')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => executeBulkOperation('assign')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Assign
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => executeBulkOperation('delete')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectionChange([])}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Items</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedItems.length === items.length && items.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    {item.type} • {item.status} • Modified {new Date(item.lastModified).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operations Status */}
      {(activeOperations.length > 0 || showOperations) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bulk Operations</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOperations(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeOperations.map((operation) => (
                <div key={operation.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getOperationIcon(operation.type)}
                      <span className="font-medium capitalize">{operation.type}</span>
                      <Badge variant="secondary">{operation.itemIds.length} items</Badge>
                    </div>
                    {getStatusIcon(operation.status)}
                  </div>
                  <Progress value={operation.progress} className="h-2" />
                  <div className="text-sm text-gray-500 mt-1">
                    {Math.round(operation.progress)}% complete
                  </div>
                </div>
              ))}
              
              {completedOperations.slice(-3).map((operation) => (
                <div key={operation.id} className="p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getOperationIcon(operation.type)}
                      <span className="font-medium capitalize">{operation.type}</span>
                      <Badge variant="secondary">{operation.itemIds.length} items</Badge>
                    </div>
                    {getStatusIcon(operation.status)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Completed {new Date(operation.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkOperationsManager;