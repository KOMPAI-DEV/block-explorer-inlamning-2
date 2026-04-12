import { BlockchainService } from '../src/BlockchainService';
import { JsonRpcProvider } from 'ethers';

jest.mock('ethers', () => {
    const originalEthers = jest.requireActual('ethers');
    return {
        ...originalEthers,
        JsonRpcProvider: jest.fn().mockImplementation(() => {
            return {
                getBlockNumber: jest.fn().mockResolvedValue(42),
                getBalance: jest.fn().mockResolvedValue(1500000000000000000n),
                getSigner: jest.fn().mockResolvedValue({
                    // Mockar transaktionssvaret från ethers.js
                    sendTransaction: jest.fn().mockResolvedValue({
                        hash: '0xfakeTransactionHash123456789'
                    })
                }),
                getBlock: jest.fn().mockResolvedValue({
                    prefetchedTransactions: [
                        { hash: '0xabc', from: '0x111', to: '0x222', value: 500000000000000000n },
                        { hash: '0xdef', from: '0x333', to: '0x444', value: 0n } // Ska filtreras bort i View
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

    test('should return a valid block number from the mocked blockchain', async () => {
        const blockNumber = await blockchainService.getBlockNumber();
        expect(typeof blockNumber).toBe('number');
        expect(blockNumber).toBe(42); // Verifierar att vår mock anropas och fungerar
    });

    test('should return balance formatted in Ether for a given address', async () => {
        const dummyAddress = '0x1234567890123456789012345678901234567890';
        const balance = await blockchainService.getBalance(dummyAddress);
        expect(typeof balance).toBe('string');
        expect(balance).toBe('1.5'); // Vi förväntar oss 1.5 ETH baserat på vår mock
    });

    test('should send a transaction and return the transaction hash', async () => {
        const toAddress = '0x9876543210987654321098765432109876543210';
        const amount = '0.5'; // 0.5 ETH
        
        const txHash = await blockchainService.sendTransaction(toAddress, amount);
        
        expect(typeof txHash).toBe('string');
        expect(txHash).toBe('0xfakeTransactionHash123456789');
    });

    test('should return an array of transactions from the latest block', async () => {
        const transactions = await blockchainService.getLatestTransactions();
        
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions).toHaveLength(2);
        expect(transactions[0].hash).toBe('0xabc');
        expect(transactions[0].value).toBe(500000000000000000n);
    });
});
