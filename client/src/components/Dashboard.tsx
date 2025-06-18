import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreateSongModal } from "./CreateSongModal";
import {
  Plus,
  Bell,
  Music,
  Play,
  TrendingUp,
  DollarSign,
  Globe,
  Pause,
  Check,
  Loader2,
  Mic,
  Languages,
  Shield,
  Download,
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  const { data: aiArtists } = useQuery({
    queryKey: ["/api/ai-artists"],
  });

  const recentProjects = projects?.slice(0, 3) || [];
  const currentGeneratingProject = projects?.find(p => p.status === 'generating');

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-600/20 text-emerald-500">Completed</Badge>;
      case 'generating':
        return <Badge className="bg-orange-600/20 text-orange-500">Generating</Badge>;
      case 'published':
        return <Badge className="bg-blue-600/20 text-blue-500">Published</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProgressSteps = (currentStep: string, progress: number) => {
    const steps = [
      { name: 'Script Generation', key: 'script' },
      { name: 'Voice Synthesis', key: 'voice' },
      { name: 'Instrumental Creation', key: 'instrumental' },
      { name: 'Audio Mixing', key: 'mixing' },
      { name: 'Video Generation', key: 'video' },
      { name: 'Final Export', key: 'export' },
    ];

    return steps.map((step, index) => {
      let status = 'pending';
      if (currentStep === step.key && progress > 0) {
        status = 'active';
      } else if (steps.findIndex(s => s.key === currentStep) > index) {
        status = 'completed';
      }

      return (
        <div key={step.key} className={`progress-step ${status}`}>
          <div className="step-indicator">
            {status === 'completed' ? <Check className="w-3 h-3" /> :
             status === 'active' ? <Loader2 className="w-3 h-3 animate-spin" /> :
             index + 1}
          </div>
          <span className="text-sm">{step.name}</span>
        </div>
      );
    });
  };

  return (
    <div className="p-8 bg-dark-950">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Production Dashboard</h1>
            <p className="text-dark-400">Manage your AI music creation and track performance</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Song
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="stats-card">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Music className="text-primary text-xl" />
              </div>
              <span className="text-xs text-emerald-500 font-medium">+12.5%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {userStats?.totalSongs || 0}
              </p>
              <p className="text-sm text-dark-400">Total Songs Created</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Play className="text-blue-500 text-xl" />
              </div>
              <span className="text-xs text-emerald-500 font-medium">+8.2%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {userStats?.totalStreams ? `${(userStats.totalStreams / 1000000).toFixed(1)}M` : '0'}
              </p>
              <p className="text-sm text-dark-400">Total Streams</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-600/20 rounded-lg">
                <DollarSign className="text-emerald-500 text-xl" />
              </div>
              <span className="text-xs text-emerald-500 font-medium">+15.7%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                ${userStats?.totalEarnings || '0'}
              </p>
              <p className="text-sm text-dark-400">Total Earnings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Globe className="text-orange-500 text-xl" />
              </div>
              <span className="text-xs text-emerald-500 font-medium">+3.1%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {userStats?.countriesReached || 0}
              </p>
              <p className="text-sm text-dark-400">Countries Reached</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects Section */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Projects</h2>
                <a href="#" className="text-primary hover:text-primary/80 text-sm font-medium">
                  View All
                </a>
              </div>

              <div className="space-y-4">
                {recentProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                    <p className="text-dark-400">No projects yet. Create your first song!</p>
                    <Button 
                      onClick={() => setShowCreateModal(true)} 
                      className="mt-4"
                      variant="outline"
                    >
                      Create Song
                    </Button>
                  </div>
                ) : (
                  recentProjects.map((project) => (
                    <div key={project.id} className="project-item">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{project.title}</h3>
                        <p className="text-sm text-dark-400">
                          {project.genre} • Created {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(project.status)}
                        {project.estimatedDuration && (
                          <p className="text-xs text-dark-400 mt-1">
                            {formatDuration(project.estimatedDuration)} duration
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="ghost">
                        {project.status === 'generating' ? (
                          <Pause className="text-orange-500" />
                        ) : (
                          <Play className="text-primary" />
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Chart Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Revenue Analytics</h2>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-primary text-primary-foreground">30D</Button>
                  <Button size="sm" variant="ghost" className="text-dark-400">90D</Button>
                  <Button size="sm" variant="ghost" className="text-dark-400">1Y</Button>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-64 bg-dark-800 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <TrendingUp className="text-primary text-3xl mb-3 mx-auto" />
                  <p className="text-dark-400">Revenue chart visualization</p>
                  <p className="text-xs text-dark-500">Interactive chart showing earnings over time</p>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-dark-400">Streaming Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-dark-400">Licensing Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-dark-400">Sync Revenue</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* AI Generation Progress */}
          {currentGeneratingProject && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-white mb-4">AI Generation Queue</h2>
                
                <div className="p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{currentGeneratingProject.title}</h3>
                    <span className="text-xs text-primary">Processing</span>
                  </div>
                  
                  {/* Generation Steps */}
                  <div className="space-y-3 mb-4">
                    {getProgressSteps(
                      currentGeneratingProject.currentStep || 'script',
                      currentGeneratingProject.generationProgress || 0
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-dark-400">Progress</span>
                      <span className="text-xs text-white">
                        {currentGeneratingProject.generationProgress || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={currentGeneratingProject.generationProgress || 0} 
                      className="h-2"
                    />
                    <p className="text-xs text-dark-400 mt-2">
                      Estimated completion: 3 minutes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 p-3 h-auto hover:bg-accent"
                >
                  <Mic className="text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-white">Voice Library</p>
                    <p className="text-xs text-dark-400">Browse AI artists</p>
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 p-3 h-auto hover:bg-accent"
                >
                  <Languages className="text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium text-white">Multi-Language</p>
                    <p className="text-xs text-dark-400">100+ languages</p>
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 p-3 h-auto hover:bg-accent"
                >
                  <Shield className="text-emerald-500" />
                  <div className="text-left">
                    <p className="font-medium text-white">Security Scan</p>
                    <p className="text-xs text-dark-400">Anti-piracy check</p>
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 p-3 h-auto hover:bg-accent"
                >
                  <Download className="text-orange-500" />
                  <div className="text-left">
                    <p className="font-medium text-white">Export Bundle</p>
                    <p className="text-xs text-dark-400">Professional package</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Platform Status */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Platform Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-dark-300">AI Services</span>
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-dark-300">Audio Processing</span>
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">Fast</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-dark-300">Video Generation</span>
                  </div>
                  <span className="text-xs text-yellow-500 font-medium">High Load</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-dark-300">Global CDN</span>
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">99.9%</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-dark-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-primary" />
                  <span className="text-sm font-medium text-white">Security Active</span>
                </div>
                <p className="text-xs text-dark-400">
                  Quantum-locked watermarking and theft detection enabled across all content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-12 pt-8 border-t border-dark-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-dark-400">
            © 2025 RealArtist AI Platform - Professional Music Production
          </div>
          <div className="flex items-center gap-6 text-sm text-dark-400">
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>

      <CreateSongModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
