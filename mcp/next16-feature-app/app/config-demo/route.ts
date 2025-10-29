import { NextResponse } from 'next/server'

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = 30
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export async function GET() {
  return NextResponse.json({
    dynamic,
    dynamicParams,
    revalidate,
    fetchCache,
    runtime,
    preferredRegion,
  })
}