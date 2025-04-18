import { formatUnits } from "viem/utils";

export const toDecimal = (balance: bigint, decimals = 18) => formatUnits(balance, decimals);