import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Users, Clock, X, GitMerge, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataConflict {
  id: string;
  resourceType: 'project' | 'task' | 'client' | 'article';
  resourceId: string;
  resourceTitle: string;
  conflictType: 'concurrent_edit' | 'version_mismatch';
  users: {
    id: string;
    name: string;
    changes: Record<string, any>;
    timestamp: string;
  }[];
  currentVersion: Record<string, any>;
  detectedAt: string;
  status: 'pending' | 'resolved';
}

interface ConflictResolutionProps {
  conflicts?: DataConflict[];
  onResolveConflict?: (conflictId: string, resolution: string) => void;
}

const ConflictResolution: React.FC<ConflictResolutionProps> = ({
  conflicts: propConflicts,
  onResolveConflict
}) => {
  const [conflicts, setConflicts] = useState<DataConflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<DataConflict | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (propConflicts) {
      setConflicts(propConflicts);
    } else {
      loadConflicts();
    }
  }, [propConflicts]);

  const loadConflicts = () => {
    const stored = localStorage.getItem('rubbl_data_conflicts');
    if (stored) {
      setConflicts(JSON.parse(stored));
    }
  };

  const handleResolveConflict = (conflictId: string, resolution: string) => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    const updatedConflicts = conflicts.map(c => 
      c.id === conflictId ? { ...c, status: 'resolved' as const } : c
    );
    
    setConflicts(updatedConflicts);
    localStorage.setItem('rubbl_data_conflicts', JSON.stringify(updatedConflicts));

    if (onResolveConflict) {
      onResolveConflict(conflictId, resolution);
    }

    toast({
      title: "Conflict Resolved",
      description: `${conflict.resourceTitle} conflict resolved.`
    });

    setSelectedConflict(null);
    setShowDetails(false);
  };

  const getConflictColor = (type: string) => {
    switch (type) {
      case 'concurrent_edit': return 'bg-yellow-100 text-yellow-800';
      case 'version_mismatch': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingConflicts = conflicts.filter(c => c.status === 'pending');

  if (pendingConflicts.length === 0 && !showDetails) {
    return null;
  }

  return (
    <>
      {pendingConflicts.length > 0 && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {pendingConflicts.length} data conflict{pendingConflicts.length > 1 ? 's' : ''} detected.
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              Resolve Conflicts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {showDetails && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Data Conflict Resolution
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="overflow-y-auto">
              {selectedConflict ? (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedConflict.resourceTitle}</h3>
                        <Badge className={getConflictColor(selectedConflict.conflictType)}>
                          {selectedConflict.conflictType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedConflict(null)}
                      >
                        Back
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Current Version
                        </h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(selectedConflict.currentVersion).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedConflict.users.map((user) => (
                        <div key={user.id} className="border rounded p-3">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {user.name}'s Changes
                          </h4>
                          <div className="space-y-2 text-sm">
                            {Object.entries(user.changes).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600">{key}:</span>
                                <span className="font-medium text-blue-600">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(user.timestamp).toLocaleString()}
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => handleResolveConflict(selectedConflict.id, 'accept_theirs')}
                          >
                            Accept These Changes
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-3 mt-6 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleResolveConflict(selectedConflict.id, 'merge')}
                        className="flex items-center gap-2"
                      >
                        <GitMerge className="w-4 h-4" />
                        Smart Merge
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResolveConflict(selectedConflict.id, 'ignore')}
                      >
                        Ignore Conflict
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-3">Pending Conflicts ({pendingConflicts.length})</h3>
                  <div className="space-y-3">
                    {pendingConflicts.map((conflict) => (
                      <div key={conflict.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{conflict.resourceTitle}</h4>
                              <Badge className={getConflictColor(conflict.conflictType)}>
                                {conflict.conflictType.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {conflict.users.length} user{conflict.users.length > 1 ? 's' : ''} made conflicting changes
                            </p>
                          </div>
                          <Button
                            onClick={() => setSelectedConflict(conflict)}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ConflictResolution;