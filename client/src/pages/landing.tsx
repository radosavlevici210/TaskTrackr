import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Zap, Shield, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mr-4 glow-effect">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                RealArtist AI
              </h1>
              <p className="text-slate-400 text-lg">Professional Music Production Platform</p>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Transform Your Lyrics Into
            <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent"> Professional Songs</span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            The world's most advanced AI-powered music production platform. Create complete songs with AI vocals, 
            instrumentals, and music videos in minutes. Professional quality, commercial rights included.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="px-8 py-4 text-lg bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600 glow-effect"
          >
            Start Creating Music
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-secondary-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Music Generation</h3>
              <p className="text-slate-400 text-sm">Complete songs from lyrics in minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">100+ AI Voices</h3>
              <p className="text-slate-400 text-sm">Professional artists in every genre</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quantum Protection</h3>
              <p className="text-slate-400 text-sm">Advanced IP protection & watermarking</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Royalty Tracking</h3>
              <p className="text-slate-400 text-sm">Real-time earnings from all platforms</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50,000+</div>
            <div className="text-slate-400">Active Creators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">500,000+</div>
            <div className="text-slate-400">Songs Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">100M+</div>
            <div className="text-slate-400">Total Streams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
            <div className="text-slate-400">Royalties Paid</div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Professional Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-8">
                <h4 className="text-xl font-semibold text-white mb-2">Professional</h4>
                <div className="text-3xl font-bold text-white mb-4">$99<span className="text-lg text-slate-400">/month</span></div>
                <ul className="text-slate-300 space-y-2 mb-6">
                  <li>• Unlimited song generation</li>
                  <li>• Premium AI voices</li>
                  <li>• HD video export</li>
                  <li>• Priority processing</li>
                  <li>• Email support</li>
                </ul>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="w-full bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 backdrop-blur-sm border-secondary-500 glow-effect">
              <CardContent className="p-8">
                <h4 className="text-xl font-semibold text-white mb-2">Enterprise</h4>
                <div className="text-3xl font-bold text-white mb-4">$499<span className="text-lg text-slate-400">/month</span></div>
                <ul className="text-slate-300 space-y-2 mb-6">
                  <li>• White-label solutions</li>
                  <li>• Custom AI voice training</li>
                  <li>• API access</li>
                  <li>• Dedicated support</li>
                  <li>• Advanced analytics</li>
                </ul>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="w-full bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-700/50">
          <p className="text-slate-400 mb-2">© 2025 Ervin Remus Radosavlevici. All Rights Reserved.</p>
          <p className="text-slate-500 text-sm">
            Built with ❤️ by Ervin Remus Radosavlevici • Revolutionizing music creation through artificial intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
