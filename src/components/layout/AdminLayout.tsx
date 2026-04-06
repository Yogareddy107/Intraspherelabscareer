import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  PlusCircle, 
  LogOut,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Manage Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Post New Job', href: '/admin/jobs/new', icon: PlusCircle },
  { name: 'Applications', href: '/admin/applications', icon: Users },
];

export default function AdminLayout() {
  const { logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
          <div>
            <span className="text-lg font-bold text-sidebar-foreground">Intrasphere Labs</span>
            <p className="text-xs text-sidebar-foreground/60">HR Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-5 w-5" />
                {link.name}
                {active && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <Link 
            to="/" 
            className="text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors block"
          >
            ← Back to Careers Site
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="min-h-screen p-6 lg:p-8">
          <div className="page-transition">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
