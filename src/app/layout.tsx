import type { Metadata } from "next"
import "@fontsource-variable/inter"

import { AppShell } from "@/components/layout/app-shell"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Family Atlas",
    template: "%s | Family Atlas",
  },
  description: "A quiet, source-grounded family history atlas.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
