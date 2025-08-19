import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext()
    return NextResponse.json(authContext)
  } catch (error) {
    console.error('Error getting auth context:', error)
    return NextResponse.json({ 
      authState: 'LOGGED_OUT' 
    })
  }
}

