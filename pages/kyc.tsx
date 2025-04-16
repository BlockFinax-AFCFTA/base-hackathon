import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Upload 
} from 'lucide-react';

import { useWeb3 } from '../hooks/useWeb3';
import { useKYC, KYCStatus } from '../hooks/useKYC';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';

// Basic KYC form schema
const basicKYCSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  contactDetails: z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
  }),
});

// Advanced KYC form schema
const advancedKYCSchema = z.object({
  nationality: z.string().min(1, "Nationality is required"),
  residenceCountry: z.string().min(1, "Country of residence is required"),
  idType: z.string().min(1, "ID type is required"),
  idNumber: z.string().min(1, "ID number is required"),
  taxIdNumber: z.string().optional(),
  businessAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State/Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  companyName: z.string().optional(),
  companyType: z.string().optional(),
  businessCategory: z.string().optional(),
});

const KYCPage: NextPage = () => {
  const router = useRouter();
  const { isLoggedIn, isInitializing, user } = useWeb3();
  const { kycStatus, kycData, submitKYCMutation } = useKYC();
  
  // State for active tab 
  const [activeTab, setActiveTab] = useState<string>("basic");
  
  // Form for Basic KYC
  const basicForm = useForm<z.infer<typeof basicKYCSchema>>({
    resolver: zodResolver(basicKYCSchema),
    defaultValues: {
      firstName: kycData?.firstName || "",
      lastName: kycData?.lastName || "",
      dateOfBirth: kycData?.dateOfBirth || "",
      contactDetails: {
        email: kycData?.contactDetails?.email || "",
        phone: kycData?.contactDetails?.phone || "",
      },
    },
  });
  
  // Form for Advanced KYC
  const advancedForm = useForm<z.infer<typeof advancedKYCSchema>>({
    resolver: zodResolver(advancedKYCSchema),
    defaultValues: {
      nationality: kycData?.nationality || "",
      residenceCountry: kycData?.residenceCountry || "",
      idType: kycData?.idType || "",
      idNumber: kycData?.idNumber || "",
      taxIdNumber: kycData?.taxIdNumber || "",
      businessAddress: {
        street: kycData?.businessAddress?.street || "",
        city: kycData?.businessAddress?.city || "",
        state: kycData?.businessAddress?.state || "",
        postalCode: kycData?.businessAddress?.postalCode || "",
        country: kycData?.businessAddress?.country || "",
      },
      companyName: kycData?.companyName || "",
      companyType: kycData?.companyType || "",
      businessCategory: kycData?.businessCategory || "",
    },
  });
  
  // Handle form submissions
  const onBasicSubmit = async (data: z.infer<typeof basicKYCSchema>) => {
    try {
      await submitKYCMutation.mutateAsync({
        ...data,
        kycLevel: 'BASIC',
      });
    } catch (error) {
      console.error('Error submitting basic KYC:', error);
    }
  };
  
  const onAdvancedSubmit = async (data: z.infer<typeof advancedKYCSchema>) => {
    try {
      await submitKYCMutation.mutateAsync({
        ...data,
        kycLevel: 'ADVANCED',
      });
    } catch (error) {
      console.error('Error submitting advanced KYC:', error);
    }
  };
  
  // Redirect to home if not logged in
  React.useEffect(() => {
    if (!isLoggedIn && !isInitializing) {
      router.push('/');
    }
  }, [isLoggedIn, isInitializing, router]);
  
  // Loading state
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Not logged in
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }
  
  // Render forms first, verification notices after
  return (
    <>
      <Head>
        <title>KYC Verification | BlockFinaX</title>
      </Head>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KYC Verification</h1>
          <p className="text-muted-foreground">
            Complete your verification to access all platform features
          </p>
        </div>
        
        {/* KYC Forms Section (shown first) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Verification</TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              disabled={kycStatus !== KYCStatus.BASIC_COMPLETED && kycStatus !== KYCStatus.ADVANCED_PENDING && kycStatus !== KYCStatus.ADVANCED_VERIFIED}
            >
              Advanced Verification
            </TabsTrigger>
          </TabsList>
          
          {/* Basic KYC Form */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Verification</CardTitle>
                <CardDescription>
                  Provide your basic information to gain access to standard platform features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...basicForm}>
                  <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={basicForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={basicForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={basicForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={basicForm.control}
                      name="contactDetails.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={basicForm.control}
                      name="contactDetails.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={submitKYCMutation.isPending || kycStatus === KYCStatus.BASIC_COMPLETED || kycStatus === KYCStatus.ADVANCED_PENDING || kycStatus === KYCStatus.ADVANCED_VERIFIED}
                    >
                      {submitKYCMutation.isPending ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Basic Verification'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              {kycStatus === KYCStatus.BASIC_COMPLETED && (
                <CardFooter className="bg-green-50 text-green-800 border-t p-4">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Basic verification completed successfully</span>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Advanced KYC Form */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Verification</CardTitle>
                <CardDescription>
                  Complete advanced verification to enable international trade features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...advancedForm}>
                  <form onSubmit={advancedForm.handleSubmit(onAdvancedSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <Separator />
                    </div>
                  
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={advancedForm.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select nationality" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="JP">Japan</SelectItem>
                                <SelectItem value="CN">China</SelectItem>
                                <SelectItem value="IN">India</SelectItem>
                                <SelectItem value="BR">Brazil</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={advancedForm.control}
                        name="residenceCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country of Residence</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="JP">Japan</SelectItem>
                                <SelectItem value="CN">China</SelectItem>
                                <SelectItem value="IN">India</SelectItem>
                                <SelectItem value="BR">Brazil</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={advancedForm.control}
                        name="idType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ID type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="drivers_license">Driver's License</SelectItem>
                                <SelectItem value="national_id">National ID</SelectItem>
                                <SelectItem value="residence_permit">Residence Permit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={advancedForm.control}
                        name="idNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={advancedForm.control}
                      name="taxIdNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tax ID number" {...field} />
                          </FormControl>
                          <FormDescription>
                            For businesses, please enter your business tax ID
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Business Information (Optional)</h3>
                      <Separator />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={advancedForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={advancedForm.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Type (Optional)</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="llc">LLC</SelectItem>
                                <SelectItem value="corporation">Corporation</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                                <SelectItem value="nonprofit">Nonprofit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={advancedForm.control}
                      name="businessCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Category (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="agriculture">Agriculture</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="financial_services">Financial Services</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="logistics">Logistics & Transportation</SelectItem>
                              <SelectItem value="construction">Construction</SelectItem>
                              <SelectItem value="energy">Energy</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Address Information</h3>
                      <Separator />
                    </div>
                    
                    <FormField
                      control={advancedForm.control}
                      name="businessAddress.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={advancedForm.control}
                        name="businessAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={advancedForm.control}
                        name="businessAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={advancedForm.control}
                        name="businessAddress.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={advancedForm.control}
                        name="businessAddress.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="JP">Japan</SelectItem>
                                <SelectItem value="CN">China</SelectItem>
                                <SelectItem value="IN">India</SelectItem>
                                <SelectItem value="BR">Brazil</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Document Upload</h3>
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        Please upload clear images of the following documents. Document upload will be available in the final version.
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">ID Document</p>
                        <p className="text-xs text-muted-foreground">Upload front and back of your ID</p>
                        <Button variant="outline" size="sm" className="mt-2" disabled>
                          Upload ID
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">Proof of Address</p>
                        <p className="text-xs text-muted-foreground">Recent utility bill or bank statement</p>
                        <Button variant="outline" size="sm" className="mt-2" disabled>
                          Upload Proof
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={submitKYCMutation.isPending || kycStatus === KYCStatus.ADVANCED_VERIFIED}
                    >
                      {submitKYCMutation.isPending ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Advanced Verification'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              {kycStatus === KYCStatus.ADVANCED_PENDING && (
                <CardFooter className="bg-yellow-50 text-yellow-800 border-t p-4">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>Advanced verification is pending review (1-3 business days)</span>
                </CardFooter>
              )}
              
              {kycStatus === KYCStatus.ADVANCED_VERIFIED && (
                <CardFooter className="bg-green-50 text-green-800 border-t p-4">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Advanced verification completed successfully</span>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* KYC Status Card (shown after forms) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center
                    ${kycStatus === KYCStatus.BASIC_COMPLETED || kycStatus === KYCStatus.ADVANCED_PENDING || kycStatus === KYCStatus.ADVANCED_VERIFIED 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-500'}`
                  }>
                    {kycStatus === KYCStatus.BASIC_COMPLETED || kycStatus === KYCStatus.ADVANCED_PENDING || kycStatus === KYCStatus.ADVANCED_VERIFIED ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Basic Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Enables basic platform access and standard features
                    </p>
                  </div>
                </div>
                <div>
                  {kycStatus === KYCStatus.BASIC_COMPLETED || kycStatus === KYCStatus.ADVANCED_PENDING || kycStatus === KYCStatus.ADVANCED_VERIFIED ? (
                    <span className="text-green-600 font-medium">Completed</span>
                  ) : (
                    <span className="text-muted-foreground">Incomplete</span>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center
                    ${kycStatus === KYCStatus.ADVANCED_VERIFIED 
                      ? 'bg-green-100 text-green-800' 
                      : kycStatus === KYCStatus.ADVANCED_PENDING
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-500'}`
                  }>
                    {kycStatus === KYCStatus.ADVANCED_VERIFIED ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : kycStatus === KYCStatus.ADVANCED_PENDING ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Advanced Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Required for international trade and advanced features
                    </p>
                  </div>
                </div>
                <div>
                  {kycStatus === KYCStatus.ADVANCED_VERIFIED ? (
                    <span className="text-green-600 font-medium">Verified</span>
                  ) : kycStatus === KYCStatus.ADVANCED_PENDING ? (
                    <span className="text-yellow-600 font-medium">Pending Review</span>
                  ) : (
                    <span className="text-muted-foreground">
                      {kycStatus === KYCStatus.BASIC_COMPLETED ? 'Not Started' : 'Complete Basic First'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default KYCPage;