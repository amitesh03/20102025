import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const authorization = req.cookies.get('authorization')?.value || ''

  return fetch('https://backend-api.com/api/protected', {
    method: 'GET',
    headers: authorization ? { authorization } : undefined,
    redirect: 'manual',
  })
}