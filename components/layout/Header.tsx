import React, { useState } from 'react';
import { Menu, X, LogOut, User, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '../ui/button';
import { useWeb3 } from '../../hooks/useWeb3';
import { useAppContext } from '../../hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const LoginDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { loginUser, createAccount } = useWeb3();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(username, password);
    onClose();
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount(username, password);
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
                  Register to create your account and wallet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
              <DialogFooter>
                <Button type="submit">Register</Button>
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
  const balance = user?.balance || '0.00';
  
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
    <header className="sticky top-0 z-30 flex-shrink-0 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-700">BlockFinaX</h1>
            </div>
            <div className="ml-10 flex items-center">
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
                  onClick={() => {
                    setLoginDialogOpen(true);
                  }}
                  className="flex items-center gap-1 bg-blue-700 text-white"
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
