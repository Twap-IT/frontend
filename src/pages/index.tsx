
import { CowSwapWidget, CowSwapWidgetParams, TradeType } from '@cowprotocol/widget-react'
import { ethers } from 'ethers';



// const provider = useProvider()
// const provider = new ethers.providers.Web3Provider(window.ethereum);
interface EthereumProvider {
  on(event: string, args: unknown): void
  request<T>(params: JsonRpcRequest): Promise<T>
  enable(): Promise<void>
}

interface JsonRpcRequest {
  id: number
  method: string
  params: unknown[]
}

//  Fill this form https://cowprotocol.typeform.com/to/rONXaxHV once you pick your "appCode"
const params: CowSwapWidgetParams = {
  "appCode": "Cow Twaps Telegram", // Name of your app (max 50 characters)
  "width": "550px", // Width in pixels (or 100% to use all available space)
  "height": "640px",
  // "provider": window.ethereum,// Ethereum EIP-1193 provider. For a quick test, you can pass `window.ethereum`, but consider using something like https://web3modal.com
  "provider": typeof window === 'undefined' ? undefined : window.ethereum as CowSwapWidgetParams['provider'],// Ethereum EIP-1193 provider. For a quick test, you can pass `window.ethereum`, but consider using something like https://web3modal.com
  "chainId": 1, // 1 (Mainnet), 5 (Goerli), 100 (Gnosis)
  "tradeType": TradeType.SWAP, // TradeType.SWAP, TradeType.LIMIT or TradeType.ADVANCED
  "sell": { // Sell token. Optionally add amount for sell orders
    "asset": "COW",
    "amount": "100000"
  },
  "buy": { // Buy token. Optionally add amount for buy orders
    "asset": "USDC",
    "amount": "0"
  },
  "enabledTradeTypes": [ // TradeType.SWAP, TradeType.LIMIT and/or TradeType.ADVANCED
    TradeType.SWAP,
    TradeType.LIMIT,
    TradeType.ADVANCED
  ],
  "theme": "light", // light/dark or provide your own color palette
  "interfaceFeeBips": "50" // Fill the form above if you are interested
}


export default function Home() {
  return (
    <div>

      <div className="flex flex-col items-center justify-center min-h-screen py-4">

        <div className="mx-auto max-w-md ">
          <h2 className="mb-14 text-lg font-medium uppercase text-center tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
            Cow Twaps Telegram
          </h2>

        </div>
        <CowSwapWidget params={params} />

        <h2 className="py-10 text-lg font-medium uppercase text-center tracking-wider text-gray-900 dark:text-white ">
          A crypto exchange that <b>can</b> escape from a straitjacket
        </h2>

      </div>
    </div>
  )
}
