import { configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { mainnet, goerli } from 'wagmi/chains';
import { createClient } from 'wagmi';

const { provider, webSocketProvider } = configureChains(
  [
    mainnet,
    goerli,
    //  chain.polygon, chain.optimism, chain.arbitrum
  ],
  [infuraProvider({ apiKey: `${process.env.INFURA_PROJECT_ID}` }), publicProvider()],
);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
