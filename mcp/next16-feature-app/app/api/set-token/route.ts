import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ message: 'successful' })
  res.cookies.set('token', 'this is a token', { httpOnly: true, path: '/', sameSite: 'lax' })
  return res
}