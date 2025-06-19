import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Music, Play } from "lucide-react";
import { Link } from "wouter";

export default function ActivityPanel() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const recentProjects = projects?.slice(0, 3) || [];
  const processingProjects = projects?.filter((p: any) => p.status === 'processing') || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'processing': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getGradient = (index: number) => {
    const gradients = [
      'from-secondary-500 to-primary-500',
      'from-emerald-500 to-teal-500',
      'from-pink-500 to-purple-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Recent Projects */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
            <Link href="/projects">
              <Button variant="ghost" className="text-sm text-primary-500 hover:text-primary-400 p-0">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg animate-pulse">
                  <div className="w-10 h-10 bg-slate-600 rounded-lg"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                  </div>
                  <div className="w-4 h-4 bg-slate-600 rounded-full"></div>
                </div>
              ))
            ) : recentProjects.length > 0 ? (
              recentProjects.map((project: any, index: number) => (
                <div key={project.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getGradient(index)} rounded-lg flex items-center justify-center`}>
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{project.title}</p>
                    <p className="text-xs text-slate-400">
                      {project.genre} • <span className={getStatusColor(project.status)}>{project.status}</span>
                    </p>
                  </div>
                  {project.status === 'completed' && project.audioUrl ? (
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : project.status === 'processing' ? (
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No projects yet</p>
                <p className="text-xs">Create your first song to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Status */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">AI Processing</h3>
            <Badge variant="secondary" className={`${
              processingProjects.length > 0 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-slate-700/30 text-slate-400'
            }`}>
              {processingProjects.length} Active
            </Badge>
          </div>
          <div className="space-y-4">
            {processingProjects.length > 0 ? (
              processingProjects.map((project: any) => (
                <div key={project.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{project.title}</span>
                    <span className="text-xs text-slate-400">
                      Step {project.processingStep}/{project.totalSteps}
                    </span>
                  </div>
                  <Progress 
                    value={(project.processingStep / project.totalSteps) * 100} 
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {project.processingStep === 1 && "Analyzing lyrics..."}
                    {project.processingStep === 2 && "Generating song structure..."}
                    {project.processingStep === 3 && "Creating AI vocals..."}
                    {project.processingStep === 4 && "Composing instrumentals..."}
                    {project.processingStep === 5 && "Mixing and mastering..."}
                    {project.processingStep === 6 && "Finalizing song..."}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-400">
                <div className="w-8 h-8 bg-slate-600 rounded-full mx-auto mb-2 opacity-50"></div>
                <p className="text-sm">No active processing</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
