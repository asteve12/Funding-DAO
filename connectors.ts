import { InjectedConnector } from "@web3-react/injected-connector"
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"

//help connect to injected wallet provider
const injected = new InjectedConnector({
    supportedChainIds:[80001]
})

//wallet connect connector
const walletconnect = new WalletConnect(
    {
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal:QRCodeModal
    }
)




export const connectors = {
    injected,
    walletconnect
    
}


