export class MainView {
    private addressInput: HTMLInputElement | null;
    private balanceDisplay: HTMLElement | null;
    private blockNumberDisplay: HTMLElement | null;
    private checkBalanceBtn: HTMLElement | null;
    private openModalBtn: HTMLElement | null;

    constructor() {
        this.addressInput = document.getElementById('address-input') as HTMLInputElement;
        this.balanceDisplay = document.getElementById('balance-display');
        this.blockNumberDisplay = document.getElementById('block-number-display');
        this.checkBalanceBtn = document.getElementById('check-balance-btn');
        this.openModalBtn = document.getElementById('open-tx-modal-btn');
    }

    onCheckBalance(callback: (address: string) => void): void {
        this.checkBalanceBtn?.addEventListener('click', () => {
            if (!this.addressInput?.value) return;
            callback(this.addressInput.value);
        });
    }

    onOpenModal(callback: () => void): void {
        this.openModalBtn?.addEventListener('click', () => callback());
    }

    displayBalance(balance: string): void {
        if (this.balanceDisplay) this.balanceDisplay.innerText = `${balance} ETH`;
    }

    displayBalanceError(message: string): void {
        if (this.balanceDisplay) this.balanceDisplay.innerText = message;
    }

    displayBalanceLoading(): void {
        if (this.balanceDisplay) this.balanceDisplay.innerText = 'Laddar...';
    }

    displayBlockNumber(blockNumber: number): void {
        if (this.blockNumberDisplay) this.blockNumberDisplay.innerText = `#${blockNumber}`;
    }

    displayBlockNumberError(message: string): void {
        if (this.blockNumberDisplay) this.blockNumberDisplay.innerText = message;
    }

    showSuccess(message: string): void {
        const main = document.querySelector('main');
        if (!main) return;
        const alert = document.createElement('div');
        alert.className = 'alert alert-success mt-3';
        alert.textContent = message;
        main.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
}
