import React from 'react';
import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import Animation from "./components/Animation";
import Home from "./pages/Home";
import Ecb from "./pages/Ecb";
import Gcm from "./pages/GCM";
import Cbc from "./pages/Cbc";
import Xts from "./pages/Xts";

function App() {
    const navigate = useNavigate();
    return (
        <Animation  frames={[
            {
                content: <h1>Hello, React Spring!</h1>,
                animationProps: {
                    from: { opacity: 0, transform: 'translateY(-50px)' },
                    to: { opacity: 1, transform: 'translateY(0px)' }
                }
            },
            {
                content: <h1>Goodbye, React Spring!</h1>,
                animationProps: {
                    from: { opacity: 1, transform: 'translateY(0px)' },
                    to: { opacity: 0, transform: 'translateY(50px)' }
                }
            }
        ]}/>
        // <Routes>
        //     <Route index element={<Home navigate={navigate}/>}/>
        //     <Route path="ecb" element={<Ecb navigate={navigate}/>}/>
        //     <Route path="cbc" element={<Cbc navigate={navigate}/>}/>
        //     <Route path="gcm" element={<Gcm navigate={navigate}/>}/>
        //     <Route path="xtr" element={<Xts navigate={navigate}/>}/>
        //     <Route path="*" element={<Home navigate={navigate}/>}/>
        // </Routes>
    );
}

export default App;
