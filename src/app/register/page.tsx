"use client";

import { useState } from "react";
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

export default function Register() {
  const router = useRouter();
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "User Registration",
      subtitle: "Digital Government of Nepal",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      registerButton: "Register",
      loginLink: "Already have an account? Login here",
      passwordMismatch: "Passwords do not match",
      errorRegister: "Registration failed. Please try again.",
    },
    ne: {
      title: "प्रयोगकर्ता दर्ता",
      subtitle: "नेपाल डिजिटल सरकार",
      nameLabel: "पूरा नाम",
      emailLabel: "इमेल ठेगाना",
      passwordLabel: "पासवर्ड",
      confirmPasswordLabel: "पासवर्ड पुष्टि गर्नुहोस्",
      registerButton: "दर्ता गर्नुहोस्",
      loginLink: "पहिले नै खाता छ? यहाँ लगइन गर्नुहोस्",
      passwordMismatch: "पासवर्ड मेल खाँदैन",
      errorRegister: "दर्ता असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।",
    },
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      if (response.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await response.json();
        setError(data.message || t.errorRegister);
      }
    } catch (error) {
      setError(t.errorRegister);
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
              <Label htmlFor="name" className="font-medium">{t.nameLabel}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-50 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
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
                minLength={8}
                className="bg-gray-50 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">{t.confirmPasswordLabel}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="bg-gray-50 border-gray-300"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-800 hover:bg-blue-900" 
              disabled={loading}
            >
              {loading ? "Processing..." : t.registerButton}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center pt-0">
          <Link href="/login" className="text-sm text-blue-700 hover:underline">
            {t.loginLink}
          </Link>
        </CardFooter>
        
        {/* Bottom bar with Nepal flag colors */}
        <div className="bg-gradient-to-r from-red-700 to-blue-900 h-2 w-full mt-4"></div>
      </Card>
    </div>
  );
}