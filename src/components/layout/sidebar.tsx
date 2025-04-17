"use client";

import React, { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Import the LanguageContext (to be created)
import { useLanguage } from '../../context/language-context';
import { useSession } from 'next-auth/react';

// Translations object for sidebar
const translations = {
  en: {
    menu: "Menu",
    dashboard: "Dashboard",
    overview: "Overview",
    analytics: "Analytics",
    polls: "Polls",
    allPolls: "All Polls",
    activePolls: "Active Polls",
    results: "Results",
    admin: "Admin",
    adminDashboard: "Dashboard",
    users: "Users",
    resources: "Resources",
    guidelines: "Guidelines",
    helpCenter: "Help Center",
    home: "Home",
    managePolls: "Manage Polls", // Add this line
    settings: "Settings"
  },
  ne: {
    menu: "मेनु",
    dashboard: "ड्यासबोर्ड",
    overview: "अवलोकन",
    analytics: "विश्लेषण",
    polls: "मतदान",
    allPolls: "सबै मतदान",
    activePolls: "सक्रिय मतदान",
    results: "परिणामहरू",
    admin: "प्रशासन",
    adminDashboard: "ड्यासबोर्ड",
    users: "प्रयोगकर्ताहरू",
    resources: "स्रोतहरू",
    guidelines: "दिशानिर्देशहरू",
    helpCenter: "मद्दत",
    home: "गृहपृष्ठ",
    managePolls: "मतदान व्यवस्थापन", // Add this line
    settings: "सेटिङ्स"
  }
};

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    // Get language from context
    const { language } = useLanguage();

    // Check authentication status
    const isAuthenticated = status === 'authenticated';
    const isAdmin = isAuthenticated && session?.user?.role === 'admin';
    
    // Get translations based on current language
    const t = translations[language];

    // Don't render sidebar for unauthenticated users
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-sm">
            <div className="p-4">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 mb-2">
                        <Image 
                            src="/images/nepal-emblem.png"
                            alt="Nepal Emblem"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-center font-bold text-blue-900 text-lg">
                        {language === 'ne' ? `${t.menu} / Menu` : `${t.menu}`}
                    </h2>
                </div>

                <Separator className="my-4 bg-red-700" />

                <ScrollArea className="h-[calc(100vh-220px)]">
                    <Accordion type="multiple" defaultValue={["dashboard", "polls", "resources"]}>
                        {/* Home Link */}
                        

                        
                        {!isAdmin && (
                        <><AccordionItem value="dashboard" className="border-b-0">
                                <AccordionTrigger className="py-2 text-blue-800 hover:bg-blue-50 hover:no-underline font-medium">
                                    <span className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                                        {t.dashboard}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0 pt-1">
                                    <div className="pl-6 border-l-2 border-blue-200">
                                        <Link href="/dashboard" className={cn(
                                            "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                            pathname === "/dashboard" && "bg-blue-100 font-medium"
                                        )}>
                                            {t.overview}
                                        </Link>

                                    </div>
                                </AccordionContent>
                            </AccordionItem><AccordionItem value="polls" className="border-b-0">
                                    <AccordionTrigger className="py-2 text-blue-800 hover:bg-blue-50 hover:no-underline font-medium">
                                        <span className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" /></svg>
                                            {t.polls}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-0 pt-1">
                                        <div className="pl-6 border-l-2 border-blue-200">

                                            <Link href="/polls" className={cn(
                                                "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                                pathname === "/polls/active" && "bg-blue-100 font-medium"
                                            )}>
                                                {t.activePolls}
                                            </Link>
                                            <Link href="/polls/results" className={cn(
                                                "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                                pathname === "/polls/results" && "bg-blue-100 font-medium"
                                            )}>
                                                {t.results}
                                            </Link>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem></>
                        )}

                        {/* Admin Section - Only visible for admins */}
                        {isAdmin && (
                            <AccordionItem value="admin" className="border-b-0">
                                <AccordionTrigger className="py-2 text-blue-800 hover:bg-blue-50 hover:no-underline font-medium">
                                    <span className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                                        {t.admin}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0 pt-1">
                                    <div className="pl-6 border-l-2 border-blue-200">
                                        <Link href="/admin" className={cn(
                                            "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                            pathname === "/admin" && "bg-blue-100 font-medium"
                                        )}>
                                            {t.adminDashboard}
                                        </Link>
                                        <Link href="/admin/polls" className={cn(
                                            "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                            pathname === "/admin/polls" && "bg-blue-100 font-medium"
                                        )}>
                                            {t.managePolls}
                                        </Link>
                                        <Link href="/admin/users" className={cn(
                                            "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                            pathname === "/admin/users" && "bg-blue-100 font-medium"
                                        )}>
                                            {t.users}
                                        </Link>
                                        <Link href="/admin/settings" className={cn(
                                            "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                            pathname === "/admin/settings" && "bg-blue-100 font-medium"
                                        )}>
                                            {t.settings}
                                        </Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Resources Section */}
                        <AccordionItem value="resources" className="border-b-0">
                            <AccordionTrigger className="py-2 text-blue-800 hover:bg-blue-50 hover:no-underline font-medium">
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                                    {t.resources}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-0 pt-1">
                                <div className="pl-6 border-l-2 border-blue-200">
                                    <Link href="/resources/guidelines" className={cn(
                                        "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                        pathname === "/resources/guidelines" && "bg-blue-100 font-medium"
                                    )}>
                                        {t.guidelines}
                                    </Link>
                                    <Link href="/resources/help" className={cn(
                                        "block py-2 px-3 text-sm rounded-md hover:bg-blue-50 transition-colors",
                                        pathname === "/resources/help" && "bg-blue-100 font-medium"
                                    )}>
                                        {t.helpCenter}
                                    </Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>                
                </ScrollArea>                
            </div>
        </div>
    );
};

export default Sidebar;