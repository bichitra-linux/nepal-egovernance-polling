"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, ClipboardCheck, Info, CheckCircle, AlertCircle, 
  Vote, HelpCircle, Search, User, BarChart, Fingerprint, 
  Shield, AlertTriangle, Users, MessagesSquare
} from "lucide-react";

export default function GuidelinesPage() {
  const { language } = useLanguage();
  
  const t = {
    pageTitle: language === 'ne' ? 'प्रयोग दिशानिर्देशहरू' : 'Usage Guidelines',
    subtitle: language === 'ne' ? 'नेपाल इ-गभर्नेन्स मतदान प्रणाली प्रयोग गर्ने उत्तम तरिकाहरू' : 'Best Practices for Using the Nepal e-Governance Polling System',
    
    // Tab labels
    overview: language === 'ne' ? 'अवलोकन' : 'Overview',
    participation: language === 'ne' ? 'सहभागिता' : 'Participation',
    voting: language === 'ne' ? 'मतदान' : 'Voting',
    results: language === 'ne' ? 'परिणामहरू' : 'Results',
    accessibility: language === 'ne' ? 'पहुँचयोग्यता' : 'Accessibility',
    
    // Overview section
    overviewTitle: language === 'ne' ? 'प्रणाली अवलोकन' : 'System Overview',
    overviewDesc: language === 'ne' 
      ? 'नेपाल इ-गभर्नेन्स मतदान प्रणाली नागरिकहरूलाई सरकारी निर्णय प्रक्रियामा सहभागी हुन र आफ्नो विचार व्यक्त गर्न सक्षम बनाउने एक डिजिटल प्लेटफर्म हो।' 
      : 'The Nepal e-Governance Polling System is a digital platform that enables citizens to participate in government decision-making processes and express their opinions.',
    
    purposeTitle: language === 'ne' ? 'प्रणालीको उद्देश्य' : 'System Purpose',
    purposeDesc: language === 'ne' 
      ? 'यो प्रणालीले सुरक्षित र पारदर्शी तरिकाले जनमत संग्रह गरेर नीति निर्माणमा जनताको सहभागिता बढाउँछ।' 
      : 'This system enhances public participation in policy-making by collecting opinions in a secure and transparent manner.',
    
    eligibilityTitle: language === 'ne' ? 'योग्यता' : 'Eligibility',
    eligibilityDesc: language === 'ne' 
      ? 'नेपाली नागरिकहरू जसको उमेर १६ वर्ष वा सोभन्दा बढी छ, उनीहरू मतदानमा भाग लिन सक्छन्।' 
      : 'Nepali citizens who are 16 years of age or older can participate in polls.',
    
    // Participation section
    participationTitle: language === 'ne' ? 'कसरी भाग लिने' : 'How to Participate',
    
    accountCreationTitle: language === 'ne' ? 'खाता बनाउने' : 'Creating an Account',
    accountCreationDesc: language === 'ne' 
      ? 'तपाईंको पहिचान प्रमाणित गर्न आफ्नो नागरिकता नम्बर वा राष्ट्रिय परिचयपत्र संग रजिस्टर गर्नुहोस्।' 
      : 'Register with your citizenship number or national ID card to verify your identity.',
    
    verificationTitle: language === 'ne' ? 'पहिचान प्रमाणीकरण' : 'Identity Verification',
    verificationDesc: language === 'ne' 
      ? 'तपाईंको मोबाइल नम्बर र/वा इमेल मार्फत प्रमाणीकरण प्रक्रिया पूरा गर्नुहोस्।' 
      : 'Complete the verification process through your mobile number and/or email.',
    
    findPollsTitle: language === 'ne' ? 'मतदान खोज्ने' : 'Finding Polls',
    findPollsDesc: language === 'ne' 
      ? 'ड्यासबोर्ड, श्रेणी अनुसार खोज, वा स्थान अनुसार फिल्टर गरेर सक्रिय मतदानहरू पत्ता लगाउनुहोस्।' 
      : 'Discover active polls through your dashboard, category search, or by filtering by location.',
    
    // Voting section
    votingTitle: language === 'ne' ? 'मतदान प्रक्रिया' : 'Voting Process',
    
    beforeVotingTitle: language === 'ne' ? 'मतदान गर्नुअघि' : 'Before Voting',
    beforeVotingDesc: language === 'ne' 
      ? 'मतदानको पूर्ण विवरण, उद्देश्य र समाप्ति मिति पढ्नुहोस्। उपलब्ध कागजातहरू र संसाधनहरू हेर्नुहोस्।' 
      : 'Read the poll description, purpose, and closing date. Review available documents and resources.',
    
    castingVoteTitle: language === 'ne' ? 'मतदान गर्ने' : 'Casting Your Vote',
    castingVoteDesc: language === 'ne' 
      ? 'आफ्नो विकल्प छनौट गर्नुहोस्, त्यसपछि पुष्टिकरण पृष्ठमा आफ्नो छनौट समीक्षा गर्नुहोस्। मतदान पठाउनुअघि यसमा पुष्टि गर्नुहोस्।' 
      : 'Select your option, then review your choice on the confirmation page. Verify before submitting your vote.',
    
    securityTipsTitle: language === 'ne' ? 'सुरक्षा सुझावहरू' : 'Security Tips',
    securityTipsDesc: language === 'ne' 
      ? 'सुरक्षित मतदानको लागि सार्वजनिक नेटवर्कमा मतदान नगर्नुहोस्, आफ्नो पासवर्ड व्यक्तिगत राख्नुहोस्, र सधै आधिकारिक वेबसाइट प्रयोग गर्नुहोस्।' 
      : 'For secure voting, avoid voting on public networks, keep your password private, and always use the official website.',
    
    // Results section
    resultsTitle: language === 'ne' ? 'परिणामहरू बुझ्ने' : 'Understanding Results',
    
    viewingResultsTitle: language === 'ne' ? 'परिणामहरू हेर्ने' : 'Viewing Results',
    viewingResultsDesc: language === 'ne' 
      ? 'मतदान समाप्त भएपछि परिणामहरू सबैका लागि उपलब्ध हुनेछन्। विस्तृत विश्लेषण र विभिन्न जनसांख्यिकीय खण्डहरू द्वारा डाटा हेर्न सकिन्छ।' 
      : 'Results will be available to all after a poll closes. Data can be viewed by detailed analysis and across various demographic segments.',
    
    interpretationTitle: language === 'ne' ? 'परिणाम व्याख्या' : 'Result Interpretation',
    interpretationDesc: language === 'ne' 
      ? 'परिणामहरूमा मतदाताहरूको प्रतिशत, कुल मतदाताहरू, र विभिन्न श्रेणीहरू अनुसार विभाजन समावेश हुन्छ। ग्राफिकल चार्टहरूले प्रवृत्तिहरू पहिचान गर्न मद्दत गर्दछन्।' 
      : 'Results include percentage of voters, total voters, and breakdowns by various categories. Graphical charts help identify trends.',
    
    impactTitle: language === 'ne' ? 'परिणामहरूको प्रभाव' : 'Impact of Results',
    impactDesc: language === 'ne' 
      ? 'मतदान परिणामहरू नीति निर्माताहरू द्वारा विचार गरिनेछ। परिणामहरू कसरी प्रयोग गरिन्छ भन्ने बारे अपडेटहरू प्राप्त गर्न अनुसरण गर्नुहोस्।' 
      : 'Poll results will be considered by policy makers. Follow updates to see how the results are being used.',
    
    // Accessibility section
    accessibilityTitle: language === 'ne' ? 'पहुँचयोग्यता विशेषताहरू' : 'Accessibility Features',
    
    screenReaderTitle: language === 'ne' ? 'स्क्रिन रिडर समर्थन' : 'Screen Reader Support',
    screenReaderDesc: language === 'ne' 
      ? 'हाम्रो प्लेटफर्म NVDA र JAWS सहित सबै प्रमुख स्क्रिन रिडरहरूसँग काम गर्छ। सबै छवीहरूमा अल्टरनेट पाठ छ।' 
      : 'Our platform works with all major screen readers including NVDA and JAWS. All images have alternative text.',
    
    keyboardTitle: language === 'ne' ? 'किबोर्ड नेभिगेसन' : 'Keyboard Navigation',
    keyboardDesc: language === 'ne' 
      ? 'सम्पूर्ण साइट किबोर्ड मात्र प्रयोग गरेर नेभिगेट गर्न सकिन्छ। शर्टकट कीहरूको लागि मद्दत केन्द्र हेर्नुहोस्।' 
      : 'The entire site can be navigated using keyboard only. See the help center for shortcut keys.',
    
    lowBandwidthTitle: language === 'ne' ? 'कम ब्यान्डविथ मोड' : 'Low Bandwidth Mode',
    lowBandwidthDesc: language === 'ne' 
      ? 'सेटिङ्स मेनुबाट कम ब्यान्डविथ मोड सक्रिय गर्नुहोस् जसले छवीहरू कम गर्छ र पृष्ठ लोड हुने समय सुधार गर्छ।' 
      : 'Activate low bandwidth mode from the settings menu which reduces images and improves page loading time.',
    
    // Common components
    backToTop: language === 'ne' ? 'माथि जानुहोस्' : 'Back to Top',
    helpCenter: language === 'ne' ? 'मद्दत केन्द्र' : 'Help Center',
    reportIssue: language === 'ne' ? 'समस्या रिपोर्ट गर्नुहोस्' : 'Report an Issue',
    lastUpdated: language === 'ne' ? 'अन्तिम अपडेट' : 'Last Updated',
    
    // Important notices
    importantNote: language === 'ne' ? 'महत्वपूर्ण नोट' : 'Important Note',
    oneVoteMessage: language === 'ne' 
      ? 'प्रत्येक नागरिकले प्रत्येक मतदानमा एक पटक मात्र मतदान गर्न सक्छन्। मतदान पठाइसकेपछि यसलाई परिवर्तन गर्न सकिँदैन।' 
      : 'Each citizen can vote only once per poll. Once submitted, your vote cannot be changed.',
    
    fairUseTitle: language === 'ne' ? 'उचित प्रयोग नीति' : 'Fair Use Policy',
    fairUseMessage: language === 'ne' 
      ? 'यस प्लेटफर्मलाई इमानदारी र समानताका साथ प्रयोग गर्नुहोस्। दुरुपयोग वा धोखाधडीका गतिविधिहरू अनुसन्धान गरिनेछ र कानूनी कारबाही हुन सक्छ।' 
      : 'Use this platform with honesty and fairness. Abuse or fraudulent activities will be investigated and may result in legal action.'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-8 border border-green-100 shadow-sm">
        <div className="p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-800">
              {t.pageTitle}
            </h1>
            <p className="text-lg text-green-700">
              {t.subtitle}
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative h-40 w-40">
              <ClipboardCheck className="h-full w-full text-green-700 opacity-20" />
              <BookOpen className="absolute inset-0 m-auto h-20 w-20 text-green-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-green-50 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            <Info className="h-4 w-4 mr-1.5" />
            {t.overview}
          </TabsTrigger>
          <TabsTrigger value="participation" className="data-[state=active]:bg-white">
            <User className="h-4 w-4 mr-1.5" />
            {t.participation}
          </TabsTrigger>
          <TabsTrigger value="voting" className="data-[state=active]:bg-white">
            <Vote className="h-4 w-4 mr-1.5" />
            {t.voting}
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-white">
            <BarChart className="h-4 w-4 mr-1.5" />
            {t.results}
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="data-[state=active]:bg-white">
            <Users className="h-4 w-4 mr-1.5" />
            {t.accessibility}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-green-600" />
                {t.overviewTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>{t.overviewDesc}</p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                      {t.purposeTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.purposeDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Fingerprint className="h-5 w-5 mr-2 text-green-600" />
                      {t.eligibilityTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.eligibilityDesc}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Alert className="bg-blue-50 border border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">{t.importantNote}</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {t.oneVoteMessage}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participation Tab */}
        <TabsContent value="participation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-green-600" />
                {t.participationTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      {t.accountCreationTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.accountCreationDesc}</p>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" className="flex items-center" asChild>
                        <Link href="/register">
                          <User className="h-4 w-4 mr-1.5" />
                          {language === 'ne' ? 'रजिस्टर गर्नुहोस्' : 'Register'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Fingerprint className="h-5 w-5 mr-2 text-green-600" />
                      {t.verificationTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.verificationDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Search className="h-5 w-5 mr-2 text-green-600" />
                      {t.findPollsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.findPollsDesc}</p>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" className="flex items-center" asChild>
                        <Link href="/polls">
                          <Vote className="h-4 w-4 mr-1.5" />
                          {language === 'ne' ? 'मतदान ब्राउज गर्नुहोस्' : 'Browse Polls'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voting Tab */}
        <TabsContent value="voting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vote className="mr-2 h-5 w-5 text-green-600" />
                {t.votingTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Info className="h-5 w-5 mr-2 text-green-600" />
                      {t.beforeVotingTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.beforeVotingDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Vote className="h-5 w-5 mr-2 text-green-600" />
                      {t.castingVoteTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.castingVoteDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      {t.securityTipsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.securityTipsDesc}</p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="flex items-center" asChild>
                        <Link href="/about/security">
                          <Shield className="h-4 w-4 mr-1.5" />
                          {language === 'ne' ? 'सुरक्षा विवरण' : 'Security Details'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Alert variant="destructive" className="bg-amber-50 border border-amber-200 text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">{t.fairUseTitle}</AlertTitle>
                <AlertDescription className="text-amber-700">
                  {t.fairUseMessage}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-green-600" />
                {t.resultsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-green-600" />
                      {t.viewingResultsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.viewingResultsDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Search className="h-5 w-5 mr-2 text-green-600" />
                      {t.interpretationTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.interpretationDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MessagesSquare className="h-5 w-5 mr-2 text-green-600" />
                      {t.impactTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.impactDesc}</p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="flex items-center" asChild>
                        <Link href="/polls/results">
                          <BarChart className="h-4 w-4 mr-1.5" />
                          {language === 'ne' ? 'परिणामहरू हेर्नुहोस्' : 'View Results'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex gap-2 items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700">
                    {language === 'ne' 
                      ? 'मतदान परिणामहरू अध्ययन प्रयोजनका लागि डाउनलोड गर्न सकिन्छ। यो सुविधा प्रयोग गर्नुअघि सबै डाटा उपयोग नीतिहरू पढ्नुहोस्।' 
                      : 'Poll results can be downloaded for research purposes. Please read all data usage policies before using this feature.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-600" />
                {t.accessibilityTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      {t.screenReaderTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.screenReaderDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      {t.keyboardTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.keyboardDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-green-600" />
                      {t.lowBandwidthTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.lowBandwidthDesc}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer section */}
      <Card className="mt-8">
        <CardContent className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            {t.lastUpdated}: {new Date().toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US')}
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="flex items-center" asChild>
              <Link href="/resources/help">
                <HelpCircle className="h-4 w-4 mr-1.5" />
                {t.helpCenter}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-1.5" />
              {t.reportIssue}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}