import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Undo2, Redo2, History, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface UndoAction {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  data: any;
  undoData: any;
}

interface UndoRedoManagerProps {
  maxHistorySize?: number;
  onUndo?: (action: UndoAction) => void;
  onRedo?: (action: UndoAction) => void;
}

const UndoRedoManager: React.FC<UndoRedoManagerProps> = ({
  maxHistorySize = 20,
  onUndo,
  onRedo
}) => {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoAction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('rubbl_undo_history');
    if (stored) {
      const { undoStack: storedUndo, redoStack: storedRedo } = JSON.parse(stored);
      setUndoStack(storedUndo || []);
      setRedoStack(storedRedo || []);
    }
  }, []);

  // Save history to localStorage whenever stacks change
  useEffect(() => {
    localStorage.setItem('rubbl_undo_history', JSON.stringify({
      undoStack,
      redoStack
    }));
  }, [undoStack, redoStack]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if (
        ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z')
      ) {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack]);

  const addAction = useCallback((action: Omit<UndoAction, 'id' | 'timestamp'>) => {
    const newAction: UndoAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setUndoStack(prev => {
      const newStack = [...prev, newAction];
      // Limit stack size
      if (newStack.length > maxHistorySize) {
        newStack.shift();
      }
      return newStack;
    });

    // Clear redo stack when new action is added
    setRedoStack([]);
  }, [maxHistorySize]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) {
      toast({
        title: "Nothing to undo",
        description: "No actions available to undo."
      });
      return;
    }

    const actionToUndo = undoStack[undoStack.length - 1];
    
    // Move action from undo to redo stack
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, actionToUndo]);

    // Execute undo callback
    if (onUndo) {
      onUndo(actionToUndo);
    }

    toast({
      title: "Action undone",
      description: `Undid: ${actionToUndo.description}`
    });
  }, [undoStack, onUndo, toast]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) {
      toast({
        title: "Nothing to redo",
        description: "No actions available to redo."
      });
      return;
    }

    const actionToRedo = redoStack[redoStack.length - 1];
    
    // Move action from redo to undo stack
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, actionToRedo]);

    // Execute redo callback
    if (onRedo) {
      onRedo(actionToRedo);
    }

    toast({
      title: "Action redone",
      description: `Redid: ${actionToRedo.description}`
    });
  }, [redoStack, onRedo, toast]);

  const handleSelectiveUndo = (actionId: string) => {
    const actionIndex = undoStack.findIndex(action => action.id === actionId);
    if (actionIndex === -1) return;

    const action = undoStack[actionIndex];
    
    // Remove action from undo stack
    setUndoStack(prev => prev.filter(a => a.id !== actionId));
    
    // Execute undo callback
    if (onUndo) {
      onUndo(action);
    }

    toast({
      title: "Action undone",
      description: `Selectively undid: ${action.description}`
    });
  };

  const getActionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'create': 'bg-green-100 text-green-800',
      'update': 'bg-blue-100 text-blue-800',
      'delete': 'bg-red-100 text-red-800',
      'move': 'bg-purple-100 text-purple-800',
      'archive': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Expose addAction method globally for other components to use
  useEffect(() => {
    (window as any).addUndoAction = addAction;
    return () => {
      delete (window as any).addUndoAction;
    };
  }, [addAction]);

  return (
    <>
      {/* Undo/Redo Toolbar */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={undoStack.length === 0}
          title={`Undo (Ctrl+Z)${undoStack.length > 0 ? ` - ${undoStack[undoStack.length - 1].description}` : ''}`}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          disabled={redoStack.length === 0}
          title={`Redo (Ctrl+Y)${redoStack.length > 0 ? ` - ${redoStack[redoStack.length - 1].description}` : ''}`}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-200" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          title="Show action history"
        >
          <History className="w-4 h-4" />
        </Button>
        
        {(undoStack.length > 0 || redoStack.length > 0) && (
          <Badge variant="secondary" className="text-xs">
            {undoStack.length}
          </Badge>
        )}
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed bottom-16 right-4 z-50 w-80">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Action History</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {undoStack.length === 0 && redoStack.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No actions in history
                  </p>
                ) : (
                  <>
                    {undoStack.slice().reverse().map((action, index) => (
                      <div key={action.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge className={getActionTypeColor(action.type)} variant="secondary">
                              {action.type}
                            </Badge>
                            <span className="text-sm font-medium truncate">
                              {action.description}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectiveUndo(action.id)}
                          title="Undo this action"
                        >
                          <Undo2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {redoStack.length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <p className="text-xs text-gray-500 mb-2">Available to redo:</p>
                        {redoStack.slice().reverse().map((action) => (
                          <div key={action.id} className="flex items-center justify-between p-2 border rounded bg-gray-50 opacity-60">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge className={getActionTypeColor(action.type)} variant="secondary">
                                  {action.type}
                                </Badge>
                                <span className="text-sm font-medium truncate">
                                  {action.description}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(action.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default UndoRedoManager;
export { type UndoAction };