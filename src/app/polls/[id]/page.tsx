"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Add this import
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Poll } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThumbsUp, ThumbsDown, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PollPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const id = params?.id;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Voting states
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [voteType, setVoteType] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<boolean>(false);
  const [voteSuccess, setVoteSuccess] = useState<boolean>(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) {
        setError("Invalid poll ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/polls/${id}`);

        if (response.data && response.data.poll) {
          setPoll(response.data.poll);
        } else {
          setError("Failed to load poll data");
        }

        // Check if user has already voted (only if logged in)
        if (authStatus === "authenticated" && session?.user) {
          try {
            const voteResponse = await axios.get(`/api/polls/vote?pollId=${id}`);
            setHasVoted(voteResponse.data.hasVoted);
          } catch (err) {
            console.error("Error checking vote status:", err);
            // Continue even if vote check fails
          }
        }

      } catch (err) {
        console.error("Error fetching poll:", err);
        // Type check for AxiosError
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Error loading poll");
        } else {
          // For other types of errors
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, authStatus, session]);

  const handleVote = async (voteType: string) => {
    // Redirect to login if not logged in
    if (authStatus !== "authenticated") {
      router.push(`/login?returnUrl=/polls/${id}`);
      return;
    }

    // Prevent voting again
    if (hasVoted) {
      setVoteError("You have already voted on this poll");
      return;
    }

    try {
      setVotingInProgress(true);
      setVoteError(null);
      
      // Submit vote with type
      await axios.post('/api/polls/vote', { 
        pollId: id,
        voteType: voteType 
      });
      
      // Update UI state
      setVoteSuccess(true);
      setHasVoted(true);
      setVoteType(voteType);
      
      // Update vote count in the UI
      if (poll && poll._count) {
        setPoll({
          ...poll,
          _count: {
            ...poll._count,
            votes: (poll._count.votes || 0) + 1
          }
        });
      }
    } catch (err) {
      console.error("Error voting:", err);
      if (axios.isAxiosError(err)) {
        setVoteError(err.response?.data?.message || "Error submitting vote");
      } else {
        setVoteError("An unexpected error occurred");
      }
    } finally {
      setVotingInProgress(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/polls")}
          >
            Back to Polls
          </Button>
        </div>
      </div>
    );

  // Add this condition to handle the null case
  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Poll Not Found</h2>
          <p className="text-yellow-600">The requested poll could not be found.</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/polls")}
          >
            Back to Polls
          </Button>
        </div>
      </div>
    );
  }

  const isPollActive = poll.status === "started";
  const isPollFinished = poll.status === "finished";

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="outline" asChild className="mx-2">
                  <Link href={`/polls`}>Back to Poll</Link>
                </Button>
        <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
        
        {poll.status && (
          <Badge 
            variant="outline"
            className={`mb-4 ${
              isPollActive ? "bg-green-100 text-green-800 border-green-300" : 
              isPollFinished ? "bg-gray-100 text-gray-800 border-gray-300" : 
              "bg-yellow-100 text-yellow-800 border-yellow-300"
            }`}
          >
            {isPollActive ? "Active" : isPollFinished ? "Finished" : "Draft"}
          </Badge>
        )}
        
        <p className="text-gray-600 mb-6">{poll.description}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">
            Created by: {poll.user?.name || poll.user?.email || "Anonymous"}
          </p>
          <p className="text-sm text-gray-500">Votes: {poll._count?.votes || 0}</p>
        </div>
      </div>

      {/* Success message */}
      {voteSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your vote has been recorded. Thank you for participating!
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {voteError && (
        <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{voteError}</AlertDescription>
        </Alert>
      )}

      {/* Warning for inactive polls */}
      {!isPollActive && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">
            {isPollFinished ? "Poll Closed" : "Poll Not Active"}
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            {isPollFinished
              ? "This poll has ended and is no longer accepting votes."
              : "This poll is not yet active."}
          </AlertDescription>
        </Alert>
      )}

      {/* Voting card */}
      <Card>
        <CardHeader>
          <CardTitle>{hasVoted ? "Thank You for Voting" : "Cast Your Vote"}</CardTitle>
          <CardDescription>
            {hasVoted 
              ? `You have ${voteType === "positive" ? "supported" : "opposed"} this poll.` 
              : "Your opinion matters. Do you support or oppose this proposal?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasVoted ? (
            <div className="flex justify-center items-center py-4">
              <div className={`rounded-full p-3 ${
                voteType === "positive" 
                  ? "bg-green-100 text-green-600" 
                  : "bg-red-100 text-red-600"
              }`}>
                {voteType === "positive" 
                  ? <ThumbsUp className="h-8 w-8" /> 
                  : <ThumbsDown className="h-8 w-8" />
                }
              </div>
              <p className="ml-4 text-gray-700">
                You {voteType === "positive" ? "supported" : "opposed"} this proposal
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-600 mb-4">
              Do you support or oppose this proposal?
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {!hasVoted && (
            <>
              <Button 
                onClick={() => handleVote("positive")} 
                disabled={hasVoted || votingInProgress || authStatus !== "authenticated" || !isPollActive}
                className="bg-green-600 hover:bg-green-700"
              >
                {votingInProgress ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Voting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Support
                  </span>
                )}
              </Button>

              <Button 
                onClick={() => handleVote("negative")} 
                disabled={hasVoted || votingInProgress || authStatus !== "authenticated" || !isPollActive}
                className="bg-red-600 hover:bg-red-700"
              >
                {votingInProgress ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Voting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Oppose
                  </span>
                )}
              </Button>
            </>
          )}

          
        </CardFooter>
      </Card>

      {/* Login prompt for unauthenticated users */}
      {authStatus !== "authenticated" && (
        <div className="mt-6 text-center p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">You need to log in to participate in this poll</p>
          <Button asChild>
            <Link href={`/login?returnUrl=/polls/${id}`}>Log In to Vote</Link>
          </Button>
        </div>
      )}

      {/* Link to results */}
      <div className="mt-6 text-center">
      <Button variant="outline" asChild>
            <Link href={`/polls/${id}/results`}>View Results</Link>
          </Button>
      </div>
    </div>
  );
};

export default PollPage;
