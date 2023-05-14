import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { Wallet } from "ethers"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/Card"
import { DeploySafe } from "@/components/DeploySafe"

import { supportedTokens } from "."
import { Footer } from "../card/[address]/claim"

let privateKey: string | undefined = undefined

export function getPrivateKey() {
  if (privateKey) return privateKey
  return (privateKey = Wallet.createRandom().privateKey)
}

export default function KeysPage() {
  const router = useRouter()

  const tokenAmount = router.query.tokenAmount
    ? parseFloat(router.query.tokenAmount?.toString())
    : undefined
  const tokenAddress = router.query.tokenAddress?.toString()
  const tokenName = tokenAddress
    ? supportedTokens.find(
        ({ address }) => address.toLowerCase() === tokenAddress.toLowerCase()
      )?.name
    : undefined

  const [hasDownloadedKey, setHasDownloadedKey] = useState(false)

  if (!router.isReady) return null

  if (!tokenAmount || !tokenAddress || !tokenName) {
    return (
      <div className="centered-container space-y-8 text-center">
        <header className="space-y-2">
          <div className="text-8xl">:(</div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Oopsie Woopsie!
          </h1>
        </header>
        <p>
          Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at
          our headquarters are working VEWY HAWD to fix this! If you&apos;d like
          to know more, you can search online later for this error:{" "}
          <code>OOPSIE_WOOPSIE</code>
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="centered-container space-y-8 text-center">
        {!hasDownloadedKey ? (
          <>
            <header className="space-y-2">
              <div className="text-9xl">⚠️</div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Attention
              </h1>
            </header>
            <p>
              We have generated a secret key that gives access to your funds.
              Please download it and keep it in a safe place, otherwise all your
              funds will be lost.
            </p>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => {
                download("secret.txt", getPrivateKey())
                setTimeout(() => {
                  setHasDownloadedKey(true)
                }, 1000)
              }}
            >
              Download Key
            </Button>
          </>
        ) : (
          <DeploySafe
            privateKey={getPrivateKey()}
            amount={tokenAmount}
            currency={tokenName}
            tokenAddress={tokenAddress}
          />
        )}
      </div>
      <Footer />
    </>
  )
}

function download(filename: string, text: string) {
  const element = document.createElement("a")
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  )
  element.setAttribute("download", filename)

  element.style.display = "none"
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}
