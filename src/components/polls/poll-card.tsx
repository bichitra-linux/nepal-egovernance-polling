"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PollCardProps {
  poll: {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
  };
}

const PollCard = ({ poll }: PollCardProps) => {
  const router = useRouter();
  
  // Format the date to be more readable
  const formattedDate = new Date(poll.createdAt).toLocaleDateString();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{poll.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm mb-2">Created on: {formattedDate}</p>
        <p className="text-gray-700">
          {poll.description || 'No description provided'}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/polls/${poll.id}/results`)}
        >
          View Results
        </Button>
        
        <Button 
          variant="default"
          onClick={() => router.push(`/polls/${poll.id}`)}
        >
          Vote
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollCard;