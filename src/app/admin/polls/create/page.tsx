"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function CreatePoll() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollstatus, setPollStatus] = useState("draft");
  const [startedAt, setStartedAt] = useState<Date | undefined>(undefined);
  const [finishDuration, setFinishDuration] = useState<number | undefined>(undefined);
  const [finishedAt, setFinishedAt] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users");
        setUsers(response.data.users);
        // Set current user as default
        if (session?.user?.id) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await axios.post("/api/admin/polls", {
        title,
        description,
        userId,
        status: pollstatus,
        startedAt: startedAt?.toISOString(),
        finishedAt: finishedAt?.toISOString(),
        finishDuration,
      });

      router.push("/admin/polls");
    } catch (error) {
      console.error("Failed to create poll:", error);
      setError("Failed to create poll. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add helper function:
  const formatDateTimeForInput = (date: Date): string => {
    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Poll</h1>
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
              <Select value={status} onValueChange={setPollStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="started">Active</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                {pollstatus === "draft" &&
                  "Poll will be created in draft mode (not visible to public)"}
                {pollstatus === "started" &&
                  "Poll will be immediately active and visible to public"}
              </p>
            </div>

            {pollstatus === "started" && (
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
                {submitting ? "Creating..." : "Create Poll"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
