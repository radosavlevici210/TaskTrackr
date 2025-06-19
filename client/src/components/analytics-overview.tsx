import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

export default function AnalyticsOverview() {
  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics'],
  });

  // Mock geographic data - in production, this would come from the analytics API
  const topCountries = [
    { country: "United States", flag: "🇺🇸", percentage: 42 },
    { country: "United Kingdom", flag: "🇬🇧", percentage: 28 },
    { country: "Canada", flag: "🇨🇦", percentage: 18 },
    { country: "Australia", flag: "🇦🇺", percentage: 12 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
              <p className="text-slate-400 text-sm">Monthly earnings breakdown</p>
            </div>
            <Select defaultValue="6months">
              <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
                <SelectItem value="24months">Last 24 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Chart placeholder - would use recharts or similar in production */}
          <div className="h-64 bg-slate-700/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Revenue trending upward</p>
              <p className="text-2xl font-bold text-white mt-2">$18,429</p>
              <p className="text-emerald-400 text-xs">+15% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Global Reach</h3>
              <p className="text-slate-400 text-sm">Listener distribution worldwide</p>
            </div>
          </div>
          <div className="space-y-4">
            {topCountries.map((country) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-sm flex items-center justify-center text-xs">
                    {country.flag}
                  </div>
                  <span className="text-sm text-white">{country.country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-secondary-500 to-primary-500 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-400 w-8">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Countries</span>
              <span className="text-white font-medium">47</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-400">Total Listeners</span>
              <span className="text-white font-medium">2.4M</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
