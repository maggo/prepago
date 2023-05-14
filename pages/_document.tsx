import { Head, Html, Main, NextScript } from "next/document"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body className={fontSans.variable}>
        <Main />
        <TailwindIndicator />
        <NextScript />
      </body>
    </Html>
  )
}
