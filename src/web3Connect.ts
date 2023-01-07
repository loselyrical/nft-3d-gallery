import * as UAuthWeb3Modal from "@uauth/web3modal";
import UAuthSPA from "@uauth/js";
import Web3Modal from "web3modal";

export const uauthOptions = {
    clientID: process.env.REACT_APP_UD_CLIENT_ID as string,
    redirectUri: process.env.REACT_APP_UD_REDIRECT_URI as string,
    scope: "openid wallet"
}

export const providerOptions = {
    'custom-uauth': {
        display: UAuthWeb3Modal.display,
        connector: UAuthWeb3Modal.connector,
        package: UAuthSPA,
        options: uauthOptions,
    },
}

export const web3Connect = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions,
})
UAuthWeb3Modal.registerWeb3Modal(web3Connect)
