import { Button } from "@/components/ui/button"

export default function KeysPage() {
  return (
    <div className="centered-container space-y-8 text-center">
      <header className="space-y-2">
        <div className="text-8xl">✨</div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Success
        </h1>
      </header>

      <p>Your cards are ready to be used. You have xx cards with xx USDC.</p>
      <Button className="w-full max-w-xs">Download Cards PDF</Button>
    </div>
  )
}
