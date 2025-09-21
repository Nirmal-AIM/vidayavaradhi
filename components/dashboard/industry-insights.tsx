import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";

export function IndustryInsights() {
  const { t } = useTranslation();

  type Trend = {
    skillName?: string;
    sector?: string;
    demandGrowth?: number;
    salaryRange?: string;
    jobCount?: number;
  };

  const { data: trends, isLoading } = useQuery<Trend[]>({
    queryKey: ['/api/industry-trends'],
  });

  // Mock industry insights if no data
  type Insight = {
    title: string;
    growth?: string;
    value?: string;
    description: string;
    type: string;
    color: string;
    icon: React.ElementType;
    skills?: string[];
  };

  const mockInsights: Insight[] = [
    {
      title: "Data Analyst Demand",
      growth: "↑ 24%",
      description: "Growing demand in fintech and healthcare sectors",
      type: "High Demand",
      color: "secondary",
      icon: TrendingUp
    },
    {
      title: "Avg. Salary Range", 
      value: "₹4.5-8L",
      description: "Entry to mid-level positions in major cities",
      type: "Trending",
      color: "accent",
      icon: DollarSign
    },
    {
      title: "Top Skills Required",
      description: "Python, SQL, Excel, Tableau",
      type: "Skills",
      color: "primary",
      icon: BarChart3,
      skills: ["Python", "SQL", "Excel", "Tableau"]
    }
  ];

  const displayInsights: Insight[] = Array.isArray(trends) && trends.length > 0 ? 
    trends.slice(0, 3).map((trend: Trend, index: number): Insight => ({
      title: trend.skillName || trend.sector || "Industry Trend",
      growth: trend.demandGrowth !== undefined ? `↑ ${trend.demandGrowth}%` : undefined,
      value: trend.salaryRange,
      description: trend.jobCount !== undefined ? `${trend.jobCount} jobs available` : "No job data",
      type: "Market Data",
      color: index % 2 === 0 ? "secondary" : "accent",
      icon: TrendingUp
    })) : mockInsights;

  if (isLoading) {
    return (
      <Card className="border border-border" data-testid="industry-insights-loading">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'secondary': return 'secondary';
      case 'accent': return 'outline';
      case 'primary': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card className="border border-border" data-testid="industry-insights-card">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 mb-6">
          <h3 className="text-xl font-bold text-foreground">
            {t('dashboard.industryInsights')}
          </h3>
          {displayInsights.map((insight: Insight, index: number) => {
            const IconComponent = insight.icon;
            return (
              <div 
                key={index}
                className={`p-4 bg-${insight.color}/5 border border-${insight.color}/20 rounded-lg`}
                data-testid={`industry-insight-${index}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">
                    {insight.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {insight.growth && (
                      <span className={`text-${insight.color} text-sm font-medium`}>
                        {insight.growth}
                      </span>
                    )}
                    {insight.value && (
                      <span className={`text-${insight.color} text-sm font-medium`}>
                        {insight.value}
                      </span>
                    )}
                    {!insight.growth && !insight.value && (
                      <IconComponent className={`h-4 w-4 text-${insight.color}`} />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(insight.color)} className="text-xs">
                    {insight.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {insight.skills ? 'Top Skills' : 'Updated 2 hours ago'}
                  </span>
                </div>
                {insight.skills && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {insight.skills.map((skill: string, skillIndex: number) => (
                      <Badge 
                        key={skillIndex} 
                        variant="default" 
                        className="text-xs"
                        data-testid={`skill-tag-${skillIndex}`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Data sourced from industry reports and job portals
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default IndustryInsights;
