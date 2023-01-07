import React, {useEffect, useRef, useState} from "react";
import {createText, initCanvasScene, showNft} from "./Objects";
import {fetchNft} from "./Query";

export const CustomLoader = () => {
    return <div>
        <div className="lds-ring">
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    </div>
}

const Game = ({logout, chainId, connect, user, provider, address, web3Provider}: any) => {
    const canvasRef = useRef(null);

    const [escapeKey, setEscapeKey] = useState(false)
    const [nfts, setNfts] = useState<any[]>([])
    const [block, setBlock] = useState(true)
    const [inputAddress, setInputAddress] = useState<string>('')
    const [isOpenInputAddress, setIsOpenInputAddress] = useState<boolean>(false)

    const [idAddressError, setIsAddressError] = useState<boolean>(false)
    const [loading, setLoading] = useState<any>(0)
    let engine: any = null
    let scene: any = null

    useEffect(() => {
        initCanvasScene(engine, scene, canvasRef, setEscapeKey)
    }, []);

    useEffect(() => {
        showNft(scene, nfts)
    }, [nfts]);

    useEffect(() => {
        if (address) {
            setBlock(false)
            fetchNft(address, setNfts, user, inputAddress)
        }
    }, [address]);

    useEffect(() => {
        createText(scene, user?.sub)
    }, [user])

    const handlerConnect = (e: any) => {
        e.preventDefault();
        connect().then(() => {
            setBlock(false)
        })
    }

    const handlerDisconnect = () => {
        logout()
        window.location.reload();
    }

    const handlerSearchByAddress = (e: any) => {
        e.preventDefault();
        const validRegEx = /^0x([A-Fa-f0-9]{40})$/;
        if (!inputAddress || !validRegEx.test(inputAddress.trim())) {
            setIsAddressError(true)

            console.log("error")
        } else {
            setLoading(true)
            fetchNft(address, setNfts, user, inputAddress).then(() => {
                setBlock(false)
            }).then(() => setLoading(false))
        }
    }

    return (
        <div style={{height: '100vh', overflow: 'hidden'}}>

            {(escapeKey || block) &&
                <div className={'canvas-container'}>
                    <div className="center-div">
                        <div className="children-center-div">
                            {!address
                                ? <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <button className={"button"}
                                            onClick={(e: any) => handlerConnect(e)}
                                    >
                                        Connect
                                    </button>
                                    <button className={"button"}
                                            style={{width: '150px', marginLeft: '75px'}}
                                            onClick={() => setIsOpenInputAddress(!isOpenInputAddress)}
                                    >
                                        Paste address
                                    </button>
                                </div>
                                :
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <button className={"button"}
                                            onClick={() => {
                                                setEscapeKey(!escapeKey)
                                            }}
                                    >
                                        Resume
                                    </button>
                                    <button className={"button"}
                                            style={{width: '150px', marginLeft: '75px'}}
                                            onClick={handlerDisconnect}>
                                        Try new address
                                    </button>
                                </div>
                            }
                            {isOpenInputAddress && <>
                                <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <input value={inputAddress}
                                           onChange={(e: any) => {
                                               setIsAddressError(false);
                                               setInputAddress(e.target.value)
                                           }}
                                           type="text"
                                           id="fname"
                                           placeholder="Address..."/>
                                    <button disabled={loading}
                                            style={{marginLeft: '5px'}}
                                            className={"button"}
                                            onClick={(e: any) => {
                                                handlerSearchByAddress(e)
                                            }}
                                    >
                                        Find
                                    </button>
                                </div>
                                {idAddressError &&
                                    <div style={{color: 'red', fontWeight: '600'}}>
                                        Invalid Wallet Address
                                    </div>
                                }
                                {loading ? <CustomLoader/> : ""}
                            </>
                            }
                        </div>
                    </div>
                </div>
            }
            <canvas style={{border: '1px solid #000000'}}
                    ref={canvasRef}
            />
        </div>
    );
};

export default Game;
