import styles from "../AddInstrument/AddInstrument.module.css"; // Reutiliza o CSS
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type {
    Generico,
    Instrumento,
    InstrumentoEspecializacao,
    ParteMaterial,
    AlcanceInstrumento,
    AudioTipo
} from "../../types";
import { AfinacaoTransposicao, CategoriaPercussao, TocadoCom } from "../../types";

// Estado Inicial
const estadoInicial: Instrumento = {
    info: { id: "", nome: "", descricao: "" },
    familia_instrumento: { id: "", nome: "", descricao: null },
    historia: "",
    classificacao_sonoridade: "",
    imagem: null,
    apelidos: [],
    audios: [],
    partesMateriais: [],
    alcances: [],
    afinacao: { info: { id: "", nome: "", descricao: "" }, referencia: "", contexto: "" },
    especializacoes: { especializacao: "Harmônico", opcao1: 0, opcao1Nome: "Número de Cordas", opcao2: false, opcao2Nome: "", opcao3: false, opcao3Nome: "" }
};

export default function EditInstrument() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [instrumento, setInstrumento] = useState<Instrumento>(estadoInicial);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estado da barra de busca manual
    const [idBusca, setIdBusca] = useState(id || "");

    // --- LISTAS ---
    const [listaInstrumentosBusca, setListaInstrumentosBusca] = useState<Generico[]>([]); 
    const [listaFamilias, setListaFamilias] = useState<Generico[]>([]);
    const [listaAfinacoes, setListaAfinacoes] = useState<Generico[]>([]);
    const [listaMateriais, setListaMateriais] = useState<Generico[]>([]);
    const [listaAudiosOrfaos, setListaAudiosOrfaos] = useState<Generico[]>([]);

    // --- ESTADOS TEMPORÁRIOS ---
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Modais
    const [isAfinacaoModalOpen, setIsAfinacaoModalOpen] = useState(false);
    const [isAlcanceModalOpen, setIsAlcanceModalOpen] = useState(false);
    const [isParteMaterialModalOpen, setIsParteMaterialModalOpen] = useState(false);
    const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

    // Temps Alcance
    const [tempAlcanceTipo, setTempAlcanceTipo] = useState("");
    const [tempAlcanceMinimo, setTempAlcanceMinimo] = useState("");
    const [tempAlcanceMaximo, setTempAlcanceMaximo] = useState("");

    // Temps Parte
    const [parteNome, setParteNome] = useState("");
    const [parteDescricao, setParteDescricao] = useState("");
    const [selectedMaterialId, setSelectedMaterialId] = useState("");

    // Temps Áudio
    const [selectedAudioId, setSelectedAudioId] = useState("");

    // Temps Afinação
    const [selectedAfinacaoId, setSelectedAfinacaoId] = useState("");
    const [afinacaoContexto, setAfinacaoContexto] = useState("");

    const [usuario, setUsuario] = useState<any>(null);

    const verificarToken = async () => {

        try{
            const res = await fetch(`http://localhost:5000/testarToken`, {
                credentials: "include",
            })

            if(res.status !== 200){

                navigate("/login", { replace: true })

                return;
            }

            const data = await res.json()

            setUsuario(data)

            console.log(data);

        } catch(erro){

            alert("Erro no sistema!");
            console.log(erro);
            
            return;
        }
        
    }

    useEffect(() => {
        
        verificarToken();

    }, []);

    // --- 1. CARREGAR LISTA DE BUSCA (MENU LATERAL) ---
    useEffect(() => {
        async function carregarListaBusca() {
            try {
                const res = await fetch('http://localhost:5000/retornarIDsGenerico?nomeTabela=Instrumento');
                if (res.ok) {
                    const dados = await res.json();
                    setListaInstrumentosBusca(dados);
                }
            } catch (error) {
                console.error("Erro ao carregar lista de instrumentos:", error);
            }
        }
        carregarListaBusca();
    }, []);

    // --- 2. CARREGAR DADOS DO INSTRUMENTO SELECIONADO ---
    useEffect(() => {
        if (id) setIdBusca(id);
        if (!id) return; 

        async function loadData() {
            try {
                setIsLoading(true);

                // Busca listas auxiliares
                const [resFam, resAfi, resMat, resAud, resInst] = await Promise.all([
                    fetch('http://localhost:5000/familiasGet'),
                    fetch('http://localhost:5000/idFkNullGet?tabelaNome=afinacao'),
                    fetch('http://localhost:5000/idFkNullGet?tabelaNome=material'),
                    fetch('http://localhost:5000/idFkNullGet?tabelaNome=audio'),
                    fetch('http://localhost:5000/instrumentosGet') 
                ]);

                if (resFam.ok) setListaFamilias(await resFam.json());
                if (resAfi.ok) setListaAfinacoes(await resAfi.json());
                if (resMat.ok) setListaMateriais(await resMat.json());
                if (resAud.ok) setListaAudiosOrfaos(await resAud.json());

                if (resInst.ok) {
                    const listaCompleta: Instrumento[] = await resInst.json();
                    const itemEncontrado = listaCompleta.find(item => String(item.info.id) === String(id));

                    if (itemEncontrado) {
                        const dadosAjustados = {
                            ...itemEncontrado,
                            // @ts-ignore
                            classificacao_sonoridade: itemEncontrado.classificacao_sonoridade || itemEncontrado.classificao_sonoridade
                        };
                        setInstrumento(dadosAjustados);
                        
                        // Preenche estados dos modais se tiver dados
                        if (dadosAjustados.afinacao?.info?.id) {
                            setSelectedAfinacaoId(String(dadosAjustados.afinacao.info.id));
                            setAfinacaoContexto(dadosAjustados.afinacao.contexto || "");
                        }
                        if (dadosAjustados.imagem) setImagePreview(dadosAjustados.imagem);
                    } else {
                        alert("Instrumento não encontrado (ID inválido).");
                    }
                }

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [id, navigate]);

    useEffect(() => {
        return () => { if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview); };
    }, [imagePreview, imageFile]);

    // --- HANDLERS GERAIS ---
    const handleBuscarId = (e: React.FormEvent) => {
        e.preventDefault();
        if (idBusca) navigate(`/editar-instrumento/${idBusca}`);
    };

    const handleCardClick = (idSelecionado: string) => {
        navigate(`/editar-instrumento/${idSelecionado}`);
        window.scrollTo(0, 0);
    };

    // --- HELPER FUNCTIONS (ESTADO) ---
    const updateRoot = (field: keyof Instrumento, value: any) => setInstrumento(prev => ({ ...prev, [field]: value }));
    const updateInfo = (field: keyof Generico, value: any) => setInstrumento(prev => ({ ...prev, info: { ...prev.info, [field]: value } }));
    
    const handleSonoridadeChange = (valor: string) => {
        setInstrumento(prev => ({
            ...prev,
            classificacao_sonoridade: valor,
            especializacoes: {
                ...prev.especializacoes,
                opcao2: prev.especializacoes.especializacao === "Rítmico" ? valor as any : prev.especializacoes.opcao2
            }
        }));
    };

    const handleTipoEspecializacaoChange = (novoTipo: string) => {
        let novaSpec: InstrumentoEspecializacao;
        if (novoTipo === "Harmônico") {
            novaSpec = { especializacao: "Harmônico", opcao1: 0, opcao1Nome: "Número de Cordas", opcao2: false, opcao2Nome: "", opcao3: false, opcao3Nome: "" };
        } else if (novoTipo === "Rítmico") {
            novaSpec = { especializacao: "Rítmico", opcao1: false, opcao1Nome: "", opcao2: (instrumento.classificacao_sonoridade as any) || false, opcao2Nome: "Sonoridade", opcao3: TocadoCom.BAQUETAS, opcao3Nome: "Tocado Com" };
        } else { 
            novaSpec = { especializacao: "Melódico", opcao1: false, opcao1Nome: "", opcao2: AfinacaoTransposicao.C, opcao2Nome: "Transposição", opcao3: false, opcao3Nome: "" };
        }
        setInstrumento(prev => ({ ...prev, especializacoes: novaSpec }));
    };

    // --- MODAL HANDLERS (LÓGICA) ---
    const handleSetAfinacao = () => {
        if (!selectedAfinacaoId) return alert("Selecione uma afinação.");
        const afinacaoObj = listaAfinacoes.find(a => String(a.id) === selectedAfinacaoId);
        if (afinacaoObj) {
            setInstrumento(prev => ({
                ...prev,
                afinacao: {
                    info: { id: String(afinacaoObj.id), nome: afinacaoObj.nome, descricao: afinacaoObj.descricao },
                    referencia: null, 
                    contexto: afinacaoContexto
                }
            }));
            setIsAfinacaoModalOpen(false);
        }
    };

    const handleAddAlcance = () => {
        if (!tempAlcanceTipo) return alert("Tipo obrigatório");
        const novo: AlcanceInstrumento = { tipo: tempAlcanceTipo, nota_min: tempAlcanceMinimo || null, nota_max: tempAlcanceMaximo || null };
        setInstrumento(prev => ({ ...prev, alcances: [...prev.alcances, novo] }));
        setTempAlcanceTipo(""); setTempAlcanceMinimo(""); setTempAlcanceMaximo("");
    };
    const handleRemoveAlcance = (idx: number) => setInstrumento(prev => ({ ...prev, alcances: prev.alcances.filter((_, i) => i !== idx) }));

    const handleAddParte = () => {
        if (!parteNome || !selectedMaterialId) return alert("Nome e Material obrigatórios");
        const materialObj = listaMateriais.find(m => String(m.id) === selectedMaterialId);
        if (!materialObj) return;
        const nova: ParteMaterial = { 
            parteNome: parteNome, 
            parteDescricao: parteDescricao, 
            materialId: String(materialObj.id), 
            materialNome: materialObj.nome, 
            materialDescricao: materialObj.descricao || "" 
        };
        setInstrumento(prev => ({ ...prev, partesMateriais: [...(prev.partesMateriais || []), nova] }));
        setParteNome(""); setParteDescricao(""); setSelectedMaterialId("");
    };
    const handleRemoveParte = (idx: number) => setInstrumento(prev => ({ ...prev, partesMateriais: (prev.partesMateriais || []).filter((_, i) => i !== idx) }));

    const handleAddAudio = () => {
        if (!selectedAudioId) return alert("Selecione um áudio");
        const audioObj = listaAudiosOrfaos.find(a => String(a.id) === selectedAudioId);
        if (!audioObj) return;
        const novo: AudioTipo = {
            info: { id: String(audioObj.id), nome: audioObj.nome, descricao: audioObj.descricao },
            audio: "", nota: "", oitava: 0, bpm: null, creditos: null
        };
        setInstrumento(prev => ({ ...prev, audios: [...(prev.audios || []), novo] }));
        setListaAudiosOrfaos(prev => prev.filter(a => String(a.id) !== selectedAudioId));
        setSelectedAudioId("");
    };
    const handleRemoveAudio = (idx: number) => {
        setInstrumento(prev => ({ ...prev, audios: (prev.audios || []).filter((_, i) => i !== idx) }));
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div className={styles.div}>
            <Header ActiveButton={2} usuario={usuario} />

            <div className={styles.contentWrapper}>
                
                {/* --- ÁREA DE BUSCA E LISTA --- */}
                <div style={{marginBottom: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                    
                    {/* Busca Manual */}
                    <form onSubmit={handleBuscarId} style={{display: 'flex', gap: '10px', alignItems: 'end', marginBottom: '20px'}}>
                        <label className={styles.label} style={{flex: 1}}>
                            Buscar por ID:
                            <input className={styles.input} type="text" placeholder="Ex: INS2025..." 
                                value={idBusca} onChange={e => setIdBusca(e.target.value)} />
                        </label>
                        <button type="submit" className={styles.buttonSecondary} style={{marginBottom: '0', height: 'fit-content'}}>🔍 Buscar</button>
                    </form>

                    {/* Lista Lateral */}
                    <div className={styles.listaID}>
                        <h3 style={{color:'white'}}>Ou selecione na lista:</h3>
                        <div className={styles.listaIDScroll}>
                            {listaInstrumentosBusca.length > 0 ? (
                                listaInstrumentosBusca.map((info) => (
                                    <div 
                                        className={styles.listaIDScrollCard} 
                                        key={info.id}
                                        onClick={() => handleCardClick(String(info.id))}
                                        style={{cursor: 'pointer', border: String(info.id) === String(id) ? '2px solid #00ff88' : ''}}
                                    >
                                        <div className={styles.listaIDScrollCardNomeID}>
                                            <p className={styles.fontColorGradiant}>Nome: </p>
                                            <p><span className={styles.fontColorGradiant}>ID: </span> {info.id}</p>
                                        </div>
                                        <p className={styles.scrollVertical} style={{fontWeight:'bold'}}>{info.nome}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{color:'white'}}>Carregando lista...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- FORMULÁRIO DE EDIÇÃO --- */}
                {id ? (
                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            const dadosUpdate = {
                                id: instrumento.info.id,
                                familia_id: String(instrumento.familia_instrumento.id),
                                nome: instrumento.info.nome,
                                descricao: instrumento.info.descricao,
                                historia: instrumento.historia,
                                classificacao_sonoridade: instrumento.classificacao_sonoridade
                            };
                            if (imageFile) { /* upload */ }
                            
                            console.log("Update Payload:", dadosUpdate);
                            
                            const response = await fetch(`http://localhost:5000/atualizarInstrumentoPut`, {
                                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosUpdate)
                            });

                            if (!response.ok) throw new Error("Erro ao atualizar");
                            alert(`Instrumento "${instrumento.info.nome}" atualizado!`);
                            navigate("/instrumentos");
                        } catch (error) { console.error(error); alert("Erro ao salvar."); }
                    }}>
                        <main className={styles.main}>
                            <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                Editando: {instrumento.info.nome || "..."}
                                {isLoading && <span style={{fontSize:'0.5em', color:'yellow'}}>(Atualizando...)</span>}
                            </h1>

                            <label className={styles.label}>Nome do Instrumento: 
                                <input className={styles.input} type="text" value={instrumento.info.nome} onChange={e => updateInfo("nome", e.target.value)} />
                            </label>
                            
                            <label className={styles.label}>Família:
                                <select className={styles.input} value={instrumento.familia_instrumento.id} onChange={e => {
                                    const id = e.target.value; const obj = listaFamilias.find(f => String(f.id) === id);
                                    if (obj) setInstrumento(prev => ({ ...prev, familia_instrumento: { id: String(obj.id), nome: obj.nome, descricao: null } }));
                                }}>
                                    <option value="">Selecione...</option>
                                    {listaFamilias.map(f => <option key={f.id} value={String(f.id)}>{f.nome}</option>)}
                                </select>
                            </label>

                            <label className={styles.label}>Apelidos: 
                                <input className={styles.input} type="text" defaultValue={instrumento.apelidos?.join(", ")} onBlur={e => { const lista = e.target.value.split(',').map(s => s.trim()).filter(s => s); updateRoot("apelidos", lista); }} />
                            </label>
                            <label className={styles.label}>Descrição: 
                                <textarea className={styles.input} value={instrumento.info.descricao || ""} onChange={e => updateInfo("descricao", e.target.value)} />
                            </label>
                            <label className={styles.label}>História: 
                                <textarea className={styles.input} value={instrumento.historia ?? ""} onChange={e => updateRoot("historia", e.target.value)} />
                            </label>

                            <label className={styles.label}>Imagem: 
                                <input className={styles.input} type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if(file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } }} />
                            </label>
                            {imagePreview && <img src={imagePreview} alt="Preview" style={{maxWidth:'200px', borderRadius:'8px', marginTop:'10px'}} />}

                            {/* Classificação */}
                            <label className={styles.label}>Sonoridade:
                                <div className={styles.horizontalGroup}>{[CategoriaPercussao.MEMBRANOFONE, CategoriaPercussao.IDIOFONE, CategoriaPercussao.ELECTROFONE, CategoriaPercussao.AEROFONE, CategoriaPercussao.CORDOFONE].map(cat => (<label key={cat}><input type="radio" name="sonoridade" value={cat} checked={instrumento.classificacao_sonoridade === cat} onChange={e => handleSonoridadeChange(e.target.value)} /> {cat}</label>))}</div>
                            </label>
                            <label className={styles.label}>Tipo:
                                <div className={styles.horizontalGroup}>{["Harmônico", "Melódico", "Rítmico"].map(tipo => (<label key={tipo}><input type="radio" name="tipoEsp" value={tipo} checked={instrumento.especializacoes.especializacao === tipo} onChange={e => handleTipoEspecializacaoChange(e.target.value)} /> {tipo}</label>))}</div>
                            </label>

                            {/* Condicionais */}
                            {instrumento.especializacoes.especializacao === "Harmônico" && (
                                <label className={styles.label}>Cordas: 
                                    <input className={styles.input} type="number" value={Number(instrumento.especializacoes.opcao1)} onChange={e => setInstrumento(prev => ({...prev, especializacoes: {...prev.especializacoes, opcao1: Number(e.target.value)}}))} />
                                </label>
                            )}
                            {instrumento.especializacoes.especializacao === "Rítmico" && (
                                <label className={styles.label}>Tocado com:
                                    <div className={styles.horizontalGroup}>{[TocadoCom.BAQUETAS, TocadoCom.MAO, TocadoCom.HIBRIDO, TocadoCom.OUTRO].map(tc => (<label key={tc}><input type="radio" name="tocadoCom" value={tc} checked={instrumento.especializacoes.opcao3 === tc} onChange={e => setInstrumento(prev => ({...prev, especializacoes: { ...prev.especializacoes, opcao3: e.target.value as any }}))} /> {tc}</label>))}</div>
                                </label>
                            )}
                            {instrumento.especializacoes.especializacao === "Melódico" && (
                                <label className={styles.label}>Transposição:
                                    <div className={styles.horizontalGroup}>{[AfinacaoTransposicao.C, AfinacaoTransposicao.Bb, AfinacaoTransposicao.Eb, AfinacaoTransposicao.F, AfinacaoTransposicao.OUTRO].map(tr => (<label key={tr}><input type="radio" name="transposicao" value={tr} checked={instrumento.especializacoes.opcao2 === tr} onChange={e => setInstrumento(prev => ({...prev, especializacoes: { ...prev.especializacoes, opcao2: e.target.value as any }}))} /> {tr}</label>))}</div>
                                </label>
                            )}

                            <div className={styles.configButtons}>
                                <button type="button" className={styles.buttonSecondary} onClick={() => setIsAfinacaoModalOpen(true)}>Configurar Afinação</button>
                                <button type="button" className={styles.buttonSecondary} onClick={() => setIsAlcanceModalOpen(true)}>Alcances</button>
                                <button type="button" className={styles.buttonSecondary} onClick={() => setIsParteMaterialModalOpen(true)}>Partes</button>
                                <button type="button" className={styles.buttonSecondary} onClick={() => setIsAudioModalOpen(true)}>Áudios</button>
                            </div>

                            <button className={styles.submit} type="submit">Salvar Alterações</button>
                        </main>
                    </form>
                ) : (
                    <div style={{textAlign: 'center', color: '#aaa', padding: '20px'}}>
                        <h2>Selecione um instrumento na lista acima para editar.</h2>
                    </div>
                )}
            </div>

            {/* --- MODAL AFINAÇÃO --- */}
            {isAfinacaoModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Selecionar Afinação</h2>
                        <div className={styles.afinacao}>
                            <label>Afinação:</label>
                            <select className={styles.input} value={selectedAfinacaoId} onChange={e => setSelectedAfinacaoId(e.target.value)}>
                                <option value="">Selecione...</option>
                                {listaAfinacoes.map(a => <option key={a.id} value={String(a.id)}>{a.nome}</option>)}
                            </select>
                            <label>Contexto:</label>
                            <input className={styles.input} placeholder="Ex: Padrão" value={afinacaoContexto} onChange={e => setAfinacaoContexto(e.target.value)} />
                            <button type="button" className={styles.submit} onClick={handleSetAfinacao}>Confirmar</button>
                        </div>
                        <button type="button" className={styles.buttonSecondary} onClick={() => setIsAfinacaoModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* --- MODAL ALCANCE --- */}
            {isAlcanceModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Alcances</h2>
                        <div className={styles.afinacao}>
                            <input className={styles.input} placeholder="Tipo" value={tempAlcanceTipo} onChange={e => setTempAlcanceTipo(e.target.value)} />
                            <input className={styles.input} placeholder="Min" value={tempAlcanceMinimo} onChange={e => setTempAlcanceMinimo(e.target.value)} />
                            <input className={styles.input} placeholder="Max" value={tempAlcanceMaximo} onChange={e => setTempAlcanceMaximo(e.target.value)} />
                            <button type="button" className={styles.buttonSecondary} onClick={handleAddAlcance}>Adicionar</button>
                        </div>
                        <div className={styles.modalLists}>
                            {instrumento.alcances.map((a, i) => (
                                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'5px', borderBottom:'1px solid #555'}}>
                                    <span>{a.tipo} ({a.nota_min}-{a.nota_max})</span>
                                    <button type="button" onClick={() => handleRemoveAlcance(i)}>X</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className={styles.submit} onClick={() => setIsAlcanceModalOpen(false)}>Fechar</button>
                    </div>
                </div>
            )}

            {/* --- MODAL PARTES --- */}
            {isParteMaterialModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Partes e Materiais</h2>
                        <div className={styles.afinacao}>
                            <input className={styles.input} placeholder="Nome da Parte" value={parteNome} onChange={e => setParteNome(e.target.value)} />
                            <textarea className={styles.input} placeholder="Descrição da Parte" value={parteDescricao} onChange={e => setParteDescricao(e.target.value)} />
                            <label>Material:</label>
                            <select className={styles.input} value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)}>
                                <option value="">Selecione...</option>
                                {listaMateriais.map(m => <option key={m.id} value={String(m.id)}>{m.nome}</option>)}
                            </select>
                            <button type="button" className={styles.buttonSecondary} onClick={handleAddParte}>Adicionar</button>
                        </div>
                        <div className={styles.modalLists}>
                            {(instrumento.partesMateriais || []).map((p, i) => (
                                <div key={i} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #555', padding:'5px'}}>
                                    <span>{p.parteNome} - {p.materialNome}</span>
                                    <button type="button" onClick={() => handleRemoveParte(i)}>X</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className={styles.submit} onClick={() => setIsParteMaterialModalOpen(false)}>Fechar</button>
                    </div>
                </div>
            )}

            {/* --- MODAL ÁUDIO --- */}
            {isAudioModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Vincular Áudios Existentes</h2>
                        <div className={styles.afinacao}>
                            <label>Áudios disponíveis:</label>
                            <select className={styles.input} value={selectedAudioId} onChange={e => setSelectedAudioId(e.target.value)}>
                                <option value="">Selecione...</option>
                                {listaAudiosOrfaos.map(a => <option key={a.id} value={String(a.id)}>{a.nome || `Áudio ${a.id}`}</option>)}
                            </select>
                            <button type="button" className={styles.buttonSecondary} onClick={handleAddAudio}>Vincular</button>
                        </div>
                        <div className={styles.modalLists}>
                            <h4>Áudios Vinculados:</h4>
                            {(instrumento.audios || []).map((a, i) => (
                                <div key={i} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #555', padding:'5px'}}>
                                    <span>{a.info.nome}</span>
                                    <button type="button" onClick={() => handleRemoveAudio(i)}>X</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className={styles.submit} onClick={() => setIsAudioModalOpen(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}