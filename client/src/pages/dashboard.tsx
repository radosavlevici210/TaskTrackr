import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import StatsOverview from "@/components/stats-overview";
import CreateSongWidget from "@/components/create-song-widget";
import ActivityPanel from "@/components/activity-panel";
import AnalyticsOverview from "@/components/analytics-overview";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 glow-effect animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full opacity-80" />
          </div>
          <p className="text-white text-lg">Loading your studio...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      
      <main className="ml-64 min-h-screen">
        <TopBar />
        
        <div className="p-6 space-y-6">
          <StatsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CreateSongWidget />
            <ActivityPanel />
          </div>
          
          <AnalyticsOverview />
          
          {/* Platform Integration Status */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Platform Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm" />
                </div>
                <p className="text-sm font-medium text-white">Spotify</p>
                <p className="text-xs text-emerald-400">Connected</p>
              </div>
              <div className="text-center p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                <div className="w-12 h-12 bg-slate-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-6 h-6 bg-slate-400 rounded-sm" />
                </div>
                <p className="text-sm font-medium text-white">Apple Music</p>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
              <div className="text-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="w-12 h-12 bg-red-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm" />
                </div>
                <p className="text-sm font-medium text-white">YouTube</p>
                <p className="text-xs text-red-400">Connected</p>
              </div>
              <div className="text-center p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm" />
                </div>
                <p className="text-sm font-medium text-white">Amazon Music</p>
                <p className="text-xs text-blue-400">Connected</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
