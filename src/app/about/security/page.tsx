"use client";

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, LockKeyhole, FileCheck, Server, Database, 
  KeyRound, Bell, AlertTriangle, BookOpen, Network,
  Lock, ShieldCheck, FileKey, HelpCircle, CheckCircle,
  UserCheck, GanttChart, Fingerprint, // Add these icons:
  CheckSquare, AlertCircle, ClipboardCheck, Vote as VoteIcon
} from "lucide-react";


export default function SecurityPage() {
  const { language } = useLanguage();
  
  const t = {
    pageTitle: language === 'ne' ? 'सुरक्षा र गोपनीयता' : 'Security & Privacy',
    subtitle: language === 'ne' ? 'नेपाल इ-गभर्नेन्स मतदान प्रणाली सुरक्षा जानकारी' : 'Nepal e-Governance Polling System Security Information',
    overview: language === 'ne' ? 'अवलोकन' : 'Overview',
    securityMeasures: language === 'ne' ? 'सुरक्षा उपायहरू' : 'Security Measures',
    dataProtection: language === 'ne' ? 'डाटा संरक्षण' : 'Data Protection',
    compliance: language === 'ne' ? 'कानुनी अनुपालन' : 'Legal Compliance',
    reporting: language === 'ne' ? 'सुरक्षा समस्या रिपोर्टिङ' : 'Security Issue Reporting',
    resources: language === 'ne' ? 'सन्दर्भ स्रोतहरू' : 'Resources',
    
    // Overview section
    overviewTitle: language === 'ne' ? 'हाम्रो सुरक्षा दृष्टिकोण' : 'Our Security Approach',
    overviewDesc: language === 'ne' ? 'नेपाल इ-गभर्नेन्स मतदान प्रणालीले मतदाताहरूको डाटा र मतदानको एकदम उच्च सुरक्षा सुनिश्चित गर्दछ। हामी डिजिटल सुरक्षाका अन्तर्राष्ट्रिय मापदण्डहरू र नेपालको कानून अनुसार काम गर्दछौं।' : 'The Nepal e-Governance Polling System ensures the highest security for voter data and ballots. We follow international standards for digital security and comply with Nepalese law.',
    
    certificationsTitle: language === 'ne' ? 'प्रमाणीकरण र संलग्नता' : 'Certifications & Partnerships',
    certGov: language === 'ne' ? 'नेपाल सरकार प्रमाणित' : 'Nepal Government Certified',
    certISO: language === 'ne' ? 'ISO/IEC 27001 प्रमाणित' : 'ISO/IEC 27001 Certified',
    certPartner: language === 'ne' ? 'राष्ट्रिय सूचना प्रविधि केन्द्र (NITC) को साझेदार' : 'National Information Technology Center (NITC) Partner',
    
    // Security Measures section
    securityTitle: language === 'ne' ? 'प्रमुख सुरक्षा उपायहरू' : 'Key Security Measures',
    encryption: language === 'ne' ? 'एन्क्रिप्शन' : 'Encryption',
    encryptionDesc: language === 'ne' ? 'सबै डाटा 256-बिट AES र TLS 1.3 प्रोटोकल प्रयोग गरि एन्क्रिप्ट गरिएको छ।' : 'All data is encrypted using 256-bit AES and TLS 1.3 protocols.',
    
    auth: language === 'ne' ? 'बहु-तहको प्रमाणीकरण' : 'Multi-factor Authentication',
    authDesc: language === 'ne' ? 'सिस्टममा पहुँचका लागि बहु-तहको प्रमाणीकरण आवश्यक छ।' : 'Multi-factor authentication is required for system access.',
    
    audit: language === 'ne' ? 'लेखापरीक्षण मार्गहरू' : 'Audit Trails',
    auditDesc: language === 'ne' ? 'सबै गतिविधिहरू पूर्ण पारदर्शिताका लागि लग गरिन्छन्।' : 'All activities are logged for complete transparency.',
    
    testing: language === 'ne' ? 'नियमित सुरक्षा परीक्षण' : 'Regular Security Testing',
    testingDesc: language === 'ne' ? 'नियमित पेनेट्रेशन टेस्टिङ र भेद्यता मूल्याङ्कन।' : 'Regular penetration testing and vulnerability assessments.',
    
    // Data Protection section
    dataProtectionTitle: language === 'ne' ? 'तपाईंको डाटा कसरी सुरक्षित छ' : 'How Your Data is Protected',
    dataMinimization: language === 'ne' ? 'डाटा न्यूनीकरण' : 'Data Minimization',
    dataMinimizationDesc: language === 'ne' ? 'हामी आवश्यक डाटा मात्र संकलन गर्दछौं। अनावश्यक व्यक्तिगत जानकारी संकलन गरिँदैन।' : 'We collect only necessary data. No unnecessary personal information is gathered.',
    
    storage: language === 'ne' ? 'सुरक्षित भण्डारण' : 'Secure Storage',
    storageDesc: language === 'ne' ? 'सबै डाटा नेपालभित्रै स्थित सुरक्षित सर्भरहरूमा भण्डारण गरिन्छ।' : 'All data is stored on secure servers located within Nepal.',
    
    access: language === 'ne' ? 'कडा पहुँच नियन्त्रण' : 'Strict Access Controls',
    accessDesc: language === 'ne' ? 'कर्मचारीहरूलाई न्यूनतम आवश्यक पहुँच मात्र दिइन्छ।' : 'Staff are given only the minimum necessary access.',
    
    deletion: language === 'ne' ? 'डाटा विलोपन' : 'Data Deletion',
    deletionDesc: language === 'ne' ? 'डाटा कानूनी आवश्यकताहरू पूरा गरेपछि सुरक्षित रूपमा मेटाइन्छ।' : 'Data is securely erased after legal requirements are met.',
    
    // Legal Compliance section
    complianceTitle: language === 'ne' ? 'कानूनी अनुपालन र फ्रेमवर्क' : 'Legal Compliance & Frameworks',
    nepalAct: language === 'ne' ? 'सूचना प्रविधि ऐन, २०७९' : 'Information Technology Act, 2022',
    nepalActDesc: language === 'ne' ? 'हाम्रो प्रणालीले नेपालको सूचना प्रविधि ऐन, २०७९ को सम्पूर्ण प्रावधानहरू पूरा गर्दछ।' : 'Our system complies with all provisions of Nepal\'s Information Technology Act, 2022.',
    
    privacyAct: language === 'ne' ? 'व्यक्तिगत गोपनीयता ऐन, २०७५' : 'Privacy Act, 2018',
    privacyActDesc: language === 'ne' ? 'हामी नेपालको व्यक्तिगत गोपनीयता ऐन, २०७५ अनुसार व्यक्तिगत डाटाको संरक्षण गर्दछौं।' : 'We protect personal data in accordance with Nepal\'s Privacy Act, 2018.',
    
    eGov: language === 'ne' ? 'इ-गभर्नेन्स फ्रेमवर्क' : 'e-Governance Framework',
    eGovDesc: language === 'ne' ? 'हाम्रो प्रणाली नेपाल सरकारको इ-गभर्नेन्स फ्रेमवर्क र डिजिटल नेपाल फ्रेमवर्कको अनुपालन गर्दछ।' : 'Our system adheres to the Nepal Government\'s e-Governance Framework and Digital Nepal Framework.',
    
    intStandards: language === 'ne' ? 'अन्तर्राष्ट्रिय मापदण्डहरू' : 'International Standards',
    intStandardsDesc: language === 'ne' ? 'हामी ISO/IEC 27001 र NIST साइबरसुरक्षा फ्रेमवर्क जस्ता अन्तर्राष्ट्रिय मापदण्डहरू लागू गर्दछौं।' : 'We implement international standards such as ISO/IEC 27001 and the NIST Cybersecurity Framework.',
    
    // Security Reporting
    reportingTitle: language === 'ne' ? 'सुरक्षा समस्याहरू रिपोर्ट गर्ने' : 'Reporting Security Issues',
    reportingDesc: language === 'ne' ? 'यदि तपाईंले कुनै सुरक्षा समस्या फेला पार्नुभयो भने, कृपया तुरुन्तै हामीलाई सूचित गर्नुहोस्। हामी सुरक्षा अनुसन्धानकर्ताहरूको योगदानलाई मूल्यवान ठान्दछौं।' : 'If you discover a security issue, please inform us immediately. We value the contributions of security researchers.',
    reportingInstructions: language === 'ne' ? 'समस्या रिपोर्ट गर्न:' : 'To report an issue:',
    reportingEmail: language === 'ne' ? 'हामीलाई security@polling.gov.np मा इमेल गर्नुहोस्' : 'Email us at security@polling.gov.np',
    reportingPhone: language === 'ne' ? 'सुरक्षा हटलाइन: +977-1-4XXXXXX मा फोन गर्नुहोस्' : 'Call our security hotline: +977-1-4XXXXXX',
    reportingForm: language === 'ne' ? 'हाम्रो सुरक्षित रिपोर्टिङ फारम प्रयोग गर्नुहोस्' : 'Use our secure reporting form',
    reportingPolicy: language === 'ne' ? 'हाम्रो प्रकटीकरण नीति हेर्नुहोस्' : 'View our disclosure policy',
    
    // Resources section
    resourcesTitle: language === 'ne' ? 'थप जानकारी र स्रोतहरू' : 'Additional Information & Resources',
    lawsLabel: language === 'ne' ? 'सम्बन्धित कानूनहरू:' : 'Relevant Laws:',
    law1: language === 'ne' ? 'सूचना प्रविधि ऐन, २०७९' : 'Information Technology Act, 2022',
    law2: language === 'ne' ? 'व्यक्तिगत गोपनीयता ऐन, २०७५' : 'Privacy Act, 2018',
    law3: language === 'ne' ? 'विद्युतीय कारोबार ऐन, २०६३' : 'Electronic Transactions Act, 2006',
    
    websitesLabel: language === 'ne' ? 'उपयोगी वेबसाइटहरू:' : 'Useful Websites:',
    website1: language === 'ne' ? 'सूचना प्रविधि विभाग, नेपाल' : 'Department of Information Technology, Nepal',
    website2: language === 'ne' ? 'राष्ट्रिय सूचना प्रविधि केन्द्र' : 'National Information Technology Center',
    website3: language === 'ne' ? 'नेपाल साइबरसुरक्षा अनुसन्धान केन्द्र' : 'Nepal Cybersecurity Research Center',
    
    contactUsButton: language === 'ne' ? 'थप प्रश्नहरूका लागि सम्पर्क गर्नुहोस्' : 'Contact Us for More Questions',
    lastUpdated: language === 'ne' ? 'अन्तिम अपडेट:' : 'Last Updated:',
    downloadPdf: language === 'ne' ? 'PDF डाउनलोड गर्नुहोस्' : 'Download PDF',
    
    // FAQs
    faqsTitle: language === 'ne' ? 'प्राय सोधिने प्रश्नहरू' : 'Frequently Asked Questions',
    faq1Q: language === 'ne' ? 'के मेरो मत गोप्य रहन्छ?' : 'Is my vote kept confidential?',
    faq1A: language === 'ne' ? 'हो, तपाईंको मत पूर्णतया गोप्य रहन्छ। मतदानको विवरण र तपाईंको पहिचान बीचको सम्बन्ध एन्क्रिप्ट गरिएको छ र अलग-अलग सिस्टमहरूमा भण्डारण गरिएको छ।' : 'Yes, your vote is completely confidential. The connection between voting details and your identity is encrypted and stored in separate systems.',
    
    faq2Q: language === 'ne' ? 'मेरो व्यक्तिगत जानकारी को-को सँग साझा गरिन्छ?' : 'Who is my personal information shared with?',
    faq2A: language === 'ne' ? 'हामी तपाईंको व्यक्तिगत जानकारी तेस्रो पक्षसँग साझा गर्दैनौं। यो केवल मतदान प्रक्रियाको प्रमाणीकरणका लागि प्रयोग गरिन्छ र कानूनी आवश्यकता अनुसार मात्रै साझा गरिन्छ।' : 'We do not share your personal information with third parties. It is used only for authentication of the voting process and shared only as required by law.',
    
    faq3Q: language === 'ne' ? 'के यो प्रणाली ह्याक गर्न सकिन्छ?' : 'Can this system be hacked?',
    faq3A: language === 'ne' ? 'हामीले बहु-स्तरीय सुरक्षा उपायहरू लागू गरेका छौं र नियमित सुरक्षा परीक्षण गर्दछौं। कुनै पनि डिजिटल प्रणाली 100% सुरक्षित हुँदैन, तर हामी जोखिमहरू कम गर्न निरन्तर काम गर्दछौं।' : 'We have implemented multi-layered security measures and conduct regular security testing. No digital system is 100% secure, but we continuously work to minimize risks.',
    
    faq4Q: language === 'ne' ? 'तपाईंहरूले मेरो डाटा कति समयसम्म राख्नुहुन्छ?' : 'How long do you keep my data?',
    faq4A: language === 'ne' ? 'हामी तपाईंको व्यक्तिगत पहिचान जानकारी मतदान समाप्त भएको 90 दिनसम्म राख्छौं। त्यसपछि, यो गुमनामी बनाइन्छ र केवल सांख्यिकीय उद्देश्यहरूका लागि प्रयोग गरिन्छ।' : 'We retain your personally identifiable information for 90 days after the poll is completed. After that, it is anonymized and used only for statistical purposes.',
    
    faq5Q: language === 'ne' ? 'म सुरक्षित रूपमा कसरी मतदान गर्न सक्छु?' : 'How can I vote securely?',
    faq5A: language === 'ne' ? 'आफ्नो मतदान सुरक्षित राख्न, कृपया आधिकारिक वेबसाइट प्रयोग गर्नुहोस्, आफ्नो लगइन विवरण साझा नगर्नुहोस्, र सार्वजनिक वाइफाई प्रयोग गर्दा सावधानी अपनाउनुहोस्।' : 'To keep your vote secure, please use the official website, never share your login details, and be cautious when using public WiFi.',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-8 border border-blue-100 shadow-sm">
        <div className="p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800">
              {t.pageTitle}
            </h1>
            <p className="text-lg text-blue-700">
              {t.subtitle}
            </p>
            <div className="flex items-center mt-4 space-x-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                {t.certGov}
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {t.certISO}
              </Badge>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative h-40 w-40">
              <Shield className="h-full w-full text-blue-700 opacity-20" />
              <Lock className="absolute inset-0 m-auto h-20 w-20 text-blue-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-blue-50 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            <Shield className="h-4 w-4 mr-1.5" />
            {t.overview}
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white">
            <LockKeyhole className="h-4 w-4 mr-1.5" />
            {t.securityMeasures}
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-white">
            <Database className="h-4 w-4 mr-1.5" />
            {t.dataProtection}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-white">
            <FileCheck className="h-4 w-4 mr-1.5" />
            {t.compliance}
          </TabsTrigger>
          <TabsTrigger value="reporting" className="data-[state=active]:bg-white">
            <Bell className="h-4 w-4 mr-1.5" />
            {t.reporting}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-600" />
                {t.overviewTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>{t.overviewDesc}</p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" />
                      {t.certificationsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                        <span>{t.certGov}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                        <span>{t.certISO}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                        <span>{t.certPartner}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="bg-blue-50 rounded-lg p-6 flex flex-col justify-center items-center">
                  <div className="mb-4 flex justify-center">
                    <Image 
                      src="/images/nepal-emblem.png" 
                      alt="Nepal Government Emblem" 
                      width={80} 
                      height={80} 
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{t.faqsTitle}</h3>
                    <Link href="#faqs" className="text-blue-600 hover:underline">
                      {language === 'ne' ? 'प्राय सोधिने प्रश्नहरू हेर्नुहोस्' : 'See Frequently Asked Questions'}
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card id="faqs">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
                {t.faqsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq1">
                  <AccordionTrigger className="text-left">{t.faq1Q}</AccordionTrigger>
                  <AccordionContent>{t.faq1A}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq2">
                  <AccordionTrigger className="text-left">{t.faq2Q}</AccordionTrigger>
                  <AccordionContent>{t.faq2A}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq3">
                  <AccordionTrigger className="text-left">{t.faq3Q}</AccordionTrigger>
                  <AccordionContent>{t.faq3A}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq4">
                  <AccordionTrigger className="text-left">{t.faq4Q}</AccordionTrigger>
                  <AccordionContent>{t.faq4A}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq5">
                  <AccordionTrigger className="text-left">{t.faq5Q}</AccordionTrigger>
                  <AccordionContent>{t.faq5A}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Measures Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LockKeyhole className="mr-2 h-5 w-5 text-blue-600" />
                {t.securityTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <KeyRound className="h-5 w-5 mr-2 text-blue-600" />
                      {t.encryption}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.encryptionDesc}</p>
                    <div className="mt-4 bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-sm font-medium">256-bit AES, TLS 1.3</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Fingerprint className="h-5 w-5 mr-2 text-blue-600" />
                      {t.auth}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.authDesc}</p>
                    <div className="mt-4 bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-sm font-medium">2FA, Biometric</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <GanttChart className="h-5 w-5 mr-2 text-blue-600" />
                      {t.audit}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.auditDesc}</p>
                    <div className="mt-4 bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-sm font-medium">Immutable Records</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Server className="h-5 w-5 mr-2 text-blue-600" />
                      {t.testing}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.testingDesc}</p>
                    <div className="mt-4 bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-sm font-medium">VAPT, Red Team</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    {language === 'ne' 
                      ? 'साइबर सुरक्षा एक निरन्तर प्रक्रिया हो। हामी आफ्नो सुरक्षा प्रोटोकल नियमित रूपमा अपडेट गर्छौं। कृपया संदिग्ध गतिविधि देख्नुभएमा रिपोर्ट गर्नुहोस्।' 
                      : 'Cybersecurity is an ongoing process. We regularly update our security protocols. Please report any suspicious activity.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Protection Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-blue-600" />
                {t.dataProtectionTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      {t.dataMinimization}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.dataMinimizationDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Server className="h-5 w-5 mr-2 text-green-600" />
                      {t.storage}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.storageDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                      {t.access}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.accessDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileKey className="h-5 w-5 mr-2 text-green-600" />
                      {t.deletion}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t.deletionDesc}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Data Flow Diagram */}
              <Card className="bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {language === 'ne' ? "डाटा प्रवाह" : "Data Flow"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                      <div className="flex flex-col items-center p-4 border rounded-lg border-blue-200 bg-blue-50 w-full md:w-1/4">
                        <UserCheck className="h-8 w-8 mb-2 text-blue-600" />
                        <span className="text-center font-medium">
                          {language === 'ne' ? "प्रयोगकर्ता प्रमाणीकरण" : "User Authentication"}
                        </span>
                      </div>
                      <div className="hidden md:block">→</div>
                      <div className="flex flex-col items-center p-4 border rounded-lg border-green-200 bg-green-50 w-full md:w-1/4">
                        <CheckSquare className="h-8 w-8 mb-2 text-green-600" />
                        <span className="text-center font-medium">
                          {language === 'ne' ? "एन्क्रिप्टेड मतदान" : "Encrypted Voting"}
                        </span>
                      </div>
                      <div className="hidden md:block">→</div>
                      <div className="flex flex-col items-center p-4 border rounded-lg border-amber-200 bg-amber-50 w-full md:w-1/4">
                        <Database className="h-8 w-8 mb-2 text-amber-600" />
                        <span className="text-center font-medium">
                          {language === 'ne' ? "सुरक्षित भण्डारण" : "Secure Storage"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="mr-2 h-5 w-5 text-blue-600" />
                {t.complianceTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2 bg-blue-50">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                      {t.nepalAct}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p>{t.nepalActDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 bg-blue-50">
                    <CardTitle className="text-lg flex items-center">
                      <FileKey className="h-5 w-5 mr-2 text-blue-600" />
                      {t.privacyAct}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p>{t.privacyActDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 bg-blue-50">
                    <CardTitle className="text-lg flex items-center">
                      <Network className="h-5 w-5 mr-2 text-blue-600" />
                      {t.eGov}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p>{t.eGovDesc}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 bg-blue-50">
                    <CardTitle className="text-lg flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" />
                      {t.intStandards}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p>{t.intStandardsDesc}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg mt-4">
                <h3 className="font-medium text-lg mb-3">
                  {language === 'ne' ? "हामीले गर्ने कार्यहरू:" : "What We Do:"}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      {language === 'ne' 
                        ? "नियमित सुरक्षा अडिट र नियन्त्रण अपडेट"
                        : "Conduct regular security audits and control updates"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      {language === 'ne'
                        ? "तपाईंको डाटा उपयोगको अभिलेख कायम राख्नुहोस्"
                        : "Maintain records of your data usage"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      {language === 'ne'
                        ? "नेपाल सरकारका निकायहरूसँग सुरक्षा जानकारी साझा गर्नुहोस्"
                        : "Share security information with Nepal government agencies"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      {language === 'ne'
                        ? "व्यक्तिगत डाटा सुरक्षा अधिकारहरू सुनिश्चित गर्नुहोस्"
                        : "Ensure personal data protection rights"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporting Tab */}
        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-blue-600" />
                {t.reportingTitle}
              </CardTitle>
              <CardDescription>
                {t.reportingDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-blue-50 border border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-medium">{t.reportingInstructions}</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {t.reportingEmail}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {t.reportingPhone}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {t.reportingForm}
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'ne' ? "सुरक्षा समस्याहरू" : "Security Issues"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                          {language === 'ne'
                            ? "सम्भावित भेद्यताहरू वा सुरक्षा बगहरू"
                            : "Potential vulnerabilities or security bugs"}
                        </p>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                          {language === 'ne'
                            ? "संदिग्ध पहुँच वा डाटा उल्लङ्घनहरू"
                            : "Suspicious access or data breaches"}
                        </p>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                          {language === 'ne'
                            ? "फिशिंग वा सामाजिक इन्जिनियरिङ प्रयासहरू"
                            : "Phishing or social engineering attempts"}
                        </p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'ne' ? "रिपोर्टिङ नीति" : "Reporting Policy"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      {language === 'ne'
                        ? "हामी जिम्मेवारीपूर्ण प्रकटीकरणको अभ्यासलाई प्रोत्साहित गर्दछौं। सुरक्षा अनुसन्धानकर्ताहरूले पत्ता लगाएका समस्याहरू हामीलाई रिपोर्ट गर्न सक्छन्।"
                        : "We encourage responsible disclosure practices. Security researchers can report issues they discover to us."}
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <FileCheck className="h-4 w-4 mr-1.5" />
                      {t.reportingPolicy}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resources section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
            {t.resourcesTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">{t.lawsLabel}</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-blue-600" />
                  <Link href="https://moics.gov.np/en" className="text-blue-600 hover:underline">
                    {t.law1}
                  </Link>
                </li>
                <li className="flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-blue-600" />
                  <Link href="https://lawcommission.gov.np" className="text-blue-600 hover:underline">
                    {t.law2}
                  </Link>
                </li>
                <li className="flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-blue-600" />
                  <Link href="https://lawcommission.gov.np" className="text-blue-600 hover:underline">
                    {t.law3}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">{t.websitesLabel}</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Network className="h-4 w-4 mr-2 text-blue-600" />
                  <Link href="https://www.doitc.gov.np" className="text-blue-600 hover:underline">
                    {t.website1}
                  </Link>
                </li>
                <li className="flex items-center">
                  <Network className="h-4 w-4 mr-2 text-blue-600" />
                  <Link href="https://nitc.gov.np" className="text-blue-600 hover:underline">
                    {t.website2}
                  </Link>
                </li>
                <li className="flex items-center">
                  <Network className="h-4 w-4 mr-2 text-blue-600" />
                  <Link href="https://cirt.gov.np" className="text-blue-600 hover:underline">
                    {t.website3}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-4 border-t">
            <div className="text-sm text-gray-500">
              {t.lastUpdated} {new Date().toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US')}
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-1.5" />
                {t.contactUsButton}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <FileKey className="h-4 w-4 mr-1.5" />
                {t.downloadPdf}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}