import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiConfig } from "wagmi"

import { AccountAbstractionProvider } from "@/lib/accountAbstractionContext"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { wagmiClient } from "@/lib/wagmi"
import { ThemeProvider } from "@/components/theme-provider"

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AccountAbstractionProvider>
            <main
              className={cn(
                "flex min-h-screen flex-col bg-background font-sans antialiased",
                fontSans.variable
              )}
            >
              <Component {...pageProps} />
            </main>
          </AccountAbstractionProvider>
        </ThemeProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}
