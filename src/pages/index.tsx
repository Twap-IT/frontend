
import { CowSwapWidget, CowSwapWidgetParams, TradeType } from '@cowprotocol/widget-react'
import { ethers } from 'ethers';
import React, { useState } from 'react';
import ResolverABI from '../assets/ResolverABI.json'

import {
  useConnect, usePrepareContractWrite, useContractWrite, useWaitForTransaction,
} from 'wagmi'


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
  "chainId": 100, // 1 (Mainnet), 5 (Goerli), 100 (Gnosis)
  "tradeType": TradeType.SWAP, // TradeType.SWAP, TradeType.LIMIT or TradeType.ADVANCED
  "sell": { // Sell token. Optionally add amount for sell orders
    "asset": "TS",
    "amount": "5",
  },
  "buy": { // Buy token. Optionally add amount for buy orders
    "asset": "TT",
    "amount": "1"
  },
  "enabledTradeTypes": [ // TradeType.SWAP, TradeType.LIMIT and/or TradeType.ADVANCED
    TradeType.SWAP,
    TradeType.LIMIT,
    TradeType.ADVANCED
  ],
  "theme": "light", // light/dark or provide your own color palette
  "interfaceFeeBips": "50" // Fill the form above if you are interested
}

const RESOLVER_CONTRACT = '0x1266E1566C3314b23D720C9A1f740DA32A57fCe2';
const SWAP_ROUTER = '0xBACa92421Bc530c1a6f4431aa5BBd30de0EDa384'
const TOKENA_CONTRACT = '0x65fddb65ab0394b0c8cf6cd3e4a931f87f9e5143';
const TOKENB_CONTRACT = '0x500c99a6b976ba30877598b3ffd672ac001a756d';
const SLIPPAGE = 0.05;
const TOKEN_DECIMALS = 18;


export default function Home() {

  const [selectedOption, setSelectedOption] = useState("time");
  const [tokenAId, setTokenAId] = useState('');
  const [tokenAmount, setTokenAmount] = useState(Number(params.sell?.amount));
  const [tokenBId, setTokenBId] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState(Number(params.buy?.amount));
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  const handleBuyWithTime = () => {
    setSelectedOption('time');
  };

  const handleBuyWithPrice = () => {
    setSelectedOption('price');
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Implement your submit logic here
  };

  const { config: configResolver } = usePrepareContractWrite({
    address: RESOLVER_CONTRACT,
    abi: ResolverABI,
    functionName: 'deployPBTResolver',
    args: [
      RESOLVER_CONTRACT,
      TOKENA_CONTRACT,
      TOKENB_CONTRACT, 1 * (10 ^ TOKEN_DECIMALS),
      1 * (10 ^ TOKEN_DECIMALS), (tokenAmount * (1 - SLIPPAGE)) * (10 ^ TOKEN_DECIMALS),
      tokenAmount,
      tokenBAmount,
      SWAP_ROUTER
    ],
    enabled: Boolean(tokenAId),
  })

  const { data, error, isError, write, isSuccess } = useContractWrite(configResolver)

  const { data: configData } = useWaitForTransaction({
    hash: data?.hash,
  })

  console.log(configData);

  return (
    <div>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', width: '-webkit-fill-available', paddingTop: '10px' }}>
          <h2 style={{ margin: '0 auto', color: 'white' }}>
            Cow Twaps Telegram
          </h2>
          <div style={{ position: 'absolute', right: 0, padding: '10px' }}>
            {connectors.filter(connector => connector.name === 'MetaMask').map((connector) => (
              <button
                className='my-button'
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}

              >
                {"Connect Wallet"}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </button>
            ))}
          </div>
        </nav>
        <div className='container'>


          <div className=''>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                write?.();
              }}
              style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}
            >
              <div>
                <label htmlFor="tokenAId" style={{ padding: '10px' }}>Token A ID</label>
                <input
                  id="tokenAId"
                  onChange={(e) => setTokenAId(e.target.value)}
                  placeholder={params.sell?.asset}
                  style={{ padding: '10px' }}
                />
              </div>

              <div>
                <label htmlFor="tokenAmount" style={{ padding: '10px' }}>Token A Amount</label>
                <input
                  id="tokenAmount"
                  onChange={(e) => setTokenAmount(Number(e.target.value))}
                  placeholder={params.sell?.amount}
                  value={tokenAmount}
                  type="number"
                  style={{ padding: '10px' }}
                />
              </div>

              <div>
                <label htmlFor="tokenBId" style={{ padding: '10px' }}>Token B ID</label>
                <input
                  id="tokenBId"
                  onChange={(e) => setTokenBId(e.target.value)}
                  placeholder={params.buy?.asset}
                  style={{ padding: '10px' }}
                />
              </div>

              <div>
                <label htmlFor="tokenBAmount" style={{ padding: '10px' }}>Token B Amount</label>
                <input
                  id="tokenBAmount"
                  onChange={(e) => setTokenBAmount(Number(e.target.value))}
                  placeholder={params.buy?.amount}
                  value={tokenBAmount}
                  style={{ padding: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'right', margin: '20px' }}>
                <button type="submit" className='my-button'>
                  Submit
                </button>
              </div>
            </form>
          </div>


          <div className="buttons-container">
            <button
              className="my-button"
              onClick={handleBuyWithTime}>
              Buy with Time
            </button>

            <button
              className="my-button"
              onClick={handleBuyWithPrice}>
              Buy with Price
            </button>
          </div>


          {/* {selectedOption === 'time' && <CowSwapWidget params={params} />}*/}
          <div>
            <h2 className="" style={{ color: 'white', padding: '35px' }}>
              -------------------------------------
            </h2>
          </div>


        </div>
      </div>
    </div>
  )
}
