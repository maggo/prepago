import { useMemo } from "react"
import {
  EthersAdapter,
  SafeAccountConfig,
  predictSafeAddress,
} from "@safe-global/protocol-kit"
import { useQuery } from "@tanstack/react-query"
import { BigNumber, Wallet, constants, ethers } from "ethers"
import { parseEther } from "ethers/lib/utils.js"
import { Loader2 } from "lucide-react"
import {
  Address,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useWaitForTransaction,
} from "wagmi"

import { Card } from "./Card"
import { Button } from "./ui/button"

export function DeploySafe({
  privateKey,
  amount,
  currency,
  tokenAddress,
}: {
  privateKey: string
  amount: number
  currency: string
  tokenAddress: string
}) {
  const { isConnected, address } = useAccount()
  const { data: signer } = useSigner()

  const { config } = usePrepareContractWrite({
    abi,
    functionName: "createSafeProxy",
    address: "0x39fE2479432E681eb23EEde9963592D4a1C43C1E",
    overrides: {
      value:
        tokenAddress === constants.AddressZero
          ? parseEther(amount.toString())
          : undefined,
    },
    args: [
      [address!, new Wallet(privateKey).address as Address], // addresses
      BigNumber.from(1), // treshold
      tokenAddress as Address, // token address
      tokenAddress === constants.AddressZero
        ? constants.Zero
        : parseEther(amount.toString()), // token amount
    ],
  })

  const {
    write: deploySafe,
    isLoading,
    error,
    data: tx,
  } = useContractWrite(config)

  const {
    data,
    isSuccess,
    isLoading: txLoading,
  } = useWaitForTransaction({ hash: tx?.hash })

  console.log(data?.logs)

  const safeAddress = data?.logs.find(
    (log) =>
      log.topics[0] ===
      "0x1151116914515bc0891ff9047a6cb32cf902546f83066499bcf8ba33d2353fa2"
  )?.address

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
          address={safeAddress}
          amount={amount}
          currency={currency}
          privateKey={privateKey}
        />
        <p>
          Your card is available on-chain at <code>{safeAddress}</code>!
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
        isLoading={txLoading}
        amount={amount}
        currency={currency}
        privateKey={privateKey}
      />

      <Button
        className="w-full"
        onClick={() => deploySafe?.()}
        disabled={isLoading || !deploySafe}
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

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_safeProxyFactory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_safeMasterCopy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CreateSafeWithProxyFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "safe",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "GuardSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "safe",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "ModuleEnabled",
    type: "event",
  },
  {
    inputs: [],
    name: "ENCODED_SIG_REMOVE_OWNER",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "checkAfterExecution",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "checkTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "threshold",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "createSafeProxy",
    outputs: [
      {
        internalType: "address",
        name: "safe",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "enableModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "internalEnableModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "guard",
        type: "address",
      },
    ],
    name: "internalSetGuard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safeMasterCopy",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeProxyFactory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "guard",
        type: "address",
      },
    ],
    name: "setGuard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
