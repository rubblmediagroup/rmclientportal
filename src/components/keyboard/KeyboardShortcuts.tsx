import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Keyboard, Search, Save, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'Global' | 'Navigation' | 'Actions' | 'Custom';
  modifiers: string[];
}

interface KeyboardShortcutsProps {
  onNewProject?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onNewProject,
  onSave,
  onSearch
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load custom shortcuts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('rubbl_keyboard_shortcuts');
    if (stored) {
      setCustomShortcuts(JSON.parse(stored));
    }
  }, []);

  const defaultShortcuts: Shortcut[] = [
    // Global shortcuts
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(true),
      category: 'Global',
      modifiers: []
    },
    {
      key: 'Escape',
      description: 'Close modal/dialog',
      action: () => setShowHelp(false),
      category: 'Global',
      modifiers: []
    },
    
    // Navigation shortcuts
    {
      key: 'k',
      description: 'Open search',
      action: () => {
        if (onSearch) onSearch();
        else toast({ title: 'Search', description: 'Search functionality triggered' });
      },
      category: 'Navigation',
      modifiers: ['Ctrl']
    },
    {
      key: 'd',
      description: 'Go to dashboard',
      action: () => navigate('/admin'),
      category: 'Navigation',
      modifiers: ['Ctrl']
    },
    {
      key: 'p',
      description: 'Go to projects',
      action: () => navigate('/admin/projects'),
      category: 'Navigation',
      modifiers: ['Ctrl']
    },
    {
      key: 't',
      description: 'Go to tasks',
      action: () => navigate('/admin/tasks'),
      category: 'Navigation',
      modifiers: ['Ctrl']
    },
    {
      key: 'u',
      description: 'Go to team management',
      action: () => navigate('/admin/team'),
      category: 'Navigation',
      modifiers: ['Ctrl']
    },
    
    // Action shortcuts
    {
      key: 's',
      description: 'Save current form/data',
      action: () => {
        if (onSave) onSave();
        else toast({ title: 'Save', description: 'Save action triggered' });
      },
      category: 'Actions',
      modifiers: ['Ctrl']
    },
    {
      key: 'n',
      description: 'Create new project',
      action: () => {
        if (onNewProject) onNewProject();
        else toast({ title: 'New Project', description: 'New project creation triggered' });
      },
      category: 'Actions',
      modifiers: ['Ctrl']
    },
    {
      key: 'z',
      description: 'Undo last action',
      action: () => {
        if ((window as any).addUndoAction) {
          toast({ title: 'Undo', description: 'Undo action triggered' });
        }
      },
      category: 'Actions',
      modifiers: ['Ctrl']
    },
    {
      key: 'y',
      description: 'Redo last action',
      action: () => {
        toast({ title: 'Redo', description: 'Redo action triggered' });
      },
      category: 'Actions',
      modifiers: ['Ctrl']
    }
  ];

  // Register keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Handle help shortcut (? key)
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setShowHelp(true);
        return;
      }

      // Handle escape key
      if (event.key === 'Escape') {
        setShowHelp(false);
        return;
      }

      // Handle other shortcuts
      defaultShortcuts.forEach(shortcut => {
        const hasCtrl = shortcut.modifiers.includes('Ctrl');
        const hasShift = shortcut.modifiers.includes('Shift');
        const hasAlt = shortcut.modifiers.includes('Alt');

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (event.ctrlKey || event.metaKey) === hasCtrl &&
          event.shiftKey === hasShift &&
          event.altKey === hasAlt
        ) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [defaultShortcuts]);

  const formatShortcut = (shortcut: Shortcut) => {
    const parts = [];
    if (shortcut.modifiers.includes('Ctrl')) parts.push('Ctrl');
    if (shortcut.modifiers.includes('Shift')) parts.push('Shift');
    if (shortcut.modifiers.includes('Alt')) parts.push('Alt');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  const filteredShortcuts = defaultShortcuts.filter(shortcut =>
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  if (!showHelp) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHelp(true)}
          className="bg-white shadow-lg"
          title="Show keyboard shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              <CardTitle>Keyboard Shortcuts</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  {category === 'Global' && <Settings className="w-4 h-4" />}
                  {category === 'Navigation' && <Search className="w-4 h-4" />}
                  {category === 'Actions' && <Plus className="w-4 h-4" />}
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <span className="text-sm">{shortcut.description}</span>
                      <Badge variant="outline" className="font-mono">
                        {formatShortcut(shortcut)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Press <Badge variant="outline" className="font-mono text-xs">?</Badge> anytime to show this help</li>
              <li>• Press <Badge variant="outline" className="font-mono text-xs">Escape</Badge> to close dialogs</li>
              <li>• Shortcuts work from anywhere except input fields</li>
              <li>• Use <Badge variant="outline" className="font-mono text-xs">Ctrl+K</Badge> for quick search</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyboardShortcuts;