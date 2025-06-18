import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Sparkles, Shield, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">RealArtist AI</h1>
              <p className="text-dark-400">Professional Music Production Platform</p>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Lyrics Into
            <span className="block bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Professional Songs
            </span>
          </h2>
          
          <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
            The world's most advanced AI-powered music production platform. 
            Generate complete songs with AI vocals, instrumentals, and music videos in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => window.location.href = "/api/login"}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating Music
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-dark-600 hover:bg-dark-800"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-dark-900/50 border-dark-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Music Generation</h3>
              <p className="text-dark-400 text-sm">Complete songs from lyrics with professional quality</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-900/50 border-dark-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">100+ Languages</h3>
              <p className="text-dark-400 text-sm">Multi-language AI singing with cultural accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-900/50 border-dark-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">IP Protection</h3>
              <p className="text-dark-400 text-sm">Quantum-locked watermarking and theft detection</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-900/50 border-dark-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Commercial Rights</h3>
              <p className="text-dark-400 text-sm">Full ownership and monetization rights included</p>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Input Lyrics</h4>
              <p className="text-dark-400">Write your lyrics and choose genre, mood, and AI artist</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">AI Generation</h4>
              <p className="text-dark-400">Our AI creates vocals, instrumentals, and music video</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Download & Monetize</h4>
              <p className="text-dark-400">Get professional-quality files with full commercial rights</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Create Your First Song?</h3>
              <p className="text-dark-300 mb-6">
                Join thousands of artists using RealArtist AI to produce professional music
              </p>
              <Button 
                size="lg" 
                className="px-8 py-4"
                onClick={() => window.location.href = "/api/login"}
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-dark-400">
              © 2025 RealArtist AI Platform - Professional Music Production
            </div>
            <div className="flex items-center gap-6 text-sm text-dark-400">
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
