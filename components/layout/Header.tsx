import React from 'react';
import type { LinkProps } from 'next/link';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useWeb3 } from '../../hooks/useWeb3';
import { useAppContext } from '../../hooks/useAppContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { KYCStatus } from '../../hooks/useKYC';
import { getKYCStatusColor, getKYCStatusLabel } from '../../lib/kycBypass';

const Header: React.FC = () => {
  const router = useRouter();
  const { user, isLoggedIn, logoutUser } = useWeb3();
  const { toggleSidebar } = useAppContext();
  
  // Get user's KYC status
  const kycStatus = user?.kycStatus || 'PENDING';
  
  // Get user's initials for avatar
  const getInitials = () => {
    if (!user) return 'U';
    
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    
    return 'U';
  };
  
  // Handle logout
  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };
  
  // Show actual KYC badge with color from the KYC bypass utility
  const getKYCBadge = () => {
    const colorClass = getKYCStatusColor(kycStatus);
    const label = getKYCStatusLabel(kycStatus);
    
    // Display the badge with the appropriate color and label
    return <Badge className={`ml-2 ${colorClass} hover:${colorClass}`}>{label}</Badge>;
  };
  
  return (
    <header className="border-b bg-background z-10">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left Section - Logo and Toggle */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => toggleSidebar()} className="mr-2 lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <NextLink href="/dashboard">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">BlockFinaX</span>
            </div>
          </NextLink>
        </div>
        
        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage || ''} alt={user?.username || 'User'} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1">
                      <span className="text-sm hidden sm:inline-block max-w-[100px] truncate">
                        {user?.username}
                      </span>
                      {getKYCBadge()}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/kyc')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>KYC Verification</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push('/login')}>Login</Button>
              <Button onClick={() => router.push('/register')}>Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;