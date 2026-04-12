export class TransactionModal {
    private rootElement: HTMLElement | null;
    private onSubmitCallback?: (to: string, amount: string) => Promise<void>;
    private modalElement: HTMLElement | null = null;
    private statusElement: HTMLElement | null = null;

    constructor() {
        this.rootElement = document.getElementById('modal-root');
    }

    onSubmit(callback: (to: string, amount: string) => Promise<void>): void {
        this.onSubmitCallback = callback;
    }

    render() {
        if (!this.rootElement) return;

        this.rootElement.innerHTML = `
            <div class="modal fade" id="txModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Skicka Ethereum</h5>
                            <button type="button" class="btn-close" id="close-modal-icon"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Mottagaradress (To):</label>
                                <input type="text" id="tx-to-address" class="form-control" placeholder="0x...">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Belopp (ETH):</label>
                                <input type="number" id="tx-amount" class="form-control" placeholder="0.5" step="0.01">
                            </div>
                            <div id="tx-status" class="text-center mt-2 fw-bold"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="close-modal-btn">Avbryt</button>
                            <button type="button" class="btn btn-primary" id="tx-send-btn">Skicka</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    private attachEventListeners() {
        const sendBtn = document.getElementById('tx-send-btn');
        const closeBtn = document.getElementById('close-modal-btn');
        const closeIcon = document.getElementById('close-modal-icon');
        const toInput = document.getElementById('tx-to-address') as HTMLInputElement;
        const amountInput = document.getElementById('tx-amount') as HTMLInputElement;

        this.modalElement = document.getElementById('txModal');
        this.statusElement = document.getElementById('tx-status');

        closeBtn?.addEventListener('click', () => this.hide());
        closeIcon?.addEventListener('click', () => this.hide());

        if (sendBtn) {
            sendBtn.addEventListener('click', async () => {
                if (!toInput.value || !amountInput.value) {
                    if (this.statusElement) this.statusElement.innerHTML = '<span class="text-danger">Fyll i alla fält.</span>';
                    return;
                }

                if (this.statusElement) this.statusElement.innerHTML = '<span class="text-info">Skickar transaktion...</span>';
                sendBtn.setAttribute('disabled', 'true');

                try {
                    if (this.onSubmitCallback) await this.onSubmitCallback(toInput.value, amountInput.value);
                    if (this.statusElement) this.statusElement.innerHTML = '<span class="text-success">Transaktion lyckades!</span>';
                    setTimeout(() => this.hide(), 2000);
                } catch (error) {
                    if (this.statusElement) this.statusElement.innerHTML = '<span class="text-danger">Misslyckades. Kontrollera adressen.</span>';
                } finally {
                    sendBtn.removeAttribute('disabled');
                }
            });
        }
    }

    show() {
        if (this.modalElement) {
            this.modalElement.classList.add('show', 'd-block');
            this.modalElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
        }
    }

    hide() {
        if (this.modalElement) {
            this.modalElement.classList.remove('show', 'd-block');
            this.modalElement.style.backgroundColor = '';
        }
        if (this.statusElement) this.statusElement.innerHTML = '';
    }
}
