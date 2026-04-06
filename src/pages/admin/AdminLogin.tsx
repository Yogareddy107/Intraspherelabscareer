import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin) {
      toast.error('Please enter your PIN');
      return;
    }

    setLoading(true);
    
    const success = await login(pin);
    
    if (success) {
      toast.success('Welcome back!');
      navigate('/admin');
    } else {
      toast.error('Invalid PIN. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Careers Site
        </Link>

        <Card className="border border-border/50 shadow-soft">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">HR Dashboard</CardTitle>
              <CardDescription>
                Enter your PIN to access the admin panel
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin">Admin PIN</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pl-10 form-input-focus text-center tracking-widest"
                    maxLength={10}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Verifying...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This area is restricted to authorized HR personnel only.
        </p>
      </div>
    </div>
  );
}
