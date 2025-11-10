import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstrumentsList from "../pages/InstrumentsList/InstrumentsList";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InstrumentsList />} />    
      </Routes>
    </BrowserRouter>
  );
}