import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Zap, Music } from "lucide-react";

export default function CreateSongWidget() {
  const [lyrics, setLyrics] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [tempo, setTempo] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aiArtists, isLoading: loadingArtists } = useQuery({
    queryKey: ['/api/ai-artists'],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Created",
        description: "Your song generation has started. Check your projects to track progress.",
      });
      // Reset form
      setLyrics("");
      setGenre("");
      setMood("");
      setTempo("");
      setSelectedArtist(null);
      // Refresh projects and stats
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateSong = () => {
    if (!lyrics.trim()) {
      toast({
        title: "Missing Lyrics",
        description: "Please enter song lyrics to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedArtist) {
      toast({
        title: "Select AI Artist",
        description: "Please select an AI artist to generate the song.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate({
      title: `Song ${new Date().toLocaleDateString()}`,
      lyrics,
      genre: genre || 'Pop',
      mood: mood || 'Uplifting',
      tempo: tempo || 'Medium (90-120 BPM)',
      aiArtistId: selectedArtist,
      status: 'processing',
      processingStep: 1,
    });
  };

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
    <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Create New Song</h3>
          <p className="text-slate-400 text-sm">Transform your lyrics into professional music</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-secondary-500/20 text-secondary-400">
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {/* Lyrics Input */}
        <div>
          <Label htmlFor="lyrics" className="text-slate-300 mb-2 block">Song Lyrics</Label>
          <Textarea
            id="lyrics"
            placeholder="Enter your song lyrics here... The AI will analyze structure, emotion, and create a complete song."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="min-h-32 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-secondary-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>AI will auto-structure your lyrics</span>
            <span>{lyrics.length}/2000 characters</span>
          </div>
        </div>

        {/* Music Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-slate-300 mb-2 block">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-secondary-500">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                <SelectItem value="R&B">R&B</SelectItem>
                <SelectItem value="Electronic">Electronic</SelectItem>
                <SelectItem value="Rock">Rock</SelectItem>
                <SelectItem value="Country">Country</SelectItem>
                <SelectItem value="Jazz">Jazz</SelectItem>
                <SelectItem value="Classical">Classical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-slate-300 mb-2 block">Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-secondary-500">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Uplifting">Uplifting</SelectItem>
                <SelectItem value="Melancholic">Melancholic</SelectItem>
                <SelectItem value="Energetic">Energetic</SelectItem>
                <SelectItem value="Romantic">Romantic</SelectItem>
                <SelectItem value="Aggressive">Aggressive</SelectItem>
                <SelectItem value="Peaceful">Peaceful</SelectItem>
                <SelectItem value="Mysterious">Mysterious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-slate-300 mb-2 block">Tempo</Label>
            <Select value={tempo} onValueChange={setTempo}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-secondary-500">
                <SelectValue placeholder="Select tempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Slow (60-90 BPM)">Slow (60-90 BPM)</SelectItem>
                <SelectItem value="Medium (90-120 BPM)">Medium (90-120 BPM)</SelectItem>
                <SelectItem value="Fast (120-160 BPM)">Fast (120-160 BPM)</SelectItem>
                <SelectItem value="Very Fast (160+ BPM)">Very Fast (160+ BPM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Artist Selection */}
        <div>
          <Label className="text-slate-300 mb-3 block">AI Artist Voice</Label>
          {loadingArtists ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto mb-2"></div>
                  <div className="h-4 bg-slate-600 rounded mx-auto mb-1"></div>
                  <div className="h-3 bg-slate-600 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {aiArtists?.map((artist: any, index: number) => (
                <div
                  key={artist.id}
                  onClick={() => setSelectedArtist(artist.id)}
                  className={`relative group cursor-pointer p-4 border rounded-lg transition-colors ${
                    selectedArtist === artist.id
                      ? 'bg-secondary-500/10 border-secondary-500'
                      : 'bg-slate-700/30 border-slate-600 hover:border-secondary-500'
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${getArtistGradient(index)} rounded-full mx-auto mb-2`}></div>
                  <p className="text-sm font-medium text-white text-center">{artist.name}</p>
                  <p className="text-xs text-slate-400 text-center">
                    {artist.genre} {artist.gender}
                  </p>
                  {selectedArtist === artist.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Zap className="w-4 h-4" />
            <span>Cost: 25 AI Credits</span>
          </div>
          <Button
            onClick={handleGenerateSong}
            disabled={createProjectMutation.isPending}
            className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600 text-white font-medium glow-effect disabled:opacity-50"
          >
            {createProjectMutation.isPending ? (
              <>
                <Music className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Music className="w-4 h-4 mr-2" />
                Generate Song
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
