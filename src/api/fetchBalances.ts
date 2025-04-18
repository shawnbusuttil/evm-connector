import { getConfig } from "@/config";
import { Balance } from "../types/balance";

const USDC_CONTRACT_ADDRESSES = {
    1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
};

type ChainIdKey = keyof typeof USDC_CONTRACT_ADDRESSES;

export const fetchBalances = async (address: `0x${string}`, chainId: number): Promise<Balance[]> => {
    try {
        const alchemy = getConfig(chainId);
        const data = await alchemy.core.getTokenBalances(address)

        const usdcContractAddress = USDC_CONTRACT_ADDRESSES[chainId as ChainIdKey];
        const isZeroUSDC = !data.tokenBalances.some(balance => 
            balance.contractAddress.toLowerCase() === usdcContractAddress.toLowerCase()
        );

        if (isZeroUSDC) {
            const usdcTokenBalance = (await alchemy.core.getTokenBalances(address, [usdcContractAddress])).tokenBalances;

            data.tokenBalances = [
                ...data.tokenBalances, 
                ...usdcTokenBalance
            ]
        }

        const tokensWithMetadata = await Promise.all(
            data.tokenBalances.map(async token => {
                const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
                return {
                    ...token,
                    ...metadata
                };
            })
        );

        return tokensWithMetadata;
    } catch (e: any) {
        if (e.status === 400) {
            throw new Error("Network not supported.");
        }
        throw new Error("Error fetching balances.");
    }
}
