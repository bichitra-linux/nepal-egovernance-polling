"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from '@/context/language-context';
import { BarChart, PieChart, Activity, Users, VoteIcon, Clock, Award, AlertCircle } from "lucide-react";
import Link from 'next/link';

interface Poll {
  id: number;
  title: string;
  description: string | null;
  status: 'active' | 'completed';
  endDate?: string;
  totalVoters?: number;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  availablePolls: number;
  activePolls: number;
  completedPolls: number;
  upcomingClosingPolls: Poll[];
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    availablePolls: 0,
    activePolls: 0,
    completedPolls: 0,
    upcomingClosingPolls: []
  });
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Translations
  const t = {
    dashboard: language === 'ne' ? 'ड्यासबोर्ड' : 'Dashboard',
    welcome: language === 'ne' ? 'स्वागत छ' : 'Welcome',
    overview: language === 'ne' ? 'अवलोकन' : 'Overview',
    availablePolls: language === 'ne' ? 'उपलब्ध मतदानहरू' : 'Available Polls',
    activePolls: language === 'ne' ? 'सक्रिय मतदानहरू' : 'Active Polls',
    completedPolls: language === 'ne' ? 'समाप्त मतदानहरू' : 'Completed Polls',
    yourVotingHistory: language === 'ne' ? 'तपाईंको मतदान इतिहास' : 'Your Voting History',
    all: language === 'ne' ? 'सबै' : 'All',
    active: language === 'ne' ? 'सक्रिय' : 'Active',
    completed: language === 'ne' ? 'समाप्त' : 'Completed',
    noPolls: language === 'ne' ? 'कुनै पनि मतदानहरू उपलब्ध छैनन्।' : 'No polls are available.',
    upcomingClosings: language === 'ne' ? 'आगामी समाप्त हुने मतदानहरू' : 'Upcoming Poll Closings',
    noUpcomingClosings: language === 'ne' ? 'आगामी समाप्त हुने मतदान छैन।' : 'No upcoming poll closings.',
    viewResults: language === 'ne' ? 'नतिजाहरू हेर्नुहोस्' : 'View Results',
    voteNow: language === 'ne' ? 'मतदान गर्नुहोस्' : 'Vote Now',
    closesIn: language === 'ne' ? 'समाप्त हुन्छ' : 'Closes in',
    voters: language === 'ne' ? 'मतदाताहरू' : 'voters',
    sessionError: language === 'ne' ? 'सेसन त्रुटि। कृपया फेरि लगइन गर्नुहोस्।' : 'Session error. Please log in again.',
    days: language === 'ne' ? 'दिन' : 'days',
    hours: language === 'ne' ? 'घण्टा' : 'hours',
  };

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch polls if authenticated
    if (status === 'authenticated') {
      const fetchDashboardData = async () => {
        try {
          // Fetch polls
          const pollsResponse = await fetch('/api/polls/available');
          if (!pollsResponse.ok) throw new Error('Failed to fetch polls');
          const pollsData = await pollsResponse.json();
          
          // Fetch stats
          const statsResponse = await fetch('/api/dashboard/voter-stats');
          if (!statsResponse.ok) throw new Error('Failed to fetch stats');
          const statsData = await statsResponse.json();
          
          setPolls(pollsData.polls || []);
          setFilteredPolls(pollsData.polls || []);
          setStats(statsData);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [status, router]);

  // Filter polls when tab changes
  useEffect(() => {
    if (currentTab === 'all') {
      setFilteredPolls(polls);
    } else {
      setFilteredPolls(polls.filter(poll => poll.status === currentTab));
    }
  }, [currentTab, polls]);

  // Calculate time remaining
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    if (diff <= 0) return t.completed;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} ${t.days}`;
    } else {
      return `${hours} ${t.hours}`;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Skeleton className="h-12 w-3/4 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        
        <Skeleton className="h-10 w-1/2 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.welcome}, {session?.user?.name}</h1>
          <p className="text-muted-foreground">{t.overview}</p>
        </div>
      </div>

      {session ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-l-4 border-blue-600">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.availablePolls}</p>
                  <h3 className="text-3xl font-bold">{stats.availablePolls}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <VoteIcon size={24} className="text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-green-600">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.activePolls}</p>
                  <h3 className="text-3xl font-bold">{stats.activePolls}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity size={24} className="text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-amber-600">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.completedPolls}</p>
                  <h3 className="text-3xl font-bold">{stats.completedPolls}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Award size={24} className="text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{t.yourVotingHistory}</CardTitle>
                </CardHeader>
                
                <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
                  <div className="px-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">{t.all}</TabsTrigger>
                      <TabsTrigger value="active">{t.active}</TabsTrigger>
                      <TabsTrigger value="completed">{t.completed}</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value={currentTab} className="p-6 pt-4">
                    {filteredPolls.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p>{t.noPolls}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredPolls.map((poll) => (
                          <Card key={poll.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="p-4 md:p-6 flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <Badge className={
                                      poll.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                                    }>
                                      {poll.status === 'active' ? t.active : t.completed}
                                    </Badge>
                                    <h3 className="font-medium text-lg mt-2">{poll.title}</h3>
                                  </div>
                                  {poll.totalVoters !== undefined && (
                                    <div className="flex items-center text-muted-foreground">
                                      <Users size={16} className="mr-1" />
                                      <span>{poll.totalVoters} {t.voters}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {poll.description && (
                                  <p className="text-muted-foreground mt-2 line-clamp-2">
                                    {poll.description}
                                  </p>
                                )}
                                
                                {poll.endDate && poll.status === 'active' && (
                                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                    <Clock size={14} className="mr-1" />
                                    <span>{t.closesIn} {getTimeRemaining(poll.endDate)}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 p-4 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => router.push(`/polls/${poll.id}`)}
                                >
                                  {poll.status === 'completed' ? t.viewResults : t.voteNow}
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Upcoming Poll Closings */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">{t.upcomingClosings}</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.upcomingClosingPolls.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">{t.noUpcomingClosings}</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.upcomingClosingPolls.map(poll => (
                        <div key={poll.id} className="flex justify-between items-start pb-4 border-b last:border-b-0 last:pb-0">
                          <div>
                            <h4 className="font-medium line-clamp-1">{poll.title}</h4>
                            <div className="flex items-center mt-1 text-sm text-red-600">
                              <Clock size={14} className="mr-1" />
                              {poll.endDate ? getTimeRemaining(poll.endDate) : ''}
                            </div>
                          </div>
                          <Link href={`/polls/${poll.id}`}>
                            <Button variant="ghost" size="sm">
                              →
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
            <p>{t.sessionError}</p>
            <Button 
              onClick={() => router.push('/login')}
              variant="outline" 
              className="mt-4"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;