import { JsonRpcProvider, formatEther, parseEther, TransactionResponse } from 'ethers';

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

    async sendTransaction(toAddress: string, amountEther: string): Promise<string> {
        try {
            // Hämtar det första testkontot från vår lokala nod (Anvil)
            const signer = await this.provider.getSigner();
            
            // Bygger och skickar transaktionen
            const tx = await signer.sendTransaction({
                to: toAddress,
                value: parseEther(amountEther) // Konverterar "0.5" ETH till Wei
            });
            
            // Returnerar kvittot (hashen) på att transaktionen ligger i blockkedjan
            return tx.hash;
        } catch (error) {
            console.error("Misslyckades med att skicka transaktion:", error);
            throw new Error("Kunde inte genomföra transaktionen.");
        }
    }

    async getLatestTransactions(): Promise<TransactionResponse[]> {
        try {
            const block = await this.provider.getBlock('latest', true);
            if (!block) return [];
            return block.prefetchedTransactions;
        } catch (error) {
            console.error("Misslyckades med att hämta transaktioner:", error);
            throw new Error("Kunde inte hämta transaktioner från senaste blocket.");
        }
    }
}
