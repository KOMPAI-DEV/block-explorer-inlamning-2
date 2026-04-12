# Ethereum Block Explorer

En blockkedjeutforskare byggd med TypeScript och ethers.js som ansluter till en lokal Anvil-nod.

## Installation

```bash
npm install
```

## Användning

Starta Anvil i en terminal:

```bash
anvil
```

Bygg och starta appen:

```bash
npm run build
npm start
```

Öppna http://localhost:3000

## Tester

```bash
npm run test
```

Testerna körs utan Anvil – ethers.js är fullständigt mockad.

## Projektstruktur

```
src/
├── BlockchainService.ts   – Hanterar anrop mot blockkedjan
├── MainView.ts            – Hanterar UI-element på huvudsidan
├── TransactionModal.ts    – Modal för att skicka transaktioner
├── TransactionList.ts     – Visar senaste transaktioner i en tabell
├── types.ts               – Gemensamma TypeScript-interface
└── index.ts               – Startar appen och kopplar ihop delarna
```


