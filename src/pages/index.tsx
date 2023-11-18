
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
    "asset": "USDC",
    "amount": "100"
  },
  "buy": { // Buy token. Optionally add amount for buy orders
    "asset": "COW",
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
      <div className="container">
        <div className='container'>
          <h2 className="" style={{ color: 'black', padding: '35px' }}>
            Cow Twaps Telegram
          </h2>
          <CowSwapWidget params={params} />



        </div>
        {params.sell?.amount}
        {/* <h2 className="">
          A crypto exchange that <b>can</b> escape from a straitjacket
        </h2> */}

        <div style={{ position: 'relative' }}>
          <CowSwapWidget params={params} />
          <button style={{ position: 'absolute', top: '10px', right: '10px' }}>
            My Button
          </button>
        </div>

      </div>
    </div>
  )
}
