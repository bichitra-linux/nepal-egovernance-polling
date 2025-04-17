import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, Vote, TrendingUp, Shield, Users } from "lucide-react";
import { FeaturedPolls } from "@/components/polls/featured-polls";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Nepal eGovernance Polling System
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Participate in digital democracy and help shape Nepal's future. Your voice matters
                in every decision that affects your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100">
                  <Link href="/polls">View Active Polls</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-white text-blue-700 hover:bg-gray-100"
                >
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative w-full h-80">
                {/* Use the SVG file from public directory */}
                <Image
                  src="/images/new-nepal-map-805788885.svg"
                  alt="Map of Nepal"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Polls Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Polls</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These are current high-priority polls that need your input. Your participation helps
              guide important decisions.
            </p>
          </div>

          {/* Client component to fetch and display polls for all users */}
          <FeaturedPolls />

          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link href="/polls">View All Polls</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The Nepal eGovernance Polling System makes participation simple and accessible to all
              citizens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Register with your national ID or citizenship number to verify your identity.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Vote className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cast Your Vote</h3>
              <p className="text-gray-600">
                Browse available polls and submit your vote on matters important to you.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">See the Impact</h3>
              <p className="text-gray-600">
                Track the results and see how citizen input helps shape policy decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden">
                <div className="relative h-64 w-full bg-blue-50 flex items-center justify-center p-6">
                  {/* Nepal map with padlock overlay */}
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/new-nepal-map-805788885.svg"
                      alt="Map of Nepal"
                      fill
                      className="object-contain opacity-80"
                    />

                    {/* Padlock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        width="150"
                        height="150"
                        viewBox="0 0 500 500"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Lock Body */}
                        <rect
                          x="100"
                          y="180"
                          width="300"
                          height="240"
                          rx="30"
                          ry="30"
                          fill="#3b82f6"
                          stroke="#2563eb"
                          strokeWidth="10"
                        />

                        {/* Lock Shackle */}
                        <path
                          d="M150,180 L150,120 C150,60 350,60 350,120 L350,180"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="40"
                          strokeLinecap="round"
                        />

                        {/* Keyhole */}
                        <circle cx="250" cy="270" r="30" fill="#f0f9ff" />
                        <rect x="240" y="270" width="20" height="70" fill="#f0f9ff" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold">Secure and Transparent</h2>
              <p className="text-gray-600">
                We prioritize the security and integrity of the polling process. All votes are
                encrypted, and results are publicly verifiable while maintaining your privacy.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="text-green-600 h-5 w-5" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-green-600 h-5 w-5" />
                  <span>Identity verification through national ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-green-600 h-5 w-5" />
                  <span>Transparent vote counting</span>
                </div>
              </div>
              <Button asChild className="mt-4">
                <Link href="/about/security">Learn More About Security</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-blue-700 text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to make your voice heard?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of citizens already participating in Nepal's digital democracy
            initiative.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            {/* Primary Button - More prominent design */}
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 transition-colors border-2 border-transparent"
            >
              <Link href="/register" className="w-full h-full flex items-center justify-center">
                Create Account
              </Link>
            </Button>

            {/* Secondary Button - Clear outline style */}
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 transition-colors border-2 border-transparent"
            >
              <Link href="/polls" className="w-full h-full flex items-center justify-center">
                Browse Polls
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
