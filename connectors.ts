import { InjectedConnector } from "@web3-react/injected-connector"






const injected = new InjectedConnector({
    supportedNetworks:[1,137,4]
})


export const connectors = {
    injected
}


