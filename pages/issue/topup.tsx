import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function KeysPage() {
  return (
    <div className="centered-container space-y-8 text-center">
      <header className="space-y-2">
        <div className="text-8xl">👍</div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Top Up
        </h1>
      </header>

      <p>
        Top up your cards now. By pressing the button below you will be sending
        tokens to the card.
      </p>
      <Button asChild className="w-full max-w-xs">
        <Link href="/issue/success">Top Up</Link>
      </Button>
    </div>
  )
}
