import styles from "../AddInstrument/AddInstrument.module.css"; // Reutilizando o CSS padrão
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import type { Usuario } from "../../types";
import { useNavigate } from "react-router-dom";

type InstrumentoSimples = {
    info: {
        id: string;
        nome: string;
    }
};

export default function AddAudio() {
    
    const [instrumentoId, setInstrumentoId] = useState("");
    const [listaInstrumentos, setListaInstrumentos] = useState<InstrumentoSimples[]>([]);
    const [arquivo, setArquivo] = useState<string>("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [nota, setNota] = useState("");
    const [oitava, setOitava] = useState<number | "">("");
    const [bpm, setBpm] = useState<number | "">("");
    const [creditos, setCreditos] = useState("");
    const [usuario, setUsuario] = useState<Usuario>();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!instrumentoId) return alert("Selecione um instrumento!");
        if (!arquivo) return alert("Selecione um arquivo de áudio!");
        if (!titulo) return alert("O título é obrigatório!");
        if (!nota) return alert("A nota é obrigatória!");
        if (oitava === "") return alert("A oitava é obrigatória!");

        try {

            const verificarID = await fetch(`http://localhost:5000/verificarExistenciaGet?nomeTabela=instrumento&id=${instrumentoId}`, {
                credentials: "include",
            })

            if(verificarID.status != 200){

                alert("Erro no sistema ao verificar a família do instrumento!");

                return;
            }

            const dadoID = await verificarID.json();

            if(!dadoID["Exists"]){

                alert("O id da família de instrumento não existe!");

                return;
            }

            const dadosAudio = {
                instrumento_id: instrumentoId,
                titulo: titulo,
                descricao: descricao,
                nota: nota,
                oitava: Number(oitava),
                bpm: bpm === "" ? null : Number(bpm),
                arquivo: "semArquivo",
                credito_gravacao: creditos
            };

            console.log("Enviando Áudio:", dadosAudio);

            const response = await fetch('http://localhost:5000/inserirAudioPost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dadosAudio)
            });


            if (response.status === 200) {

                alert("Áudio adicionado com sucesso!");

                navigate("/", { replace: true });

            } else {
                alert("Erro ao salvar áudio no banco.");

            }

        } catch (error) {
            console.error(error);
            alert("Erro de conexão com o servidor.");
        }
    };

    const verificarToken = async () => {

        try{
            const res = await fetch(`http://localhost:5000/testarToken`, {
                credentials: "include",
            })

            if(res.status !== 200){

                navigate("/login", { replace: true })

                return;
            }

            const data = await res.json();

            setUsuario(data);

        } catch(erro){

            alert("Erro no sistema!");
            console.log(erro);
            
            return;
        }
    }

    useEffect(() => {

        //verificarToken();

    }, []);

    return (
        <div className={styles.div}>
            <Header ActiveButton={2} usuario={usuario}/>
            
            <form className={styles.form} onSubmit={handleSubmit}>
                <main className={styles.main}>
                    <h1>Adicionar Áudio Avulso</h1>
                    

                    <label className={styles.label}>
                        Instrumento_id
                        <input 
                            className={styles.input} required
                            type="text" placeholder="Exemplo: INS202500001"
                            onChange={e => setInstrumentoId(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        Arquivo de Áudio:
                        <input 
                            className={styles.input} required
                            type="text" 
                            onChange={e => setArquivo(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        Título do Áudio:
                        <input className={styles.input} type="text" placeholder="Ex: Corda Solta, Escala Maior"  required
                            value={titulo} onChange={e => setTitulo(e.target.value)} />
                    </label>

                    <label className={styles.label}>
                        Descrição:
                        <textarea className={styles.input} placeholder="Detalhes sobre a gravação..."
                            value={descricao} onChange={e => setDescricao(e.target.value)} />
                    </label>

                    <div className={styles.radioGroup} style={{gap: '20px'}}>
                        <label className={styles.label} style={{flex: 1}}>
                            Nota Principal:
                            <input className={styles.input} type="text" placeholder="Ex: C, F#" required
                                value={nota} onChange={e => setNota(e.target.value)} />
                        </label>

                        <label className={styles.label} style={{flex: 1}}>
                            Oitava:
                            <input className={styles.input} type="number" placeholder="Ex: 3, 4" required
                                value={oitava} onChange={e => setOitava(e.target.value === "" ? "" : Number(e.target.value))} />
                        </label>
                    </div>

                    <div className={styles.radioGroup} style={{gap: '20px'}}>
                        <label className={styles.label} style={{flex: 1}}>
                            BPM:
                            <input className={styles.input} type="number" placeholder="Ex: 120" 
                                value={bpm} onChange={e => setBpm(e.target.value === "" ? "" : Number(e.target.value))} />
                        </label>

                        <label className={styles.label} style={{flex: 1}}>
                            Créditos:
                            <input className={styles.input} type="text" placeholder="Quem gravou?" 
                                value={creditos} onChange={e => setCreditos(e.target.value)} />
                        </label>
                    </div>

                    <button className={styles.submit} type="submit">Salvar Áudio</button>
                </main>
            </form>
        </div>
    );
}