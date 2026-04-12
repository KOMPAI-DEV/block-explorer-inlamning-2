import { FormattedTransaction } from './types';

export class TransactionList {
    private tbodyElement: HTMLElement | null;

    constructor() {
        this.tbodyElement = document.getElementById('tx-list-root');
    }

    render(transactions: FormattedTransaction[]) {
        if (!this.tbodyElement) return;

        const withValue = transactions
            .filter(tx => Number(tx.value) > 0)
            .slice(0, 10);

        if (withValue.length === 0) {
            this.tbodyElement.innerHTML = `
                <tr><td colspan="4" class="text-center text-muted">Inga transaktioner med värde hittades i senaste blocket.</td></tr>
            `;
            return;
        }

        this.tbodyElement.innerHTML = withValue
            .map(tx => `
                <tr>
                    <td class="text-truncate" style="max-width:150px;" title="${tx.hash}">
                        <code>${tx.hash.slice(0, 10)}…</code>
                    </td>
                    <td class="text-truncate" style="max-width:130px;" title="${tx.from}">
                        <code>${tx.from.slice(0, 8)}…</code>
                    </td>
                    <td class="text-truncate" style="max-width:130px;" title="${tx.to ?? ''}">
                        <code>${tx.to ? tx.to.slice(0, 8) + '…' : '-'}</code>
                    </td>
                    <td>${tx.value} ETH</td>
                </tr>
            `)
            .join('');
    }

    renderError(message: string): void {
        if (!this.tbodyElement) return;
        this.tbodyElement.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${message}</td></tr>`;
    }
}
