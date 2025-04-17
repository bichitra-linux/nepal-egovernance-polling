"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const router = useRouter();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "User Login",
      subtitle: "Digital Government of Nepal",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      loginButton: "Login",
      registerLink: "Don't have an account? Register here",
      adminLink: "Admin Login",
      errorLogin: "Invalid email or password",
    },
    ne: {
      title: "प्रयोगकर्ता लग-इन",
      subtitle: "नेपाल डिजिटल सरकार",
      emailLabel: "इमेल ठेगाना",
      passwordLabel: "पासवर्ड",
      loginButton: "लग-इन",
      registerLink: "खाता छैन? यहाँ दर्ता गर्नुहोस्",
      adminLink: "प्रशासक लग-इन",
      errorLogin: "अमान्य इमेल वा पासवर्ड",
    },
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.errorLogin);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError(t.errorLogin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        {/* Top bar with Nepal flag colors */}
        <div className="bg-gradient-to-r from-red-700 to-blue-900 h-2 w-full"></div>
        
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="mx-auto w-20 h-20 relative mb-2">
            <Image
              src="/images/nepal-emblem.png"
              alt="Nepal Government Emblem"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">{t.title}</CardTitle>
          <CardDescription className="text-red-800 font-medium">{t.subtitle}</CardDescription>
          <Separator className="mt-4 bg-red-700" />
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4 pb-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">{t.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-300"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-800 hover:bg-blue-900" 
              disabled={loading}
            >
              {loading ? "Loading..." : t.loginButton}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-2 pt-0">
          <Link href="/register" className="text-sm text-blue-700 hover:underline">
            {t.registerLink}
          </Link>
          <Link href="/admin/login" className="text-xs text-gray-500 hover:underline">
            {t.adminLink}
          </Link>
        </CardFooter>
        
        {/* Bottom bar with Nepal flag colors */}
        <div className="bg-gradient-to-r from-red-700 to-blue-900 h-2 w-full mt-4"></div>
      </Card>
    </div>
  );
}