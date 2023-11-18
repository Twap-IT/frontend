import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
// import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import { ethers } from 'ethers'
import type { NextPageWithLayout } from '@/types';
import { ThemeProvider } from 'next-themes';



import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
	arbitrum,
	avalanche,
	bsc,
	fantom,
	gnosis,
	mainnet,
	optimism,
	polygon,
} from "wagmi/chains";
import Head from "next/head";

const chains = [
	mainnet,
	polygon,
	avalanche,
	arbitrum,
	bsc,
	optimism,
	gnosis,
	fantom,
];

// 1. Get projectID at https://cloud.walletconnect.com

const projectId = "bc51c1051f4f8da7bd3b3d09f7519ae5";

// 2. Set chains
const mainnet_ = {
	chainId: 1,
	name: 'Ethereum',
	currency: 'ETH',
	explorerUrl: 'https://etherscan.io',
	rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create modal
const metadata = {
	name: 'My Website',
	description: 'My Website description',
	url: 'https://mywebsite.com',
	icons: ['https://avatars.mywebsite.com/']
}

// const ethersConfig = defaultConfig({ metadata });

//   createWeb3Modal({
// 	ethersConfig: ethersConfig,
// 	chains: [mainnet_],
// 	projectId
//   })

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });


type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
  };
  

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const [ready, setReady] = useState(false);
	const getLayout = Component.getLayout ?? ((page) => page);


	useEffect(() => {
		setReady(true);
	}, []);
	return (
		<>
			<Head>
				{/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1 maximum-scale=1"
				/>
			</Head>
			<ThemeProvider
				attribute="class"
				enableSystem={false}
				defaultTheme="light"
			>
				{ready ? (
					// <WagmiConfig config={ethersConfig}>

					<WagmiConfig config={wagmiConfig}>
						<Component {...pageProps} />
					</WagmiConfig>

				) : null}
			</ThemeProvider>

		</>
	);
}
