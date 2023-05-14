import { useMemo } from "react"
import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
  predictSafeAddress,
} from "@safe-global/protocol-kit"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Wallet, ethers } from "ethers"
import { Loader2 } from "lucide-react"
import { useAccount, useSigner } from "wagmi"

import { getPrivateKey } from "@/pages/issue/keys"

import { Card } from "./Card"
import { Button } from "./ui/button"

export function DeploySafe({
  privateKey,
  amount,
  currency,
}: {
  privateKey: string
  amount: number
  currency: string
}) {
  const { isConnected, address } = useAccount()
  const { data: signer } = useSigner()

  const ownerAdapter = useMemo(
    () =>
      signer
        ? new EthersAdapter({
            ethers,
            signerOrProvider: signer,
          })
        : undefined,
    [signer]
  )

  const safeAccountConfig: SafeAccountConfig | undefined = address
    ? {
        owners: [address, new Wallet(privateKey).address],
        threshold: 1,
      }
    : undefined

  const { data: predictedSafeAddress, isLoading: safeAddressLoading } =
    useQuery(
      ["safeAddress", ownerAdapter, safeAccountConfig],
      () =>
        predictSafeAddress({
          ethAdapter: ownerAdapter!,
          safeAccountConfig: safeAccountConfig!,
        }),
      { enabled: !!ownerAdapter && !!safeAccountConfig }
    )

  const {
    mutate: deploySafe,
    isLoading,
    error,
    isSuccess,
    data: actualSafeAddress,
  } = useMutation<string, Error>(
    async () => {
      if (!ownerAdapter || !safeAccountConfig) throw new Error("Not logged in")

      const safeFactory = await SafeFactory.create({
        ethAdapter: ownerAdapter!,
      })

      const safe = await safeFactory.deploySafe({ safeAccountConfig })

      return safe.getAddress()
    },
    {
      onSuccess() {},
    }
  )

  console.log(getPrivateKey())

  if (!isConnected) {
    return <p className="text-xl">Please log in to continue…</p>
  }

  if (isSuccess) {
    return (
      <>
        <header className="space-y-2">
          <div className="text-8xl">✨</div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Success
          </h1>
          <p>Your card is funded!</p>
        </header>
        <Card
          isLoading={safeAddressLoading}
          address={actualSafeAddress}
          amount={amount}
          currency={currency}
          privateKey={privateKey}
        />
        <p>
          Your card is available on-chain at <code>{actualSafeAddress}</code>!
        </p>
      </>
    )
  }

  return (
    <>
      <header className="space-y-2">
        <div className="text-8xl">👍</div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Ready
        </h1>
        <p>Your card is ready to be funded.</p>
      </header>
      <Card
        isExample
        isLoading={safeAddressLoading}
        address={predictedSafeAddress}
        amount={amount}
        currency={currency}
        privateKey={privateKey}
      />

      <Button
        className="w-full"
        onClick={() => deploySafe()}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Fund Card
      </Button>

      {!!error && (
        <p className="font-mono text-red-500">Error: {error.message}</p>
      )}
    </>
  )
}
