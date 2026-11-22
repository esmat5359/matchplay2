# Matchplay web

The front end for the **Matchplay** Intelligent Contract on **GenLayer Studionet**.

- Contract: `0xdd842644E5fEaba5c4FDB28d97236b5B58C5C69c` (change it in `.env` or `src/config.js`)
- Repo: https://github.com/reza9133/matchplay · Author: https://x.com/amirhp771

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/ (hash router, relative base: works on GitHub Pages, IPFS, any folder)
```

Copy `.env.example` to `.env` to override the contract address or the demo video.
Drop your demo video at `public/demo/matchplay-demo.mp4` (or set `VITE_DEMO_VIDEO_URL` to a YouTube/hosted link).

## Pages

| Route | What it does |
|---|---|
| `#/` | Landing: hero, live stats, how it works, 3D arena, latest rounds |
| `#/rounds` | All rounds, filter / search / paging |
| `#/round/:id` | Entries, matches with full verdict reviews, 3D arena, money table, every write action |
| `#/create` | Create a round with live economics and full input validation |
| `#/me` | Your rounds, your credit, claim |
| `#/ledger` | `stats()`, `solvency()`, `audit_books()` and the contract's real balance |
| `#/docs` | Full documentation (lifecycle, rules, money, wallet, Studionet quirks, interface, errors, FAQ) |
| `#/demo` | Click-to-play demo video |

## Wallet (EIP-6963)

`src/lib/wallet.jsx` discovers wallets with `eip6963:requestProvider` / `eip6963:announceProvider`
(with a `window.ethereum` fallback). Connect = `eth_requestAccounts`; disconnect forgets the account and calls
`wallet_revokePermissions` where supported, and never auto-reconnects afterwards. A wrong network shows a banner and blocks
transactions until the user switches (`wallet_switchEthereumChain`, then `wallet_addEthereumChain` for chain 61999).

## Studionet quirks handled

- **Refused payable calls trap GEN** (`create_round`, `enter`, `top_up`): `src/lib/validate.js` ports the contract's rules
  (lengths, bond/prize minimums, pitch letters, public-URL rules, duplicate evidence/pitch, tripwire) and the app also calls
  the contract's `would_steer()` view and re-reads the round right before attaching any value.
- **`play_next` UNDETERMINED**: shown as "no state changed, retry now"; the 120 s cool-down is applied only when `tries > 0`.
- **500 requests/hour rate limit**: reads are cached, de-duplicated, polled slowly and back off (`src/lib/chain.js`).

## Layout

```
src/
  lib/        chain.js (reads, cache, rate limits) · wallet.jsx · tx.jsx · receipt.js · validate.js · format.js · hooks.js
  components/ Logo · Spinners · Arena3D (three.js) · UI · WalletUI · Layout · RoundCard
  pages/      Home · Rounds · RoundDetail · Create · Dashboard · Ledger · Docs · Demo · NotFound
public/       brand/ (GenLayer logo/symbol/GEN token from the media kit, Matchplay mark) · img/ (Mochi + arena art) · demo/
```

Third-party artwork: GenLayer logo, symbol and GEN token from the GenLayer media kit; the arena image and Mochi mascot
from the supplied image.
