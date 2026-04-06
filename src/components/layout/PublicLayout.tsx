import { Link, Outlet, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={cn(
        "sticky z-50 transition-all duration-500 ease-in-out",
        scrolled 
          ? "top-4 mx-4 md:mx-auto max-w-6xl rounded-2xl border border-border/50 shadow-2xl glass py-1" 
          : "top-0 w-full border-b border-border glass py-0"
      )}>
        <div className={cn(
          "container mx-auto transition-all duration-500",
          scrolled ? "px-6" : "px-4"
        )}>
          <div className={cn(
            "flex items-center justify-between transition-all duration-500",
            scrolled ? "h-14" : "h-16"
          )}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-foreground tracking-tight">Intrasphere Labs</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-foreground',
                    location.pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild size="sm" className="rounded-full">
                <Link to="/jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  View Openings
                </Link>
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-foreground px-3 py-2.5 rounded-md',
                      location.pathname === item.href
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild size="sm" className="mt-2 rounded-full">
                  <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    View Openings
                  </Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="page-transition">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <span className="text-base font-bold tracking-tight">Intrasphere Labs</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Building meaningful technology for tomorrow.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm font-sans uppercase tracking-wider text-muted-foreground">Careers</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/jobs" className="text-foreground/70 hover:text-foreground transition-colors">All Jobs</Link></li>
                <li><Link to="/jobs?type=Internship" className="text-foreground/70 hover:text-foreground transition-colors">Internships</Link></li>
                <li><Link to="/jobs?type=Full-time" className="text-foreground/70 hover:text-foreground transition-colors">Full-time Roles</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm font-sans uppercase tracking-wider text-muted-foreground">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">About Us</span></li>
                <li><span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">Culture</span></li>
                <li><span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm font-sans uppercase tracking-wider text-muted-foreground">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Intrasphere Labs. All rights reserved.
            </p>
            <Link 
              to="/admin" 
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              HR Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
