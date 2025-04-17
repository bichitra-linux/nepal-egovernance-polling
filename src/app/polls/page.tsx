"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PollCard from '../../components/polls/poll-card';
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Poll } from "@/types";




const PollsPage = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/polls');
        
        if (response.data && response.data.polls) {
          setPolls(response.data.polls);
        } else {
          setError("Failed to load polls");
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

    fetchPolls();
  }, []);

  if (loading) return <div className="container mx-auto p-6">Loading polls...</div>;
  if (error) return <div className="container mx-auto p-6">Error: {error}</div>;
  if (polls.length === 0) return <div className="container mx-auto p-6">No polls available at this time.</div>;


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Polls</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">{poll.title}</h2>
            <p className="text-gray-600 mb-4">{poll.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{poll._count?.votes || 0} votes</span>
              <Button variant="outline" asChild size="sm" className="flex items-center gap-1">
                <Link href={`/polls/${poll.id}`}>
                  Vote Now <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollsPage;