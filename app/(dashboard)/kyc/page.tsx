'use client'

import { useState } from 'react'
import { useWeb3 } from '@/hooks/useWeb3'
import { useKYC, KYCData } from '@/hooks/useKYC'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  FileText, 
  Shield,
  Building2, 
  User,
  Loader2
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function KYCPage() {
  const { user } = useWeb3()
  const { submitKYC, isLoading } = useKYC(user?.id)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState<KYCData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    residenceCountry: '',
    idType: '',
    idNumber: '',
    idExpiryDate: '',
    taxIdNumber: '',
    companyName: '',
    companyRegistrationNumber: '',
    companyType: '',
    businessCategory: '',
    yearEstablished: undefined,
    annualRevenue: undefined,
    employeeCount: undefined,
    businessAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    contactDetails: {
      email: '',
      phone: '',
    },
    documentVerification: {
      identityDocument: '',
      proofOfAddress: '',
      companyRegistration: '',
      taxCertificate: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof KYCData] as object,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleNumberChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : parseInt(value, 10)
    }))
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      await submitKYC(formData)
      toast({
        title: 'KYC submitted successfully',
        description: 'Your identity verification request has been submitted and is under review.'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Failed to submit KYC data'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getStatusBadge = () => {
    if (!user) return null
    
    switch (user.kycStatus) {
      case 'VERIFIED':
        return (
          <div className="flex items-center text-sm font-medium text-green-600">
            <CheckCircle2 className="mr-1 h-4 w-4" /> Verified
          </div>
        )
      case 'PENDING':
        return (
          <div className="flex items-center text-sm font-medium text-yellow-600">
            <Clock className="mr-1 h-4 w-4" /> Pending Review
          </div>
        )
      case 'REJECTED':
        return (
          <div className="flex items-center text-sm font-medium text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" /> Rejected
          </div>
        )
      default:
        return (
          <div className="flex items-center text-sm font-medium text-gray-600">
            <AlertCircle className="mr-1 h-4 w-4" /> Not Submitted
          </div>
        )
    }
  }
  
  // Check if user has already completed KYC
  const isVerified = user?.kycStatus === 'VERIFIED'
  const isPending = user?.kycStatus === 'PENDING'
  const isRejected = user?.kycStatus === 'REJECTED'
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Identity Verification</h1>
          <p className="text-gray-500 mt-1">
            Complete your identity verification to access all platform features
          </p>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </div>
      
      {isVerified ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700">Verification Complete</h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Your identity has been verified. You now have full access to all platform features.
              </p>
              <div className="mt-8 max-w-xs mx-auto">
                <div className="bg-green-50 rounded-lg p-4 text-left">
                  <h3 className="font-medium text-green-800 flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Verification Status
                  </h3>
                  <p className="text-green-700 mt-1">Approved on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isPending ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold text-yellow-700">Verification In Progress</h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Your identity verification request is currently being reviewed. This typically takes 1-2 business days.
              </p>
              <div className="mt-8 max-w-xs mx-auto">
                <div className="bg-yellow-50 rounded-lg p-4 text-left">
                  <h3 className="font-medium text-yellow-800 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Verification Status
                  </h3>
                  <p className="text-yellow-700 mt-1">Submitted on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Complete Your Identity Verification</CardTitle>
              <CardDescription>
                Please provide accurate information as it appears on your official documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="personal">
                    <User className="h-4 w-4 mr-2" /> Personal
                  </TabsTrigger>
                  <TabsTrigger value="business">
                    <Building2 className="h-4 w-4 mr-2" /> Business
                  </TabsTrigger>
                  <TabsTrigger value="address">
                    <FileText className="h-4 w-4 mr-2" /> Address
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <Upload className="h-4 w-4 mr-2" /> Documents
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select
                        value={formData.nationality}
                        onValueChange={(value) => handleSelectChange('nationality', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="SG">Singapore</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type</Label>
                      <Select
                        value={formData.idType}
                        onValueChange={(value) => handleSelectChange('idType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your ID number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idExpiryDate">ID Expiry Date</Label>
                      <Input
                        id="idExpiryDate"
                        name="idExpiryDate"
                        type="date"
                        value={formData.idExpiryDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxIdNumber">Tax ID Number (Optional)</Label>
                      <Input
                        id="taxIdNumber"
                        name="taxIdNumber"
                        value={formData.taxIdNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your tax ID number"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setActiveTab('business')}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="business" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyRegistrationNumber">Registration Number</Label>
                      <Input
                        id="companyRegistrationNumber"
                        name="companyRegistrationNumber"
                        value={formData.companyRegistrationNumber}
                        onChange={handleInputChange}
                        placeholder="Enter registration number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyType">Company Type</Label>
                      <Select
                        value={formData.companyType}
                        onValueChange={(value) => handleSelectChange('companyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="limited_company">Limited Company</SelectItem>
                          <SelectItem value="corporation">Corporation</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessCategory">Business Category</Label>
                      <Select
                        value={formData.businessCategory}
                        onValueChange={(value) => handleSelectChange('businessCategory', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="financial_services">Financial Services</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearEstablished">Year Established</Label>
                      <Input
                        id="yearEstablished"
                        name="yearEstablished"
                        type="number"
                        value={formData.yearEstablished?.toString() || ''}
                        onChange={(e) => handleNumberChange('yearEstablished', e.target.value)}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRevenue">Annual Revenue (USD)</Label>
                      <Input
                        id="annualRevenue"
                        name="annualRevenue"
                        type="number"
                        value={formData.annualRevenue?.toString() || ''}
                        onChange={(e) => handleNumberChange('annualRevenue', e.target.value)}
                        placeholder="Enter annual revenue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Number of Employees</Label>
                      <Input
                        id="employeeCount"
                        name="employeeCount"
                        type="number"
                        value={formData.employeeCount?.toString() || ''}
                        onChange={(e) => handleNumberChange('employeeCount', e.target.value)}
                        placeholder="Enter employee count"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('personal')}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => setActiveTab('address')}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="address" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress.street">Street Address</Label>
                    <Input
                      id="businessAddress.street"
                      name="businessAddress.street"
                      value={formData.businessAddress?.street || ''}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress.city">City</Label>
                      <Input
                        id="businessAddress.city"
                        name="businessAddress.city"
                        value={formData.businessAddress?.city || ''}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress.state">State/Province</Label>
                      <Input
                        id="businessAddress.state"
                        name="businessAddress.state"
                        value={formData.businessAddress?.state || ''}
                        onChange={handleInputChange}
                        placeholder="Enter state or province"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress.postalCode">Postal Code</Label>
                      <Input
                        id="businessAddress.postalCode"
                        name="businessAddress.postalCode"
                        value={formData.businessAddress?.postalCode || ''}
                        onChange={handleInputChange}
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress.country">Country</Label>
                      <Select
                        value={formData.businessAddress?.country || ''}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          businessAddress: {
                            ...prev.businessAddress as object,
                            country: value
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="SG">Singapore</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactDetails.email">Email Address</Label>
                      <Input
                        id="contactDetails.email"
                        name="contactDetails.email"
                        type="email"
                        value={formData.contactDetails?.email || ''}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactDetails.phone">Phone Number</Label>
                      <Input
                        id="contactDetails.phone"
                        name="contactDetails.phone"
                        value={formData.contactDetails?.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('business')}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => setActiveTab('documents')}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Upload Identity Document</CardTitle>
                        <CardDescription>
                          Upload a clear photo of your passport, national ID, or driver's license
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                          <p className="text-xs text-gray-400">
                            Supported formats: JPG, PNG, PDF (max 5MB)
                          </p>
                          <Button variant="outline" className="mt-4">
                            Browse Files
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Upload Proof of Address</CardTitle>
                        <CardDescription>
                          Upload a utility bill, bank statement, or official letter (not older than 3 months)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                          <p className="text-xs text-gray-400">
                            Supported formats: JPG, PNG, PDF (max 5MB)
                          </p>
                          <Button variant="outline" className="mt-4">
                            Browse Files
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {formData.companyName && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Upload Company Registration</CardTitle>
                          <CardDescription>
                            Upload company incorporation or registration certificate
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                            <p className="text-xs text-gray-400">
                              Supported formats: JPG, PNG, PDF (max 5MB)
                            </p>
                            <Button variant="outline" className="mt-4">
                              Browse Files
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('address')}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Verification
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Verification Process</CardTitle>
              <CardDescription>
                Learn about our identity verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="bg-primary/10 rounded-full p-2 mr-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Verification</h3>
                    <p className="text-sm text-gray-500">
                      Your data is encrypted and securely stored according to industry standards.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-primary/10 rounded-full p-2 mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Review Timeline</h3>
                    <p className="text-sm text-gray-500">
                      Verification typically takes 1-2 business days once all documents are submitted.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-primary/10 rounded-full p-2 mr-4">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Accuracy Matters</h3>
                    <p className="text-sm text-gray-500">
                      Ensure all information provided matches your official documents to avoid delays.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// Need to import this at the bottom to avoid circular dependency
import { ChevronRight, ChevronLeft } from 'lucide-react'