"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { Poll } from "@/types";
import { useLanguage } from "@/context/language-context";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Icons
import {
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
  BarChart2,
  Share2,
  ChevronLeft,
  User,
  Info,
  Check,
} from "lucide-react";

// Translations for both languages
const translations = {
  en: {
    backToPolls: "Back to Polls",
    active: "Active",
    finished: "Finished",
    draft: "Draft",
    createdBy: "Created by",
    votes: "Votes",
    success: "Success!",
    voteRecorded: "Your vote has been recorded. Thank you for participating!",
    error: "Error",
    pollClosed: "Poll Closed",
    pollNotActive: "Poll Not Active",
    pollEndedMessage: "This poll has ended and is no longer accepting votes.",
    pollNotActiveMessage: "This poll is not yet active.",
    thankYou: "Thank You for Voting",
    castVote: "Cast Your Vote",
    supportedMessage: "You have supported this poll.",
    opposedMessage: "You have opposed this poll.",
    opinionMatters: "Your opinion matters. Do you support or oppose this proposal?",
    supported: "supported",
    opposed: "opposed",
    doYouSupport: "Do you support or oppose this proposal?",
    support: "Support",
    oppose: "Oppose",
    voting: "Voting...",
    authRequired: "Authentication Required",
    loginNeeded: "You need to log in to participate in this poll",
    loginToVote: "Log In to Vote",
    viewResults: "View Detailed Results",
    pollNotFound: "Poll Not Found",
    pollNotFoundMessage: "The requested poll could not be found.",
    errorLoading: "Error",
    remainingTime: "remaining",
    days: "d",
    hours: "h",
    minutes: "m",
    resultsOverview: "Results Overview",
    totalVotes: "Total Votes",
    share: "Share Poll",
    copied: "Link copied to clipboard!",
  },
  ne: {
    backToPolls: "मतदानहरूमा फर्कनुहोस्",
    active: "सक्रिय",
    finished: "समाप्त",
    draft: "ड्राफ्ट",
    createdBy: "सिर्जनाकर्ता",
    votes: "मतहरू",
    success: "सफलता!",
    voteRecorded: "तपाईंको मत रेकर्ड गरिएको छ। सहभागिताको लागि धन्यवाद!",
    error: "त्रुटि",
    pollClosed: "मतदान बन्द भयो",
    pollNotActive: "मतदान सक्रिय छैन",
    pollEndedMessage: "यो मतदान समाप्त भएको छ र अब मत स्वीकार गरिरहेको छैन।",
    pollNotActiveMessage: "यो मतदान अझै सक्रिय छैन।",
    thankYou: "मतदानको लागि धन्यवाद",
    castVote: "आफ्नो मत दिनुहोस्",
    supportedMessage: "तपाईंले यस मतदानलाई समर्थन गर्नुभयो।",
    opposedMessage: "तपाईंले यस मतदानको विरोध गर्नुभयो।",
    opinionMatters:
      "तपाईंको विचार महत्त्वपूर्ण छ। के तपाई यस प्रस्तावको समर्थन वा विरोध गर्नुहुन्छ?",
    supported: "समर्थन गर्नुभयो",
    opposed: "विरोध गर्नुभयो",
    doYouSupport: "के तपाई यस प्रस्तावको समर्थन वा विरोध गर्नुहुन्छ?",
    support: "समर्थन",
    oppose: "विरोध",
    voting: "मतदान गर्दै...",
    authRequired: "प्रमाणीकरण आवश्यक छ",
    loginNeeded: "यस मतदानमा भाग लिन तपाईंले लगइन गर्नु आवश्यक छ",
    loginToVote: "मतदान गर्न लगइन गर्नुहोस्",
    viewResults: "विस्तृत नतिजाहरू हेर्नुहोस्",
    pollNotFound: "मतदान फेला परेन",
    pollNotFoundMessage: "अनुरोध गरिएको मतदान फेला पार्न सकिएन।",
    errorLoading: "त्रुटि",
    remainingTime: "बाँकी समय",
    days: "दिन",
    hours: "घण्टा",
    minutes: "मिनेट",
    resultsOverview: "नतिजाहरूको अवलोकन",
    totalVotes: "कुल मतहरू",
    share: "मतदान साझा गर्नुहोस्",
    copied: "लिंक क्लिपबोर्डमा प्रतिलिपि गरियो!",
  },
};

// Format date without date-fns
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PollPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const { language } = useLanguage();
  const id = params?.id;

  // Get translations based on current language
  const t = translations[language];

  // States
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [voteType, setVoteType] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<boolean>(false);
  const [voteSuccess, setVoteSuccess] = useState<boolean>(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  // Calculate time remaining for active polls
  useEffect(() => {
    if (poll?.endDate && poll.status === "started") {
      const endDate = new Date(poll.endDate);

      const updateTimeRemaining = () => {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining(null);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(`${days}${t.days} ${hours}${t.hours} ${t.remainingTime}`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}${t.hours} ${minutes}${t.minutes} ${t.remainingTime}`);
        } else {
          setTimeRemaining(`${minutes} ${t.minutes} ${t.remainingTime}`);
        }
      };

      updateTimeRemaining();
      const timer = setInterval(updateTimeRemaining, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [poll?.endDate, poll?.status, t]);

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
            setVoteType(voteResponse.data.voteType);
          } catch (err) {
            console.error("Error checking vote status:", err);
            // Continue even if vote check fails
          }
        }
      } catch (err) {
        console.error("Error fetching poll:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Error loading poll");
        } else {
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
      await axios.post("/api/polls/vote", {
        pollId: id,
        voteType: voteType,
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
            votes: (poll._count.votes || 0) + 1,
          },
          positiveVotes:
            voteType === "positive" ? (poll.positiveVotes || 0) + 1 : poll.positiveVotes,
          negativeVotes:
            voteType === "negative" ? (poll.negativeVotes || 0) + 1 : poll.negativeVotes,
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

  const handleSharePoll = useCallback(() => {
    const url = `${window.location.origin}/polls/${id}`;

    // Try using the Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: poll?.title || "Nepal eGovernance Poll",
          text: "Check out this government poll",
          url,
        })
        .catch(() => {
          // Fallback to clipboard copy
          navigator.clipboard.writeText(url);
          setShowCopiedTooltip(true);
          setTimeout(() => setShowCopiedTooltip(false), 2000);
        });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(url);
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    }
  }, [id, poll]);

  // Loading state with skeletons
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-32 mr-2" />
        </div>

        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-24 mb-4" />

        <Skeleton className="h-32 w-full mb-6" />

        <div className="mb-6">
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          </CardContent>
          <CardFooter className="justify-center">
            <Skeleton className="h-10 w-28 mr-2" />
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2 text-center">{t.errorLoading}</h2>
          <p className="text-red-600 text-center mb-4">{error}</p>
          <div className="flex justify-center">
            <Button onClick={() => router.push("/polls")}>{t.backToPolls}</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">{t.pollNotFound}</h2>
          <p className="text-yellow-600">{t.pollNotFoundMessage}</p>
          <Button className="mt-4" onClick={() => router.push("/polls")}>
            {t.backToPolls}
          </Button>
        </div>
      </div>
    );
  }

  const isPollActive = poll.status === "started";
  const isPollFinished = poll.status === "finished";

  // Calculate percentage for display
  const totalVotes = poll._count?.votes || 0;
  const positivePercentage =
    totalVotes > 0 ? Math.round(((poll.positiveVotes || 0) / totalVotes) * 100) : 0;
  const negativePercentage =
    totalVotes > 0 ? Math.round(((poll.negativeVotes || 0) / totalVotes) * 100) : 0;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header section with back button and share */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" asChild size="sm">
          <Link href="/polls">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.backToPolls}
          </Link>
        </Button>

        <TooltipProvider>
          <Tooltip open={showCopiedTooltip}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSharePoll}
                className="text-gray-500 hover:text-blue-600"
                title={t.share}
              >
                {showCopiedTooltip ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t.copied}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>

        <div className="flex flex-wrap items-center gap-2 mb-4">
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
              {isPollActive ? t.active : isPollFinished ? t.finished : t.draft}
            </Badge>
          )}

          {timeRemaining && isPollActive && (
            <span className="inline-flex items-center text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full border border-amber-200">
              <Clock className="h-3 w-3 mr-1" />
              {timeRemaining}
            </span>
          )}

          {poll.category && <Badge variant="secondary">{poll.category}</Badge>}
        </div>

        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{poll.description}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 justify-between">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(poll.createdAt)}
              </p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <User className="h-4 w-4 mr-1 text-gray-400" />
                {t.createdBy}: {poll.user?.name || poll.user?.email || "Anonymous"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{t.totalVotes}</p>
              <p className="text-xl font-bold">{poll._count?.votes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success message */}
      {voteSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">{t.success}</AlertTitle>
          <AlertDescription className="text-green-700">{t.voteRecorded}</AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {voteError && (
        <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.error}</AlertTitle>
          <AlertDescription>{voteError}</AlertDescription>
        </Alert>
      )}

      {/* Warning for inactive polls */}
      {!isPollActive && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">
            {isPollFinished ? t.pollClosed : t.pollNotActive}
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            {isPollFinished ? t.pollEndedMessage : t.pollNotActiveMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Voting card */}
      <Card className="border border-gray-200 shadow-sm mb-6">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle>{hasVoted ? t.thankYou : t.castVote}</CardTitle>
          <CardDescription>
            {hasVoted
              ? voteType === "positive"
                ? t.supportedMessage
                : t.opposedMessage
              : t.opinionMatters}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {hasVoted ? (
            <div className="flex flex-col items-center py-4 space-y-4">
              <div
                className={`rounded-full p-4 ${
                  voteType === "positive"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {voteType === "positive" ? (
                  <ThumbsUp className="h-8 w-8" />
                ) : (
                  <ThumbsDown className="h-8 w-8" />
                )}
              </div>
              <p className="text-lg font-medium text-gray-700">
                {t.doYouSupport} {voteType === "positive" ? t.supported : t.opposed}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <p className="text-gray-600">{t.doYouSupport}</p>
              <div className="flex justify-center gap-12">
                <div className="text-center">
                  <div className="bg-green-50 rounded-full p-4 mx-auto mb-2">
                    <ThumbsUp className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-700">{t.support}</span>
                </div>
                <div className="text-center">
                  <div className="bg-red-50 rounded-full p-4 mx-auto mb-2">
                    <ThumbsDown className="h-8 w-8 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-red-700">{t.oppose}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center gap-4 bg-gray-50 border-t p-4">
          {!hasVoted ? (
            <>
              <Button
                onClick={() => handleVote("positive")}
                disabled={
                  hasVoted || votingInProgress || authStatus !== "authenticated" || !isPollActive
                }
                className="bg-green-600 hover:bg-green-700 min-w-[120px]"
                size="lg"
              >
                {votingInProgress ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t.voting}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {t.support}
                  </span>
                )}
              </Button>

              <Button
                onClick={() => handleVote("negative")}
                disabled={
                  hasVoted || votingInProgress || authStatus !== "authenticated" || !isPollActive
                }
                className="bg-red-600 hover:bg-red-700 min-w-[120px]"
                size="lg"
              >
                {votingInProgress ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t.voting}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    {t.oppose}
                  </span>
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" asChild size="lg">
              <Link href={`/polls/${id}/results`}>
                <BarChart2 className="mr-2 h-4 w-4" />
                {t.viewResults}
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Login prompt for unauthenticated users */}
      {authStatus !== "authenticated" && (
        <div className="mb-6 text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <Avatar className="h-16 w-16 mx-auto mb-4 bg-gray-200">
            <AvatarFallback>
              <User className="h-8 w-8 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium mb-2">{t.authRequired}</h3>
          <p className="text-gray-600 mb-4">{t.loginNeeded}</p>
          <Button asChild size="lg">
            <Link href={`/login?returnUrl=/polls/${id}`}>{t.loginToVote}</Link>
          </Button>
        </div>
      )}

      

      {/* Official notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Nepal eGovernance Polling System</AlertTitle>
        <AlertDescription className="text-blue-700">
          This is an official government polling system. Your participation helps shape policy
          decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PollPage;
