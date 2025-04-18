import { SiEthereum } from "react-icons/si";
import { TbPlug, TbPlugOff } from "react-icons/tb";

import { trimAddress } from "@/utils/trimAddress";

type Props = {
    publicKey?: string;
    displayBalance?: string;
    unit?: string;
    isConnected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
    icon?: string;
    iconColor?: string;
    walletIcon?: string;
}

export const Connector = ({
    publicKey,
    displayBalance, 
    unit,
    icon,
    iconColor,
    isConnected,
    onConnect, 
    onDisconnect,
    walletIcon
}: Props) => {
    return (
        <div className="flex flex-col items-center gap-5">
            <div className={`w-[200px] h-[200px] relative flex items-center justify-center`}>
                <div className={`w-full h-full text-[100px] flex items-center justify-center rounded-full p-6 bg-clip-border`} 
                    style={{ 
                        backgroundColor: isConnected ? iconColor : '#c5c5c5',
                        filter: !isConnected ? 'grayscale(1)' : undefined
                    }}>
                    {isConnected ? <img width="100%" className="rounded-full" src={icon} alt="chain" /> : <SiEthereum className="text-black" />}
                </div>
                {isConnected && <button data-testid={`${unit}-disconnect`} onClick={onDisconnect} className="absolute flex items-center justify-center right-0 top-[70%] w-14 h-14 rounded-[100px] text-[28px] p-2">
                    {walletIcon ? <img src={walletIcon} alt="wallet" /> : <TbPlugOff />}
                </button>}
                {!isConnected && <button data-testid={`${unit}-connect`} onClick={onConnect} className="absolute flex items-center justify-center right-0 top-[70%] w-14 h-14 rounded-[100px] text-[28px] p-2">
                    <TbPlug />
                </button>}
            </div>

            {publicKey !== undefined && displayBalance !== undefined &&  (
                <div className="flex gap-1 text-black text-sm md:text-lg">
                    <span data-testid="public-key">
                        {trimAddress(publicKey)}
                    </span>
                    <span>-</span>
                    <span data-testid="balance">
                        {displayBalance}
                    </span>
                </div>
            )} 
        </div>
    );
}