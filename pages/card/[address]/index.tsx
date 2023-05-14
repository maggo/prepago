import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { formatEther, getAddress, isAddress } from "ethers/lib/utils.js"

export default function CardPage() {
  const rawAddress = useRouter().query.address?.toString().toLowerCase() ?? ""

  const address = isAddress(rawAddress) ? getAddress(rawAddress) : undefined

  const { data: balances } = useQuery(
    ["balances", address],
    async () => {
      const res =
        await fetch(`https://safe-transaction-goerli.safe.global/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=true
    `)

      const data = await res.json()

      return data as {
        tokenAddress: string | null
        token: string | null
        balance: string
      }[]
    },
    { enabled: !!address }
  )

  if (!address) {
    return (
      <div className="centered-container">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Card address is not valid
        </h1>
      </div>
    )
  }

  return (
    <div className="centered-container space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Card #{address.slice(0, 6)}…{address.slice(-4)}
      </h1>
      <p>This card holds</p>
      <div>
        {balances?.map(({ token, tokenAddress, balance }) => (
          <div key={tokenAddress} className="text-4xl font-bold">
            {formatEther(BigNumber.from(balance))} ${token ?? "ETH"}
          </div>
        ))}
      </div>
    </div>
  )
}
