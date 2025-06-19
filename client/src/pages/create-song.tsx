import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import CreateSongWidget from "@/components/create-song-widget";

export default function CreateSong() {
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
            <h1 className="text-3xl font-bold text-white mb-2">Create New Song</h1>
            <p className="text-slate-400">Transform your lyrics into professional music with AI</p>
          </div>
          
          <div className="max-w-6xl">
            <CreateSongWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
