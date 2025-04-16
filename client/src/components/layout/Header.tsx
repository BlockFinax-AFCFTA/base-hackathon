import React, { useState } from 'react';
import { Menu, X, LogOut, User, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { loginUser, createAccount } = useWeb3();
  
  // Basic KYC fields for registration
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(username, password);
    onClose();
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create basic KYC data object
    const kycData = {
      firstName,
      lastName,
      contactDetails: {
        email,
        phone
      },
      kycLevel: 'BASIC', // Indicate this is basic KYC level
    };
    
    // Check if createAccount can handle KYC data
    if (typeof createAccount === 'function') {
      if (createAccount.length >= 3) {
        // Function can accept KYC data
        await createAccount(username, password, kycData);
      } else {
        // Function only accepts username and password
        console.warn('Basic KYC data available but createAccount does not support it');
        await createAccount(username, password);
      }
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" value={tab} onValueChange={(value) => setTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <DialogHeader>
                <DialogTitle>Login to your account</DialogTitle>
                <DialogDescription>
                  Enter your credentials to access your account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Login</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <DialogHeader>
                <DialogTitle>Create your account</DialogTitle>
                <DialogDescription>
                  Register with basic information to create your account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input 
                    id="reg-username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col space-y-2">
                <div className="text-xs text-muted-foreground">
                  By registering, you agree to our terms of service and privacy policy.
                </div>
                <Button type="submit">Register with Basic KYC</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const UserMenu = () => {
  const { user, logoutUser } = useWeb3();
  // Get balance from wallet instead since it's not on the user object
  const balance = '0.00'; // Placeholder, would fetch from wallet
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImage} alt={user?.username} />
            <AvatarFallback className="bg-primary text-white">
              {user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.walletAddress}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/wallet">
            <div className="flex items-center cursor-pointer w-full">
              <Menu className="mr-2 h-4 w-4" />
              <span>Wallet</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const { toggleSidebar } = useAppContext();
  const { isLoggedIn } = useWeb3();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-white border-b border-gray-200">
      <div className="px-4 h-full mx-auto">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="mr-2 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/">
                <h1 className="text-xl font-bold text-blue-700">BlockFinaX</h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10">
              <div className="flex space-x-4">
                <Link href="/">
                  <div className="px-3 py-2 text-sm font-medium text-blue-700 cursor-pointer">Home</div>
                </Link>
                <Link href="/api">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">API</div>
                </Link>
                <Link href="/documentation">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">Documentation</div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* User Menu or Auth Buttons */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLoginDialogOpen(true)}
                  className="flex items-center gap-1 text-gray-700"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setLoginDialogOpen(true)}
                  className="flex items-center gap-1 bg-blue-700"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Button>
                
                <LoginDialog 
                  isOpen={loginDialogOpen}
                  onClose={() => setLoginDialogOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
