import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstrumentsList from "../pages/InstrumentsList/InstrumentsList";
import AddInstrument from "../pages/AddInstrument/AddInstrument";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InstrumentsList />} />
        <Route path="/adicionarInstrumento" element={<AddInstrument />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}