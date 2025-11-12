import styles from "./AddInstrument.module.css";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import type {
    Afinacao,
    Generico,
    Instrumento,
    InstrumentoEspecializacao,
    ParteMaterial,
    AlcanceInstrumento,
    AudioTipo
} from "../../types";
import { AfinacaoTransposicao, CategoriaPercussao, TocadoCom } from "../../types";

// --- MOCKS DE DADOS ---
const familiasMockadas: Generico[] = [
    { id: 1, nome: "Cordas", descricao: "Instrumentos que produzem som por cordas." },
    { id: 2, nome: "Metais", descricao: "Instrumentos de sopro feitos de metal." },
    { id: 3, nome: "Madeiras", descricao: "Instrumentos de sopro originalmente de madeira." },
    { id: 4, nome: "Percussão", descricao: "Instrumentos tocados por impacto." },
];

// --- ESTADO INICIAL ---
const estadoInicial: Instrumento = {
    info: { id: 0, nome: "", descricao: "" },
    familia_instrumento: { id: 0, nome: "", descricao: null },
    historia: "",
    classificacao_sonoridade: "",
    imagem: null,
    apelidos: [],
    audios: [],
    partesMateriais: [],
    alcances: [],
    afinacao: {
        info: { id: 0, nome: "", descricao: "" },
        referencia: "",
        contexto: ""
    },
    // Padrão inicial: Harmônico
    especializacoes: {
        especializacao: "Harmônico",
        opcao1: 0, opcao1Nome: "Número de Cordas",
        opcao2: false, opcao2Nome: "",
        opcao3: false, opcao3Nome: ""
    }
};

export default function AddInstrument() {

    // --- ESTADO ÚNICO ---
    const [instrumento, setInstrumento] = useState<Instrumento>(estadoInicial);

    // --- ESTADOS AUXILIARES ---
    const [listaFamilias, setListaFamilias] = useState<Generico[]>([]);
    
    // --- ESTADOS TEMPORÁRIOS (Para digitação antes de salvar no objeto principal) ---
    
    // Imagem
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Modais (Visibilidade)
    const [isAfinacaoModalOpen, setIsAfinacaoModalOpen] = useState(false);
    const [isAlcanceModalOpen, setIsAlcanceModalOpen] = useState(false);
    const [isParteMaterialModalOpen, setIsParteMaterialModalOpen] = useState(false);
    const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

    // Temps Alcance
    const [tempAlcanceTipo, setTempAlcanceTipo] = useState("");
    const [tempAlcanceMinimo, setTempAlcanceMinimo] = useState("");
    const [tempAlcanceMaximo, setTempAlcanceMaximo] = useState("");

    // Temps Parte/Material
    const [parteNome, setParteNome] = useState("");
    const [parteDescricao, setParteDescricao] = useState("");
    const [materialNome, setMaterialNome] = useState("");
    const [materialDescricao, setMaterialDescricao] = useState("");

    // Temps Áudio
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioNome, setAudioNome] = useState("");
    const [audioDescricao, setAudioDescricao] = useState("");
    const [audioNota, setAudioNota] = useState("");
    const [audioOitava, setAudioOitava] = useState<number | "">("");
    const [audioBpm, setAudioBpm] = useState<number | "">("");
    const [audioCreditos, setAudioCreditos] = useState("");

    // --- EFEITOS ---
    useEffect(() => {
        setListaFamilias(familiasMockadas);
        // Limpeza de memória da imagem
        return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
    }, [imagePreview]);


    // --- FUNÇÕES DE AJUDA (ATUALIZAÇÃO DO ESTADO PRINCIPAL) ---

    // Atualiza campos simples da raiz (historia, apelidos)
    const updateRoot = (field: keyof Instrumento, value: any) => {
        setInstrumento(prev => ({ ...prev, [field]: value }));
    };

    // Atualiza campos dentro de 'info' (nome, descricao)
    const updateInfo = (field: keyof Generico, value: any) => {
        setInstrumento(prev => ({ ...prev, info: { ...prev.info, [field]: value } }));
    };

    // Atualiza Afinação
    const updateAfinacao = (field: 'nome' | 'descricao' | 'referencia' | 'contexto', value: string) => {
        setInstrumento(prev => {
            if (field === 'nome' || field === 'descricao') {
                return { ...prev, afinacao: { ...prev.afinacao, info: { ...prev.afinacao.info, [field]: value } } };
            }
            return { ...prev, afinacao: { ...prev.afinacao, [field]: value } };
        });
    };

    // Lógica Complexa: Mudar Sonoridade Global
    const handleSonoridadeChange = (valor: string) => {
        setInstrumento(prev => ({
            ...prev,
            classificacao_sonoridade: valor,
            especializacoes: {
                ...prev.especializacoes,
                // Se for rítmico, atualiza também a opcao2
                opcao2: prev.especializacoes.especializacao === "Rítmico" ? valor as any : prev.especializacoes.opcao2
            }
        }));
    };

    // Lógica Complexa: Mudar Tipo de Especialização
    const handleTipoEspecializacaoChange = (novoTipo: string) => {
        let novaSpec: InstrumentoEspecializacao;

        if (novoTipo === "Harmônico") {
            novaSpec = {
                especializacao: "Harmônico",
                opcao1: 0, opcao1Nome: "Número de Cordas",
                opcao2: false, opcao2Nome: "",
                opcao3: false, opcao3Nome: ""
            };
        } else if (novoTipo === "Rítmico") {
            novaSpec = {
                especializacao: "Rítmico",
                opcao1: false, opcao1Nome: "",
                // Mantém a sonoridade se já foi selecionada antes
                opcao2: (instrumento.classificacao_sonoridade as any) || false, opcao2Nome: "Sonoridade",
                opcao3: TocadoCom.BAQUETAS, opcao3Nome: "Tocado Com"
            };
        } else { // Melódico
            novaSpec = {
                especializacao: "Melódico",
                opcao1: false, opcao1Nome: "",
                opcao2: AfinacaoTransposicao.C, opcao2Nome: "Transposição",
                opcao3: false, opcao3Nome: ""
            };
        }

        setInstrumento(prev => ({ ...prev, especializacoes: novaSpec }));
    };

    // --- FUNÇÕES DE MODAL (ADICIONAR ÀS LISTAS) ---

    const handleAddAlcance = () => {
        if (!tempAlcanceTipo) return alert("Tipo obrigatório");
        const novo: AlcanceInstrumento = { tipo: tempAlcanceTipo, nota_min: tempAlcanceMinimo || null, nota_max: tempAlcanceMaximo || null };
        setInstrumento(prev => ({ ...prev, alcances: [...prev.alcances, novo] }));
        setTempAlcanceTipo(""); setTempAlcanceMinimo(""); setTempAlcanceMaximo("");
    };
    const handleRemoveAlcance = (index: number) => {
        setInstrumento(prev => ({ ...prev, alcances: prev.alcances.filter((_, i) => i !== index) }));
    };

    const handleAddParte = () => {
        if (!parteNome) return alert("Nome obrigatório");
        const nova: ParteMaterial = { parteNome, parteDescricao, materialId: 0, materialNome, materialDescricao };
        setInstrumento(prev => ({ ...prev, partesMateriais: [...(prev.partesMateriais || []), nova] }));
        setParteNome(""); setParteDescricao(""); setMaterialNome(""); setMaterialDescricao("");
    };
    const handleRemoveParte = (index: number) => {
        setInstrumento(prev => ({ ...prev, partesMateriais: (prev.partesMateriais || []).filter((_, i) => i !== index) }));
    };

    const handleAddAudio = () => {
        if (!audioFile || !audioNome) return alert("Arquivo e Nome obrigatórios");
        const novo: AudioTipo = {
            info: { id: 0, nome: audioNome, descricao: audioDescricao || null },
            audio: "url_falsa_" + audioFile.name, // Simulação de URL
            nota: audioNota, oitava: Number(audioOitava), bpm: Number(audioBpm) || null, creditos: audioCreditos || null
        };
        setInstrumento(prev => ({ ...prev, audios: [...(prev.audios || []), novo] }));
        setAudioNome(""); setAudioDescricao(""); setAudioFile(null); setAudioNota(""); setAudioOitava(""); setAudioBpm(""); setAudioCreditos("");
    };
    const handleRemoveAudio = (index: number) => {
        setInstrumento(prev => ({ ...prev, audios: (prev.audios || []).filter((_, i) => i !== index) }));
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div className={styles.div}>
            <Header ActiveButton={2} />
            <form className={styles.form} onSubmit={(e) => {
                e.preventDefault();
                
                // Validações Básicas
                if (!instrumento.info.nome) return alert("Nome obrigatório");
                if (!instrumento.familia_instrumento.id) return alert("Família obrigatória");
                if (!instrumento.classificacao_sonoridade) return alert("Sonoridade obrigatória");

                // Preparar Payload (Injetar URL da imagem se houver)
                const payloadFinal = { ...instrumento };
                if (imageFile) {
                    payloadFinal.imagem = `https://fake-bucket.com/${imageFile.name}`;
                }

                console.log("DADOS FINAIS PARA ENVIO:", payloadFinal);
                alert("Sucesso! Verifique o console.");
                // Aqui iria o fetch() enviando payloadFinal
            }}>
                <main className={styles.main}>
                    <h1>Adicionar Instrumento</h1>

                    {/* 1. Nome */}
                    <label className={styles.label}>Nome do Instrumento:
                        <input className={styles.input} type="text" 
                            value={instrumento.info.nome} 
                            onChange={e => updateInfo("nome", e.target.value)} 
                        />
                    </label>

                    {/* 2. Família */}
                    <label className={styles.label}>Família:
                        <select className={styles.input} 
                            value={instrumento.familia_instrumento.id}
                            onChange={e => {
                                const id = Number(e.target.value);
                                const obj = listaFamilias.find(f => f.id === id);
                                if (obj) {
                                    setInstrumento(prev => ({ ...prev, familia_instrumento: { id: obj.id, nome: obj.nome, descricao: null } }));
                                }
                            }}
                        >
                            <option value={0}>Selecione...</option>
                            {listaFamilias.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                        </select>
                    </label>

                    {/* 3. Apelidos */}
                    <label className={styles.label}>Apelidos:
                        <input className={styles.input} type="text" placeholder="Separe por vírgula"
                            onBlur={e => {
                                const lista = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                                updateRoot("apelidos", lista);
                            }}
                        />
                    </label>

                    {/* 4. Descrição e História */}
                    <label className={styles.label}>Descrição:
                        <textarea className={styles.input} value={instrumento.info.descricao || ""} onChange={e => updateInfo("descricao", e.target.value)} />
                    </label>
                    <label className={styles.label}>História:
                        <textarea className={styles.input} value={instrumento.historia} onChange={e => updateRoot("historia", e.target.value)} />
                    </label>

                    {/* 5. Imagem */}
                    <label className={styles.label}>Imagem do Instrumento:
                        <input className={styles.input} type="file" accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if(imagePreview) URL.revokeObjectURL(imagePreview);
                                if(file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                                else { setImageFile(null); setImagePreview(null); }
                            }}
                        />
                    </label>
                    {imagePreview && (
                        <div style={{textAlign:'center', marginTop:'10px'}}>
                            <img src={imagePreview} alt="Preview" style={{maxWidth:'200px', borderRadius:'8px', border:'2px solid #ccc'}} />
                        </div>
                    )}

                    {/* 6. Sonoridade */}
                    <label className={styles.label}>Sonoridade:
                        <div className={styles.horizontalGroup}>
                            {[CategoriaPercussao.MEMBRANOFONE, CategoriaPercussao.IDIOFONE, CategoriaPercussao.ELECTROFONE, CategoriaPercussao.AEROFONE, CategoriaPercussao.CORDOFONE].map(cat => (
                                <label key={cat}>
                                    <input type="radio" name="sonoridade" value={cat}
                                        checked={instrumento.classificacao_sonoridade === cat}
                                        onChange={e => handleSonoridadeChange(e.target.value)}
                                    /> {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </label>
                            ))}
                        </div>
                    </label>

                    {/* 7. Tipo de Especialização */}
                    <label className={styles.label}>Tipo de Especialização:
                        <div className={styles.horizontalGroup}>
                            {["Harmônico", "Melódico", "Rítmico"].map(tipo => (
                                <label key={tipo}>
                                    <input type="radio" name="tipoEsp" value={tipo}
                                        checked={instrumento.especializacoes.especializacao === tipo}
                                        onChange={e => handleTipoEspecializacaoChange(e.target.value)}
                                    /> {tipo}
                                </label>
                            ))}
                        </div>
                    </label>

                    {/* CAMPOS CONDICIONAIS */}
                    {instrumento.especializacoes.especializacao === "Harmônico" && (
                        <label className={styles.label}>Número de Cordas:
                            <input className={styles.input} type="number"
                                value={Number(instrumento.especializacoes.opcao1)}
                                onChange={e => setInstrumento(prev => ({
                                    ...prev, especializacoes: { ...prev.especializacoes, opcao1: Number(e.target.value) }
                                }))}
                            />
                        </label>
                    )}
                    {instrumento.especializacoes.especializacao === "Rítmico" && (
                        <label className={styles.label}>Tocado com:
                            <div className={styles.horizontalGroup}>
                                {[TocadoCom.BAQUETAS, TocadoCom.MAO, TocadoCom.HIBRIDO, TocadoCom.OUTRO].map(tc => (
                                    <label key={tc}>
                                        <input type="radio" name="tocadoCom" value={tc}
                                            checked={instrumento.especializacoes.opcao3 === tc}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao3: e.target.value as any }
                                            }))}
                                        /> {tc}
                                    </label>
                                ))}
                            </div>
                        </label>
                    )}
                    {instrumento.especializacoes.especializacao === "Melódico" && (
                        <label className={styles.label}>Transposição:
                            <div className={styles.horizontalGroup}>
                                {[AfinacaoTransposicao.C, AfinacaoTransposicao.Bb, AfinacaoTransposicao.Eb, AfinacaoTransposicao.F, AfinacaoTransposicao.OUTRO].map(tr => (
                                    <label key={tr}>
                                        <input type="radio" name="transposicao" value={tr}
                                            checked={instrumento.especializacoes.opcao2 === tr}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao2: e.target.value as any }
                                            }))}
                                        /> {tr}
                                    </label>
                                ))}
                            </div>
                        </label>
                    )}

                    {/* BOTÕES MODAIS */}
                    <div className={styles.configButtons}>
                        <button type="button" className={styles.buttonSecondary} onClick={() => setIsAfinacaoModalOpen(true)}>Configurar Afinação</button>
                        <button type="button" className={styles.buttonSecondary} onClick={() => setIsAlcanceModalOpen(true)}>Configurar Alcances ({instrumento.alcances.length})</button>
                        <button type="button" className={styles.buttonSecondary} onClick={() => setIsParteMaterialModalOpen(true)}>Partes ({instrumento.partesMateriais?.length || 0})</button>
                        <button type="button" className={styles.buttonSecondary} onClick={() => setIsAudioModalOpen(true)}>Áudios ({instrumento.audios?.length || 0})</button>
                    </div>

                    <button className={styles.submit} type="submit">Adicionar Instrumento</button>
                </main>
            </form>

            {/* --- MODAL AFINAÇÃO --- */}
            {isAfinacaoModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Afinação</h2>
                        <div className={styles.afinacao}>
                            Nome: <input className={styles.input} value={instrumento.afinacao.info.nome} onChange={e => updateAfinacao('nome', e.target.value)} />
                            Ref: <input className={styles.input} value={instrumento.afinacao.referencia || ""} onChange={e => updateAfinacao('referencia', e.target.value)} />
                            Contexto: <input className={styles.input} value={instrumento.afinacao.contexto} onChange={e => updateAfinacao('contexto', e.target.value)} />
                            Desc: <input className={styles.input} value={instrumento.afinacao.info.descricao || ""} onChange={e => updateAfinacao('descricao', e.target.value)} />
                        </div>
                        <button type="button" className={styles.submit} onClick={() => setIsAfinacaoModalOpen(false)}>Fechar</button>
                    </div>
                </div>
            )}

            {/* --- MODAL ALCANCE --- */}
            {isAlcanceModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Alcances</h2>
                        <div className={styles.afinacao}>
                            <input className={styles.input} placeholder="Tipo (ex: Voz)" value={tempAlcanceTipo} onChange={e => setTempAlcanceTipo(e.target.value)} />
                            <input className={styles.input} placeholder="Min (ex: A2)" value={tempAlcanceMinimo} onChange={e => setTempAlcanceMinimo(e.target.value)} />
                            <input className={styles.input} placeholder="Max (ex: C5)" value={tempAlcanceMaximo} onChange={e => setTempAlcanceMaximo(e.target.value)} />
                            <button type="button" className={styles.buttonSecondary} onClick={handleAddAlcance}>Adicionar</button>
                        </div>
                        <div className={styles.modalLists}>
                            <h4>Adicionados:</h4>
                            {instrumento.alcances.map((a, i) => (
                                <div key={i} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #555', padding:'5px'}}>
                                    <span>{a.tipo} ({a.nota_min}-{a.nota_max})</span>
                                    <button type="button" onClick={() => handleRemoveAlcance(i)}>Remover</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className={styles.submit} onClick={() => setIsAlcanceModalOpen(false)}>Fechar</button>
                    </div>
                </div>
            )}

            {/* --- MODAL PARTE/MATERIAL --- */}
            {isParteMaterialModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Partes e Materiais</h2>
                        <div className={styles.afinacao}>
                            <input className={styles.input} placeholder="Nome Parte" value={parteNome} onChange={e => setParteNome(e.target.value)} />
                            <textarea className={styles.input} placeholder="Desc Parte" value={parteDescricao} onChange={e => setParteDescricao(e.target.value)} />
                            <input className={styles.input} placeholder="Nome Material" value={materialNome} onChange={e => setMaterialNome(e.target.value)} />
                            <textarea className={styles.input} placeholder="Desc Material" value={materialDescricao} onChange={e => setMaterialDescricao(e.target.value)} />
                            <button type="button" className={styles.buttonSecondary} onClick={handleAddParte}>Adicionar</button>
                        </div>
                        <div className={styles.modalLists}>
                            <h4>Adicionados:</h4>
                            {(instrumento.partesMateriais || []).map((p, i) => (
                                <div key={i} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #555', padding:'5px'}}>
                                    <span>{p.parteNome} ({p.materialNome})</span>
                                    <button type="button" onClick={() => handleRemoveParte(i)}>Remover</button>
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
                        <h2>Áudios</h2>
                        <div className={styles.afinacao}>
                            <label className={styles.label}>Arquivo:
                                <input className={styles.input} type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
                            </label>
                            <input className={styles.input} placeholder="Nome" value={audioNome} onChange={e => setAudioNome(e.target.value)} />
                            <textarea className={styles.input} placeholder="Desc" value={audioDescricao} onChange={e => setAudioDescricao(e.target.value)} />
                            <div className={styles.horizontalGroup}>
                                <input className={styles.input} placeholder="Nota" value={audioNota} onChange={e => setAudioNota(e.target.value)} />
                                <input className={styles.input} type="number" placeholder="Oitava" value={audioOitava} onChange={e => setAudioOitava(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className={styles.horizontalGroup}>
                                <input className={styles.input} type="number" placeholder="BPM" value={audioBpm} onChange={e => setAudioBpm(e.target.value === "" ? "" : Number(e.target.value))} />
                                <input className={styles.input} placeholder="Créditos" value={audioCreditos} onChange={e => setAudioCreditos(e.target.value)} />
                            </div>
                            <button type="button" className={styles.buttonSecondary} onClick={handleAddAudio}>Adicionar</button>
                        </div>
                        <div className={styles.modalLists}>
                            <h4>Adicionados:</h4>
                            {(instrumento.audios || []).map((a, i) => (
                                <div key={i} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #555', padding:'5px'}}>
                                    <span>{a.info.nome} ({a.audio.split('_').pop()})</span>
                                    <button type="button" onClick={() => handleRemoveAudio(i)}>Remover</button>
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