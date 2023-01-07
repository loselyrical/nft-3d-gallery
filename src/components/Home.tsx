import React, {useCallback, useEffect, useReducer} from 'react';
import {providers} from 'ethers'
import * as UAuthWeb3Modal from '@uauth/web3modal'
import Game from "./Game";
import {initialState, reducer} from "../store/redux";
import {providerOptions, web3Connect} from "../web3Connect";

export const Home = (): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {provider, web3Provider, user, address, chainId} = state

    useEffect(() => {
        clearStorage()
    }, []);

    const connect = useCallback(async function () {
        const provider = await web3Connect.connect()
        const web3Provider = new providers.Web3Provider(provider)

        const signer = web3Provider.getSigner()
        const address = await signer.getAddress()

        const network = await web3Provider.getNetwork()

        let account: any = null
        if (web3Connect.cachedProvider === "custom-uauth") {
            const {package: uauthPackage, options: uauthOptions} =
                providerOptions["custom-uauth"];
            account = await UAuthWeb3Modal.getUAuth(uauthPackage, uauthOptions)?.user()
        }

        dispatch({
            type: 'SET_WEB3_PROVIDER',
            provider,
            web3Provider,
            address,
            chainId: network.chainId,
            user: {...account}
        })
    }, [])

    function clearStorage() {
        let keys = Object.keys(localStorage), key
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
        localStorage.removeItem('username')
        localStorage.removeItem('request')
        localStorage.removeItem('uauth-default-username')
        for (let i = 0; key = keys[i]; i++) {
            if (key.includes('openidConfiguration')
                || key.includes('Parse/')
                || key.includes('authorization?clientID=')
            ) {
                localStorage.removeItem(key)
            }
        }
    }

    const disconnect = useCallback(
        async function () {
            await web3Connect.clearCachedProvider()
            if (provider?.disconnect && typeof provider.disconnect === 'function') {
                await provider.disconnect()
            }
            clearStorage()
            dispatch({type: 'RESET_WEB3_PROVIDER',})
        },
        [provider]
    )

    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts: string[]) => {
                dispatch({
                    type: 'SET_ADDRESS',
                    address: accounts[0],
                })
            }

            const handleChainChanged = (_hexChainId: string) => {
                window.location.reload()
            }

            const handleDisconnect = (error: { code: number; message: string }) => {
                console.log('disconnect', error)
                disconnect()
            }

            // provider.on('accountsChanged', handleAccountsChanged)
            // provider.on('chainChanged', handleChainChanged)
            provider.on('disconnect', handleDisconnect)

            return () => {
                if (provider.removeListener) {
                    // provider.removeListener('accountsChanged', handleAccountsChanged)
                    // provider.removeListener('chainChanged', handleChainChanged)
                    provider.removeListener('disconnect', handleDisconnect)
                }
            }
        }
    }, [provider, disconnect])

    return <Game chainId={chainId} connect={connect} user={user} logout={disconnect} provider={provider}
                 address={address} web3Provider={web3Provider}/>
}

export default Home
