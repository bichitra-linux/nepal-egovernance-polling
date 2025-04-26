"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThumbsUp, ThumbsDown, Users } from "lucide-react";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
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
      {/* Enhanced header section */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button variant="outline" asChild className="hover:bg-gray-50 transition-colors">
            <Link href={`/polls/${id}`} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Poll
            </Link>
          </Button>
          
          {poll.status && (
            <Badge
              variant="outline"
              className={`${
                isPollActive
                  ? "bg-green-100 text-green-800 border-green-300"
                  : isPollFinished
                  ? "bg-gray-100 text-gray-800 border-gray-300"
                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
              } ml-1 font-medium`}
            >
              {isPollActive ? "Active" : isPollFinished ? "Finished" : "Draft"}
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Poll Results</h1>
        <div className="h-1 w-20 bg-blue-600 rounded-full mb-4"></div>
      </div>

      {/* Enhanced poll details card */}
      <Card className="mb-10 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b bg-gray-50 pb-4">
          <CardTitle className="text-xl text-gray-800">{poll.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <p className="text-gray-600 mb-6 leading-relaxed">{poll.description}</p>
          
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
            <div className="space-y-1 mt-3">
              <p className="flex items-center">
                <User className="h-4 w-4 mr-1.5 text-gray-400" />
                Created by: <span className="font-medium ml-1">{poll.user?.name || poll.user?.email || "Anonymous"}</span>
              </p>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                Created: <span className="font-medium ml-1">{new Date(poll.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
            
            <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg mt-3">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <span className="text-blue-800 font-medium text-base">{results.totalVotes}</span>
                <span className="text-blue-700 text-sm ml-1">total votes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary section */}
      <div className="mb-8 text-center">
        <p className="text-lg">
          {results.totalVotes > 0 ? (
            <>
              <span className="font-medium">
                {results.positivePercentage > results.negativePercentage ? 'Support' : 
                 results.negativePercentage > results.positivePercentage ? 'Opposition' : 'Equal support and opposition'}
              </span> {results.positivePercentage === results.negativePercentage ? '' : 'leads with '}
              {results.positivePercentage === results.negativePercentage ? 
                `(${results.positivePercentage}% each)` : 
                results.positivePercentage > results.negativePercentage ? 
                  `${results.positivePercentage}% of votes` : 
                  `${results.negativePercentage}% of votes`}
            </>
          ) : (
            <span className="text-gray-500">No votes have been cast yet</span>
          )}
        </p>
      </div>

      {/* Enhanced results cards with animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Positive Votes Card */}
        <Card
          className={`border-l-4 ${
            results.positiveVotes > 0 ? "border-l-green-500" : "border-l-gray-200"
          } hover:shadow-md transition-all duration-300`}
        >
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <div className="bg-green-100 p-1.5 rounded-full mr-2.5">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
              Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-50 border-4 border-green-100 mb-3">
                <div className="text-5xl font-bold text-green-600">{results.positiveVotes}</div>
              </div>
              <div className="text-gray-500 mb-4">Votes in support</div>

              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                <div
                  className="bg-green-500 h-4 rounded-full animate-grow-width"
                  style={{ 
                    width: `${results.positivePercentage}%`,
                    animation: "growWidth 1s ease-out forwards"
                  }}
                />
              </div>
              <div className="text-xl mt-3 font-semibold text-green-700">{results.positivePercentage}%</div>
            </div>
          </CardContent>
        </Card>

        {/* Negative Votes Card */}
        <Card
          className={`border-l-4 ${
            results.negativeVotes > 0 ? "border-l-red-500" : "border-l-gray-200"
          } hover:shadow-md transition-all duration-300`}
        >
          <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <div className="bg-red-100 p-1.5 rounded-full mr-2.5">
                <ThumbsDown className="h-5 w-5 text-red-600" />
              </div>
              Opposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-50 border-4 border-red-100 mb-3">
                <div className="text-5xl font-bold text-red-600">{results.negativeVotes}</div>
              </div>
              <div className="text-gray-500 mb-4">Votes in opposition</div>

              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                <div
                  className="bg-red-500 h-4 rounded-full animate-grow-width"
                  style={{ 
                    width: `${results.negativePercentage}%`,
                    animation: "growWidth 1s ease-out forwards"
                  }}
                />
              </div>
              <div className="text-xl mt-3 font-semibold text-red-700">{results.negativePercentage}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison section */}
      {results.totalVotes > 0 && (
        <Card className="mb-10 overflow-hidden border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-base">Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex h-12">
              <div
                className="h-full bg-green-500 flex items-center justify-center text-white font-medium"
                style={{ width: `${results.positivePercentage}%` }}
              >
                {results.positivePercentage > 15 ? `${results.positivePercentage}%` : ''}
              </div>
              <div
                className="h-full bg-red-500 flex items-center justify-center text-white font-medium"
                style={{ width: `${results.negativePercentage}%` }}
              >
                {results.negativePercentage > 15 ? `${results.negativePercentage}%` : ''}
              </div>
            </div>
            <div className="flex text-xs p-1">
              <div style={{ width: '50%' }} className="text-center border-r">Support</div>
              <div style={{ width: '50%' }} className="text-center">Opposition</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-3 mt-10 mb-4">
        <Button 
          variant="outline" 
          asChild 
          className="shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
        >
          <Link href="/polls">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View All Polls
          </Link>
        </Button>
        
        <Button 
          variant="default" 
          asChild 
          className="shadow-sm hover:shadow-md transition-all bg-blue-600"
        >
          <Link href={`/polls/${id}`}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Back to Poll
          </Link>
        </Button>
      </div>
    </div>
  );
}
