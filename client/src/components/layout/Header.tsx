import React, { useState } from 'react';
import { useLanguage, languageOptions, Language } from '../../../../context/LanguageContext';
import { Menu, X, LogOut, User, LogIn, UserPlus, Globe } from 'lucide-react';
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
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
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

const RegisterDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { createAccount } = useWeb3();
  const { translate } = useLanguage();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount(username, password);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleRegister}>
          <DialogHeader>
            <DialogTitle>{translate('actions.register')}</DialogTitle>
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
            <Button type="submit">{translate('actions.register')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Now using the shared LanguageContext module from context/LanguageContext.tsx

// Language switcher dropdown
const LanguageSwitcher = () => {
  const { language, setLanguage, translate } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{translate('language.select')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserMenu = () => {
  const { user, logoutUser } = useWeb3();
  const { translate } = useLanguage();
  
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
          <span>{translate('profile.view')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/wallet">
            <div className="flex items-center cursor-pointer w-full">
              <Menu className="mr-2 h-4 w-4" />
              <span>{translate('wallet.view')}</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{translate('actions.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const { toggleSidebar } = useAppContext();
  const { isLoggedIn } = useWeb3();
  const { translate } = useLanguage();
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mr-2 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-primary">{translate('app.title')}</h1>
          </div>
          <div className="flex items-center">
            {/* Language Switcher - visible regardless of login state */}
            <LanguageSwitcher />
            
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => {
                    setRegisterDialogOpen(true);
                  }}
                  className="flex items-center gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{translate('actions.register')}</span>
                </Button>
                
                <RegisterDialog 
                  isOpen={registerDialogOpen}
                  onClose={() => setRegisterDialogOpen(false)}
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
