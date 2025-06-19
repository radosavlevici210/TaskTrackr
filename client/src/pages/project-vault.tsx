import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Play, Download, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ProjectVault() {
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

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ['/api/projects'],
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-400">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400">Failed</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400">Draft</Badge>;
    }
  };

  const getGradient = (index: number) => {
    const gradients = [
      'from-secondary-500 to-primary-500',
      'from-emerald-500 to-teal-500',
      'from-pink-500 to-purple-500',
      'from-orange-500 to-red-500',
      'from-violet-500 to-indigo-500',
      'from-yellow-500 to-orange-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      
      <main className="ml-64 min-h-screen">
        <TopBar />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Project Vault</h1>
            <p className="text-slate-400">Manage and track your music projects</p>
          </div>
          
          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-600 rounded-lg"></div>
                      <div className="w-20 h-6 bg-slate-600 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-slate-600 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-600 rounded w-2/3"></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="w-16 h-8 bg-slate-600 rounded"></div>
                      <div className="w-8 h-8 bg-slate-600 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any, index: number) => (
                <Card key={project.id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getGradient(index)} rounded-lg flex items-center justify-center`}>
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                      <p className="text-sm text-slate-400">{project.genre} • {project.mood}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    
                    {project.status === 'processing' && (
                      <div className="mb-4">
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-secondary-500 to-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(project.processingStep / project.totalSteps) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Step {project.processingStep}/{project.totalSteps}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {project.status === 'completed' && (
                          <>
                            <Button size="sm" variant="ghost" className="text-primary-500 hover:text-primary-400">
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-slate-400 mb-6">Create your first song to get started</p>
              <Button 
                onClick={() => window.location.href = '/create'}
                className="bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600"
              >
                Create New Song
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
