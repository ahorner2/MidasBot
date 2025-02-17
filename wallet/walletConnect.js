import {
  isWalletInfoRemote,
  WalletInfoRemote,
  WalletsListManager,
} from "@tonconnect/sdk";

const walletsListManager = new WalletsListManager({
  cacheTTLMs: process.env.WALLETS_LIST_CACHE_TTL_MS,
});

export async function getWallets() {
  const wallets = await walletsListManager.getWallets(); 
  return wallets.filter(isWalletInfoRemote); 
}

export async function getWalletInfo(walletAppName) {
  const wallets = await getWallets(); 
  return wallets.find(wallet => wallet.appName.toLowerCase() === walletAppName.toLowerCase()); 
}