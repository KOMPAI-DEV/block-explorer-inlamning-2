import { BlockchainService } from '../src/BlockchainService';
import { JsonRpcProvider } from 'ethers';

jest.mock('ethers', () => {
    const originalEthers = jest.requireActual('ethers');
    return {
        ...originalEthers,
        JsonRpcProvider: jest.fn().mockImplementation(() => {
            return {
                getBlockNumber: jest.fn().mockResolvedValue(42),
                // Vi mockar att saldot är 1.5 Ether (uttryckt i Wei)
                getBalance: jest.fn().mockResolvedValue(1500000000000000000n) 
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
});
