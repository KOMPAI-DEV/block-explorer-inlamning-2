import { BlockchainService } from './BlockchainService';
import { TransactionModal } from './TransactionModal';
import { TransactionList } from './TransactionList';

class App {
    private blockchainService: BlockchainService;
    private transactionModal: TransactionModal;
    private transactionList: TransactionList;

    constructor() {
        // Initiera tjänsten mot vår lokala Anvil-nod
        this.blockchainService = new BlockchainService('http://127.0.0.1:8545');
        
        this.transactionList = new TransactionList();

        // Initiera modalen med logik för vad som händer när vi trycker på "Skicka"
        this.transactionModal = new TransactionModal(async (to, amount) => {
            const txHash = await this.blockchainService.sendTransaction(to, amount);
            console.log("Transaktion genomförd, hash:", txHash);
        });
    }

    async init() {
        this.transactionModal.render(); // Bygger modalen i DOM:en
        this.setupEventListeners();
        await this.updateBlockNumber();
        await this.loadTransactionList();
    }

    private setupEventListeners() {
        // Hantera saldo-sökning
        const checkBalanceBtn = document.getElementById('check-balance-btn');
        const addressInput = document.getElementById('address-input') as HTMLInputElement;
        const balanceDisplay = document.getElementById('balance-display');

        if (checkBalanceBtn && addressInput && balanceDisplay) {
            checkBalanceBtn.addEventListener('click', async () => {
                if (!addressInput.value) return;
                balanceDisplay.innerText = "Laddar...";
                try {
                    const balance = await this.blockchainService.getBalance(addressInput.value);
                    balanceDisplay.innerText = `${balance} ETH`;
                } catch (error) {
                    balanceDisplay.innerText = "Fel vid hämtning";
                }
            });
        }

        // Hantera öppning av modal
        const openModalBtn = document.getElementById('open-tx-modal-btn');
        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                this.transactionModal.show();
            });
        }
    }

    private async updateBlockNumber() {
        const blockDisplay = document.getElementById('block-number-display');
        if (blockDisplay) {
            try {
                const blockNumber = await this.blockchainService.getBlockNumber();
                blockDisplay.innerText = `#${blockNumber}`;
            } catch (error) {
                blockDisplay.innerText = "Ej ansluten";
            }
        }
    }

    private async loadTransactionList() {
        try {
            const transactions = await this.blockchainService.getLatestTransactions();
            this.transactionList.render(transactions);
        } catch (error) {
            const tbody = document.getElementById('tx-list-root');
            if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Kunde inte ladda transaktioner.</td></tr>';
        }
    }
}

// Starta applikationen när DOM:en är redo
const app = new App();
app.init();
