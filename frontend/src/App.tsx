import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { useColorScheme } from "./hooks/color-theme";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useRenderCount } from "@uidotdev/usehooks";

function App() {
    const renderCount = useRenderCount();
    useColorScheme();

    return (
        <BrowserRouter>
            <main className="w-full h-full">
                <div className="debug-rerender-count">Rerender count: {renderCount}</div>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
