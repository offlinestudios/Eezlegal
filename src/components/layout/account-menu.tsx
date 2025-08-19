'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Crown,
  FileText,
  Zap,
  Download,
  Keyboard
} from 'lucide-react'

interface AccountMenuProps {
  onOpenSettings: () => void
}

export function AccountMenu({ onOpenSettings }: AccountMenuProps) {
  const { user, logout, authState } = useAuth()

  const handleBillingPortal = async () => {
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
    }
  }

  const getPlanBadge = () => {
    if (!user) return null
    
    const colors = {
      FREE: 'bg-gray-100 text-gray-800',
      PLUS: 'bg-blue-100 text-blue-800',
      PRO: 'bg-purple-100 text-purple-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[user.plan]}`}>
        {user.plan}
      </span>
    )
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium truncate">{user.email}</div>
            <div className="text-xs text-muted-foreground">{getPlanBadge()}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64" 
        align="end" 
        side="top"
        role="menu"
        aria-label="Account menu"
      >
        {/* Identity Section */}
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.email}</div>
              <div className="flex items-center gap-2 mt-1">
                {getPlanBadge()}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Upgrade Plan (only for free users) */}
        {user.plan === 'FREE' && (
          <>
            <DropdownMenuItem 
              role="menuitem"
              className="cursor-pointer"
              onClick={() => {/* TODO: Open upgrade modal */}}
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade plan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Settings */}
        <DropdownMenuItem 
          role="menuitem"
          className="cursor-pointer"
          onClick={onOpenSettings}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        {/* Help Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger role="menuitem">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent role="menu" aria-label="Help submenu">
            <DropdownMenuItem role="menuitem" className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help center
            </DropdownMenuItem>
            <DropdownMenuItem role="menuitem" className="cursor-pointer">
              <Zap className="mr-2 h-4 w-4" />
              Release notes
            </DropdownMenuItem>
            <DropdownMenuItem role="menuitem" className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              Terms & policies
            </DropdownMenuItem>
            <DropdownMenuItem role="menuitem" className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              Download apps
            </DropdownMenuItem>
            <DropdownMenuItem role="menuitem" className="cursor-pointer">
              <Keyboard className="mr-2 h-4 w-4" />
              Keyboard shortcuts
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem 
          role="menuitem"
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

