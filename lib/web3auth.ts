// Web3Auth Libraries

import { CHAIN_NAMESPACES } from "@web3auth/base"
import { Web3Auth } from "@web3auth/modal"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector"
import { Chain } from "wagmi"

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const name = "Prepago"
  const web3AuthInstance = new Web3Auth({
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x" + chains[0].id.toString(16),
      rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol,
    },
    uiConfig: {
      appName: name,
      theme: "light",
      loginMethodsOrder: ["facebook", "google"],
      defaultLanguage: "en",
      appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
      modalZIndex: "2147483647",
    },
  })

  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      network: "cyan",
      uxMode: "popup",
      whiteLabel: {
        name,
        logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        defaultLanguage: "en",
        dark: true, // whether to enable dark mode. defaultValue: false
      },
    },
  })
  web3AuthInstance.configureAdapter(openloginAdapterInstance)

  return new Web3AuthConnector({
    chains: chains as any,
    options: {
      web3AuthInstance,
    },
  })
}
