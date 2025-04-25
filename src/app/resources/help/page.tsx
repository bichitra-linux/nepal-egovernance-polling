"use client";

import React from 'react';
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, Phone, Mail, FileText, ExternalLink, 
  Search, User, ChevronRight, CircleCheck 
} from "lucide-react";

export default function HelpPage() {
  const { language } = useLanguage();

  const t = {
    title: language === 'ne' ? 'मद्दत केन्द्र' : 'Help Center',
    subtitle: language === 'ne' ? 'नेपाल इ-गभर्नेन्स मतदान प्रणालीको प्रयोगमा सहायता' : 'Assistance with using the Nepal eGovernance Polling System',
    
    // Section titles
    faqTitle: language === 'ne' ? 'सामान्य प्रश्नहरू' : 'Frequently Asked Questions',
    supportTitle: language === 'ne' ? 'सहायता प्राप्त गर्नुहोस्' : 'Get Support',
    guideTitle: language === 'ne' ? 'द्रुत मार्गदर्शन' : 'Quick Guides',
    
    // FAQ items
    q1: language === 'ne' ? 'कसरी दर्ता गर्ने?' : 'How do I register?',
    a1: language === 'ne' 
      ? 'रजिस्ट्रेशन फारममा आफ्नो नाम, इमेल, र नागरिकता/राष्ट्रिय परिचयपत्र नम्बर भर्नुहोस्। त्यसपछि प्रमाणीकरणको लागि एक इमेल वा एसएमएस प्राप्त हुनेछ।' 
      : 'Fill out the registration form with your name, email, and citizenship/national ID number. You\'ll then receive an email or SMS for verification.',
    
    q2: language === 'ne' ? 'मैले आफ्नो पासवर्ड बिर्सेँ' : 'I forgot my password',
    a2: language === 'ne' 
      ? 'लगइन पृष्ठमा "पासवर्ड बिर्सनुभयो?" लिंकमा क्लिक गर्नुहोस्। आफ्नो इमेल प्रविष्ट गर्नुहोस् र पासवर्ड रिसेट निर्देशनहरू प्राप्त गर्नुहोस्।' 
      : 'Click the "Forgot password?" link on the login page. Enter your email and follow the password reset instructions.',
    
    q3: language === 'ne' ? 'के मेरो मत गोप्य रहन्छ?' : 'Is my vote confidential?',
    a3: language === 'ne' 
      ? 'हो, तपाईंको मत पूर्णतया गोप्य रहन्छ। सिस्टमले तपाईंको पहिचान र मतदान विवरणलाई अलग राख्छ र सबै डाटा एन्क्रिप्ट गरिएको छ।' 
      : 'Yes, your vote is completely confidential. The system separates your identity from voting details, and all data is encrypted.',
    
    q4: language === 'ne' ? 'मैले कसरी मतदान गर्ने?' : 'How do I vote?',
    a4: language === 'ne' 
      ? 'लगइन गरेपछि, होमपेज वा "मतदान" ट्याबमा सक्रिय मतदानहरू हेर्नुहोस्। मतदानमा क्लिक गर्नुहोस्, विवरण पढ्नुहोस्, आफ्नो विकल्प छनौट गर्नुहोस्, र पुष्टि गर्नुहोस्।' 
      : 'After logging in, view active polls on the homepage or "Polls" tab. Click on a poll, read the details, select your option, and confirm.',
    
    q5: language === 'ne' ? 'मैले आफ्नो मतदान कसरी परिवर्तन गर्न सक्छु?' : 'Can I change my vote?',
    a5: language === 'ne' 
      ? 'मतदान सकिएपछि आफ्नो मत परिवर्तन गर्न सकिँदैन। कृपया मतदान गर्नुअघि आफ्नो विकल्प ध्यानपूर्वक छनौट गर्नुहोस्।' 
      : 'Once submitted, your vote cannot be changed. Please carefully select your option before voting.',
    
    // Support information
    contactUs: language === 'ne' ? 'हामीलाई सम्पर्क गर्नुहोस्' : 'Contact Us',
    phoneSupport: language === 'ne' ? 'फोन सहायता' : 'Phone Support',
    phoneNumber: '+977-1-4XXXXXX',
    phoneHours: language === 'ne' ? 'आइतबार - शुक्रबार, बिहान ९:०० - साँझ ५:००' : 'Sunday - Friday, 9:00 AM - 5:00 PM',
    
    emailSupport: language === 'ne' ? 'इमेल सहायता' : 'Email Support',
    emailAddress: 'support@polling.gov.np',
    emailResponse: language === 'ne' ? '२४ घण्टा भित्र जवाफ' : 'Response within 24 hours',
    
    reportIssue: language === 'ne' ? 'समस्या रिपोर्ट गर्नुहोस्' : 'Report an Issue',
    
    // Quick guides
    accountSetup: language === 'ne' ? 'खाता सेटअप' : 'Account Setup',
    votingProcess: language === 'ne' ? 'मतदान प्रक्रिया' : 'Voting Process',
    viewResults: language === 'ne' ? 'परिणामहरू हेर्नुहोस्' : 'Viewing Results',
    
    // Additional resources
    additionalResources: language === 'ne' ? 'थप संसाधनहरू' : 'Additional Resources',
    guidelines: language === 'ne' ? 'मार्गदर्शन' : 'Guidelines',
    security: language === 'ne' ? 'सुरक्षा जानकारी' : 'Security Information',
    
    // Quick guide steps
    accountStep1: language === 'ne' ? 'रजिस्टर गर्नुहोस्' : 'Register',
    accountStep2: language === 'ne' ? 'इमेल/फोन प्रमाणित गर्नुहोस्' : 'Verify email/phone',
    accountStep3: language === 'ne' ? 'प्रोफाइल अपडेट गर्नुहोस्' : 'Update profile',
    
    votingStep1: language === 'ne' ? 'सक्रिय मतदान चयन गर्नुहोस्' : 'Select active poll',
    votingStep2: language === 'ne' ? 'विकल्प छनौट गर्नुहोस्' : 'Choose option',
    votingStep3: language === 'ne' ? 'मतदान पुष्टि गर्नुहोस्' : 'Confirm vote',
    
    resultsStep1: language === 'ne' ? 'परिणाम पृष्ठमा जानुहोस्' : 'Go to results page',
    resultsStep2: language === 'ne' ? 'मतदान फिल्टर गर्नुहोस्' : 'Filter polls',
    resultsStep3: language === 'ne' ? 'विश्लेषण हेर्नुहोस्' : 'View analysis',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* FAQ Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
            {t.faqTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>{t.q1}</AccordionTrigger>
              <AccordionContent>{t.a1}</AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q2">
              <AccordionTrigger>{t.q2}</AccordionTrigger>
              <AccordionContent>{t.a2}</AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q3">
              <AccordionTrigger>{t.q3}</AccordionTrigger>
              <AccordionContent>{t.a3}</AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q4">
              <AccordionTrigger>{t.q4}</AccordionTrigger>
              <AccordionContent>{t.a4}</AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q5">
              <AccordionTrigger>{t.q5}</AccordionTrigger>
              <AccordionContent>{t.a5}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Quick Guides */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            {t.guideTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  {t.accountSetup}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ol className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-blue-100 text-blue-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">1</span>
                    {t.accountStep1}
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 text-blue-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">2</span>
                    {t.accountStep2}
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 text-blue-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">3</span>
                    {t.accountStep3}
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex items-center">
                  <CircleCheck className="h-4 w-4 mr-2 text-green-600" />
                  {t.votingProcess}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ol className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-green-100 text-green-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">1</span>
                    {t.votingStep1}
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 text-green-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">2</span>
                    {t.votingStep2}
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 text-green-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">3</span>
                    {t.votingStep3}
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex items-center">
                  <Search className="h-4 w-4 mr-2 text-amber-600" />
                  {t.viewResults}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ol className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-amber-100 text-amber-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">1</span>
                    {t.resultsStep1}
                  </li>
                  <li className="flex items-center">
                    <span className="bg-amber-100 text-amber-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">2</span>
                    {t.resultsStep2}
                  </li>
                  <li className="flex items-center">
                    <span className="bg-amber-100 text-amber-700 rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 text-xs">3</span>
                    {t.resultsStep3}
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-blue-600" />
            {t.supportTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Phone className="mr-2 h-4 w-4 text-blue-600" />
                {t.phoneSupport}
              </h3>
              <p className="text-lg font-semibold">{t.phoneNumber}</p>
              <p className="text-sm text-muted-foreground">{t.phoneHours}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Mail className="mr-2 h-4 w-4 text-blue-600" />
                {t.emailSupport}
              </h3>
              <p className="text-lg font-semibold">{t.emailAddress}</p>
              <p className="text-sm text-muted-foreground">{t.emailResponse}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div>
              <h3 className="font-medium mb-2">{t.additionalResources}</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/resources/guidelines">
                    <FileText className="mr-2 h-4 w-4" />
                    {t.guidelines}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/about/security">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t.security}
                  </Link>
                </Button>
              </div>
            </div>
            
            <Button className="flex items-center bg-blue-600 hover:bg-blue-700">
              <HelpCircle className="mr-2 h-4 w-4" />
              {t.reportIssue}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}