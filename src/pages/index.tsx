
import { CowSwapWidget, CowSwapWidgetParams, TradeType } from '@cowprotocol/widget-react'
import { ethers } from 'ethers';
import { parseEther } from 'viem';
import React, { useState } from 'react';
import ResolverABI from '../assets/ResolverABI.json'
import AgentABI from '../assets/AgentABI.json'
import ERC20ABI from '../assets/ERC20ABI.json'
import { useAccount } from 'wagmi'


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

const RESOLVER_CONTRACT = '0x8E08aD80c9c83D2cCf4AC3E41e3C7953dd5bBC74';
const AGENT_CONTRACT = '0x071412e301C2087A4DAA055CF4aFa2683cE1e499';
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
  const { address } = useAccount();

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
      TOKENB_CONTRACT, 
      1 * (10 ^ TOKEN_DECIMALS),
      1 * (10 ^ TOKEN_DECIMALS), (tokenAmount * (1 - SLIPPAGE)) * (10 ^ TOKEN_DECIMALS),
      tokenAmount,
      tokenBAmount,
      SWAP_ROUTER
    ],
    enabled: Boolean(tokenAId),
  })

  const { data: dataResolver, error: errorResolver, isError: isErrorResolver, write: writeResolver, isSuccess: isSuccessResolver } = useContractWrite(configResolver)
  const { data: txDataResolver } = useWaitForTransaction({
    hash: dataResolver?.hash,
  })

  let jobkey = txDataResolver?.logs[2].topics[1];
  let RESOLVER_JOB_CONTRACT = txDataResolver?.logs[0].address

  if(!jobkey == null){
    console.log('jobkey received', jobkey)
    console.log('factory address', txDataResolver?.logs[0].address)
  }

  const { config: configAgent } = usePrepareContractWrite({
    address: AGENT_CONTRACT,
    abi: AgentABI,
    functionName: 'acceptJobTransfer',
    args: [
      jobkey
    ]
  })

  const { data: dataAgent, error: errorAgent, isError: isErrorAgent, write: writeAgent, isSuccess: isSuccessAgent } = useContractWrite(configAgent)
  const { data: txDataAgent } = useWaitForTransaction({
    hash: dataAgent?.hash,
  })

  if(!dataAgent == null){
    console.log('tx data agent received', dataAgent)
  }
  
  // console.log(dataAgent)
  // console.log('data', configData);
  // console.log('config', configData?.logs[2])
  // console.log('topic ', configData?.logs[2].topics[1])

  const { config: configAgentDeposit } = usePrepareContractWrite({
    address: AGENT_CONTRACT,
    abi: AgentABI,
    functionName: 'depositJobOwnerCredits',
    args: [
      address
    ],
    value: parseEther("0.01")
  })

  const { data: dataAgentDeposit, error: errorAgentDeposit, isError: isErrorAgentDeposit, write: writeAgentDeposit, isSuccess: isSuccessAgentDeposit } = useContractWrite(configAgentDeposit)
  const { data: txDataAgentDeposit } = useWaitForTransaction({
    hash: dataAgentDeposit?.hash,
  })

  if(!txDataAgentDeposit == null){
    console.log('tx data agent deposit received', dataAgentDeposit)
  }

  // const { config: configTokenAContract } = usePrepareContractWrite({
  //   address: TOKENA_CONTRACT,
  //   abi: ERC20ABI,
  //   functionName: 'approve',
  //   args: [
  //     RESOLVER_JOB_CONTRACT,
  //     1 * (10 ^ TOKEN_DECIMALS)
  //   ],
  //   value: parseEther("0.01")
  // })

  // const { data: dataTokenA, error: errorTokenA, isError: isErrorTokenA, write: writeTokenA, isSuccess: isSuccessTokenA } = useContractWrite(configTokenAContract)
  // const { data: txDataTokenA } = useWaitForTransaction({
  //   hash: dataTokenA?.hash,
  // })

  // if(!txDataTokenA == null){
  //   console.log('tx data TokenA received', dataTokenA)
  // }

  // const { config: configTokenBContract } = usePrepareContractWrite({
  //   address: TOKENB_CONTRACT,
  //   abi: ERC20ABI,
  //   functionName: 'approve',
  //   args: [
  //     RESOLVER_JOB_CONTRACT,
  //     1 * (10 ^ TOKEN_DECIMALS)
  //   ],
  //   value: parseEther("0.01")
  // })


  // const { data: dataTokenB, error: errorTokenB, isError: isErrorTokenB, write: writeTokenB, isSuccess: isSuccessTokenB } = useContractWrite(configTokenBContract)
  // const { data: txDataTokenB } = useWaitForTransaction({
  //   hash: dataTokenB?.hash,
  // })

  // if(!txDataTokenB == null){
  //   console.log('tx data TokenB received', dataTokenB)
  // }


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
              onSubmit={(e) => {
                e.preventDefault();
                writeResolver?.();
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

          <button onClick={(e) => {
            e.preventDefault();
            writeAgent?.()
            console.log('agent written')
          }} className='my-button'>
            Submit Acccept Job Transfer
          </button>

          <button onClick={(e) => {
            e.preventDefault();
            writeAgentDeposit?.()
            console.log('agent deposit written')
          }} className='my-button'>
            Submit Acccept Deposit Job Transfer
          </button>

          <button onClick={(e) => {
            e.preventDefault();
            writeTokenA?.()
            console.log('agent deposit written')
          }} className='my-button'>
            Write Token A
          </button>



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
