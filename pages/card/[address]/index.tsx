import { useRouter } from "next/router"
import AccountAbstraction from "@safe-global/account-abstraction-kit-poc"
import Safe, { EthersAdapter, getSafeContract } from "@safe-global/protocol-kit"
import { GelatoRelayPack } from "@safe-global/relay-kit"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Alchemy, Network } from "alchemy-sdk"
import { BigNumber, ethers } from "ethers"
import { formatEther, getAddress, isAddress } from "ethers/lib/utils.js"
import { Loader2 } from "lucide-react"
import { useAccount, useChainId, useSigner } from "wagmi"

import { shortenAddress } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supportedTokens } from "@/pages/issue"

import { Footer } from "./claim"

const relayPack = new GelatoRelayPack(
  "sB0a0DD_KOgg70SS57eHEItQnn45VcIysXZMLk4hw34_"
)

export default function CardPage() {
  const chainId = useChainId()
  const rawAddress = useRouter().query.address?.toString().toLowerCase() ?? ""

  const safeAddress = isAddress(rawAddress) ? getAddress(rawAddress) : undefined

  const { address: userAddress } = useAccount()
  const { data: signer } = useSigner()

  const { data: balances } = useQuery(
    ["balances", safeAddress],
    async () => {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID!,
        network: Network.ETH_GOERLI,
      }
      const alchemy = new Alchemy(settings)
      return (await alchemy.core.getTokenBalances(safeAddress!)).tokenBalances
    },
    { enabled: !!safeAddress }
  )

  const { data: isOwner } = useQuery(
    ["isOwner", userAddress],
    async () => {
      if (!signer || !userAddress || !safeAddress) throw new Error()

      const safe = await Safe.create({
        ethAdapter: new EthersAdapter({
          ethers,
          signerOrProvider: signer,
        }),
        safeAddress,
      })

      return safe.isOwner(userAddress)
    },
    { enabled: !!userAddress }
  )

  const {
    mutate: activate,
    isLoading,
    data: relayTxId,
  } = useMutation(async () => {
    if (!signer || !safeAddress || !userAddress) throw new Error()

    const safeAccountAbstraction = new AccountAbstraction(signer)
    await safeAccountAbstraction.init({ relayPack })

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    })

    const safe = await Safe.create({
      ethAdapter,
      safeAddress,
    })

    const swapOwnerTx = await safe.createRemoveOwnerTx({
      ownerAddress: userAddress,
      threshold: 1,
    })

    const signedSafeTx = await safe.signTransaction(swapOwnerTx)
    const safeSingletonContract = await getSafeContract({
      ethAdapter,
      safeVersion: await safe.getContractVersion(),
    })

    const encodedTx = safeSingletonContract.encode("execTransaction", [
      signedSafeTx.data.to,
      signedSafeTx.data.value,
      signedSafeTx.data.data,
      signedSafeTx.data.operation,
      signedSafeTx.data.safeTxGas,
      signedSafeTx.data.baseGas,
      signedSafeTx.data.gasPrice,
      signedSafeTx.data.gasToken,
      signedSafeTx.data.refundReceiver,
      signedSafeTx.encodedSignatures(),
    ])

    const response = await relayPack.relayTransaction({
      target: safeAddress,
      encodedTransaction: encodedTx,
      chainId,
      options: {
        gasLimit: "500000",
        isSponsored: true,
      },
    })

    return response.taskId
  })

  const { data: taskStatus } = useQuery(
    ["getTaskStatus", relayTxId],
    async () => {
      if (!relayTxId) throw new Error()

      return relayPack.getTaskStatus(relayTxId)
    },
    {
      enabled: !!relayTxId,
      refetchInterval(data) {
        if (
          data?.taskState &&
          [
            "ExecSuccess",
            "ExecReverted",
            "Blacklisted",
            "Cancelled",
            "NotFound",
          ].includes(data.taskState)
        ) {
          return false
        }

        return 1000
      },
    }
  )

  if (!safeAddress) {
    return (
      <div className="centered-container">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Card address is not valid
        </h1>
      </div>
    )
  }

  return (
    <>
      <div className="centered-container space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Card #{shortenAddress(safeAddress)}
        </h1>
        <p>This card holds</p>
        <div>
          {balances?.map(({ tokenBalance, contractAddress }) =>
            BigNumber.from(tokenBalance).gt(0) ? (
              <div key={contractAddress} className="text-4xl font-bold">
                {formatEther(BigNumber.from(tokenBalance))} $
                {supportedTokens.find(
                  ({ address }) =>
                    address.toLowerCase() === contractAddress.toLowerCase()
                )?.name ?? "ETH"}
              </div>
            ) : null
          )}
        </div>
        {isOwner && (
          <>
            {taskStatus ? (
              taskStatus.taskState === "ExecSuccess" ? (
                <p className="text-green-500">
                  Card has been activated successfully!
                </p>
              ) : (
                <p className="text-green-500">
                  Task Status: {taskStatus.taskState}
                </p>
              )
            ) : (
              <Button disabled={isLoading} onClick={() => activate()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Activate Card
              </Button>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  )
}
