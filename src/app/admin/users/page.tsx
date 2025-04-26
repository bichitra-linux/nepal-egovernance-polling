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
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  PencilIcon,
  MailIcon,
  ShieldCheck,
  UserCog,
  UserX,
  RefreshCcw,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  XCircle
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  active: boolean;
}

export default function UsersManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  // Translations
  const t = {
    userManagement: language === 'ne' ? 'प्रयोगकर्ता व्यवस्थापन' : 'User Management',
    manageUsers: language === 'ne' ? 'प्रयोगकर्ताहरू व्यवस्थापन गर्नुहोस्' : 'Manage Users',
    searchUsers: language === 'ne' ? 'प्रयोगकर्ताहरू खोज्नुहोस्...' : 'Search users...',
    addNewUser: language === 'ne' ? 'नयाँ प्रयोगकर्ता थप्नुहोस्' : 'Add New User',
    allUsers: language === 'ne' ? 'सबै प्रयोगकर्ताहरू' : 'All Users',
    admins: language === 'ne' ? 'प्रशासकहरू' : 'Admins',
    voters: language === 'ne' ? 'मतदाताहरू' : 'Voters',
    name: language === 'ne' ? 'नाम' : 'Name',
    email: language === 'ne' ? 'इमेल' : 'Email',
    role: language === 'ne' ? 'भूमिका' : 'Role',
    status: language === 'ne' ? 'स्थिति' : 'Status',
    joinDate: language === 'ne' ? 'सामेल मिति' : 'Join Date',
    actions: language === 'ne' ? 'कार्यहरू' : 'Actions',
    edit: language === 'ne' ? 'सम्पादन' : 'Edit',
    delete: language === 'ne' ? 'मेटाउनुहोस्' : 'Delete',
    changeRole: language === 'ne' ? 'भूमिका परिवर्तन' : 'Change Role',
    changeStatus: language === 'ne' ? 'स्थिति परिवर्तन' : 'Change Status',
    confirmDelete: language === 'ne' ? 'मेटाउने पुष्टि गर्नुहोस्' : 'Confirm Delete',
    deleteUserQuestion: language === 'ne' ? 'के तपाईं निश्चित हुनुहुन्छ कि तपाईं यस प्रयोगकर्तालाई मेटाउन चाहानुहुन्छ?' : 'Are you sure you want to delete this user?',
    deleteWarning: language === 'ne' ? 'यो कार्य पूर्ववत गर्न सकिँदैन। प्रयोगकर्ताको सबै डाटा मेटिनेछ।' : 'This action cannot be undone. All user data will be permanently deleted.',
    cancel: language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel',
    confirm: language === 'ne' ? 'पुष्टि गर्नुहोस्' : 'Confirm',
    userDeleted: language === 'ne' ? 'प्रयोगकर्ता मेटाइयो' : 'User deleted',
    userUpdated: language === 'ne' ? 'प्रयोगकर्ता अद्यावधिक गरियो' : 'User updated',
    error: language === 'ne' ? 'त्रुटि भयो' : 'An error occurred',
    noUsersFound: language === 'ne' ? 'कुनै प्रयोगकर्ताहरू भेटिएनन्' : 'No users found',
    active: language === 'ne' ? 'सक्रिय' : 'Active',
    inactive: language === 'ne' ? 'निष्क्रिय' : 'Inactive',
    admin: language === 'ne' ? 'प्रशासक' : 'Admin',
    user: language === 'ne' ? 'प्रयोगकर्ता' : 'User',
    loading: language === 'ne' ? 'लोड हुँदैछ...' : 'Loading...',
    errorFetchingData: language === 'ne' ? 'डाटा प्राप्त गर्न त्रुटि' : 'Error fetching data',
    tryAgain: language === 'ne' ? 'पुन: प्रयास गर्नुहोस्' : 'Try Again',
    refresh: language === 'ne' ? 'रिफ्रेस गर्नुहोस्' : 'Refresh',
    usersUpdated: language === 'ne' ? 'प्रयोगकर्ताहरू अद्यावधिक गरियो' : 'Users updated',
    activateUser: language === 'ne' ? 'प्रयोगकर्ता सक्रिय गर्नुहोस्' : 'Activate User',
    deactivateUser: language === 'ne' ? 'प्रयोगकर्ता निष्क्रिय गर्नुहोस्' : 'Deactivate User',
    activateConfirm: language === 'ne' ? 'के तपाईं निश्चित हुनुहुन्छ कि तपाईं यस प्रयोगकर्तालाई सक्रिय गर्न चाहानुहुन्छ?' : 'Are you sure you want to activate this user?',
    deactivateConfirm: language === 'ne' ? 'के तपाईं निश्चित हुनुहुन्छ कि तपाईं यस प्रयोगकर्तालाई निष्क्रिय गर्न चाहानुहुन्छ?' : 'Are you sure you want to deactivate this user?',
    statusChangeWarning: language === 'ne' ? 'यसले प्रयोगकर्ताको लगइन पहुँचमा असर गर्नेछ।' : 'This will affect the user\'s login access.',
    makeAdmin: language === 'ne' ? 'प्रशासक बनाउनुहोस्' : 'Make Admin',
    makeUser: language === 'ne' ? 'प्रयोगकर्ता बनाउनुहोस्' : 'Make User',
    roleChangeQuestion: language === 'ne' ? 'के तपाईं निश्चित हुनुहुन्छ कि तपाईं यस प्रयोगकर्ताको भूमिका परिवर्तन गर्न चाहानुहुन्छ?' : 'Are you sure you want to change this user\'s role?',
    roleChangeWarning: language === 'ne' ? 'यसले प्रयोगकर्ताको अनुमतिहरू र पहुँचमा असर गर्नेछ।' : 'This will affect the user\'s permissions and access.',
    totalUsers: language === 'ne' ? 'कुल प्रयोगकर्ताहरू' : 'Total Users',
    totalAdmins: language === 'ne' ? 'कुल प्रशासकहरू' : 'Total Admins',
    totalVoters: language === 'ne' ? 'कुल मतदाताहरू' : 'Total Voters',
    cannotDeleteSelf: language === 'ne' ? 'तपाईं आफैलाई मेटाउन सक्नुहुन्न' : 'You cannot delete yourself',
    cannotChangeSelfRole: language === 'ne' ? 'तपाईं आफ्नो भूमिका परिवर्तन गर्न सक्नुहुन्न' : 'You cannot change your own role',
    unableToProcess: language === 'ne' ? 'अनुरोध प्रशोधन गर्न अक्षम' : 'Unable to process request',
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

    fetchUsers();
  }, [status, session, router]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(t.errorFetchingData);
      toast.error(t.errorFetchingData);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users);
      toast.success(t.usersUpdated);
    } catch (error) {
      console.error('Failed to refresh users:', error);
      toast.error(t.errorFetchingData);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    // Prevent self-deletion
    if (selectedUser.id === session?.user?.id) {
      toast.error(t.cannotDeleteSelf);
      setIsDeleteDialogOpen(false);
      return;
    }
    
    setProcessingUserId(selectedUser.id);
    
    try {
      await axios.delete(`/api/admin/users/${selectedUser.id}`);
      setUsers(users.filter(user => user.id !== selectedUser.id));
      toast.success(t.userDeleted);
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(t.error);
    } finally {
      setIsDeleteDialogOpen(false);
      setProcessingUserId(null);
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedUser) return;
    
    setProcessingUserId(selectedUser.id);
    
    try {
      const newStatus = !selectedUser.active;
      await axios.patch(`/api/admin/users/${selectedUser.id}/status`, { active: newStatus });
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, active: newStatus } : user
      ));
      
      toast.success(t.userUpdated);
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error(t.error);
    } finally {
      setIsStatusDialogOpen(false);
      setProcessingUserId(null);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;
    
    // Prevent changing own role
    if (selectedUser.id === session?.user?.id) {
      toast.error(t.cannotChangeSelfRole);
      setIsRoleDialogOpen(false);
      return;
    }
    
    setProcessingUserId(selectedUser.id);
    
    try {
      const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
      await axios.patch(`/api/admin/users/${selectedUser.id}/role`, { role: newRole });
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      ));
      
      toast.success(t.userUpdated);
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error(t.error);
    } finally {
      setIsRoleDialogOpen(false);
      setProcessingUserId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'email') {
      return sortDirection === 'asc' 
        ? a.email.localeCompare(b.email) 
        : b.email.localeCompare(a.email);
    } else if (sortBy === 'role') {
      return sortDirection === 'asc' 
        ? a.role.localeCompare(b.role) 
        : b.role.localeCompare(a.role);
    } else if (sortBy === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const adminCount = users.filter(user => user.role === 'admin').length;
  const userCount = users.filter(user => user.role === 'user').length;

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-40" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="rounded-md border">
          <div className="p-4">
            <Skeleton className="h-10 w-full mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-36 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            {t.userManagement}
          </h1>
          <p className="text-muted-foreground">{t.manageUsers}</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchUsers}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="hidden md:inline ml-2">{t.refresh}</span>
          </Button>
          
          <Button size="sm" asChild>
            <Link href="/admin/users/add">
              <UserPlus className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">{t.addNewUser}</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.totalAdmins}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{adminCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.totalVoters}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userCount}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t.allUsers}</TabsTrigger>
          <TabsTrigger value="admins">{t.admins}</TabsTrigger>
          <TabsTrigger value="voters">{t.voters}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <UserTable 
            users={sortedUsers} 
            t={t} 
            handleSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onEdit={(user) => router.push(`/admin/users/${user.id}/edit`)}
            onDelete={(user) => {
              setSelectedUser(user);
              setIsDeleteDialogOpen(true);
            }}
            onChangeStatus={(user) => {
              setSelectedUser(user);
              setIsStatusDialogOpen(true);
            }}
            onChangeRole={(user) => {
              setSelectedUser(user);
              setIsRoleDialogOpen(true);
            }}
            processingUserId={processingUserId}
            currentUserId={session?.user?.id || ''}
          />
        </TabsContent>
        
        <TabsContent value="admins">
          <UserTable 
            users={sortedUsers.filter(user => user.role === 'admin')} 
            t={t} 
            handleSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onEdit={(user) => router.push(`/admin/users/${user.id}/edit`)}
            onDelete={(user) => {
              setSelectedUser(user);
              setIsDeleteDialogOpen(true);
            }}
            onChangeStatus={(user) => {
              setSelectedUser(user);
              setIsStatusDialogOpen(true);
            }}
            onChangeRole={(user) => {
              setSelectedUser(user);
              setIsRoleDialogOpen(true);
            }}
            processingUserId={processingUserId}
            currentUserId={session?.user?.id || ''}
          />
        </TabsContent>
        
        <TabsContent value="voters">
          <UserTable 
            users={sortedUsers.filter(user => user.role === 'user')} 
            t={t} 
            handleSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onEdit={(user) => router.push(`/admin/users/${user.id}/edit`)}
            onDelete={(user) => {
              setSelectedUser(user);
              setIsDeleteDialogOpen(true);
            }}
            onChangeStatus={(user) => {
              setSelectedUser(user);
              setIsStatusDialogOpen(true);
            }}
            onChangeRole={(user) => {
              setSelectedUser(user);
              setIsRoleDialogOpen(true);
            }}
            processingUserId={processingUserId}
            currentUserId={session?.user?.id || ''}
          />
        </TabsContent>
      </Tabs>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              {t.confirmDelete}
            </DialogTitle>
            <DialogDescription>
              {t.deleteUserQuestion}
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md text-sm">
                {t.deleteWarning}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t.cancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={processingUserId !== null}
            >
              {processingUserId ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  {t.loading}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t.delete}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedUser?.active ? (
                <UserX className="h-5 w-5 text-amber-500" />
              ) : (
                <UserCog className="h-5 w-5 text-green-500" />
              )}
              {selectedUser?.active ? t.deactivateUser : t.activateUser}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.active ? t.deactivateConfirm : t.activateConfirm}
              <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-md text-sm">
                {t.statusChangeWarning}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              {t.cancel}
            </Button>
            <Button
              type="button"
              variant={selectedUser?.active ? "destructive" : "default"}
              onClick={handleChangeStatus}
              disabled={processingUserId !== null}
            >
              {processingUserId ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  {t.loading}
                </>
              ) : selectedUser?.active ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  {t.deactivateUser}
                </>
              ) : (
                <>
                  <UserCog className="mr-2 h-4 w-4" />
                  {t.activateUser}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedUser?.role === 'admin' ? (
                <Users className="h-5 w-5 text-blue-500" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-red-500" />
              )}
              {selectedUser?.role === 'admin' ? t.makeUser : t.makeAdmin}
            </DialogTitle>
            <DialogDescription>
              {t.roleChangeQuestion}
              <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-md text-sm">
                {t.roleChangeWarning}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRoleDialogOpen(false)}
            >
              {t.cancel}
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleChangeRole}
              disabled={processingUserId !== null || selectedUser?.id === session?.user?.id}
            >
              {processingUserId ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  {t.loading}
                </>
              ) : selectedUser?.role === 'admin' ? (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  {t.makeUser}
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {t.makeAdmin}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component for the user table
function UserTable({ 
  users, 
  t, 
  handleSort, 
  sortBy, 
  sortDirection, 
  onEdit, 
  onDelete,
  onChangeStatus,
  onChangeRole, 
  processingUserId,
  currentUserId
}: { 
  users: User[], 
  t: any, 
  handleSort: (column: string) => void,
  sortBy: string,
  sortDirection: 'asc' | 'desc',
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
  onChangeStatus: (user: User) => void,
  onChangeRole: (user: User) => void,
  processingUserId: string | null,
  currentUserId: string
}) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex justify-center items-center">
          <p className="text-muted-foreground">{t.noUsersFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                {t.name}
                {sortBy === 'name' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('email')}>
                {t.email}
                {sortBy === 'email' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('role')}>
                {t.role}
                {sortBy === 'role' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
            </TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('createdAt')}>
                {t.joinDate}
                {sortBy === 'createdAt' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className={user.id === currentUserId ? "bg-blue-50" : ""}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="flex items-center gap-1">
                <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {user.email}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={user.role === 'admin' ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}
                >
                  {user.role === 'admin' ? (
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  ) : (
                    <Users className="mr-1 h-3.5 w-3.5" />
                  )}
                  {user.role === 'admin' ? t.admin : t.user}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={user.active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
                >
                  {user.active ? (
                    <CheckCircle className="mr-1 h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="mr-1 h-3.5 w-3.5" />
                  )}
                  {user.active ? t.active : t.inactive}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString(
                  undefined, 
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={processingUserId === user.id}
                    onClick={() => onEdit(user)}
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    <span className="sr-only md:not-sr-only md:ml-2">{t.edit}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={processingUserId === user.id}
                    onClick={() => onChangeStatus(user)}
                    className={user.active ? "text-amber-700" : "text-green-700"}
                  >
                    {user.active ? (
                      <UserX className="h-3.5 w-3.5" />
                    ) : (
                      <UserCog className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">{user.active ? t.deactivateUser : t.activateUser}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={processingUserId === user.id || user.id === currentUserId}
                    onClick={() => onChangeRole(user)}
                    className={user.role === 'admin' ? "text-blue-700" : "text-red-700"}
                  >
                    {user.role === 'admin' ? (
                      <Users className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">{user.role === 'admin' ? t.makeUser : t.makeAdmin}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={processingUserId === user.id || user.id === currentUserId}
                    onClick={() => onDelete(user)}
                    className="text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">{t.delete}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}