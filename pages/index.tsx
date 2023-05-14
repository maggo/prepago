import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <div className="centered-container space-y-8">
      <header className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Prepago
        </h1>
        <p>Prepaid crypto cards for the masses</p>
      </header>

      <Button asChild className="w-full max-w-xs">
        <Link href="/issue">Issue a new Card</Link>
      </Button>
    </div>
  )
}
