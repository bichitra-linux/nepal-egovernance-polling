"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  BarChart3,
  Users,
  VoteIcon,
  AlertTriangle,
  Settings,
  Plus,
  PenSquare,
  Eye,
  BarChart2,
  RefreshCcw,
  Activity,
  CalendarClock
} from "lucide-react";

interface DashboardStats {
  totalPolls: number;
  totalUsers: number;
  totalVotes: number;
  recentPolls: {
    id: number;
    title: string;
    voteCount: number;
    createdAt: string;
  }[];
  activePolls: number;
  completedPolls: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Translations
  const t = {
    adminDashboard: language === 'ne' ? 'प्रशासक ड्यासबोर्ड' : 'Admin Dashboard',
    welcomeAdmin: language === 'ne' ? 'स्वागत छ, प्रशासक' : 'Welcome, Administrator',
    overview: language === 'ne' ? 'अवलोकन' : 'Overview',
    polls: language === 'ne' ? 'मतदानहरू' : 'Polls',
    users: language === 'ne' ? 'प्रयोगकर्ताहरू' : 'Users',
    totalPolls: language === 'ne' ? 'जम्मा मतदानहरू' : 'Total Polls',
    totalUsers: language === 'ne' ? 'जम्मा प्रयोगकर्ताहरू' : 'Total Users',
    totalVotes: language === 'ne' ? 'जम्मा मतहरू' : 'Total Votes',
    activePolls: language === 'ne' ? 'सक्रिय मतदानहरू' : 'Active Polls',
    completedPolls: language === 'ne' ? 'पूरा भएका मतदानहरू' : 'Completed Polls',
    recentPolls: language === 'ne' ? 'हालै सिर्जना गरिएका मतदानहरू' : 'Recently Created Polls',
    manageAllPolls: language === 'ne' ? 'सबै मतदानहरू व्यवस्थापन गर्नुहोस्' : 'Manage All Polls',
    createNewPoll: language === 'ne' ? 'नयाँ मतदान सिर्जना गर्नुहोस्' : 'Create New Poll',
    pollTitle: language === 'ne' ? 'मतदान शीर्षक' : 'Poll Title',
    votes: language === 'ne' ? 'मतहरू' : 'Votes',
    createdDate: language === 'ne' ? 'सिर्जना मिति' : 'Created Date',
    actions: language === 'ne' ? 'कार्यहरू' : 'Actions',
    edit: language === 'ne' ? 'सम्पादन' : 'Edit',
    results: language === 'ne' ? 'परिणामहरू' : 'Results',
    noRecentPolls: language === 'ne' ? 'कुनै हालको मतदान फेला परेन' : 'No recent polls found',
    loading: language === 'ne' ? 'लोड हुँदैछ...' : 'Loading...',
    errorFetchingData: language === 'ne' ? 'डाटा प्राप्त गर्न त्रुटि' : 'Error fetching data',
    tryAgain: language === 'ne' ? 'पुन: प्रयास गर्नुहोस्' : 'Try Again',
    refresh: language === 'ne' ? 'रिफ्रेस गर्नुहोस्' : 'Refresh',
    manageUsers: language === 'ne' ? 'प्रयोगकर्ताहरू व्यवस्थापन' : 'Manage Users',
    dashboardUpdated: language === 'ne' ? 'ड्यासबोर्ड अद्यावधिक गरियो' : 'Dashboard updated',
    viewAll: language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All',
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setError(t.errorFetchingData);
        toast.error(t.errorFetchingData);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, session, router, t.errorFetchingData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
      toast.success(t.dashboardUpdated);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
      toast.error(t.errorFetchingData);
    } finally {
      setRefreshing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-500 to-blue-600"></div>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Skeleton className="h-8 w-64 mb-4" />
        <Card>
          <div className="p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b last:border-0">
                <Skeleton className="h-5 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <AlertDescription className="text-lg">
            {error}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-8">
          <Button onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                {t.tryAgain}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t.adminDashboard}</h1>
          <p className="text-muted-foreground">
            {t.welcomeAdmin}, {session?.user?.name}
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="ml-2">{t.refresh}</span>
          </Button>
          
          <Button size="sm" asChild>
            <Link href="/admin/polls/create">
              <Plus className="mr-1 h-4 w-4" />
              {t.createNewPoll}
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        <Card className="overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
              {t.totalPolls}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalPolls || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-1 bg-green-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-500" />
              {t.totalUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-1 bg-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <VoteIcon className="h-4 w-4 mr-2 text-purple-500" />
              {t.totalVotes}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalVotes || 0}</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-amber-500" />
              {t.activePolls}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activePolls || 0}</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 bg-slate-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarClock className="h-4 w-4 mr-2 text-slate-500" />
              {t.completedPolls}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.completedPolls || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue="recent" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="recent">{t.recentPolls}</TabsTrigger>
              <TabsTrigger value="active">{t.activePolls}</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/polls">
                  <Eye className="mr-1 h-4 w-4" />
                  {t.viewAll}
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/admin/polls">
                  <Settings className="mr-1 h-4 w-4" />
                  {t.manageAllPolls}
                </Link>
              </Button>
            </div>
          </div>
          
          <TabsContent value="recent">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.pollTitle}</TableHead>
                    <TableHead>{t.votes}</TableHead>
                    <TableHead>{t.createdDate}</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.recentPolls?.map(poll => (
                    <TableRow key={poll.id}>
                      <TableCell className="font-medium">{poll.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <VoteIcon className="h-4 w-4 mr-1 text-purple-500" />
                          {poll.voteCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(poll.createdAt).toLocaleDateString(
                          language === 'ne' ? 'ne-NP' : undefined, 
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/polls/${poll.id}/edit`}>
                              <PenSquare className="h-3.5 w-3.5 mr-1" />
                              {t.edit}
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/polls/${poll.id}/results`}>
                              <BarChart2 className="h-3.5 w-3.5 mr-1" />
                              {t.results}
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!stats?.recentPolls || stats.recentPolls.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {t.noRecentPolls}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.pollTitle}</TableHead>
                    <TableHead>{t.votes}</TableHead>
                    <TableHead>{t.createdDate}</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!stats?.recentPolls || stats.recentPolls.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {t.noRecentPolls}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              {t.manageUsers}
            </Link>
          </Button>
          
          <Button variant="default" asChild>
            <Link href="/admin/polls/create">
              <Plus className="mr-2 h-4 w-4" />
              {t.createNewPoll}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}