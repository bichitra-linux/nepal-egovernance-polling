"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Poll {
  id: number;
  title: string;
  description: string | null;
  userId: string;
  status: "draft" | "started" | "finished";
  finishedAt: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function EditPoll() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [pollStatus, setPollStatus] = useState<"draft" | "started" | "finished">("draft");
  const [finishedAt, setFinishedAt] = useState<Date | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | undefined>(undefined);
  const [finishDuration, setFinishDuration] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch poll data
        const pollResponse = await axios.get(`/api/admin/polls/${id}`);
        const poll = pollResponse.data.poll;

        setTitle(poll.title);
        setDescription(poll.description || "");
        setUserId(poll.userId);
        setPollStatus(poll.status || "verified");

        // Set finished date if available
        if (poll.finishedAt) {
          setFinishedAt(new Date(poll.finishedAt));
        }

        // ADD THESE LINES HERE - after poll data is fetched:
        if (poll.startedAt) {
          setStartedAt(new Date(poll.startedAt));
        }
        if (poll.finishDuration) {
          setFinishDuration(poll.finishDuration);
        }

        // Fetch users
        const usersResponse = await axios.get("/api/admin/users");
        setUsers(usersResponse.data.users);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load poll data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && id) {
      fetchData();
    }
  }, [status, session, router, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await axios.put(`/api/admin/polls/${id}`, {
        title,
        description,
        userId,
        status: pollStatus,
        startedAt: startedAt?.toISOString(),
        finishedAt: finishedAt?.toISOString(),
        finishDuration,
      });

      router.push("/admin/polls");
    } catch (error) {
      console.error("Failed to update poll:", error);
      setError("Failed to update poll. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value as "draft" | "started" | "finished";
    setPollStatus(newStatus);

    // If status is changed to finished and no end date is set, default to today
    if (newStatus === "finished" && !finishedAt) {
      setFinishedAt(new Date());
    }

    // If status is changed to something other than finished, clear the end date
    if (newStatus !== "finished") {
      setFinishedAt(undefined);
    }
  };

  // Helper function to format date for the input field (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().slice(0, 16);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && error === "Failed to load poll data") {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/admin/polls">Back to Polls</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Poll</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/polls">Back to Polls</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Poll Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter poll title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter poll description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={pollStatus} onValueChange={handleStatusChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="started">Active</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                {pollStatus === "draft" && "Poll is in draft mode and not visible to public"}
                {pollStatus === "started" && "Poll is active and visible to all public users"}
                {pollStatus === "finished" && "Poll is finished and no longer accepting votes"}
              </p>
            </div>

            {pollStatus === "started" && (
              <div className="space-y-2">
                <Label htmlFor="finishDuration">Poll Duration</Label>
                <Select
                  value={finishDuration?.toString() || ""}
                  onValueChange={(value) => {
                    const days = parseInt(value);
                    setFinishDuration(days);

                    // Calculate finish date based on duration
                    if (days) {
                      const endDate = new Date();
                      endDate.setDate(endDate.getDate() + days);
                      setFinishedAt(endDate);
                    }
                  }}
                >
                  <SelectTrigger id="finishDuration">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="2">2 Days</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">1 Week</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  The poll will automatically finish after this duration
                </p>

                {finishedAt && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm">Poll will end on: {finishedAt.toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}

            {/* Show end date picker only when status is finished */}
            {pollStatus === "finished" && (
              <div className="space-y-2">
                <Label htmlFor="finishedAt">End Date</Label>
                <div className="relative">
                  <div className="flex items-center">
                    <Input
                      type="date"
                      id="finishedAt"
                      className="w-full"
                      value={finishedAt ? formatDateForInput(finishedAt) : ""}
                      onChange={(e) => {
                        const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                        setFinishedAt(selectedDate);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={() => setFinishedAt(new Date())}
                    >
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Today
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">The date when the poll was closed</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="userId">Created By</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" asChild>
                <Link href="/admin/polls">Cancel</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update Poll"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
