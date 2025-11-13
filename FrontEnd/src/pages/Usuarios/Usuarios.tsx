import styles from "./Usuarios.css";
import Header from "../../components/Header/Header";
import type { Instrumento, AudioTipo, Usuario } from "../../types";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {

    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [instrumentoAtivo, setInstrumentoAtivo] = useState<String>("-1");
    const [audioDoMenuAtivo, setAudioDoMenuAtivo] = useState<AudioTipo | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [usuario, setUsuario] = useState<Usuario>()

    const navigate = useNavigate();

    return (
        <div></div>
    )
}