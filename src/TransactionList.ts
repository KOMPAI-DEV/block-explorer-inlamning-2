import { TransactionResponse, formatEther } from 'ethers';

export class TransactionList {
    private tbodyElement: HTMLElement | null;

    constructor() {
        this.tbodyElement = document.getElementById('tx-list-root');
    }

    render(transactions: TransactionResponse[]) {
        if (!this.tbodyElement) return;

        // Filtrerar bort transaktioner med värdet 0 (t.ex. kontraktsanrop utan ETH)
        const withValue = transactions
            .filter(tx => tx.value > 0n)
            .slice(0, 10); // Max 10 rader för att inte frysa gränssnittet

        if (withValue.length === 0) {
            this.tbodyElement.innerHTML = `
                <tr><td colspan="4" class="text-center text-muted">Inga transaktioner med värde hittades i senaste blocket.</td></tr>
            `;
            return;
        }

        // Mappar varje transaktion till en HTML-rad
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
                    <td>${formatEther(tx.value)} ETH</td>
                </tr>
            `)
            .join('');
    }
}
