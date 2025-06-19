import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  LayoutDashboard, 
  PlusCircle, 
  Folder, 
  BarChart3, 
  DollarSign, 
  Users, 
  Shield,
  ShieldCheck
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Create Song", href: "/create", icon: PlusCircle },
    { name: "Project Vault", href: "/projects", icon: Folder },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Royalties", href: "/royalties", icon: DollarSign },
    { name: "AI Artists", href: "/ai-artists", icon: Users },
    { name: "Security Center", href: "/security", icon: Shield },
  ];

  const getInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "ER";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50">
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Logo and Branding */}
        <div className="flex items-center mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center mr-3 glow-effect">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
              RealArtist AI
            </h1>
            <p className="text-xs text-slate-400">Professional Studio</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-slate-700/30 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-3">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-semibold">
                {getInitials(user)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName || user?.lastName 
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : user?.email || 'User'
                }
              </p>
              <p className="text-xs text-slate-400">{user?.plan || 'Free'} Plan</p>
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-slate-400">AI Credits</span>
            <span className="text-primary-500 font-medium">{user?.aiCredits || 0}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg group ${
                  isActive 
                    ? 'text-white bg-secondary-600/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}>
                  <item.icon className={`w-5 h-5 mr-3 ${
                    isActive 
                      ? 'text-secondary-500' 
                      : 'text-slate-400 group-hover:text-primary-500'
                  }`} />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Security Status */}
        <div className="mt-8 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="text-xs font-medium text-emerald-400">Quantum Protected</span>
          </div>
          <p className="text-xs text-emerald-300/70 mt-1">All content encrypted & watermarked</p>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <Button 
            onClick={() => window.location.href = '/api/logout'}
            variant="outline"
            className="w-full text-slate-300 border-slate-600 hover:bg-slate-700/50"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}