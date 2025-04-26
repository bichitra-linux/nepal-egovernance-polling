"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Home, 
  LogIn, 
  Clock, 
  HelpCircle, 
  Shield, 
  RotateCcw,
  ChevronRight,
  Mail
} from "lucide-react";

export default function Unauthorized() {
  const { language } = useLanguage();
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  const [activeTab, setActiveTab] = useState<string>("info");
  
  const translations = {
    en: {
      title: "Access Denied",
      subtitle: "Unauthorized Access",
      message: "You do not have permission to access this page.",
      detailedMessage: "This area is restricted to authorized personnel only. If you believe you should have access, please ensure you are logged in with the correct credentials or contact the system administrator.",
      homeButton: "Return to Home",
      loginButton: "Login Correctly",
      helpButton: "Get Help",
      reportButton: "Report Issue",
      autoRedirect: "Redirecting to homepage in",
      seconds: "seconds",
      securityTab: "Security Info",
      helpTab: "Help & Support",
      securityMessage: "This page is part of a secure government system. Unauthorized access attempts may be logged and monitored.",
      helpMessage: "If you need assistance accessing this system, please contact the support team:",
      contactEmail: "support@polling.gov.np",
      contactPhone: "+977 1234567890",
      tryAgain: "Try Again",
      goBack: "Go Back"
    },
    ne: {
      title: "पहुँच अस्वीकृत",
      subtitle: "अनधिकृत पहुँच",
      message: "तपाईंसँग यो पृष्ठमा पहुँच गर्ने अनुमति छैन।",
      detailedMessage: "यो क्षेत्र अधिकृत कर्मचारीहरूका लागि मात्र सीमित छ। यदि तपाईं विश्वास गर्नुहुन्छ कि तपाईंसँग पहुँच हुनुपर्दछ, कृपया सही प्रमाणपत्रहरूसँग लगइन गरेको सुनिश्चित गर्नुहोस् वा प्रणाली प्रशासकलाई सम्पर्क गर्नुहोस्।",
      homeButton: "गृहपृष्ठमा फर्कनुहोस्",
      loginButton: "सही तरिकाले लगइन गर्नुहोस्",
      helpButton: "सहयोग प्राप्त गर्नुहोस्",
      reportButton: "समस्या रिपोर्ट गर्नुहोस्",
      autoRedirect: "गृहपृष्ठमा पुनर्निर्देशन गर्दै",
      seconds: "सेकेन्ड",
      securityTab: "सुरक्षा जानकारी",
      helpTab: "सहायता र समर्थन",
      securityMessage: "यो पृष्ठ सुरक्षित सरकारी प्रणालीको अंश हो। अनधिकृत पहुँच प्रयासहरू लग गरिने र निगरानी गरिन सक्छन्।",
      helpMessage: "यदि तपाईंलाई यो प्रणालीमा पहुँच गर्न सहायता चाहिएमा, कृपया सहायता टोलीलाई सम्पर्क गर्नुहोस्:",
      contactEmail: "support@polling.gov.np",
      contactPhone: "+977 1234567890",
      tryAgain: "पुन: प्रयास गर्नुहोस्",
      goBack: "पछाडि जानुहोस्"
    },
  };

  // Type assertion for language key
  const t = translations[language as keyof typeof translations];

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Nepal flag colors top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-700 to-blue-900" style={{ backgroundSize: "200% 100%" }}></div>
      
      <div className="w-full max-w-xl">
        <div className="mb-4 flex items-center gap-2">
          <div className="p-2 rounded-full bg-red-100">
            <AlertTriangle className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-red-800">{t.subtitle}</h2>
            <p className="text-xs text-gray-500">
              {t.autoRedirect} <span className="font-mono font-bold">{countdown}</span> {t.seconds}
            </p>
          </div>
        </div>
        
        <Card className="w-full shadow-lg border border-red-200 overflow-hidden animate-fadeIn">
          <div className="h-2 bg-gradient-to-r from-red-600 to-blue-700"></div>
          
          <CardHeader className="space-y-2 text-center pt-8 pb-4">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-red-100 rounded-full mb-3 animate-pulse">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-800">{t.title}</CardTitle>
              <CardDescription className="text-gray-700 mt-2 max-w-md">
                {t.message}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 relative">
                <Image
                  src="/images/nepal-emblem.png"
                  alt="Nepal Government Emblem"
                  width={96}
                  height={96}
                  className="object-contain opacity-50"
                />
              </div>
            </div>
            
            <p className="text-sm text-center text-gray-600 max-w-md mx-auto">
              {t.detailedMessage}
            </p>
            
            <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="info" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {t.securityTab}
                </TabsTrigger>
                <TabsTrigger value="help" className="text-xs">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  {t.helpTab}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="p-3 bg-red-50 rounded-md mt-2 border border-red-100 text-xs text-gray-700">
                <div className="flex items-start">
                  <Shield className="w-4 h-4 text-red-700 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{t.securityMessage}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="help" className="p-3 bg-blue-50 rounded-md mt-2 border border-blue-100 text-xs">
                <div className="flex items-start">
                  <HelpCircle className="w-4 h-4 text-blue-700 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">{t.helpMessage}</p>
                    <div className="flex items-center mt-2">
                      <Mail className="w-3 h-3 text-blue-700 mr-1" />
                      <a href="mailto:support@nepal-egov.gov.np" className="text-blue-700 hover:underline">
                        {t.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <Separator className="my-2" />
          
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 py-6">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                {t.homeButton}
              </Link>
            </Button>
            
            <Button asChild variant="default" className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900">
              <Link href="/login">
                <LogIn className="w-4 h-4 mr-2" />
                {t.loginButton}
              </Link>
            </Button>
            
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="javascript:history.back()">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t.goBack}
              </Link>
            </Button>
          </CardFooter>
          
          <div className="px-6 pb-6 flex justify-center">
            <Link 
              href="/contact" 
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center transition-colors"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              {t.reportButton}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </Card>
        
        <div className="mt-4 flex justify-center">
          <Clock className="w-4 h-4 text-gray-400 animate-pulse mr-2" />
          <p className="text-xs text-gray-500">
            {t.autoRedirect} {countdown} {t.seconds}
          </p>
        </div>
      </div>
      
      {/* Nepal flag colors bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-700 to-blue-900" style={{ backgroundSize: "200% 100%" }}></div>
    </div>
  );
}