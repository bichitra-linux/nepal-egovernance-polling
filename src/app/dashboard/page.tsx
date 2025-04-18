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
import { 
  Activity, Users, Clock, Award, AlertCircle, CheckCircle, 
  AlarmClock, Calendar, ChevronRight, ArrowUpRight, 
  BarChart, PieChart, ThumbsUp, ThumbsDown, HelpCircle,
  Vote, Bell, History, CalendarRange
} from "lucide-react";
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Poll {
  id: number;
  title: string;
  description: string | null;
  status: 'active' | 'finished';
  endDate?: string;
  totalVoters?: number;
  createdAt: string;
  updatedAt: string;
  hasVoted?: boolean;
}

interface DashboardStats {
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
    activePolls: 0,
    completedPolls: 0,
    upcomingClosingPolls: []
  });
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  // Translations
  const t = {
    dashboard: language === 'ne' ? 'ड्यासबोर्ड' : 'Dashboard',
    welcome: language === 'ne' ? 'स्वागत छ' : 'Welcome',
    overview: language === 'ne' ? 'अवलोकन' : 'Overview',
    activePolls: language === 'ne' ? 'सक्रिय मतदानहरू' : 'Active Polls',
    completedPolls: language === 'ne' ? 'समाप्त मतदानहरू' : 'Completed Polls',
    yourVotingHistory: language === 'ne' ? 'तपाईंको मतदान इतिहास' : 'Your Voting History',
    all: language === 'ne' ? 'सबै' : 'All',
    active: language === 'ne' ? 'सक्रिय' : 'Active',
    completed: language === 'ne' ? 'समाप्त' : 'Completed',
    noPolls: language === 'ne' ? 'कुनै पनि मतदानहरू उपलब्ध छैनन्।' : 'No polls are available.',
    noActivePolls: language === 'ne' ? 'कुनै सक्रिय मतदान छैन' : 'No active polls available.',
    noCompletedPolls: language === 'ne' ? 'कुनै समाप्त मतदान छैन' : 'No completed polls yet.',
    noPollsDescription: language === 'ne' ? 'हाल कुनै पनि मतदानहरू उपलब्ध छैनन्। कृपया पछि फेरि जाँच गर्नुहोस्।' : 'There are no polls available at this time. Please check back later.',
    noActivePollsDescription: language === 'ne' ? 'अहिले कुनै पनि सक्रिय मतदान छैन। कृपया पछि फेरि जाँच गर्नुहोस्।' : 'There are no active polls at the moment. Please check back later.',
    noCompletedPollsDescription: language === 'ne' ? 'अहिलेसम्म कुनै पनि मतदान समाप्त भएको छैन।' : 'No polls have been completed yet.',
    upcomingClosings: language === 'ne' ? 'आगामी समाप्त हुने मतदानहरू' : 'Upcoming Poll Closings',
    noUpcomingClosings: language === 'ne' ? 'आगामी समाप्त हुने मतदान छैन।' : 'No upcoming poll closings.',
    viewResults: language === 'ne' ? 'नतिजाहरू हेर्नुहोस्' : 'View Results',
    voteNow: language === 'ne' ? 'मतदान गर्नुहोस्' : 'Vote Now',
    closesIn: language === 'ne' ? 'समाप्त हुन्छ' : 'Closes in',
    voters: language === 'ne' ? 'मतदाताहरू' : 'voters',
    sessionError: language === 'ne' ? 'सेसन त्रुटि। कृपया फेरि लगइन गर्नुहोस्।' : 'Session error. Please log in again.',
    days: language === 'ne' ? 'दिन' : 'days',
    hours: language === 'ne' ? 'घण्टा' : 'hours',
    minutes: language === 'ne' ? 'मिनेट' : 'minutes',
    voted: language === 'ne' ? 'मतदान गरिसकेको' : 'Voted',
    notVoted: language === 'ne' ? 'मतदान गरिएको छैन' : 'Not voted yet',
    loginToView: language === 'ne' ? 'हेर्नका लागि लगइन गर्नुहोस्' : 'Login to View',
    availableToVote: language === 'ne' ? 'मतदान गर्न सकिन्छ' : 'Available to vote',
    resultsAvailable: language === 'ne' ? 'नतिजाहरू हेर्न सकिन्छ' : 'Results available',
    needHelp: language === 'ne' ? 'सहयोग चाहिन्छ?' : 'Need Help?',
    helpText: language === 'ne' ? 'मतदान प्रक्रिया बारे सहयोग प्राप्त गर्नुहोस्।' : 'Get assistance with the voting process.',
    visitHelpCenter: language === 'ne' ? 'सहायता केन्द्र हेर्नुहोस्' : 'Visit Help Center',
    yourActivity: language === 'ne' ? 'तपाईंको गतिविधि' : 'Your Activity',
    todaysPolls: language === 'ne' ? 'आजका मतदानहरू' : "Today's Polls",
    viewAll: language === 'ne' ? 'सबै हेर्नुहोस्' : 'View all',
    browsePollsButton: language === 'ne' ? 'मतदानहरू ब्राउज गर्नुहोस्' : 'Browse Polls',
    todaysDate: language === 'ne' ? 'आजको मिति' : 'Today',
    pollsClosingAlert: language === 'ne' ? 'मतदानहरू समाप्त हुँदै छन्' : 'Polls closing soon',
    recentActivity: language === 'ne' ? 'हालैको गतिविधि' : 'Recent Activity',
    totalPolls: language === 'ne' ? 'जम्मा मतदानहरू' : 'Total Polls',
  };

  useEffect(() => {
    // Set current date for display
    const now = new Date();
    setCurrentDate(now.toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch polls if authenticated
    if (status === 'authenticated') {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          
          // Fetch polls - using fetch with proper error handling
          let pollsData;
          try {
            const pollsResponse = await fetch('/api/polls/available');
            if (!pollsResponse.ok) {
              throw new Error(`Failed to fetch polls: ${pollsResponse.status}`);
            }
            pollsData = await pollsResponse.json();
          } catch (error) {
            console.error("Error fetching polls:", error);
            pollsData = { polls: [] };
          }
          
          // Fetch stats - using fetch with proper error handling
          let statsData;
          try {
            const statsResponse = await fetch('/api/dashboard/voter-stats');
            if (!statsResponse.ok) {
              throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
            }
            statsData = await statsResponse.json();
          } catch (error) {
            console.error("Error fetching stats:", error);
            statsData = { 
              activePolls: 0, 
              completedPolls: 0, 
              upcomingClosingPolls: [] 
            };
          }
          
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
  }, [status, router, language]);

  // Filter polls when tab changes
  useEffect(() => {
    if (currentTab === 'all') {
      setFilteredPolls(polls);
    } else if (currentTab === 'active') {
      setFilteredPolls(polls.filter(poll => poll.status === 'active'));
    } else if (currentTab === 'completed') {
      setFilteredPolls(polls.filter(poll => poll.status === 'finished'));
    }
  }, [currentTab, polls]);

  // Helper function to get days remaining
  const getDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    if (diff <= 0) return 0;
    
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Calculate time remaining
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    if (diff <= 0) return t.completed;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} ${t.days}, ${hours} ${t.hours}`;
    } else if (hours > 0) {
      return `${hours} ${t.hours}, ${minutes} ${t.minutes}`;
    } else {
      return `${minutes} ${t.minutes}`;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Skeleton className="h-12 w-3/4 mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[1, 2].map(i => (
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
      {/* Welcome Header with Background */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6 border border-blue-100 shadow-sm">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-800">
                  {t.welcome}, {session?.user?.name}
                </h1>
                <p className="text-blue-600">{t.overview}</p>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 mb-1 flex items-center">
                  <CalendarRange className="h-3.5 w-3.5 mr-1" />
                  {currentDate}
                </Badge>
                {stats.upcomingClosingPolls.length > 0 && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 animate-pulse flex items-center">
                    <Bell className="h-3.5 w-3.5 mr-1" />
                    {t.pollsClosingAlert}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="border-l-4 border-green-600 hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">{t.activePolls}</p>
                <h3 className="text-3xl font-bold">{stats.activePolls}</h3>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> 
                  {t.availableToVote}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity size={24} className="text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-amber-600 hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">{t.completedPolls}</p>
                <h3 className="text-3xl font-bold">{stats.completedPolls}</h3>
                <p className="text-sm text-amber-600 mt-1 flex items-center">
                  <BarChart className="h-3 w-3 mr-1" /> 
                  {t.resultsAvailable}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Award size={24} className="text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      {session ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Polls */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-gray-50 border-b">
                <CardTitle className="text-xl flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-600" />
                  {t.yourVotingHistory}
                </CardTitle>
              </CardHeader>
              
              <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
                <div className="px-6 pt-2">
                  <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100">
                    <TabsTrigger 
                      value="all" 
                      className={currentTab === "all" ? "data-[state=active]:bg-white" : ""}
                    >
                      {t.all}
                      <Badge variant="outline" className="ml-2 bg-gray-200">{polls.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="active" 
                      className={currentTab === "active" ? "data-[state=active]:bg-white" : ""}
                    >
                      {t.active}
                      <Badge variant="outline" className="ml-2 bg-green-100">{polls.filter(p => p.status === 'active').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed" 
                      className={currentTab === "completed" ? "data-[state=active]:bg-white" : ""}
                    >
                      {t.completed}
                      <Badge variant="outline" className="ml-2 bg-gray-200">{polls.filter(p => p.status === 'finished').length}</Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value={currentTab} className="p-6 pt-4">
                  {filteredPolls.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="bg-gray-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        {currentTab === 'all' ? t.noPolls : (currentTab === 'active' ? t.noActivePolls : t.noCompletedPolls)}
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        {currentTab === 'all' 
                          ? t.noPollsDescription 
                          : (currentTab === 'active' ? t.noActivePollsDescription : t.noCompletedPollsDescription)
                        }
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="/polls">{t.browsePollsButton}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPolls.map((poll) => (
                        <Card key={poll.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-4 md:p-6 flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge className={
                                      poll.status === 'active' 
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }>
                                      <div className="flex items-center">
                                        {poll.status === 'active' ? (
                                          <><Activity className="h-3 w-3 mr-1 text-green-600" /> {t.active}</>
                                        ) : (
                                          <><CheckCircle className="h-3 w-3 mr-1 text-gray-600" /> {t.completed}</>
                                        )}
                                      </div>
                                    </Badge>
                                    
                                    {poll.hasVoted && (
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                        <div className="flex items-center">
                                          <ThumbsUp className="h-3 w-3 mr-1 text-blue-600" />
                                          {t.voted}
                                        </div>
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <h3 className="font-medium text-lg mt-2 line-clamp-2">{poll.title}</h3>
                                </div>
                                {poll.totalVoters !== undefined && (
                                  <div className="flex items-center text-muted-foreground bg-gray-50 px-3 py-1 rounded-full text-sm mt-2 sm:mt-0">
                                    <Users size={16} className="mr-1" />
                                    <span>{poll.totalVoters} {t.voters}</span>
                                  </div>
                                )}
                              </div>
                              
                              {poll.description && (
                                <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
                                  {poll.description}
                                </p>
                              )}
                              
                              {poll.endDate && poll.status === 'active' && (
                                <div className="mt-3">
                                  <div className={`flex items-center text-sm ${getDaysRemaining(poll.endDate) <= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                                    <Clock size={14} className="mr-1" />
                                    <span>{t.closesIn} {getTimeRemaining(poll.endDate)}</span>
                                  </div>
                                  
                                  {/* Visual progress indicator */}
                                  <div className="mt-2">
                                    <Progress 
                                      value={Math.max(0, Math.min(100, (getDaysRemaining(poll.endDate) / 7) * 100))} 
                                      className="h-1" 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 p-4 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/80">
                              <Button 
                                variant={poll.status === 'finished' ? "outline" : "default"}
                                size="sm"
                                className={`flex-1 ${poll.status === 'finished' ? 'border-blue-200 hover:bg-blue-50' : 'bg-green-600 hover:bg-green-700'}`}
                                onClick={() => router.push(poll.status === 'finished' ? `/polls/${poll.id}/results` : `/polls/${poll.id}`)}
                              >
                                {poll.status === 'finished' ? (
                                  <><PieChart className="h-4 w-4 mr-2" /> {t.viewResults}</>
                                ) : (
                                  <><Vote className="h-4 w-4 mr-2" /> {t.voteNow}</>
                                )}
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
          <div className="space-y-6">
            {/* Upcoming Poll Closings */}
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b">
                <CardTitle className="text-xl flex items-center">
                  <AlarmClock className="h-5 w-5 mr-2 text-red-600" />
                  {t.upcomingClosings}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {stats.upcomingClosingPolls.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-muted-foreground">{t.noUpcomingClosings}</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {stats.upcomingClosingPolls.map(poll => (
                      <div key={poll.id} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
                        <div className="mr-4 bg-red-100 rounded-full p-2 self-start">
                          <Clock size={20} className="text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{poll.title}</h4>
                          <div className="flex items-center mt-1 text-sm text-red-600 font-medium">
                            <AlarmClock size={14} className="mr-1" />
                            {poll.endDate ? getTimeRemaining(poll.endDate) : ''}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="ml-2 hover:bg-red-50 hover:text-red-600">
                          <Link href={`/polls/${poll.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Your Activity Overview */}
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-xl flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  {t.yourActivity}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t.totalPolls}</span>
                    <span className="font-medium">{polls.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t.voted}</span>
                    <span className="font-medium">{polls.filter(poll => poll.hasVoted).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t.active}</span>
                    <span className="font-medium">{polls.filter(p => p.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t.completed}</span>
                    <span className="font-medium">{polls.filter(p => p.status === 'finished').length}</span>
                  </div>
                </div>

                
              </CardContent>
            </Card>
            
            
          </div>
        </div>
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
              {t.loginToView}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;