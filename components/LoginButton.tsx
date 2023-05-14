import { useConnect } from "wagmi"

import { Button } from "./ui/button"

export function LoginButton() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  return (
    <div className="space-y-2">
      {connectors.map((connector) => (
        <Button
          className="w-full"
          disabled={!connector.ready || isLoading}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
        </Button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}
