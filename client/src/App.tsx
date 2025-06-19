import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard";
import CreateSong from "@/pages/create-song";
import EliteStudio from "@/pages/elite-studio";
import AIArtists from "@/pages/ai-artists";
import ProjectVault from "@/pages/project-vault";
import Analytics from "@/pages/analytics";
import Royalties from "@/pages/royalties";
import Security from "@/pages/security";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/create" component={CreateSong} />
          <Route path="/elite-studio" component={EliteStudio} />
          <Route path="/projects" component={ProjectVault} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/royalties" component={Royalties} />
          <Route path="/ai-artists" component={AiArtists} />
          <Route path="/security" component={Security} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-900 text-white">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;