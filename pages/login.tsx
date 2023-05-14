import { useAccountAbstraction } from "@/lib/accountAbstractionContext"
import { Button } from "@/components/ui/button"

export default function IndexPage() {
  const { loginWeb3Auth, isAuthenticated, ownerAddress, logoutWeb3Auth } =
    useAccountAbstraction()

  return (
    <div className="centered-container space-y-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Login
      </h1>
      <p>Log into your account</p>
      {isAuthenticated ? (
        <>
          <p>
            <code>{ownerAddress}</code>
          </p>
          <Button className="w-full max-w-xs" onClick={() => logoutWeb3Auth()}>
            Log Out
          </Button>
        </>
      ) : (
        <Button className="w-full max-w-xs" onClick={() => loginWeb3Auth()}>
          Log In
        </Button>
      )}
    </div>
  )
}
