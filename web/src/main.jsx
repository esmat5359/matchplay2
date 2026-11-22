import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { WalletProvider } from "./lib/wallet.jsx";
import { TxProvider } from "./lib/tx.jsx";
import "./styles/global.css";

// HashRouter: the site works from any static host (GitHub Pages, IPFS, a folder) without server rewrites.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <WalletProvider>
        <TxProvider>
          <App />
        </TxProvider>
      </WalletProvider>
    </HashRouter>
  </React.StrictMode>,
);
