import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { useColorScheme } from "./hooks/color-theme";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
    useColorScheme();

    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
