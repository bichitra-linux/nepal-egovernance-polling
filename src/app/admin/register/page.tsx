"use client";

import { useState } from "react";
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

export default function AdminRegister() {
  const router = useRouter();
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "Admin Registration",
      subtitle: "Secure Registration Portal",
      nameLabel: "Full Name",
      emailLabel: "Admin Email",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      adminCodeLabel: "Admin Authorization Code",
      registerButton: "Register as Admin",
      loginLink: "Already registered? Login here",
      passwordMismatch: "Passwords do not match",
      errorRegister: "Registration failed. Please try again.",
      invalidCode: "Invalid admin authorization code",
    },
    ne: {
      title: "प्रशासक दर्ता",
      subtitle: "सुरक्षित दर्ता पोर्टल",
      nameLabel: "पूरा नाम",
      emailLabel: "प्रशासक इमेल",
      passwordLabel: "पासवर्ड",
      confirmPasswordLabel: "पासवर्ड पुष्टि गर्नुहोस्",
      adminCodeLabel: "प्रशासक प्राधिकरण कोड",
      registerButton: "प्रशासकको रूपमा दर्ता गर्नुहोस्",
      loginLink: "पहिले नै दर्ता? यहाँ लगइन गर्नुहोस्",
      passwordMismatch: "पासवर्ड मेल खाँदैन",
      errorRegister: "दर्ता असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।",
      invalidCode: "अमान्य प्रशासक प्राधिकरण कोड",
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
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, adminCode }),
      });

      if (response.ok) {
        router.push("/admin/login?registered=true");
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
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="font-medium">{t.adminCodeLabel}</Label>
              <Input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                className="bg-gray-50 border-gray-300"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-800 hover:bg-red-900" 
              disabled={loading}
            >
              {loading ? "Processing..." : t.registerButton}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center pt-0 pb-4">
          <Link href="/admin/login" className="text-sm text-blue-700 hover:underline">
            {t.loginLink}
          </Link>
        </CardFooter>
        
        {/* Bottom bar with Nepal flag colors */}
        <div className="bg-gradient-to-r from-red-700 to-blue-900 h-3 w-full"></div>
      </Card>
    </div>
  );
}