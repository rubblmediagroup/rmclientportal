import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Move, Trash2, Eye } from 'lucide-react';

interface Block {
  id: string;
  type: 'text' | 'image' | 'button' | 'html';
  content: any;
  styles: any;
}

interface PageBuilderProps {
  title: string;
  blocks: Block[];
  onSave: (blocks: Block[]) => void;
}

const PageBuilder = ({ title, blocks, onSave }: PageBuilderProps) => {
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>(blocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: {}
    };
    setCurrentBlocks([...currentBlocks, newBlock]);
  };

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'text': return { text: 'Enter your text here' };
      case 'image': return { src: '', alt: 'Image' };
      case 'button': return { text: 'Button', link: '#' };
      case 'html': return { html: '<div>Custom HTML</div>' };
      default: return {};
    }
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setCurrentBlocks(blocks => 
      blocks.map(block => 
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setCurrentBlocks(blocks => blocks.filter(block => block.id !== id));
    setSelectedBlock(null);
  };

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text Content</Label>
              <Textarea
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, text: e.target.value }
                })}
              />
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={block.content.src}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, src: e.target.value }
                })}
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={block.content.alt}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, alt: e.target.value }
                })}
              />
            </div>
          </div>
        );
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, text: e.target.value }
                })}
              />
            </div>
            <div>
              <Label>Link URL</Label>
              <Input
                value={block.content.link}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, link: e.target.value }
                })}
              />
            </div>
          </div>
        );
      case 'html':
        return (
          <div className="space-y-4">
            <div>
              <Label>Custom HTML</Label>
              <Textarea
                value={block.content.html}
                onChange={(e) => updateBlock(block.id, {
                  content: { ...block.content, html: e.target.value }
                })}
                rows={6}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <Button
            size="sm"
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>

        {!previewMode && (
          <>
            <div>
              <Label className="text-sm font-medium mb-2 block">Add Blocks</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => addBlock('text')}>
                  <Plus className="w-4 h-4 mr-1" />Text
                </Button>
                <Button size="sm" variant="outline" onClick={() => addBlock('image')}>
                  <Plus className="w-4 h-4 mr-1" />Image
                </Button>
                <Button size="sm" variant="outline" onClick={() => addBlock('button')}>
                  <Plus className="w-4 h-4 mr-1" />Button
                </Button>
                <Button size="sm" variant="outline" onClick={() => addBlock('html')}>
                  <Plus className="w-4 h-4 mr-1" />HTML
                </Button>
              </div>
            </div>

            {selectedBlock && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Block Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderBlockEditor(
                    currentBlocks.find(b => b.id === selectedBlock)!
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteBlock(selectedBlock)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Block
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Button onClick={() => onSave(currentBlocks)} className="w-full">
          Save Changes
        </Button>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {currentBlocks.map((block) => (
            <div
              key={block.id}
              className={`relative group border-2 border-dashed ${
                selectedBlock === block.id ? 'border-blue-500' : 'border-transparent'
              } hover:border-gray-300 p-4 rounded-lg cursor-pointer`}
              onClick={() => !previewMode && setSelectedBlock(block.id)}
            >
              {!previewMode && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-1">
                  <Button size="sm" variant="outline">
                    <Move className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {block.type === 'text' && (
                <div dangerouslySetInnerHTML={{ __html: block.content.text }} />
              )}
              {block.type === 'image' && (
                <img src={block.content.src} alt={block.content.alt} className="max-w-full" />
              )}
              {block.type === 'button' && (
                <Button>{block.content.text}</Button>
              )}
              {block.type === 'html' && (
                <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
              )}
            </div>
          ))}
          
          {currentBlocks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No blocks added yet. Start building your page!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;