import React from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { shortenAddress } from '@/lib/utils';
import { 
  Menu, 
  Bell, 
  Wallet,
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'BlockFinaX', 
  subtitle = 'Blockchain Trade Finance Platform' 
}) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { account, isLoggedIn, user, disconnectWallet, logoutUser, connectWallet } = useWeb3();
  
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  
  const handleLogout = () => {
    disconnectWallet();
    logoutUser();
    setShowProfileMenu(false);
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="relative">
              <div 
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Avatar className="h-8 w-8">
                  {user?.profileImage ? (
                    <AvatarImage src={user.profileImage} alt={user.username} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{user?.username || 'User'}</div>
                  <div className="text-xs text-muted-foreground">{shortenAddress(account)}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-muted"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </button>
                    
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-muted"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet
                    </button>
                    
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-muted"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-muted text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Button 
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => connectWallet()}
          >
            <Wallet className="mr-1 h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;