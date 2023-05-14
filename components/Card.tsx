/* eslint-disable @next/next/no-img-element */

import { useState } from "react"
import ReactCardFlip from "react-card-flip"
import QRCode from "react-qr-code"

import { Skeleton } from "./ui/skeleton"

export function Card({
  isLoading,
  isExample,
  address,
  amount,
  privateKey,
  currency,
}: {
  isLoading?: boolean
  isExample?: boolean
  address?: string
  privateKey: string
  amount: number
  currency: string
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasRevealed, setHasRevealed] = useState(false)

  return (
    <button onClick={() => setIsFlipped(!isFlipped)}>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div className="relative mx-auto h-[265px] w-[400px] overflow-hidden rounded-md bg-[#D5D7E1]">
          {isExample && (
            <div className="absolute left-[-30px] top-[18px] z-10 -rotate-45 items-center justify-center bg-red-600 px-8 py-1 font-mono uppercase">
              Example
            </div>
          )}
          <img
            src="/images/cards/nouns1.png"
            alt=""
            className="absolute bottom-0 left-0 [image-rendering:pixelated]"
          />
          <div className="absolute right-0 h-full w-[55%] space-y-1 p-2 text-right text-black">
            <h1 className="font-bold">This card holds</h1>
            <p className="text-4xl font-bold">
              {amount.toLocaleString()} ${currency}
            </p>
            <p className="text-xs">
              1. Scan this QR code to verify the code was not used before.
              <br />
              2. Scratch-off the code in the back and scan it to redeem your
              tokens.
            </p>
            <div className="absolute bottom-2 right-2 h-24 w-24 rounded-sm bg-white p-2">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <QRCode
                  className="h-full w-full"
                  value={`${window.location.origin}/card/${address}`}
                />
              )}
            </div>
          </div>
        </div>

        <div className="relative mx-auto h-[265px] w-[400px] overflow-hidden rounded-md bg-[#D5D7E1]">
          {isExample && (
            <div className="absolute left-[-30px] top-[18px] z-10 -rotate-45 items-center justify-center bg-red-600 px-8 py-1 font-mono uppercase">
              Example
            </div>
          )}
          <img
            src="/images/cards/nouns2.png"
            alt=""
            className="absolute bottom-0 left-0 [image-rendering:pixelated]"
          />
          <div className="absolute right-0 h-full w-[55%] space-y-1 p-2 text-right text-black">
            <h1 className="font-bold">This card holds</h1>
            <p className="text-4xl font-bold">
              {amount.toLocaleString()} ${currency}
            </p>
            <p className="text-xs">
              <span className="font-bold">⚠️ WARNING</span>
              <br />
              The code below gives access to these tokens. Scratch off and
              redeem immediately!
            </p>
            <div className="absolute bottom-2 right-2 h-24 w-24 rounded-sm bg-white p-2">
              <QRCode
                className="h-full w-full"
                value={`${window.location.origin}/card/${address}/claim?key=${privateKey}`}
              />
              {!hasRevealed && (
                <button
                  className="absolute inset-0 h-full w-full cursor-pointer bg-gray-500 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setHasRevealed(true)
                  }}
                >
                  Click to reveal secret key
                </button>
              )}
            </div>
          </div>
        </div>
      </ReactCardFlip>
    </button>
  )
}
