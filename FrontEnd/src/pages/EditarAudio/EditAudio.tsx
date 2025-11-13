import styles from "../AddInstrument/AddInstrument.module.css"; 
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

type InstrumentoSimples = {
    info: {
        id: string;
        nome: string;
    }
};

// Tipo para a lista de busca
type AudioSimples = {
    id: string;
    titulo: string; // O backend retorna 'nome' no genérico, mas ajustaremos se necessário
    nome?: string;  // Caso venha como 'nome'
    descricao: string;
};

export default function EditAudio() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [idBusca, setIdBusca] = useState(id || "");

    // Listas
    const [listaAudiosBusca, setListaAudiosBusca] = useState<AudioSimples[]>([]);
    const [listaInstrumentos, setListaInstrumentos] = useState<InstrumentoSimples[]>([]);

    // Formulário
    const [instrumentoId, setInstrumentoId] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [nota, setNota] = useState("");
    const [oitava, setOitava] = useState<number | "">("");
    const [bpm, setBpm] = useState<number | "">("");
    const [creditos, setCreditos] = useState("");
    const [arquivoUrl, setArquivoUrl] = useState(""); 
    const [novoArquivo, setNovoArquivo] = useState<File | null>(null); 

    // --- 1. CARREGAR LISTAS GERAIS ---
    useEffect(() => {
        async function fetchAllData() {
            try {
                const [resInst, resAud] = await Promise.all([
                    fetch('http://localhost:5000/instrumentosGet'),
                    // Usamos a rota genérica para listar todos os áudios (mesmo os vinculados, se possível, ou criar rota específica)
                    // Como idFkNullGet só traz órfãos, o ideal seria uma rota /audiosGet. 
                    // Vamos usar retornarIDsGenerico para Áudio se existir, senão idFkNullGet
                    fetch('http://localhost:5000/retornarIDsGenerico?nomeTabela=Áudio') 
                ]);

                if (resInst.ok) setListaInstrumentos(await resInst.json());
                
                if (resAud.ok) {
                    const dados = await resAud.json();
                    // Normaliza 'nome' para 'titulo' se necessário
                    const dadosNormalizados = dados.map((d: any) => ({...d, titulo: d.titulo || d.nome}));
                    setListaAudiosBusca(dadosNormalizados);
                }

            } catch (error) {
                console.error("Erro ao carregar listas:", error);
            }
        }
        fetchAllData();
    }, []);

    // --- 2. CARREGAR DADOS DO ÁUDIO SELECIONADO ---
    useEffect(() => {
        if (id) setIdBusca(id);
        if (!id) return;

        async function loadAudioData() {
            try {
                setIsLoading(true);
                console.log(`Buscando áudio ID: ${id}...`);
                
                // --- MOCK: Simulação (Substituir por fetch real quando tiver rota GET Audio por ID) ---
                // const res = await fetch(`http://localhost:5000/audioGet?id=${id}`);
                
                // Por enquanto, vamos tentar encontrar na lista de busca se ela já carregou, 
                // mas ela só tem dados básicos. Para dados completos, precisaríamos do fetch real.
                
                // Dados Mockados para permitir a edição visual:
                const audioMock = {
                    id: id,
                    instrumento_id: "INS202500001", 
                    titulo: "Escala Maior em Dó",
                    descricao: "Gravação limpa.",
                    nota: "C",
                    oitava: 3,
                    bpm: 120,
                    arquivo: "https://fake-storage.com/audio.mp3",
                    credito_gravacao: "Estúdio A"
                };

                // Preencher
                setInstrumentoId(audioMock.instrumento_id);
                setTitulo(audioMock.titulo);
                setDescricao(audioMock.descricao);
                setNota(audioMock.nota);
                setOitava(audioMock.oitava);
                setBpm(audioMock.bpm);
                setArquivoUrl(audioMock.arquivo);
                setCreditos(audioMock.credito_gravacao);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadAudioData();
    }, [id]);

    // --- HANDLERS ---
    const handleBuscarId = (e: React.FormEvent) => {
        e.preventDefault();
        if (idBusca) navigate(`/editar-audio/${idBusca}`);
    };

    const handleCardClick = (idSelecionado: string) => {
        navigate(`/editar-audio/${idSelecionado}`);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!instrumentoId) return alert("Selecione um instrumento!");
        if (!titulo) return alert("O título é obrigatório!");

        try {
            let urlFinal = arquivoUrl;
            if (novoArquivo) {
                urlFinal = `https://fake-storage.com/novo_${novoArquivo.name}`;
            }

            const dadosUpdate = {
                id: id, 
                instrumento_id: instrumentoId,
                titulo: titulo,
                descricao: descricao,
                nota: nota,
                oitava: Number(oitava),
                bpm: bpm === "" ? null : Number(bpm),
                arquivo: urlFinal,
                credito_gravacao: creditos
            };

            console.log("Enviando Update:", dadosUpdate);

            const response = await fetch('http://localhost:5000/atualizarAudioPut', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUpdate)
            });

            if (response.ok) {
                alert("Áudio atualizado com sucesso!");
            } else {
                alert("Erro ao atualizar áudio.");
            }

        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        }
    };

    return (
        <div className={styles.div}>
            <Header ActiveButton={2} />
            
            <div className={styles.contentWrapper}>
                
                {/* --- ÁREA DE BUSCA --- */}
                <div style={{marginBottom: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                    <form onSubmit={handleBuscarId} style={{display: 'flex', gap: '10px', alignItems: 'end', marginBottom: '20px'}}>
                        <label className={styles.label} style={{flex: 1}}>
                            Buscar Áudio por ID:
                            <input className={styles.input} type="text" placeholder="Ex: AUD2025..." 
                                value={idBusca} onChange={e => setIdBusca(e.target.value)} />
                        </label>
                        <button type="submit" className={styles.buttonSecondary} style={{marginBottom: '0', height: 'fit-content'}}>🔍 Buscar</button>
                    </form>

                    <div className={styles.listaID}>
                        <h3 style={{color:'white'}}>Ou selecione na lista:</h3>
                        <div className={styles.listaIDScroll}>
                            {listaAudiosBusca.length > 0 ? (
                                listaAudiosBusca.map((info) => (
                                    <div 
                                        className={styles.listaIDScrollCard} 
                                        key={info.id}
                                        onClick={() => handleCardClick(String(info.id))}
                                        style={{cursor: 'pointer', border: String(info.id) === String(id) ? '2px solid #00ff88' : ''}}
                                    >
                                        <div className={styles.listaIDScrollCardNomeID}>
                                            <p className={styles.fontColorGradiant}>Título: </p>
                                            <p><span className={styles.fontColorGradiant}>ID: </span> {info.id}</p>
                                        </div>
                                        <p className={styles.scrollVertical} style={{fontWeight:'bold'}}>{info.titulo || info.nome}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{color:'white'}}>Carregando lista...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- FORMULÁRIO --- */}
                {id ? (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <main className={styles.main}>
                            <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                Editar Áudio #{id}
                                {isLoading && <span style={{fontSize: '0.5em', color: 'yellow', opacity: 0.8}}>(Carregando...)</span>}
                            </h1>
                            

                            {/* 1. INSTRUMENTO VINCULADO */}
                            <label className={styles.label}>
                                Vincular ao Instrumento:
                                <select 
                                    className={styles.input} 
                                    value={instrumentoId} 
                                    onChange={e => setInstrumentoId(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {listaInstrumentos.map(inst => (
                                        <option key={inst.info.id} value={inst.info.id}>
                                            {inst.info.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* 2. ARQUIVO */}
                            <label className={styles.label}>
                                Arquivo de Áudio:
                                <div style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '5px'}}>
                                    Atual: {arquivoUrl.split('/').pop()}
                                </div>
                                <input 
                                    className={styles.input} 
                                    type="file" 
                                    accept="audio/*"
                                    onChange={e => setNovoArquivo(e.target.files?.[0] || null)}
                                />
                            </label>

                            {/* 3. DADOS DO ÁUDIO */}
                            <label className={styles.label}>
                                Título:
                                <input className={styles.input} type="text" value={titulo} onChange={e => setTitulo(e.target.value)} />
                            </label>

                            <label className={styles.label}>
                                Descrição:
                                <textarea className={styles.input} value={descricao} onChange={e => setDescricao(e.target.value)} />
                            </label>

                            <div className={styles.horizontalGroup}>
                                <label className={styles.label} style={{flex: 1}}>
                                    Nota:
                                    <input className={styles.input} type="text" value={nota} onChange={e => setNota(e.target.value)} />
                                </label>
                                <label className={styles.label} style={{flex: 1}}>
                                    Oitava:
                                    <input className={styles.input} type="number" value={oitava} onChange={e => setOitava(e.target.value === "" ? "" : Number(e.target.value))} />
                                </label>
                            </div>

                            <div className={styles.horizontalGroup}>
                                <label className={styles.label} style={{flex: 1}}>
                                    BPM:
                                    <input className={styles.input} type="number" value={bpm} onChange={e => setBpm(e.target.value === "" ? "" : Number(e.target.value))} />
                                </label>
                                <label className={styles.label} style={{flex: 1}}>
                                    Créditos:
                                    <input className={styles.input} type="text" value={creditos} onChange={e => setCreditos(e.target.value)} />
                                </label>
                            </div>

                            <button className={styles.submit} type="submit">Salvar Alterações</button>
                        </main>
                    </form>
                ) : (
                    <div style={{textAlign: 'center', color: '#aaa', padding: '20px'}}>
                        <h2>Selecione um áudio na lista para editar.</h2>
                    </div>
                )}
            </div>
        </div>
    );
}