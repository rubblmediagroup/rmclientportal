import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const isAdmin = user?.role === 'agency_admin' || user?.role === 'super_admin';
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Home breadcrumb
    breadcrumbs.push({
      label: 'Dashboard',
      path: isAdmin ? '/admin' : '/client'
    });
    
    // Build path progressively
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip the first segment if it's admin/client as it's already covered by Dashboard
      if (index === 0 && (segment === 'admin' || segment === 'client')) {
        return;
      }
      
      const label = formatSegmentLabel(segment, pathSegments, index);
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const formatSegmentLabel = (segment: string, segments: string[], index: number): string => {
    // Custom labels for common routes
    const labelMap: Record<string, string> = {
      'projects': 'Projects',
      'tasks': 'Tasks',
      'clients': 'Clients',
      'team': 'Team Management',
      'documents': 'Documents',
      'billing': 'Billing',
      'settings': 'Settings',
      'files': 'Files',
      'messages': 'Messages',
      'knowledge': 'Knowledge Base',
      'dashboard-builder': 'Dashboard Builder',
      'change-requests': 'Change Requests',
      'progress': 'Progress Tracking',
      'notifications': 'Notifications',
      'reports': 'Reports',
      'security': 'Security Settings'
    };
    
    // Check if it's an ID (typically UUIDs or numbers)
    if (/^[0-9a-f-]{36}$|^\d+$/.test(segment)) {
      // Try to get context from previous segment
      const prevSegment = segments[index - 1];
      if (prevSegment === 'projects') return 'Project Details';
      if (prevSegment === 'clients') return 'Client Details';
      if (prevSegment === 'tasks') return 'Task Details';
      return 'Details';
    }
    
    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(breadcrumbs[0].path)}
        className="h-auto p-1 hover:bg-gray-100"
      >
        <Home className="w-4 h-4" />
      </Button>
      
      {breadcrumbs.slice(1).map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {breadcrumb.isActive ? (
            <span className="font-medium text-gray-900">
              {breadcrumb.label}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(breadcrumb.path)}
              className="h-auto p-1 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            >
              {breadcrumb.label}
            </Button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;