"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Loader2, 
  Lock,
  Mail,
  RefreshCw,
  LogIn
} from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Use the useSearchParams hook with dynamic import to enable suspense
  const [searchParams, setSearchParams] = useState<{
    callbackUrl: string;
    from: string | null;
  }>({
    callbackUrl: "/admin",
    from: null
  });

  // Effect to get search params after component mounts
  useEffect(() => {
    // This safely uses the window object only on the client
    const url = new URL(window.location.href);
    const callbackUrl = url.searchParams.get("callbackUrl") || "/admin";
    const from = url.searchParams.get("from");
    
    setSearchParams({
      callbackUrl,
      from
    });
  }, []);

  // Enhanced translations
  const translations = {
    en: {
      title: "Admin Login",
      subtitle: "Restricted Access Portal",
      welcome: "Secure administrator access",
      emailLabel: "Admin Email",
      emailPlaceholder: "Enter admin email address",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter admin password",
      rememberMe: "Remember me",
      loginButton: "Secure Login",
      loginButtonLoading: "Authenticating...",
      userLink: "User Login",
      adminRegisterLink: "Register New Admin",
      errorLogin: "Invalid admin credentials",
      errorBadRequest: "Invalid request format",
      errorLimit: "Too many login attempts. Please try again later.",
      unauthorized: "You are not authorized as an admin",
      sessionExpired: "Your admin session has expired. Please login again.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      loginSuccess: "Admin authentication successful",
      clearForm: "Clear form",
      securityNote: "This portal is for authorized administrators only",
    },
    ne: {
      title: "प्रशासक लग-इन",
      subtitle: "प्रतिबन्धित पहुँच पोर्टल",
      welcome: "सुरक्षित प्रशासक पहुँच",
      emailLabel: "प्रशासक इमेल",
      emailPlaceholder: "प्रशासक इमेल ठेगाना प्रविष्ट गर्नुहोस्",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "प्रशासक पासवर्ड प्रविष्ट गर्नुहोस्",
      rememberMe: "मलाई सम्झनुहोस्",
      loginButton: "सुरक्षित लग-इन",
      loginButtonLoading: "प्रमाणीकरण गर्दै...",
      userLink: "प्रयोगकर्ता लग-इन",
      adminRegisterLink: "नयाँ प्रशासक दर्ता",
      errorLogin: "अमान्य प्रशासक प्रमाणपत्र",
      errorBadRequest: "अमान्य अनुरोध ढाँचा",
      errorLimit: "धेरै लगइन प्रयासहरू। कृपया पछि फेरि प्रयास गर्नुहोस्।",
      unauthorized: "तपाईं प्रशासकको रूपमा अधिकृत हुनुहुन्न",
      sessionExpired: "तपाईंको प्रशासक सत्र समाप्त भएको छ। कृपया फेरि लगइन गर्नुहोस्।",
      showPassword: "पासवर्ड देखाउनुहोस्",
      hidePassword: "पासवर्ड लुकाउनुहोस्",
      loginSuccess: "प्रशासक प्रमाणीकरण सफल भयो",
      clearForm: "फारम खाली गर्नुहोस्",
      securityNote: "यो पोर्टल अधिकृत प्रशासकहरूका लागि मात्र हो",
    },
  };

  // Type assertion to access translations with language as key
  const t = translations[language as keyof typeof translations];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Focus on email input when component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    
    // Check if user was redirected due to session expiration
    if (searchParams.from === "session-expired") {
      toast.warning(t.sessionExpired);
    }
  }, [searchParams.from, t.sessionExpired]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Clear form
  const handleClearForm = () => {
    form.reset();
    setError(null);
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setIsLoading(true);
    
    // Prevent brute force attacks with rate limiting
    if (loginAttempts >= 5) {
      setError(t.errorLimit);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: searchParams.callbackUrl,
      });

      if (result?.error) {
        setLoginAttempts(prev => prev + 1);
        setError(t.errorLogin);
      } else {
        // Check if user is an admin
        const checkRes = await fetch("/api/auth/check-admin");
        
        if (!checkRes.ok) {
          throw new Error(t.errorBadRequest);
        }
        
        const checkData = await checkRes.json();
        
        if (checkData.isAdmin) {
          // Store in localStorage if "Remember Me" is checked
          if (data.rememberMe) {
            localStorage.setItem("rememberedAdminEmail", data.email);
          } else {
            localStorage.removeItem("rememberedAdminEmail");
          }
          
          // Success notification
          toast.success(t.loginSuccess);
          
          // Navigate to admin dashboard
          router.push(searchParams.callbackUrl);
          router.refresh();
        } else {
          // Sign out if not an admin
          await signIn("credentials", { redirect: false }); 
          setError(t.unauthorized);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginAttempts(prev => prev + 1);
      setError(t.errorLogin);
    } finally {
      setIsLoading(false);
    }
  };

  // Set remembered email if it exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedAdminEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-4 py-8 md:py-12">
        <Card className="w-full shadow-lg border-gray-300 border-2 overflow-hidden">
          {/* Top bar with Nepal flag colors */}
          <div className="bg-gradient-to-r from-red-700 to-blue-900 h-3 w-full"></div>
          
          <CardHeader className="space-y-2 text-center pt-8 pb-4">
            <div className="flex justify-center items-center space-x-3">
              <div 
                className="w-16 h-16 relative" 
                role="img" 
                aria-label="Nepal Government Emblem"
              >
                <Image
                  src="/images/nepal-emblem.png"
                  alt="Nepal Government Emblem"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
              <Shield className="h-12 w-12 text-red-800 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">{t.title}</CardTitle>
            <CardDescription className="text-red-800 font-medium">{t.subtitle}</CardDescription>
            <p className="text-sm text-gray-600 mt-1">{t.welcome}</p>
            <Separator className="mt-3 bg-red-700" />
          </CardHeader>
          
          <CardContent className="space-y-4 pt-3 pb-5">
            {error && (
              <Alert variant="destructive" className="animate-shake border-red-500 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">{t.emailLabel}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder={t.emailPlaceholder}
                            className="bg-gray-50 border-gray-300 pl-10"
                            type="email" 
                            autoComplete="email"
                            disabled={isLoading}
                            ref={emailInputRef}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">{t.passwordLabel}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder={t.passwordPlaceholder}
                            type={showPassword ? "text" : "password"}
                            className="bg-gray-50 border-gray-300 pl-10 pr-10"
                            autoComplete="current-password"
                            disabled={isLoading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? t.hidePassword : t.showPassword}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            id="remember-me"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="remember-me"
                          className="text-sm font-normal cursor-pointer"
                        >
                          {t.rememberMe}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500"
                    onClick={handleClearForm}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {t.clearForm}
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-800 hover:bg-red-900 transition-all flex items-center justify-center" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.loginButtonLoading}
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        {t.loginButton}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-3">
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {t.securityNote}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center gap-2 pt-0 pb-4">
            <Link 
              href="/login" 
              className="text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors"
            >
              {t.userLink}
            </Link>
            <Link 
              href="/admin/register" 
              className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              {t.adminRegisterLink}
            </Link>
          </CardFooter>
          
          {/* Bottom bar with Nepal flag colors */}
          <div className="bg-gradient-to-r from-red-700 to-blue-900 h-3 w-full"></div>
        </Card>
      </div>
    </div>
  );
}