"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Unauthorized() {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Access Denied",
      message: "You do not have permission to access this page.",
      homeButton: "Return to Home",
      loginButton: "Login Correctly",
    },
    ne: {
      title: "पहुँच अस्वीकृत",
      message: "तपाईंसँग यो पृष्ठमा पहुँच गर्ने अनुमति छैन।",
      homeButton: "गृहपृष्ठमा फर्कनुहोस्",
      loginButton: "सही तरिकाले लगइन गर्नुहोस्",
    },
  };

  const t = translations[language];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md border border-red-200">
        <CardHeader className="space-y-2 text-center pb-4">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
          <CardTitle className="text-2xl font-bold text-red-800">{t.title}</CardTitle>
          <CardDescription className="text-gray-700">{t.message}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex justify-center">
          <div className="w-32 h-32 relative">
            <Image
              src="/images/nepal-emblem.png"
              alt="Nepal Government Emblem"
              width={128}
              height={128}
              className="object-contain opacity-30"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 pb-6">
          <Button asChild variant="outline">
            <Link href="/">{t.homeButton}</Link>
          </Button>
          <Button asChild variant="default" className="bg-blue-800">
            <Link href="/login">{t.loginButton}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}