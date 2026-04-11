import { JsonRpcProvider, formatEther } from 'ethers';

export class BlockchainService {
    private provider: JsonRpcProvider;

    constructor(providerUrl: string) {
        // Vi sätter upp en anslutning till blockkedjan enligt ethers.js standard
        this.provider = new JsonRpcProvider(providerUrl);
    }

    async getBlockNumber(): Promise<number> {
        try {
            const blockNumber = await this.provider.getBlockNumber();
            return blockNumber;
        } catch (error) {
            console.error("Misslyckades med att hämta blocknummer:", error);
            throw new Error("Kunde inte ansluta till blockkedjan.");
        }
    }

    async getBalance(address: string): Promise<string> {
        try {
            const balanceWei = await this.provider.getBalance(address);
            return formatEther(balanceWei);
        } catch (error) {
            console.error("Misslyckades med att hämta saldo:", error);
            throw new Error("Kunde inte hämta saldo för adressen.");
        }
    }
}
