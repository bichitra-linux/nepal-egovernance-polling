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
import { Eye, EyeOff, AlertTriangle, Loader2, Info, Lock, Mail } from "lucide-react";
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

export default function Login() {
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
    callbackUrl: "/dashboard",
    from: null
  });

  // Effect to get search params after component mounts
  useEffect(() => {
    // This safely uses the window object only on the client
    const url = new URL(window.location.href);
    const callbackUrl = url.searchParams.get("callbackUrl") || "/dashboard";
    const from = url.searchParams.get("from");
    
    setSearchParams({
      callbackUrl,
      from
    });
  }, []);
  
  // Translations
  const translations = {
    en: {
      title: "User Login",
      subtitle: "Digital Government of Nepal",
      welcome: "Welcome back",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email address",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      loginButton: "Login",
      loginButtonLoading: "Logging in...",
      registerLink: "Don't have an account? Register here",
      adminLink: "Admin Login",
      errorLogin: "Invalid email or password",
      errorLimit: "Too many login attempts. Please try again later.",
      sessionExpired: "Your session has expired. Please login again.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      requiredField: "This field is required",
    },
    ne: {
      title: "प्रयोगकर्ता लग-इन",
      subtitle: "नेपाल डिजिटल सरकार",
      welcome: "फेरि स्वागत छ",
      emailLabel: "इमेल ठेगाना",
      emailPlaceholder: "आफ्नो इमेल ठेगाना प्रविष्ट गर्नुहोस्",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्",
      rememberMe: "मलाई सम्झनुहोस्",
      forgotPassword: "पासवर्ड बिर्सनुभयो?",
      loginButton: "लग-इन",
      loginButtonLoading: "लग-इन गर्दै...",
      registerLink: "खाता छैन? यहाँ दर्ता गर्नुहोस्",
      adminLink: "प्रशासक लग-इन",
      errorLogin: "अमान्य इमेल वा पासवर्ड",
      errorLimit: "धेरै लगइन प्रयासहरू। कृपया पछि फेरि प्रयास गर्नुहोस्।",
      sessionExpired: "तपाईंको सत्र समाप्त भएको छ। कृपया फेरि लगइन गर्नुहोस्।",
      showPassword: "पासवर्ड देखाउनुहोस्",
      hidePassword: "पासवर्ड लुकाउनुहोस्",
      requiredField: "यो क्षेत्र आवश्यक छ",
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

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setIsLoading(true);
    
    // Simulating rate limiting
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
        // Store in localStorage if "Remember Me" is checked
        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        
        // Clear any previous errors
        toast.success(language === "ne" ? "सफलतापूर्वक लग इन गरियो" : "Successfully logged in");
        router.push(searchParams.callbackUrl);
        router.refresh();
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
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-4 py-8 md:py-12">
        <Card className="w-full shadow-lg border-gray-200 overflow-hidden">
          {/* Top bar with Nepal flag colors */}
          <div className="bg-gradient-to-r from-red-700 to-blue-900 h-2 w-full"></div>
          
          <CardHeader className="space-y-2 text-center pt-8 pb-4">
            <div 
              className="mx-auto w-20 h-20 relative mb-2" 
              role="img" 
              aria-label="Nepal Government Emblem"
            >
              <Image
                src="/images/nepal-emblem.png"
                alt="Nepal Government Emblem"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">{t.title}</CardTitle>
            <CardDescription className="text-red-800 font-medium">{t.subtitle}</CardDescription>
            <p className="text-sm text-gray-500">{t.welcome}</p>
            <Separator className="mt-4 bg-red-700" />
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4 pb-6">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="sr-only">Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-medium">{t.passwordLabel}</FormLabel>
                        <Link 
                          href="/forgot-password" 
                          className="text-xs text-blue-700 hover:text-blue-800 hover:underline"
                          tabIndex={3}
                        >
                          {t.forgotPassword}
                        </Link>
                      </div>
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
                            tabIndex={2}
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
                  type="submit" 
                  className="w-full bg-blue-800 hover:bg-blue-900 transition-all" 
                  disabled={isLoading}
                  tabIndex={1}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.loginButtonLoading}
                    </>
                  ) : (
                    t.loginButton
                  )}
                </Button>
              </form>
            </Form>

            {loginAttempts > 2 && (
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {language === "ne" 
                    ? "निरन्तर असफल लगइन प्रयासहरूले तपाईंको खातालाई अस्थायी रूपमा लक गर्न सक्छ।"
                    : "Continued failed login attempts may temporarily lock your account."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col items-center gap-3 pt-0 pb-6">
            <Link 
              href="/register" 
              className="text-sm text-blue-700 hover:text-blue-800 hover:underline transition-colors"
            >
              {t.registerLink}
            </Link>
            <Link 
              href="/admin/login" 
              className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              {t.adminLink}
            </Link>
          </CardFooter>
          
          {/* Bottom bar with Nepal flag colors */}
          <div className="bg-gradient-to-r from-red-700 to-blue-900 h-2 w-full"></div>
        </Card>
      </div>
    </div>
  );
}