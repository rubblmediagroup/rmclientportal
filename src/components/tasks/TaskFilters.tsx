import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { TaskFilter } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  filters: TaskFilter;
  onFiltersChange: (filters: TaskFilter) => void;
  availableTags?: string[];
  availableAssignees?: string[];
  className?: string;
}

export default function TaskFilters({ 
  filters, 
  onFiltersChange, 
  availableTags = [], 
  availableAssignees = [],
  className 
}: TaskFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: string) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handlePriorityChange = (priority: string) => {
    const currentPriority = filters.priority || [];
    const newPriority = currentPriority.includes(priority)
      ? currentPriority.filter(p => p !== priority)
      : [...currentPriority, priority];
    onFiltersChange({ ...filters, priority: newPriority });
  };

  const handleTagChange = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const activeFiltersCount = [
    filters.status?.length || 0,
    filters.priority?.length || 0,
    filters.assignee?.length || 0,
    filters.tags?.length || 0,
    filters.search ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute z-10 mt-2 w-full">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Filter Tasks</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['todo', 'in-progress', 'review', 'done'].map((status) => (
                      <Badge
                        key={status}
                        variant={filters.status?.includes(status) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleStatusChange(status)}
                      >
                        {status.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['low', 'medium', 'high', 'urgent'].map((priority) => (
                      <Badge
                        key={priority}
                        variant={filters.priority?.includes(priority) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handlePriorityChange(priority)}
                      >
                        {priority}
                      </Badge>
                    ))}
                  </div>
                </div>

                {availableTags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={filters.tags?.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagChange(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}