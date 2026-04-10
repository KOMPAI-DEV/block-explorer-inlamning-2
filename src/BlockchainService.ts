export class BlockchainService {
    private providerUrl: string;

    constructor(providerUrl: string) {
        this.providerUrl = providerUrl;
    }

    async getBlockNumber(): Promise<number> {
        throw new Error("Method not implemented.");
    }
}
