import { Suspense } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function SuccessContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4">Welcome to EezLegal Plus!</h1>
        <p className="text-muted-foreground mb-8">
          Your subscription is now active. You have unlimited access to all EezLegal features.
        </p>
        <Link href="/chat">
          <Button className="w-full">Start Using EezLegal</Button>
        </Link>
      </div>
    </div>
  )
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

