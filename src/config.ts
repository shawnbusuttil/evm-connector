import { Alchemy, Network } from 'alchemy-sdk';

export const ALCHEMY_API_KEY = "BZT7geOrPmDM6YF2BkWmN2GjqOz-pBgT";

export const ALCHEMY_CHAINS = {
    1: Network.ETH_MAINNET,
    137: Network.MATIC_MAINNET,
    42161: Network.ARB_MAINNET,
    8453: Network.BASE_MAINNET,
};

export const getConfig = (chainId: number) => {
    const config = {
        apiKey: ALCHEMY_API_KEY,
        network: ALCHEMY_CHAINS[chainId as keyof typeof ALCHEMY_CHAINS]
    }

    return new Alchemy(config);
};




