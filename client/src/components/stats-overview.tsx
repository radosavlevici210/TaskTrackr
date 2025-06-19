import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Play, DollarSign, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const statsData = [
    {
      title: "Songs Created",
      value: stats?.songsCreated || 0,
      growth: "+12% this month",
      icon: Music,
      color: "secondary-500",
      bgColor: "secondary-500/20",
    },
    {
      title: "Total Streams",
      value: stats?.totalStreams ? `${(stats.totalStreams / 1000000).toFixed(1)}M` : "0",
      growth: `+${stats?.monthlyGrowth?.streams || 0}% this month`,
      icon: Play,
      color: "primary-500",
      bgColor: "primary-500/20",
    },
    {
      title: "Royalties Earned",
      value: stats?.royaltiesEarned ? `$${parseFloat(stats.royaltiesEarned).toLocaleString()}` : "$0",
      growth: `+${stats?.monthlyGrowth?.royalties || 0}% this month`,
      icon: DollarSign,
      color: "emerald-500",
      bgColor: "emerald-500/20",
    },
    {
      title: "AI Credits",
      value: stats?.aiCredits || 0,
      growth: "Premium plan",
      icon: Zap,
      color: "yellow-500",
      bgColor: "yellow-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={stat.title} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl card-gradient animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-emerald-400 text-xs mt-1">{stat.growth}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
