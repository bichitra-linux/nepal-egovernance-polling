"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function AdminLogin() {
  const router = useRouter();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "Admin Login",
      subtitle: "Restricted Access Portal",
      emailLabel: "Admin Email",
      passwordLabel: "Password",
      loginButton: "Secure Login",
      userLink: "User Login",
      adminRegisterLink: "Register New Admin",
      errorLogin: "Invalid admin credentials",
      unauthorized: "You are not authorized as an admin",
    },
    ne: {
      title: "प्रशासक लग-इन",
      subtitle: "प्रतिबन्धित पहुँच पोर्टल",
      emailLabel: "प्रशासक इमेल",
      passwordLabel: "पासवर्ड",
      loginButton: "सुरक्षित लग-इन",
      userLink: "प्रयोगकर्ता लग-इन",
      adminRegisterLink: "नयाँ प्रशासक दर्ता",
      errorLogin: "अमान्य प्रशासक प्रमाणपत्र",
      unauthorized: "तपाईं प्रशासकको रूपमा अधिकृत हुनुहुन्न",
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
        // Check if user is an admin
        const checkRes = await fetch("/api/auth/check-admin");
        const checkData = await checkRes.json();
        
        if (checkData.isAdmin) {
          router.push("/admin");
          router.refresh();
        } else {
          await signIn("credentials", { redirect: false }); // Sign out
          setError(t.unauthorized);
        }
      }
    } catch (error) {
      setError(t.errorLogin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg border-2 border-gray-300">
        {/* Top bar with Nepal flag colors */}
        <div className="bg-gradient-to-r from-red-700 to-blue-900 h-3 w-full"></div>
        
        <CardHeader className="space-y-2 text-center pt-6 pb-3">
          <div className="flex justify-center items-center space-x-3">
            <div className="w-16 h-16 relative">
              <Image
                src="/images/nepal-emblem.png"
                alt="Nepal Government Emblem"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <Shield className="h-10 w-10 text-blue-800" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">{t.title}</CardTitle>
          <CardDescription className="text-red-800 font-medium">{t.subtitle}</CardDescription>
          <Separator className="mt-3 bg-red-700" />
        </CardHeader>
        
        <CardContent className="space-y-4 pt-3 pb-5">
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
                placeholder="admin@example.com"
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
              className="w-full bg-red-800 hover:bg-red-900" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : t.loginButton}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-2 pt-0 pb-4">
          <Link href="/login" className="text-sm text-blue-700 hover:underline">
            {t.userLink}
          </Link>
          <Link href="/admin/register" className="text-xs text-gray-600 hover:underline">
            {t.adminRegisterLink}
          </Link>
        </CardFooter>
        
        {/* Bottom bar with Nepal flag colors */}
        <div className="bg-gradient-to-r from-red-700 to-blue-900 h-3 w-full"></div>
      </Card>
    </div>
  );
}