import { BlockchainService } from '../src/BlockchainService';

jest.mock('ethers', () => {
    const originalEthers = jest.requireActual('ethers');
    return {
        ...originalEthers,
        JsonRpcProvider: jest.fn().mockImplementation(() => {
            return {
                getBlockNumber: jest.fn().mockResolvedValue(42),
                getBalance: jest.fn().mockResolvedValue(1500000000000000000n),
                getSigner: jest.fn().mockResolvedValue({
                    sendTransaction: jest.fn().mockResolvedValue({
                        hash: '0xfakeTransactionHash123456789'
                    })
                }),
                getBlock: jest.fn().mockResolvedValue({
                    prefetchedTransactions: [
                        { hash: '0xabc', from: '0x111', to: '0x222', value: 500000000000000000n },
                        { hash: '0xdef', from: '0x333', to: '0x444', value: 0n }
                    ]
                })
            };
        })
    };
});

describe('BlockchainService', () => {
    let blockchainService: BlockchainService;

    beforeEach(() => {
        jest.clearAllMocks();
        blockchainService = new BlockchainService('http://127.0.0.1:8545');
    });

    test('should be instantiated correctly', () => {
        expect(blockchainService).toBeDefined();
    });

    test('should return the current block number', async () => {
        const blockNumber = await blockchainService.getBlockNumber();
        expect(typeof blockNumber).toBe('number');
        expect(blockNumber).toBe(42);
    });

    test('should return balance formatted in ETH', async () => {
        const dummyAddress = '0x1234567890123456789012345678901234567890';
        const balance = await blockchainService.getBalance(dummyAddress);
        expect(typeof balance).toBe('string');
        expect(balance).toBe('1.5');
    });

    test('should send a transaction and return its hash', async () => {
        const toAddress = '0x9876543210987654321098765432109876543210';
        const amount = '0.5';
        const txHash = await blockchainService.sendTransaction(toAddress, amount);
        expect(typeof txHash).toBe('string');
        expect(txHash).toBe('0xfakeTransactionHash123456789');
    });

    test('should return transactions from the latest block', async () => {
        const transactions = await blockchainService.getLatestTransactions();
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions).toHaveLength(2);
        expect(transactions[0].hash).toBe('0xabc');
        expect(transactions[0].value).toBe('0.5');
    });

    test('should throw if blockchain is unreachable', async () => {
        const provider = (blockchainService as any).provider;
        provider.getBlockNumber.mockRejectedValueOnce(new Error('Network error'));
        await expect(blockchainService.getBlockNumber()).rejects.toThrow('Kunde inte ansluta till blockkedjan.');
    });

    test('should throw if balance lookup fails', async () => {
        const provider = (blockchainService as any).provider;
        provider.getBalance.mockRejectedValueOnce(new Error('invalid address'));
        await expect(blockchainService.getBalance('0xinvalid')).rejects.toThrow('Kunde inte hämta saldo för adressen.');
    });

    test('should throw if address is empty', async () => {
        await expect(blockchainService.getBalance('')).rejects.toThrow('Adress saknas.');
    });

    test('should throw if amount is invalid', async () => {
        await expect(blockchainService.sendTransaction('0x123', '-1')).rejects.toThrow('Ogiltigt belopp.');
    });

    test('should return empty array if block is null', async () => {
        const provider = (blockchainService as any).provider;
        provider.getBlock.mockResolvedValueOnce(null);
        const transactions = await blockchainService.getLatestTransactions();
        expect(transactions).toEqual([]);
    });

    test('should call getBalance with the provided address', async () => {
        const provider = (blockchainService as any).provider;
        const address = '0x1234567890123456789012345678901234567890';
        await blockchainService.getBalance(address);
        expect(provider.getBalance).toHaveBeenCalledWith(address);
    });
});
