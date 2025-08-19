import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BillingCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 text-center">
        <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4">Upgrade Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          No worries! You can upgrade anytime to unlock unlimited access to EezLegal.
        </p>
        <div className="space-y-3">
          <Link href="/chat">
            <Button className="w-full">Continue with Free Plan</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="w-full">View Pricing</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

