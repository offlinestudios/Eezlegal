import { Button } from "@/components/ui/button"
import { MessageSquare, FileText, Scale, Handshake } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">EezLegal</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/chat">
                <Button variant="ghost">Try Free</Button>
              </Link>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">
            A Lawyer in Every Hand
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered legal assistant that makes legal documents and advice accessible to everyone. 
            Get plain English translations, document generation, and expert legal guidance.
          </p>
          <Link href="/chat">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Chatting Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Legal Modes */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Legal Mode
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Plain English</h3>
              <p className="text-muted-foreground">
                Translate complex legal documents into plain English that you can understand.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Document Generator</h3>
              <p className="text-muted-foreground">
                Create professional legal documents tailored to your specific needs.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <Scale className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dispute Resolution</h3>
              <p className="text-muted-foreground">
                Get guidance on resolving disputes and recovering what you&apos;re owed.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <Handshake className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Deal Advisor</h3>
              <p className="text-muted-foreground">
                Get suggestions and strategies to win every deal and negotiation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Personal</h3>
              <div className="text-4xl font-bold mb-6">
                $12.99<span className="text-lg text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Unlimited messages
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  All legal modes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Document upload
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Chat history
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            <div className="border rounded-lg p-8 border-primary">
              <h3 className="text-2xl font-bold mb-4">Business</h3>
              <div className="text-4xl font-bold mb-6">
                $49.99<span className="text-lg text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Everything in Personal
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Advanced features
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Team collaboration
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold">EezLegal</span>
          </div>
          <p className="text-muted-foreground">
            Making legal assistance accessible to everyone through AI technology.
          </p>
        </div>
      </footer>
    </div>
  )
}

