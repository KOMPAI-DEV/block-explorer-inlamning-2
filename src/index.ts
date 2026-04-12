import { BlockchainService } from './BlockchainService';
import { MainView } from './MainView';
import { TransactionModal } from './TransactionModal';
import { TransactionList } from './TransactionList';

class App {
    private blockchainService: BlockchainService;
    private mainView: MainView;
    private transactionModal: TransactionModal;
    private transactionList: TransactionList;

    constructor() {
        this.blockchainService = new BlockchainService('http://127.0.0.1:8545');
        this.mainView = new MainView();
        this.transactionList = new TransactionList();
        this.transactionModal = new TransactionModal();
    }

    async init() {
        this.transactionModal.render();

        this.mainView.onCheckBalance(async (address) => {
            this.mainView.displayBalanceLoading();
            try {
                const balance = await this.blockchainService.getBalance(address);
                this.mainView.displayBalance(balance);
            } catch (error) {
                this.mainView.displayBalanceError("Fel vid hämtning");
            }
        });

        this.mainView.onOpenModal(() => {
            this.transactionModal.show();
        });

        this.transactionModal.onSubmit(async (to, amount) => {
            await this.blockchainService.sendTransaction(to, amount);
            await this.updateBlockNumber();
            await this.loadTransactionList();
            this.mainView.showSuccess("Transaktion skickad!");
        });

        await this.updateBlockNumber();
        await this.loadTransactionList();
    }

    private async updateBlockNumber() {
        try {
            const blockNumber = await this.blockchainService.getBlockNumber();
            this.mainView.displayBlockNumber(blockNumber);
        } catch (error) {
            this.mainView.displayBlockNumberError("Ej ansluten");
        }
    }

    private async loadTransactionList() {
        try {
            const transactions = await this.blockchainService.getLatestTransactions();
            this.transactionList.render(transactions);
        } catch (error) {
            this.transactionList.renderError("Kunde inte ladda transaktioner.");
        }
    }
}

const app = new App();
app.init().catch(err => console.error("Applikationen kunde inte starta:", err));

