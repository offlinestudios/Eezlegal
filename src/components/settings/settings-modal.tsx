'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Palette, 
  Shield, 
  CreditCard, 
  Keyboard, 
  Info,
  Crown,
  Download,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    name?: string
    plan: 'FREE' | 'PLUS' | 'PRO'
    avatarUrl?: string
  }
  onUpdateProfile: (data: { name?: string; avatarUrl?: string }) => Promise<void>
  onDeleteAccount: () => Promise<void>
  onExportData: () => Promise<void>
  onOpenBillingPortal: () => Promise<void>
}

type SettingsSection = 'profile' | 'appearance' | 'privacy' | 'billing' | 'shortcuts' | 'about'

export function SettingsModal({
  open,
  onClose,
  user,
  onUpdateProfile,
  onDeleteAccount,
  onExportData,
  onOpenBillingPortal
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [name, setName] = useState(user.name || '')
  const [loading, setLoading] = useState(false)

  const sections = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'privacy' as const, label: 'Data & Privacy', icon: Shield },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'shortcuts' as const, label: 'Shortcuts', icon: Keyboard },
    { id: 'about' as const, label: 'About', icon: Info },
  ]

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      await onUpdateProfile({ name })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              <p className="text-muted-foreground">
                Theme and display preferences will be available in a future update.
              </p>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Data & Privacy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download all your conversations and data
                    </p>
                  </div>
                  <Button variant="outline" onClick={onExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={onDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Billing & Subscription</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Current Plan</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        user.plan === 'FREE' && "bg-gray-100 text-gray-800",
                        user.plan === 'PLUS' && "bg-blue-100 text-blue-800",
                        user.plan === 'PRO' && "bg-purple-100 text-purple-800"
                      )}>
                        {user.plan}
                      </span>
                    </div>
                  </div>
                  {user.plan !== 'FREE' ? (
                    <Button variant="outline" onClick={onOpenBillingPortal}>
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 'shortcuts':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Send message</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-sm">Enter</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>New line</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-sm">Shift + Enter</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>New chat</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + N</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Search conversations</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + K</kbd>
                </div>
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">About EezLegal</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Version</h4>
                  <p className="text-sm text-muted-foreground">1.0.0</p>
                </div>
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered legal assistant that makes legal documents and advice accessible to everyone.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Support</h4>
                  <p className="text-sm text-muted-foreground">
                    For help and support, visit our help center or contact us at support@eezlegal.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-hidden p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle id="settings-title">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r bg-muted/30 p-4">
            <nav role="navigation" aria-label="Settings navigation">
              <ul className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                          "hover:bg-accent focus:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
                          activeSection === section.id && "bg-accent"
                        )}
                        role="tab"
                        aria-selected={activeSection === section.id}
                        tabIndex={activeSection === section.id ? 0 : -1}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{section.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto" role="tabpanel">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

