"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../../context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NepaliDate from "nepali-date-converter";

// Translations object
const translations = {
  en: {
    home: "Home",
    polls: "Polls",
    activePolls: "Active Polls",
    pollresults: "Results",
    dashboard: "Dashboard",
    admin: "Admin",
    government: "Nepal Government",
    system: "eGovernance Polling System",
    new: "NEW",
    announcement: "New polling procedures are now available",
    signIn: "Sign In",
    register: "Register",
    profile: "Profile",
    logout: "Log out",
    welcome: "Welcome",
  },
  ne: {
    home: "गृहपृष्ठ",
    polls: "मतदान",
    activePolls: "सक्रिय मतदान",
    pollresults: "मतपरिणाम",
    dashboard: "ड्यासबोर्ड",
    admin: "प्रशासन",
    government: "नेपाल सरकार",
    system: "इ-गभर्नेन्स मतदान प्रणाली",
    new: "नयाँ",
    announcement: "नयाँ मतदान प्रक्रियाहरू अब उपलब्ध छन्",
    signIn: "साइन इन",
    register: "दर्ता गर्नुहोस्",
    profile: "प्रोफाइल",
    logout: "लग आउट",
    welcome: "स्वागत छ",
  },
};

const Header: React.FC = () => {
  // Use state to track current language
  const { language, setLanguage } = useLanguage();
  const [dateString, setDateString] = useState<string>("");

  // Get session data
  const { data: session, status } = useSession();

  // Check auth status
  const isAuthenticated = status === "authenticated";
  const isAdmin = isAuthenticated && session?.user?.role === "admin";

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Use a static date string to avoid hydration mismatches
  // For nepali date (unchanged)
  useEffect(() => {
    // Converting AD to BS
    try {
      const today = new Date();
      const nepaliDate = new NepaliDate(today);

      // Define Nepali month names
      const nepaliMonths = [
        "बैशाख",
        "जेठ",
        "असार",
        "श्रावण",
        "भाद्र",
        "आश्विन",
        "कार्तिक",
        "मंसिर",
        "पुष",
        "माघ",
        "फाल्गुन",
        "चैत्र",
      ];

      // Format the BS date
      if (language === "ne") {
        // Get the month index (0-based) from the NepaliDate object
        const monthIndex = nepaliDate.getMonth(); // Returns 0-11
        const nepaliMonth = nepaliMonths[monthIndex];

        // Convert numbers to Nepali digits
        const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
        const day = String(nepaliDate.getDate())
          .split("")
          .map((digit) => nepaliDigits[parseInt(digit)])
          .join("");

        const year = String(nepaliDate.getYear())
          .split("")
          .map((digit) => nepaliDigits[parseInt(digit)])
          .join("");

        setDateString(`वि.सं.${year}, ${nepaliMonth} ${day}`);
      } else {
        // For English, use the format method
        setDateString(`${nepaliDate.format("DD MMMM YYYY")} BS`);
      }
    } catch (error) {
      console.error("Error converting date:", error);
      // Fallback to a simple date display
      setDateString(new Date().toLocaleDateString(language === "ne" ? "ne-NP" : "en-US"));
    }
  }, [language]);

  // Get translations based on current language
  const t = translations[language];

  return (
    <header className="border-b border-gray-200 shadow-sm">
      {/* Top bar with Nepal flag colors */}
      <div className="bg-gradient-to-r from-red-700 to-blue-900 h-2"></div>

      {/* Main header area */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and title section */}
            <div className="flex items-center gap-3">
              {/* Nepal Government Emblem */}
              <div className="w-20 h-16 relative">
                <Image
                  src="/images/nepal-emblem.png"
                  alt="Nepal Government Emblem"
                  width={70}
                  height={70}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23c00' /%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div className="text-center md:text-left">
                <h1 className="font-bold">
                  <span className="text-lg text-red-800 block">{t.government}</span>
                  <span className="text-xl text-blue-900 block">{t.system}</span>
                  <span className="text-sm text-gray-700 block">
                    Nepal eGovernance Polling System
                  </span>
                </h1>
              </div>
            </div>

            {/* Right side elements */}
            <div className="flex flex-col items-end gap-2">
              {/* Language selector */}
              <div className="text-sm flex gap-1">
                <Button
                  variant={language === "ne" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("ne")}
                >
                  नेपाली
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                >
                  English
                </Button>
              </div>

              {/* Date in Nepali format */}
              <div className="text-xl text-gray-600">
                <Badge variant="outline" className="font-normal">
                  {dateString}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-blue-900 shadow-md">
        <div className="container mx-auto">
          <NavigationMenu className="w-full max-w-none">
            <div className="container mx-auto flex justify-between py-1">
              <NavigationMenuList className="flex w-full justify-start items-center">
                {/* Home link - always visible */}
                <NavigationMenuItem>
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2.5 text-white font-medium hover:bg-red-600 transition-colors border-r border-red-600 relative group"
                  >
                    <span className="mr-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </span>
                    {t.home}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </NavigationMenuItem>

                {/* Polls dropdown - always visible */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center px-4 py-2.5 text-white font-medium hover:bg-red-600 transition-colors border-r border-red-600 relative group">
                        <span className="mr-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </span>
                        {t.polls}
                        <span className="ml-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300"></div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white rounded shadow-lg border border-gray-200 w-48">
                      <div className="h-1 bg-gradient-to-r from-red-700 to-blue-900"></div>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/polls"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-red-700">•</span>
                          {t.activePolls}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/polls/results"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-blue-900">•</span>
                          {t.pollresults}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
                {/*
                {/* Dashboard link - only for authenticated users 
                {isAuthenticated && (
                  <NavigationMenuItem>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2.5 text-white font-medium hover:bg-red-600 transition-colors border-r border-red-600 relative group"
                    >
                      <span className="mr-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                        </svg>
                      </span>
                      {t.dashboard}
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300"></div>
                    </Link>
                  </NavigationMenuItem>
                )}

                {/* Admin link - only for admin users 
                {isAdmin && (
                  <NavigationMenuItem>
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2.5 text-white font-medium hover:bg-red-600 transition-colors relative group"
                    >
                      <span className="mr-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </span>
                      {t.admin}
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300"></div>
                    </Link>
                  </NavigationMenuItem>
                )} */}
              </NavigationMenuList>

              {/* Authentication section */}
              <div className="flex items-center">
                {!isAuthenticated ? (
                  // Show login/register for unauthenticated users
                  <div className="flex items-center">
                    <Link href="/login" className="group">
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-red-600 px-4 py-2 rounded-none border-r border-red-600 group-hover:bg-red-600 transition-colors"
                      >
                        <span className="mr-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
                          </svg>
                        </span>
                        {t.signIn}
                      </Button>
                    </Link>
                    <Link href="/register" className="group">
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-red-600 px-4 py-2 rounded-none group-hover:bg-red-600 transition-colors"
                      >
                        <span className="mr-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" x2="19" y1="8" y2="14"></line>
                            <line x1="22" x2="16" y1="11" y2="11"></line>
                          </svg>
                        </span>
                        {t.register}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  // Show avatar dropdown for authenticated users
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-red-600 flex items-center px-2 py-1.5 rounded-full border border-white/30"
                      >
                        <Avatar className="h-7 w-7 mr-2">
                          <AvatarImage
                            src={session?.user?.image || ""}
                            alt={session?.user?.name || ""}
                          />
                          <AvatarFallback className="bg-blue-900 text-white">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="mr-1 hidden sm:inline-block">
                          {session?.user?.name?.split(" ")[0]}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <div className="h-1 bg-gradient-to-r from-red-700 to-blue-900"></div>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {t.welcome}, {session?.user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <svg
                            className="mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          {t.profile}
                        </Link>
                      </DropdownMenuItem>

                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center">
                            <svg
                              className="mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            {t.admin}
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="flex items-center text-red-600"
                      >
                        <svg
                          className="mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        {t.logout}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
