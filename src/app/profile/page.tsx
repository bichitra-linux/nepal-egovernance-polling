"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { AlertCircle, Camera, Check, CloudUpload, Key, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, MapPin, FileText } from "lucide-react";
import nepalData from "../../lib/nepal-data";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z
    .string()
    .regex(/^\+977\d{10}$/, {
      message: "Phone number must start with +977 followed by 10 digits",
    })
    .optional()
    .nullable(),
  province: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  localLevel: z.string().optional().nullable(),
  citizenshipNo: z.string().optional().nullable(),
  nationalIdNo: z.string().optional().nullable(),
  voterIdNo: z.string().optional().nullable(),
  image: z
    .any()
    .optional()
    .refine((files) => {
      // Skip validation on server
      if (typeof window === "undefined") return true;
      if (!files || files.length === 0) return true;
      return files.length === 1;
    }, "Please upload only one file")
    .refine((files) => {
      // Skip validation on server
      if (typeof window === "undefined") return true;
      if (!files || files.length === 0) return true;
      return files[0].size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine((files) => {
      // Skip validation on server
      if (typeof window === "undefined") return true;
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema> & {
  image?: FileList | null;
  phoneNumber?: string | null;
  province?: string | null;
  district?: string | null;
  localLevel?: string | null;
  citizenshipNo?: string | null;
  nationalIdNo?: string | null;
  voterIdNo?: string | null;
};
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translations
  const t = {
    profile: language === "ne" ? "प्रोफाइल" : "Profile",
    yourDetails: language === "ne" ? "तपाईंको विवरण" : "Your Details",
    profileSettings: language === "ne" ? "प्रोफाइल सेटिङहरू" : "Profile Settings",
    security: language === "ne" ? "सुरक्षा" : "Security",
    personalInfo: language === "ne" ? "व्यक्तिगत जानकारी" : "Personal Information",
    updateYourInfo:
      language === "ne"
        ? "तपाईंको व्यक्तिगत जानकारी अपडेट गर्नुहोस्"
        : "Update your personal information",
    name: language === "ne" ? "नाम" : "Name",
    email: language === "ne" ? "इमेल" : "Email",
    profilePicture: language === "ne" ? "प्रोफाइल तस्वीर" : "Profile Picture",
    uploadPicture: language === "ne" ? "तस्वीर अपलोड गर्नुहोस्" : "Upload Picture",
    changeImage: language === "ne" ? "तस्वीर परिवर्तन गर्नुहोस्" : "Change Image",
    removeImage: language === "ne" ? "तस्वीर हटाउनुहोस्" : "Remove Image",
    role: language === "ne" ? "भूमिका" : "Role",
    joinedOn: language === "ne" ? "सदस्यता लिएको मिति" : "Joined on",
    passwordChange: language === "ne" ? "पासवर्ड परिवर्तन" : "Password Change",
    currentPassword: language === "ne" ? "हालको पासवर्ड" : "Current Password",
    newPassword: language === "ne" ? "नयाँ पासवर्ड" : "New Password",
    confirmPassword: language === "ne" ? "पासवर्ड पुष्टि गर्नुहोस्" : "Confirm Password",
    update: language === "ne" ? "अपडेट गर्नुहोस्" : "Update",
    cancel: language === "ne" ? "रद्द गर्नुहोस्" : "Cancel",
    saveChanges: language === "ne" ? "परिवर्तनहरू सेभ गर्नुहोस्" : "Save Changes",
    updatedSuccess:
      language === "ne" ? "प्रोफाइल सफलतापूर्वक अपडेट गरियो" : "Profile updated successfully",
    imageUpdated: language === "ne" ? "प्रोफाइल तस्वीर अपडेट भयो" : "Profile picture updated",
    imageRemoved: language === "ne" ? "प्रोफाइल तस्वीर हटाइयो" : "Profile picture removed",
    passwordSuccess:
      language === "ne" ? "पासवर्ड सफलतापूर्वक परिवर्तन गरियो" : "Password changed successfully",
    error: language === "ne" ? "त्रुटि भयो" : "An error occurred",
    loading: language === "ne" ? "लोड गर्दै..." : "Loading...",
    notAuthenticated:
      language === "ne" ? "तपाईं प्रमाणित हुनुभएको छैन" : "You are not authenticated",
    phoneNumber: language === "ne" ? "फोन नम्बर" : "Phone Number",
    phoneNumberHint: language === "ne" ? "+977 देशको कोड सहित" : "With country code +977",
    addressDetails: language === "ne" ? "ठेगाना विवरण" : "Address Details",
    province: language === "ne" ? "प्रदेश" : "Province",
    district: language === "ne" ? "जिल्ला" : "District",
    localLevel: language === "ne" ? "स्थानीय तह" : "Local Level",
    selectProvince: language === "ne" ? "प्रदेश छान्नुहोस्" : "Select Province",
    selectDistrict: language === "ne" ? "जिल्ला छान्नुहोस्" : "Select District",
    selectLocalLevel: language === "ne" ? "स्थानीय तह छान्नुहोस्" : "Select Local Level",
    identificationDetails: language === "ne" ? "पहिचान विवरण" : "Identification Details",
    citizenshipNo: language === "ne" ? "नागरिकता नम्बर" : "Citizenship Number",
    nationalIdNo: language === "ne" ? "राष्ट्रिय परिचयपत्र नम्बर" : "National ID Card Number",
    voterIdNo: language === "ne" ? "मतदाता परिचयपत्र नम्बर" : "Voter ID Number",
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      image: undefined,
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || null,
        phoneNumber: session.user.phoneNumber || "",
        province: session.user.province || null,
        district: session.user.district || null,
        localLevel: session.user.localLevel || null,
        citizenshipNo: session.user.citizenshipNo || "",
        nationalIdNo: session.user.nationalIdNo || "",
        voterIdNo: session.user.voterIdNo || "",
      });

      // Set province and district selectors for cascading dropdowns
      if (session.user.province) {
        setSelectedProvince(session.user.province);
      }
      if (session.user.district) {
        setSelectedDistrict(session.user.district);
      }

      // Set initial profile image if available
      if (session.user.image) {
        setPreviewImage(session.user.image);
      }
    }
  }, [session, form]);

  // Handle province change to update district options
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict(null); // Reset district when province changes
    form.setValue("district", null);
    form.setValue("localLevel", null);
  };

  // Handle district change to update local level options
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    form.setValue("localLevel", null); // Reset local level when district changes
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch("/api/user/remove-profile-picture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove profile picture");
      }

      // Update session and UI
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          image: null,
        },
      });

      toast(t.imageRemoved, {
        description: new Date().toLocaleDateString(),
      });
    } catch (error: unknown) {
      console.error("Error removing profile picture:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(t.error, {
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      setIsUpdating(true);

      // Create form data for multipart/form-data submission to handle files
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.phoneNumber) formData.append("phoneNumber", values.phoneNumber);
      if (values.province) formData.append("province", values.province);
      if (values.district) formData.append("district", values.district);
      if (values.localLevel) formData.append("localLevel", values.localLevel);
      if (values.citizenshipNo) formData.append("citizenshipNo", values.citizenshipNo);
      if (values.nationalIdNo) formData.append("nationalIdNo", values.nationalIdNo);
      if (values.voterIdNo) formData.append("voterIdNo", values.voterIdNo);

      // Append image file if provided
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData, // No Content-Type header needed for FormData
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      // Update the session with new values
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
          image: data.user.image,
          phoneNumber: values.phoneNumber,
          province: values.province,
          district: values.district,
          localLevel: values.localLevel,
          citizenshipNo: values.citizenshipNo,
          nationalIdNo: values.nationalIdNo,
          voterIdNo: values.voterIdNo,
        },
      });

      toast(t.updatedSuccess, {
        description: new Date().toLocaleDateString(),
      });
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(t.error, {
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    try {
      setIsChangingPassword(true);
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to change password");
      }

      passwordForm.reset();

      toast(t.passwordSuccess, {
        description: new Date().toLocaleDateString(),
      });
    } catch (error: unknown) {
      console.error("Error changing password:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(t.error, {
        description: errorMessage,
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  // Display skeleton while loading
  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (status === "unauthenticated") {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
          <p>{t.notAuthenticated}</p>
          <Button onClick={() => router.push("/login")} variant="outline" className="mt-4">
            Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t.profile}</h1>
          <p className="text-muted-foreground">{t.profileSettings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={previewImage || session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {session?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">{session?.user?.name}</h3>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {session?.user?.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm">{session?.user?.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm">{session?.user?.email}</span>
              </div>
              <div className="flex items-center">
                <Key className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm">••••••••</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.yourDetails}</CardTitle>
                <TabsList>
                  <TabsTrigger value="personal">{t.personalInfo}</TabsTrigger>
                  <TabsTrigger value="security">{t.security}</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>{t.updateYourInfo}</CardDescription>
            </CardHeader>

            <CardContent>
              <TabsContent value="personal" className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Image Upload */}
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>{t.profilePicture}</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <Avatar className="h-20 w-20">
                                  <AvatarImage
                                    src={previewImage || session?.user?.image || ""}
                                    alt={session?.user?.name || ""}
                                  />
                                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                                    {session?.user?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                              </div>

                              <div className="flex flex-col gap-2">
                                <input
                                  type="file"
                                  id="image"
                                  className="sr-only"
                                  accept="image/jpeg,image/png,image/webp"
                                  ref={fileInputRef}
                                  onChange={(e) => {
                                    onChange(e.target.files);
                                    handleImageChange(e);
                                  }}
                                  {...(field as Omit<typeof field, "ref">)}
                                />
                                <Label
                                  htmlFor="image"
                                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                                >
                                  <Camera size={16} />
                                  {t.changeImage}
                                </Label>
                                {(previewImage || session?.user?.image) && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={handleRemoveImage}
                                    disabled={isUpdating}
                                  >
                                    {t.removeImage}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.name}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.email}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-6" />
                    <div className="text-lg font-medium mb-4">{t.addressDetails}</div>

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Phone size={16} />
                              {t.phoneNumber}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+9771234567890"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>{t.phoneNumberHint}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Province */}
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} />
                              {t.province}
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleProvinceChange(value);
                            }}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t.selectProvince} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nepalData.provinces.map((province) => (
                                <SelectItem key={province.id} value={province.id}>
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* District - shown only when province is selected */}
                    {selectedProvince && (
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.district}</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleDistrictChange(value);
                              }}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t.selectDistrict} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {nepalData.districts[
                                  selectedProvince as keyof typeof nepalData.districts
                                ]?.map((district) => (
                                  <SelectItem key={district.id} value={district.id}>
                                    {district.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Local Level - shown only when district is selected */}
                    {selectedDistrict &&
                      nepalData.localLevels[
                        selectedDistrict as keyof typeof nepalData.localLevels
                      ] && (
                        <FormField
                          control={form.control}
                          name="localLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.localLevel}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t.selectLocalLevel} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {nepalData.localLevels[
                                    selectedDistrict as keyof typeof nepalData.localLevels
                                  ]?.map((localLevel) => (
                                    <SelectItem key={localLevel.id} value={localLevel.id}>
                                      {localLevel.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                    {/* Identification Documents */}
                    <Separator className="my-6" />
                    <div className="text-lg font-medium mb-4">{t.identificationDetails}</div>

                    {/* Citizenship Number */}
                    <FormField
                      control={form.control}
                      name="citizenshipNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <FileText size={16} />
                              {t.citizenshipNo}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* National ID Card Number */}
                    <FormField
                      control={form.control}
                      name="nationalIdNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.nationalIdNo}</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Voter ID Number */}
                    <FormField
                      control={form.control}
                      name="voterIdNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.voterIdNo}</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isUpdating ? t.loading : t.saveChanges}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="security">
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.currentPassword}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showCurrentPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                <span className="sr-only">
                                  {showCurrentPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.newPassword}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showNewPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                <span className="sr-only">
                                  {showNewPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.confirmPassword}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                <span className="sr-only">
                                  {showConfirmPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isChangingPassword ? t.loading : t.update}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
