import Link from "next/link"
import { constants } from "ethers"
import { Controller, useForm } from "react-hook-form"
import { Address } from "wagmi"

import { useAccountAbstraction } from "@/lib/accountAbstractionContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const supportedTokens = [
  {
    address: constants.AddressZero,
    name: "ETH",
  },
  {
    address: "0x123",
    name: "APE",
  },
  {
    address: "0x97a4ab97028466FE67F18A6cd67559BAABE391b8",
    name: "BOB",
  },
  {
    address: "0xcbE9771eD31e761b744D3cB9eF78A1f32DD99211",
    name: "GHO",
  },
]

interface Fields {
  cardsAmount: number
  tokenAmount: number
  tokenAddress: Address
}

export default function IndexPage() {
  const { isAuthenticated } = useAccountAbstraction()

  const form = useForm<Fields>({
    defaultValues: {
      cardsAmount: 8,
      tokenAmount: 1,
      tokenAddress: constants.AddressZero,
    },
  })

  function onSubmit(fields: Fields) {}

  const tokenAmount = form.watch("tokenAmount")
  const tokenAddress = form.watch("tokenAddress")
  const tokenName = form.watch("tokenAddress")
    ? supportedTokens.find(
        ({ address }) =>
          address.toLowerCase() === form.watch("tokenAddress").toLowerCase()
      )?.name
    : "Tokens"

  return (
    <div className="container space-y-8">
      <header className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Issue
        </h1>
        <p className="text-2xl font-semibold">Create a new gift card.</p>
      </header>

      <p>Select how many tokens the card should hold.</p>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="tokenAmount">Amount of tokens per card</label>
              <Input
                id="tokenAmount"
                type="number"
                min={0.1}
                {...form.register("tokenAmount", { valueAsNumber: true })}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label htmlFor="tokenAddress">Token</label>
              <Controller
                control={form.control}
                name="tokenAddress"
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <Select value={value} name={name} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue onBlur={onBlur} />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedTokens.map(({ address, name }) => (
                        <SelectItem
                          className="font-sans"
                          key={address}
                          value={address}
                        >
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <p>
            You will be issuing a gift card with {tokenAmount.toLocaleString()}{" "}
            {tokenName}.
          </p>
          <Button asChild className="w-full" type="submit">
            <Link
              href={{
                pathname: "/issue/keys",
                query: {
                  tokenAmount,
                  tokenAddress,
                },
              }}
            >
              Prepare Card
            </Link>
          </Button>
        </fieldset>
      </form>
    </div>
  )
}
