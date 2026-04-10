import { BlockchainService } from '../src/BlockchainService';

describe('BlockchainService', () => {
    let blockchainService: BlockchainService;

    beforeEach(() => {
        // Vi skickar in en fejk-URL just nu bara för testet
        blockchainService = new BlockchainService('http://127.0.0.1:8545');
    });

    test('should be instantiated correctly', () => {
        expect(blockchainService).toBeDefined();
    });

    test('should have a method to get block number', async () => {
        // Vi förväntar oss att metoden existerar innan vi ens har byggt den (TDD)
        expect(typeof blockchainService.getBlockNumber).toBe('function');
    });
});
