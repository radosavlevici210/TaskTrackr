import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, User } from "lucide-react";

export default function AiArtists() {
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

  const { data: artists, isLoading: loadingArtists } = useQuery({
    queryKey: ['/api/ai-artists'],
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const getArtistGradient = (index: number) => {
    const gradients = [
      'from-pink-500 to-purple-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
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
            <h1 className="text-3xl font-bold text-white mb-2">AI Artists</h1>
            <p className="text-slate-400">Choose from our collection of professional AI voices</p>
          </div>
          
          {loadingArtists ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-slate-600 rounded-full mx-auto mb-4"></div>
                    <div className="h-5 bg-slate-600 rounded mx-auto mb-2 w-3/4"></div>
                    <div className="h-4 bg-slate-600 rounded mx-auto mb-4 w-1/2"></div>
                    <div className="h-8 bg-slate-600 rounded mx-auto"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : artists && artists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist: any, index: number) => (
                <Card key={artist.id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${getArtistGradient(index)} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{artist.name}</h3>
                    <div className="flex justify-center space-x-2 mb-3">
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {artist.genre}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {artist.gender}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {artist.description || `Professional ${artist.genre} artist with ${artist.voiceType} voice`}
                    </p>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600">
                        <Play className="w-4 h-4 mr-2" />
                        Preview Voice
                      </Button>
                      <p className="text-xs text-slate-500">Language: {artist.language?.toUpperCase() || 'EN'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No AI artists available</h3>
              <p className="text-slate-400">AI artists will be added soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
