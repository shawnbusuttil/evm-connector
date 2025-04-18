import React from "react";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { base, mainnet, arbitrum, polygon } from "wagmi/chains";

export const config = getDefaultConfig({
    appName: "Multi-EVM",
    projectId: "2e3d62a308b604fe611e0dd3e0174f59",
    chains: [
        base,
        mainnet, 
        arbitrum,
        polygon
    ]
});

const queryClient = new QueryClient();

export const EthereumProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
