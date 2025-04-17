"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ThumbsUp, ThumbsDown, Users } from "lucide-react";
import { Poll } from "@/types";
// Extend Poll interface to include results
interface PollResults {
  totalVotes: number;
  positiveVotes: number;
  negativeVotes: number;
  positivePercentage: number;
  negativePercentage: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function PollResults() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) {
        setError("Invalid poll ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/polls/${id}/results`);

        if (response.data) {
          setPoll(response.data.poll);
          setResults(response.data.results);
        } else {
          setError("Failed to load poll results");
        }
      } catch (err) {
        console.error("Error fetching poll results:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Error loading poll results");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/polls")}>
            Back to Polls
          </Button>
        </Alert>
      </div>
    );
  }

  if (!poll || !results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Alert className="max-w-md bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-700">
            The requested poll results could not be found.
          </AlertDescription>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/polls")}>
            Back to Polls
          </Button>
        </Alert>
      </div>
    );
  }

  const isPollActive = poll.status === "started";
  const isPollFinished = poll.status === "finished";

  // Example data for the charts - you would use your actual poll data here
  const sampleData = [
    { name: "Yes", value: 70 },
    { name: "No", value: 30 },
  ];

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
      <Button variant="outline" asChild className="mx-2">
          <Link href={`/polls/${id}`}>Back to Poll</Link>
        </Button>
        <h1 className="text-3xl font-bold mt-4 mb-2">Poll Results</h1>
        {poll.status && (
          <Badge
            variant="outline"
            className={`${
              isPollActive
                ? "bg-green-100 text-green-800 border-green-300"
                : isPollFinished
                ? "bg-gray-100 text-gray-800 border-gray-300"
                : "bg-yellow-100 text-yellow-800 border-yellow-300"
            }`}
          >
            {isPollActive ? "Active" : isPollFinished ? "Finished" : "Draft"}
          </Badge>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{poll.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <p>Created by: {poll.user?.name || poll.user?.email || "Anonymous"}</p>
              <p>Created: {new Date(poll.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Total votes: {results.totalVotes}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Positive Votes Card */}
        <Card
          className={`border-l-4 ${
            results.positiveVotes > 0 ? "border-l-green-500" : "border-l-gray-200"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2 text-green-600" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="text-5xl font-bold text-green-600 mb-2">{results.positiveVotes}</div>
              <div className="text-gray-500">Votes in support</div>

              <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${results.positivePercentage}%` }}
                />
              </div>
              <div className="text-xl mt-2 font-semibold">{results.positivePercentage}%</div>
            </div>
          </CardContent>
        </Card>

        {/* Negative Votes Card */}
        <Card
          className={`border-l-4 ${
            results.negativeVotes > 0 ? "border-l-red-500" : "border-l-gray-200"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ThumbsDown className="h-5 w-5 mr-2 text-red-600" />
              Opposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="text-5xl font-bold text-red-600 mb-2">{results.negativeVotes}</div>
              <div className="text-gray-500">Votes in opposition</div>

              <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div
                  className="bg-red-500 h-4 rounded-full"
                  style={{ width: `${results.negativePercentage}%` }}
                />
              </div>
              <div className="text-xl mt-2 font-semibold">{results.negativePercentage}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" asChild className="mx-2">
          <Link href="/polls">View All Polls</Link>
        </Button>
      </div>
    </div>
  );
}
