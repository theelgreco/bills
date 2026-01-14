import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { useColorScheme } from "./hooks/color-theme";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Invite from "./pages/Invite";

function App() {
    useColorScheme();

    return (
        <BrowserRouter>
            <main className="w-full h-full">
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/invite" element={<Invite />}></Route>
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
