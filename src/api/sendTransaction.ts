import { getPublicClient, getWalletClient } from '@wagmi/core';
import { erc20Abi, parseEther, parseUnits } from 'viem';

import { config } from "@/providers/EthereumProvider";

type TokenOptions = {
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
}

export const sendTransaction = async (from: `0x${string}`, to: `0x${string}`, value: any, chainId: any, options?: TokenOptions) => {

    const walletClient = await getWalletClient(config, 
        { 
            chainId,
            account: from
        }
    );

    if (!walletClient) {
        throw new Error('No wallet client connected.');
    }

    const publicClient = getPublicClient(config, { chainId });

    try {
        if (options?.tokenAddress) {
            const decimals = options.tokenDecimals ?? 18;
      
            const hash = await walletClient.writeContract({
              address: options.tokenAddress,
              abi: erc20Abi,
              functionName: 'transfer',
              args: [to, parseUnits(String(value), decimals)],
              account: from,
            });
      
            console.log('Token transfer tx hash:', hash);
      
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return receipt;
          } else {
              const hash = await walletClient.sendTransaction({
                  to,
                  value: parseEther(String(value)),
                  account: from
              });
      
              const result = await publicClient.waitForTransactionReceipt({ hash });
              return result;
          }
    } catch (error: any) {
        throw new Error(`Transaction failed: ${error.message}`);
    }
};
