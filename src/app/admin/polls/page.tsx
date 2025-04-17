"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";

interface Poll {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  finishedAt: string | null; // Added end date field
  status: "draft" | "started" | "finished"; // Added status field
  user: {
    name: string | null;
    email: string;
  };
  _count: {
    votes: number;
  };
}

type SortField = "title" | "createdAt" | "votes" | "status";
type SortOrder = "asc" | "desc";

export default function AdminPolls() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    const fetchPolls = async () => {
      try {
        const response = await axios.get("/api/admin/polls");
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchPolls();
    }
  }, [status, session, router]);

  const handleDeletePoll = async (id: number) => {
    try {
      await axios.delete(`/api/admin/polls/${id}`);
      setPolls(polls.filter((poll) => poll.id !== id));
    } catch (error) {
      console.error("Failed to delete poll:", error);
      alert("Failed to delete poll. Please try again.");
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: "draft" | "started" | "finished") => {
    setUpdatingStatus(id);
    try {
      const poll = polls.find((p) => p.id === id);
      if (!poll) return;

      // Calculate finishedAt if status is changed to finished
      const finishedAt = newStatus === "finished" ? new Date().toISOString() : null;

      await axios.put(`/api/admin/polls/${id}`, {
        title: poll.title,
        description: poll.description,
        status: newStatus,
        finishedAt,
      });

      // Update local state
      const updatedPolls = polls.map((p) =>
        p.id === id ? { ...p, status: newStatus, finishedAt } : p
      );
      setPolls(updatedPolls);
      applyFiltersAndSort(updatedPolls);
    } catch (error) {
      console.error("Failed to update poll status:", error);
      alert("Failed to update poll status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Sort and filter functions
  const toggleSort = (field: SortField) => {
    const newOrder = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    applyFiltersAndSort(polls, field, newOrder);
  };

  const applyFiltersAndSort = (
    pollsData: Poll[],
    field: SortField = sortField,
    order: SortOrder = sortOrder,
    status: string | null = statusFilter,
    search: string = searchTerm
  ) => {
    let filtered = [...pollsData];

    // Apply status filter
    if (status) {
      filtered = filtered.filter((poll) => poll.status === status);
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (poll) =>
          poll.title.toLowerCase().includes(searchLower) ||
          poll.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (field) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "votes":
          comparison = a._count.votes - b._count.votes;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return order === "asc" ? comparison : -comparison;
    });

    setFilteredPolls(filtered);
  };

  useEffect(() => {
    applyFiltersAndSort(polls);
  }, [searchTerm, statusFilter, sortField, sortOrder]);

  // Function to render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Draft
          </Badge>
        );
      case "started":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Active
          </Badge>
        );
      case "finished":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            Finished
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder === "asc" ? (
      <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600" />
    ) : (
      <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600 rotate-180" />
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Polls</h1>
        <Button asChild>
          <Link href="/admin/polls/create">Create New Poll</Link>
        </Button>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            onClick={() => setStatusFilter(null)}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "outline"}
            onClick={() => setStatusFilter("draft")}
            size="sm"
            className="flex items-center gap-1"
          >
            <AlertCircle className="h-4 w-4" /> Draft
          </Button>
          <Button
            variant={statusFilter === "started" ? "default" : "outline"}
            onClick={() => setStatusFilter("started")}
            size="sm"
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" /> Active
          </Button>
          <Button
            variant={statusFilter === "finished" ? "default" : "outline"}
            onClick={() => setStatusFilter("finished")}
            size="sm"
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" /> Finished
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("title")}>
                <div className="flex items-center">Title {getSortIcon("title")}</div>
              </TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("createdAt")}>
                <div className="flex items-center">Start Date {getSortIcon("createdAt")}</div>
              </TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                <div className="flex items-center">Status {getSortIcon("status")}</div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("votes")}>
                <div className="flex items-center">Votes {getSortIcon("votes")}</div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolls.map((poll) => (
              <TableRow key={poll.id}>
                <TableCell className="font-medium">{poll.title}</TableCell>
                <TableCell>{poll.user.name || poll.user.email}</TableCell>
                <TableCell>{new Date(poll.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {poll.finishedAt ? new Date(poll.finishedAt).toLocaleDateString() : "Ongoing"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2 flex items-center">
                        {renderStatusBadge(poll.status)}
                        {updatingStatus === poll.id ? (
                          <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-opacity-50 border-t-blue-500"></span>
                        ) : (
                          <MoreHorizontal className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        disabled={poll.status === "draft" || updatingStatus === poll.id}
                        onClick={() => handleUpdateStatus(poll.id, "draft")}
                      >
                        <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        Mark as Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={poll.status === "started" || updatingStatus === poll.id}
                        onClick={() => handleUpdateStatus(poll.id, "started")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Mark as Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={poll.status === "finished" || updatingStatus === poll.id}
                        onClick={() => handleUpdateStatus(poll.id, "finished")}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                        Mark as Finished
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{poll._count.votes}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/polls/${poll.id}/edit`}>Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/polls/${poll.id}/results`}>Results</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the poll and
                          all associated votes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePoll(poll.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {filteredPolls.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {polls.length === 0 ? "No polls found" : "No polls match your search criteria"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
