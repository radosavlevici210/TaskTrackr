import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ShieldCheck, AlertTriangle, Lock } from "lucide-react";

export default function Security() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      
      <main className="ml-64 min-h-screen">
        <TopBar />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
            <p className="text-slate-400">Monitor and protect your intellectual property</p>
          </div>
          
          {/* Security Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-emerald-900/20 border-emerald-500/30">
              <CardContent className="p-6 text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">Quantum Protection</h3>
                <p className="text-xs text-emerald-400">Active</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">Watermarking</h3>
                <p className="text-xs text-blue-400">Enabled</p>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-900/20 border-yellow-500/30">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">Threat Detection</h3>
                <p className="text-xs text-yellow-400">Monitoring</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-900/20 border-purple-500/30">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">IP Logging</h3>
                <p className="text-xs text-purple-400">24/7 Active</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 opacity-50">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Security Dashboard</h3>
            <p className="text-slate-400 mb-6">Comprehensive security monitoring and threat detection features coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}
