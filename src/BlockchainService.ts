import { JsonRpcProvider, formatEther, parseEther } from 'ethers';
import { FormattedTransaction } from './types';

export class BlockchainService {
    private provider: JsonRpcProvider;

    constructor(providerUrl: string) {
        this.provider = new JsonRpcProvider(providerUrl);
    }

    async getBlockNumber(): Promise<number> {
        try {
            return await this.provider.getBlockNumber();
        } catch (error) {
            console.error("Misslyckades med att hämta blocknummer:", error);
            throw new Error("Kunde inte ansluta till blockkedjan.");
        }
    }

    async getBalance(address: string): Promise<string> {
        if (!address) throw new Error("Adress saknas.");
        try {
            const balanceWei = await this.provider.getBalance(address);
            return formatEther(balanceWei);
        } catch (error) {
            console.error("Misslyckades med att hämta saldo:", error);
            throw new Error("Kunde inte hämta saldo för adressen.");
        }
    }

    async sendTransaction(toAddress: string, amountEther: string): Promise<string> {
        if (!toAddress || !amountEther) throw new Error("Adress och belopp krävs.");
        if (isNaN(Number(amountEther)) || Number(amountEther) <= 0) {
            throw new Error("Ogiltigt belopp.");
        }
        try {
            const signer = await this.provider.getSigner();
            const tx = await signer.sendTransaction({
                to: toAddress,
                value: parseEther(amountEther)
            });
            return tx.hash;
        } catch (error) {
            console.error("Misslyckades med att skicka transaktion:", error);
            throw new Error("Kunde inte genomföra transaktionen.");
        }
    }

    async getLatestTransactions(): Promise<FormattedTransaction[]> {
        try {
            const block = await this.provider.getBlock('latest', true);
            if (!block) return [];
            const transactions = block.prefetchedTransactions ?? [];
            return transactions.map(tx => ({
                hash: tx.hash,
                from: tx.from,
                to: tx.to ?? null,
                value: formatEther(tx.value)
            }));
        } catch (error) {
            console.error("Misslyckades med att hämta transaktioner:", error);
            throw new Error("Kunde inte hämta transaktioner från senaste blocket.");
        }
    }
}
