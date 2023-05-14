import { configureChains, createClient, goerli } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import Web3AuthConnectorInstance from "./web3auth"

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ]
)

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    Web3AuthConnectorInstance(chains),
    new InjectedConnector({ chains }),
  ],
  provider,
  webSocketProvider,
})
