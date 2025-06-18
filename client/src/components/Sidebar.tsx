import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Plus,
  Folder,
  BarChart3,
  DollarSign,
  Users,
  Mic,
  Shield,
  Settings,
  Music,
} from "lucide-react";

export function Sidebar() {
  const { user } = useAuth();
  
  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  const creditPercentage = user?.creditsRemaining ? (user.creditsRemaining / 3000) * 100 : 0;
  const daysUntilRenewal = user?.subscriptionEndDate 
    ? Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <aside className="w-80 bg-dark-900 border-r border-dark-800 flex-shrink-0 fixed h-full z-30 overflow-y-auto">
      <div className="p-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
            <Music className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">RealArtist AI</h1>
            <p className="text-xs text-dark-400">Professional Studio</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="mb-6">
            <div className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">STUDIO</div>
            <a href="#" className="sidebar-nav-item active">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="sidebar-nav-item">
              <Plus className="w-5 h-5" />
              <span>Create Song</span>
            </a>
            <a href="#" className="sidebar-nav-item">
              <Folder className="w-5 h-5" />
              <span>Project Vault</span>
            </a>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">BUSINESS</div>
            <a href="#" className="sidebar-nav-item">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </a>
            <a href="#" className="sidebar-nav-item">
              <DollarSign className="w-5 h-5" />
              <span>Royalties</span>
            </a>
            <a href="#" className="sidebar-nav-item">
              <Users className="w-5 h-5" />
              <span>Collaborators</span>
            </a>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">TOOLS</div>
            <a href="#" className="sidebar-nav-item">
              <Mic className="w-5 h-5" />
              <span>AI Artists</span>
            </a>
            <a href="#" className="sidebar-nav-item">
              <Shield className="w-5 h-5" />
              <span>Security Center</span>
            </a>
            <a href="#" className="sidebar-nav-item">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="mt-8 p-4 bg-dark-800 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImageUrl} alt="User Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email?.split('@')[0] || 'User'
                }
              </p>
              <p className="text-xs text-dark-400">
                {user?.accountType === 'professional' ? 'Professional Plan' : 'Free Plan'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-dark-400">AI Credits</span>
              <span className="text-white font-medium">{user?.creditsRemaining || 0}</span>
            </div>
            <Progress value={creditPercentage} className="h-2" />
            <p className="text-xs text-dark-400">
              {daysUntilRenewal > 0 ? `Renews in ${daysUntilRenewal} days` : 'Plan expired'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-xs"
            onClick={() => window.location.href = "/api/logout"}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
