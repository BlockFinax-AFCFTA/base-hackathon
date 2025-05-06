'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAppContext } from '@/hooks/useAppContext'
import { useWeb3 } from '@/hooks/useWeb3'
import { cn } from '@/lib/utils'
import { 
  CreditCard, 
  FileText, 
  Menu, 
  Home, 
  DollarSign, 
  Wallet,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BASE_NETWORK } from '@/client/src/services/web3Service'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useAppContext()
  const { user, account, networkName, isBaseNetwork, logoutUser } = useWeb3()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  
  const links = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Stablecoin Demo',
      href: '/stablecoin',
      icon: DollarSign,
      highlight: true
    },
    {
      name: 'Wallet',
      href: '/wallet',
      icon: Wallet
    },
    {
      name: 'Invoices',
      href: '/invoice',
      icon: FileText
    },
    {
      name: 'Contracts',
      href: '/contracts',
      icon: CreditCard
    }
  ]
  
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') {
      return false
    }
    return pathname?.startsWith(path)
  }
  
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }
  
  const renderNavLinks = () => {
    return (
      <div className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive(link.href) ? 
                "bg-primary/10 text-primary" : 
                "hover:bg-muted",
              link.highlight && !isActive(link.href) && "bg-primary/5 text-primary"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.name}</span>
            {link.highlight && <Badge variant="outline" className="ml-auto">New</Badge>}
          </Link>
        ))}
      </div>
    )
  }
  
  const renderUserInfo = () => {
    return (
      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.username || 'Guest User'}
            </p>
            {account && (
              <p className="text-xs text-muted-foreground truncate font-mono">
                {formatAddress(account)}
              </p>
            )}
          </div>
          {isBaseNetwork && (
            <Badge variant="outline" className="text-xs">
              {networkName}
            </Badge>
          )}
        </div>
        
        {user && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logoutUser}
            className="w-full mt-2 justify-start px-3"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
      </div>
    )
  }
  
  // Mobile sidebar using Sheet component
  const mobileSidebar = (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center mb-6 mt-2">
            <h3 className="text-lg font-semibold">Base Stablecoin</h3>
          </div>
          {renderNavLinks()}
          {renderUserInfo()}
        </div>
      </SheetContent>
    </Sheet>
  )
  
  // Desktop sidebar
  const desktopSidebar = (
    <div
      className={cn(
        "hidden md:flex h-screen flex-col border-r transition-all overflow-hidden",
        sidebarOpen ? "w-64" : "w-16",
        className
      )}
    >
      <div className="flex h-16 items-center px-4 border-b">
        <div className={cn("flex gap-2 items-center", !sidebarOpen && "justify-center w-full")}>
          <DollarSign className="h-6 w-6 text-primary" />
          {sidebarOpen && <h3 className="text-lg font-semibold">Base Stablecoin</h3>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className={cn("ml-auto", !sidebarOpen && "hidden")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-3">
        {renderNavLinks()}
      </div>
      
      {sidebarOpen && renderUserInfo()}
    </div>
  )
  
  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  )
}