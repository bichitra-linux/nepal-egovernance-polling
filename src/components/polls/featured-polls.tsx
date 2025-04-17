"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Poll } from "@/types";



export function FeaturedPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('/api/polls/active');
        if (response.data && response.data.polls) {
          setPolls(response.data.polls);
        }
      } catch (err) {
        console.error("Error fetching polls:", err);
        setError("Failed to load polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) return <div className="text-center py-8">Loading polls...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (polls.length === 0) return <div className="text-center py-8">No polls available at this time.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll) => (
        <div
          key={poll.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium mb-4">
              {poll.category || "General"}
            </span>
            <h3 className="text-xl font-bold mb-2">{poll.title}</h3>
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
        </div>
      ))}
    </div>
  );
}