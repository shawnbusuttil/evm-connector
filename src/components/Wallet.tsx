import { useEffect, useMemo, useState } from 'react';
import { Button, InputNumber, Select } from 'antd';
import { useAccount, useBalance, useBlockNumber, useConfig } from 'wagmi';
import { isAddress } from 'viem';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';

import { fetchBalances } from '@/api/fetchBalances';
import { sendTransaction } from '@/api/sendTransaction';
import { Balance } from '@/types/balance';
import { toDecimal } from '@/utils/ethToDecimal';

import '@rainbow-me/rainbowkit/styles.css';

import { Connector } from './Connector';
import { parseTransactionStatus } from '@/utils/parseTransactionStatus';

const GAS_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const Wallet = () => {
    const { address, chain: connectedChain, connector, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { chains } = useConfig();
    const [balances, setBalances] = useState<Balance[] | null>(null);
    const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(null);
    const [selectedTokenAmount, setSelectedTokenAmount] = useState<number>(0);
    const [recipientAddress, setRecipientAddress] = useState<string>("");
    const [transactionStatus, setTransactionStatus] = useState<number | null>(null);
    const [isRecipientValid, setIsRecipientValid] = useState<boolean | null>(null);

    useBlockNumber({ watch: true });
    const { data: gasTokenBalance } = useBalance({
        address,
        chainId: connectedChain?.id
    })

    useEffect(() => {
        if (!isConnected && openConnectModal) {
            openConnectModal();
        }
    }, [isConnected, openConnectModal]);

    useEffect(() => {
        if (!isConnected) {
            setBalances(null);
            return;
        }
        
        async function getBalances() {
            if (!address || !connectedChain) return;

            const result = await fetchBalances(address, connectedChain.id);
            setBalances(result);
        }

        getBalances();
    }, [address, connectedChain]);

    useEffect(() => {
        if (balances && balances.length > 0) {
            setSelectedToken(GAS_TOKEN_ADDRESS);
        }
    }, [balances]);

    useEffect(() => {
        if (selectedToken) {
            setSelectedTokenAmount(0);
        }
    }, [selectedToken]);

    const setMaxTokenAmount = () => {
        if (selectedToken === GAS_TOKEN_ADDRESS) {
            setSelectedTokenAmount(parseFloat(toDecimal(gasTokenBalance!.value, gasTokenBalance?.decimals)));
            return;
        }
        const token = balances?.find(balance => balance.contractAddress === selectedToken);
        setSelectedTokenAmount(parseFloat(toDecimal(BigInt(token!.tokenBalance!), token!.decimals!)));
    };

    const handleTokenChange = (value: `0x${string}`) => {
        setSelectedToken(value);
    }

    const isSupportedChain = useMemo(() => {
        return connectedChain && chains.some(chain => chain.id === connectedChain.id);
    }, [connectedChain, chains]);

    const tokenBalanceItems = useMemo(() => {
        if (!gasTokenBalance || !balances || !connectedChain) {
            return undefined;
        }

        const balanceOfGas: Balance = {
            contractAddress: GAS_TOKEN_ADDRESS,
            decimals: connectedChain.nativeCurrency.decimals,
            name: connectedChain.nativeCurrency.name,
            symbol: connectedChain.nativeCurrency.symbol,
            logo: null,
            tokenBalance: gasTokenBalance.value.toString()
        }

        return [balanceOfGas, ...balances].map(balance => ({
            label: (
                <div className="flex gap-5 items-center">
                    <img src={balance.logo!} className="w-6 h-6" alt={balance.name!} />
                    <span>{toDecimal(BigInt(balance.tokenBalance!), balance.decimals!)} {balance.symbol}</span>
                </div>
            ),
            value: balance.contractAddress
        }));

    }, [balances, connectedChain, gasTokenBalance]);

    const selectAfter = useMemo(() => (
        <Select data-testid="token-list"
            className='w-full' 
            value={selectedToken} 
            onChange={handleTokenChange}
            options={tokenBalanceItems} 
        />
    ), [tokenBalanceItems, selectedToken, handleTokenChange]);

    const sendToken = async () => {
        if (!isAddress(recipientAddress)) {
            setIsRecipientValid(false);
            return;
        };

        setIsRecipientValid(true);

        try {
            setTransactionStatus(2);

            await sendTransaction(
                address!, 
                recipientAddress, 
                selectedTokenAmount,
                connectedChain!.id,
                selectedToken !== GAS_TOKEN_ADDRESS ? {
                    tokenAddress: selectedToken!,
                    tokenDecimals: balances?.find(balance => balance.contractAddress === selectedToken)?.decimals || 18
                } : undefined
            );

            setTransactionStatus(0);
        } catch (error: any) {
            setTransactionStatus(1);
        }
    };

    return (
        <div className="flex flex-col gap-5 mt-[300px] items-center">
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    mounted,
                    openAccountModal,
                    openConnectModal
                }) => {
                    const isConnected = mounted && !!account && !!chain;

                    return (
                        <Connector 
                            publicKey={account?.displayName}
                            displayBalance={account?.displayBalance}
                            icon={chain?.iconUrl}
                            iconColor={chain?.iconBackground}
                            onConnect={openConnectModal} 
                            onDisconnect={openAccountModal} 
                            isConnected={isConnected} 
                            walletIcon={connector?.icon}
                        />
                    );
                }}
            </ConnectButton.Custom>
            {tokenBalanceItems && (
                <>
                <div className='flex justify-center gap-5'>
                    <InputNumber addonAfter={selectAfter} defaultValue={0} value={selectedTokenAmount} className='w-[80%]' onChange={(value) => setSelectedTokenAmount(value!)} min={0} />
                    <Button color="primary" variant="link" onClick={setMaxTokenAmount}>Max</Button>
                </div>
                <div className='flex gap-5'>
                    <div className='flex flex-col'>
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipientAddress}
                            onChange={(e) => {
                                setRecipientAddress(e.target.value)
                            }}
                            className="border p-2 text-black"
                        />
                        {isRecipientValid === false && <p className='text-red-700'>Not a valid address format.</p>}
                    </div>
                    <Button onClick={sendToken} disabled={!selectedToken || !selectedTokenAmount || !recipientAddress} className="bg-blue-500 text-white p-2 mt-2">
                        Send
                    </Button>
                </div>
                </>
            )}
            {!isSupportedChain && <p className="text-center mt-2 text-red-700">Unsupported network.</p>}
            {transactionStatus && <p className="text-center mt-2 text-black">{parseTransactionStatus(transactionStatus)}</p>}
        </div>
    );
}