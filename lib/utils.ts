import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "wagmi"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: Address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
