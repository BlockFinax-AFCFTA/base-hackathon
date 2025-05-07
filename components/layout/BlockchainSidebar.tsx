'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  Wallet,
  FileText,
  Receipt,
  ChevronRight,
  Menu,
  X,
  FileSpreadsheet
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function BlockchainSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  
  const navigation = [
    {
      name: 'Wallet',
      href: '/wallet',
      icon: Wallet,
      current: pathname === '/wallet',
    },
    {
      name: 'Contracts',
      href: '/contracts',
      icon: FileSpreadsheet,
      current: pathname === '/contracts',
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      current: pathname === '/documents',
    },
    {
      name: 'Invoices',
      href: '/invoices',
      icon: Receipt,
      current: pathname === '/invoices',
    },
  ]

  return (
    <div className={cn('md:block', className)}>
      <div className="block md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative right-0 top-0 md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 sm:max-w-xs">
            <div className="flex justify-between items-center px-4 h-16">
              <div className="font-semibold">Base Network Finance</div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground mb-1",
                    item.current ? "bg-accent text-accent-foreground" : "transparent"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                  {item.current && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground mb-1",
                item.current ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
              {item.current && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}