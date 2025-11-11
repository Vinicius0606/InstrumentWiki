import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstrumentsList from "../pages/InstrumentsList/InstrumentsList";
import AddInstrument from "../pages/AddInstrument/AddInstrument";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InstrumentsList />} />
        <Route path="/adicionar" element={<AddInstrument />} />
      </Routes>
    </BrowserRouter>
  );
}