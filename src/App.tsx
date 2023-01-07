import Home from "./components/Home";
import Game from "./components/Game";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

function App() {
    useEffect(() => {
        document.title = "NFT Gallery with Unstoppable Domains Login"
    }, []);

    return (
        <Routes>
            <Route path={"/game"} element={<Game/>}/>
            <Route path="/" element={<Home/>}/>
        </Routes>
    )
}

export default App

