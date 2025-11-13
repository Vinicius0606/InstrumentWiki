import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstrumentsList from "../pages/InstrumentsList/InstrumentsList";
import AddInstrument from "../pages/AddInstrument/AddInstrument";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import RemoverGenerico from "../pages/RemoverGenerico/Remover";
import AddAudio from "../pages/AddAudio/AddAudio";
import AddGenerico from "../pages/AddGenerico/AddGenerico";
import { useState } from "react";
import EditInstrument from "../pages/editarInstrumento/EditInstrument";
import EditMaterial from "../pages/EditarMaterial/EditMaterial";
import EditFamily from "../pages/EditarFamilia/EditFamily";
import EditAfinacao from "../pages/EditarAfinacao/EditAfinacao";
import EditAudio from "../pages/EditarAudio/EditAudio";
import EditTecnica from "../pages/EditarTecnica/EditTecnica";

export default function Router() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InstrumentsList />} />
        <Route path="/adicionarInstrumento" element={<AddInstrument/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/removerGenerico/:nomeTabela" element={<RemoverGenerico/>} />
        <Route path="/adicionarÁudio" element={<AddAudio/>} />
        <Route path="/adicionarGenerico/:nomeTabela/:id" element={<AddGenerico/>} />
        <Route path="/editarInstrumento/" element={<EditInstrument/>} />
        <Route path="/editarGenerico/Material/" element={<EditMaterial/>} />
        <Route path="/editarGenerico/Técnica/" element={<EditTecnica/>} />
        <Route path="/editarGenerico/Família/" element={<EditFamily/>} />
        <Route path="/editarGenerico/Afinação/" element={<EditAfinacao/>} />
        <Route path="/editarÁudio/" element={<EditAudio/>} />
      </Routes>
    </BrowserRouter>
  );
}