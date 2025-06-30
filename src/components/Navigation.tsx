import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  X,
  UserPlus,
  Palette,
  CheckSquare,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const { user, logout, sidebarOpen, toggleSidebar } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === 'agency_admin' || user.role === 'super_admin';
  
  const adminNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: FolderOpen, label: "Projects", path: "/admin/projects" },
    { icon: CheckSquare, label: "Tasks", path: "/admin/tasks" },
    { icon: Users, label: "Clients", path: "/admin/clients" },
    { icon: UserCheck, label: "Team Management", path: "/admin/team" },
    { icon: FileText, label: "Documents", path: "/admin/documents" },
    { icon: DollarSign, label: "Billing", path: "/admin/billing" },
    { icon: Palette, label: "Customization", path: "/admin/settings" },
    { icon: Settings, label: "Settings", path: "/admin/general-settings" },
  ];

  const clientNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/client" },
    { icon: FolderOpen, label: "Projects", path: "/client/projects" },
    { icon: CheckSquare, label: "Tasks", path: "/client/tasks" },
    { icon: UserCheck, label: "Team", path: "/client/team" },
    { icon: FileText, label: "Files", path: "/client/files" },
    { icon: Users, label: "Messages", path: "/client/messages" },
  ];

  const navItems = isAdmin ? adminNavItems : clientNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateClient = () => {
    console.log('Create client clicked');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Rubbl Portal</span>
          </div>

          {isAdmin && (
            <div className="px-4 py-4 border-b border-gray-200">
              <Button 
                onClick={handleCreateClient}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Client Account
              </Button>
            </div>
          )}

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 mr-3",
                    isActive ? "text-blue-700" : "text-gray-500"
                  )} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-gray-700 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navigation;