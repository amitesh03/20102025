import type { Metadata } from 'next'
import { i18n, type Locale } from '../../i18n-config'

export const metadata: Metadata = {
  title: 'i18n within app router - Next.js 16',
  description: 'How to do i18n in Next.js 16 within app router',
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

export default async function Root(props: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const params = await props.params
  const { children } = props

  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}