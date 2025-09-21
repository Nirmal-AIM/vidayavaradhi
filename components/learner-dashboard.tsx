"use client"


import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ProgressCards = dynamic(() => import('@/components/dashboard/progress-cards').then(mod => mod.default), { ssr: false });
const AchievementsGrid = dynamic(() => import('@/components/dashboard/achievements-grid').then(mod => mod.default), { ssr: false });
const CourseList = dynamic(() => import('@/components/dashboard/course-list').then(mod => mod.default), { ssr: false });
const SkillAnalysis = dynamic(() => import('@/components/dashboard/skill-analysis').then(mod => mod.default), { ssr: false });
const Recommendations = dynamic(() => import('@/components/dashboard/recommendations').then(mod => mod.default), { ssr: false });
const IndustryInsights = dynamic(() => import('@/components/dashboard/industry-insights').then(mod => mod.default), { ssr: false });
/*
  The dynamic imports are correct. 
  If you still see errors, ensure that each imported file (e.g., progress-cards.tsx) has a default export.
  Example for progress-cards.tsx:
  export default function ProgressCards() { ... }
*/
const queryClient = new QueryClient();

export default function LearnerDashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <ProgressCards />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AchievementsGrid />
          <CourseList />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkillAnalysis />
          <Recommendations />
        </div>
        <IndustryInsights />
      </main>
    </QueryClientProvider>
  );
}


