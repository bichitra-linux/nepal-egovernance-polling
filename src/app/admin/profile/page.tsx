"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { AlertCircle, BarChart2, Check, Key, Lock, Mail, Shield, User } from "lucide-react";
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AdminProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  // Translations
  const t = {
    profile: language === 'ne' ? 'प्रशासक प्रोफाइल' : 'Admin Profile',
    yourDetails: language === 'ne' ? 'तपाईंको विवरण' : 'Your Details',
    profileSettings: language === 'ne' ? 'प्रोफाइल सेटिङहरू' : 'Profile Settings',
    security: language === 'ne' ? 'सुरक्षा' : 'Security',
    activity: language === 'ne' ? 'गतिविधि' : 'Activity',
    adminSettings: language === 'ne' ? 'प्रशासक सेटिङहरू' : 'Admin Settings',
    personalInfo: language === 'ne' ? 'व्यक्तिगत जानकारी' : 'Personal Information',
    updateYourInfo: language === 'ne' ? 'तपाईंको व्यक्तिगत जानकारी अपडेट गर्नुहोस्' : 'Update your personal information',
    name: language === 'ne' ? 'नाम' : 'Name',
    email: language === 'ne' ? 'इमेल' : 'Email',
    role: language === 'ne' ? 'भूमिका' : 'Role',
    adminStatus: language === 'ne' ? 'प्रशासक स्थिति' : 'Admin Status',
    joinedOn: language === 'ne' ? 'सदस्यता लिएको मिति' : 'Joined on',
    passwordChange: language === 'ne' ? 'पासवर्ड परिवर्तन' : 'Password Change',
    currentPassword: language === 'ne' ? 'हालको पासवर्ड' : 'Current Password',
    newPassword: language === 'ne' ? 'नयाँ पासवर्ड' : 'New Password',
    confirmPassword: language === 'ne' ? 'पासवर्ड पुष्टि गर्नुहोस्' : 'Confirm Password',
    update: language === 'ne' ? 'अपडेट गर्नुहोस्' : 'Update',
    cancel: language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel',
    saveChanges: language === 'ne' ? 'परिवर्तनहरू सेभ गर्नुहोस्' : 'Save Changes',
    updatedSuccess: language === 'ne' ? 'प्रोफाइल सफलतापूर्वक अपडेट गरियो' : 'Profile updated successfully',
    passwordSuccess: language === 'ne' ? 'पासवर्ड सफलतापूर्वक परिवर्तन गरियो' : 'Password changed successfully',
    adminOnly: language === 'ne' ? 'यो पृष्ठ प्रशासकहरूको लागि मात्र हो' : 'This page is for administrators only',
    backToDashboard: language === 'ne' ? 'ड्यासबोर्डमा फर्कनुहोस्' : 'Back to Dashboard',
    recentActivity: language === 'ne' ? 'हालको गतिविधिहरू' : 'Recent Activities',
    noActivity: language === 'ne' ? 'कुनै गतिविधि छैन' : 'No recent activities found',
    action: language === 'ne' ? 'कार्य' : 'Action',
    timestamp: language === 'ne' ? 'समय' : 'Timestamp',
    error: language === 'ne' ? 'त्रुटि भयो' : 'An error occurred',
    loading: language === 'ne' ? 'लोड गर्दै...' : 'Loading...',
    notAuthenticated: language === 'ne' ? 'तपाईं प्रमाणित हुनुभएको छैन' : 'You are not authenticated',
    notAuthorized: language === 'ne' ? 'तपाईंसँग यो पृष्ठ हेर्ने अनुमति छैन' : 'You do not have permission to view this page',
    notAnAdmin: language === 'ne' ? 'तपाई प्रशासक होइनुहुन्छ' : 'You are not an administrator',
  };

  // Check if user is admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/profile');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      // Fetch admin activity data
      fetchAdminActivity();
    }
  }, [status, session, router]);

  const fetchAdminActivity = async () => {
    try {
      setIsLoadingActivity(true);
      const response = await fetch('/api/admin/activity');
      if (!response.ok) throw new Error('Failed to fetch activity data');
      
      const data = await response.json();
      setActivityData(data.activities || []);
    } catch (error) {
      console.error('Error fetching admin activity:', error);
      toast({
        variant: "destructive",
        title: t.error,
        description: error.message,
      });
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session, form]);

  async function onSubmit(values) {
    try {
      setIsUpdating(true);
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update the session with new values
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
        },
      });

      toast({
        title: t.updatedSuccess,
        description: new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: t.error,
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function onPasswordSubmit(values) {
    try {
      setIsChangingPassword(true);
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }

      passwordForm.reset();
      
      toast({
        title: t.passwordSuccess,
        description: new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        variant: "destructive",
        title: t.error,
        description: error.message,
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  // Display skeleton while loading
  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
          <p>{t.notAuthorized}</p>
          <p className="text-muted-foreground mt-2">{t.notAnAdmin}</p>
          <Button 
            onClick={() => router.push('/profile')}
            variant="outline" 
            className="mt-4"
          >
            {t.backToDashboard}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show message if not authenticated
  if (status === 'unauthenticated') {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
          <p>{t.notAuthenticated}</p>
          <Button 
            onClick={() => router.push('/login')}
            variant="outline" 
            className="mt-4"
          >
            Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t.profile}</h1>
          <p className="text-muted-foreground">{t.adminSettings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" alt={session?.user?.name || ""} />
                <AvatarFallback className="text-2xl bg-red-100 text-red-700">
                  {session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">{session?.user?.name}</h3>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                  {t.adminStatus}
                </span>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm">{session?.user?.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm">{session?.user?.email}</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-600">Administrator</span>
              </div>
              <div className="flex items-center">
                <Key className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm">••••••••</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">{t.adminOnly}</h4>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/admin')}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                {language === 'ne' ? 'प्रशासन ड्यासबोर्ड' : 'Admin Dashboard'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/admin/users')}
              >
                <User className="mr-2 h-4 w-4" />
                {language === 'ne' ? 'प्रयोगकर्ता व्यवस्थापन' : 'User Management'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Tabs defaultValue="personal" className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t.yourDetails}</CardTitle>
                  <TabsList>
                    <TabsTrigger value="personal">{t.personalInfo}</TabsTrigger>
                    <TabsTrigger value="security">{t.security}</TabsTrigger>
                    <TabsTrigger value="activity">{t.activity}</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>{t.updateYourInfo}</CardDescription>
              </CardHeader>

              <CardContent className="pb-6">
                <TabsContent value="personal" className="space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.name}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.email}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button 
                          type="submit" 
                          disabled={isUpdating}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isUpdating ? t.loading : t.saveChanges}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="security">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.currentPassword}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.newPassword}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.confirmPassword}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button 
                          type="submit" 
                          disabled={isChangingPassword}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isChangingPassword ? t.loading : t.update}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="activity">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t.recentActivity}</h3>
                    
                    {isLoadingActivity ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex justify-between">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-1/5" />
                          </div>
                        ))}
                      </div>
                    ) : activityData.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        {t.noActivity}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activityData.map((activity, i) => (
                          <div key={i} className="flex justify-between py-2 border-b last:border-0">
                            <div className="text-sm">{activity.action}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}