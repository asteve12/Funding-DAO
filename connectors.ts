import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";





const injected = new InjectedConnector({
    supportedChainIds:[80001]
})

// const WalletConnect = new WalletConnectConnector({
//     rpcUrl:`${process.env.NEXT_PUBLIC_RPC_ENDPOINT}`,
//     bridge: "https://bridge.walletconnect.org",
//     qrcode: true
//    });


export const connectors = {
    injected,
    
}


