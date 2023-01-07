type StateType = {
    provider?: any
    web3Provider?: any
    address?: string
    chainId?: number,
    user?: any
}

type ActionType =
    | {
    type: 'SET_WEB3_PROVIDER'
    provider?: StateType['provider']
    web3Provider?: StateType['web3Provider']
    address?: StateType['address']
    chainId?: StateType['chainId']
    user?: StateType['user']
}
    | {
    type: 'SET_ADDRESS'
    address?: StateType['address']
}
    | {
    type: 'SET_CHAIN_ID'
    chainId?: StateType['chainId']
}
    | {
    type: 'RESET_WEB3_PROVIDER'
}

export const initialState: StateType | any = {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null,
    user: {},
}

export function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case 'SET_WEB3_PROVIDER':
            return {
                ...state,
                provider: action.provider,
                web3Provider: action.web3Provider,
                address: action.address,
                chainId: action.chainId,
                user: action.user
            }
        case 'SET_ADDRESS':
            return {
                ...state,
                address: action.address,
            }
        case 'SET_CHAIN_ID':
            return {
                ...state,
                chainId: action.chainId,
            }
        case 'RESET_WEB3_PROVIDER':
            return initialState
        default:
            throw new Error()
    }
}
