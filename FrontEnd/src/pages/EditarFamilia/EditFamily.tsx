import styles from "../AddInstrument/AddInstrument.module.css"; 
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Generico } from "../../types";

export default function EditFamily() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [idBusca, setIdBusca] = useState(id || "");

    const [listaFamiliasBusca, setListaFamiliasBusca] = useState<Generico[]>([]);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    useEffect(() => {
        async function carregarListaBusca() {
            try {
                const res = await fetch('http://localhost:5000/familiasGet');
                if (res.ok) {
                    const dados = await res.json();
                    setListaFamiliasBusca(dados);
                }
            } catch (error) {
                console.error("Erro ao carregar lista de famílias:", error);
            }
        }
        carregarListaBusca();
    }, []);

    useEffect(() => {
        if (id) setIdBusca(id);
        
        if (!id || listaFamiliasBusca.length === 0) return;

        setIsLoading(true);
        
        const familiaEncontrada = listaFamiliasBusca.find(f => String(f.id) === String(id));

        if (familiaEncontrada) {
            setNome(familiaEncontrada.nome);
            setDescricao(familiaEncontrada.descricao || "");
            setIsLoading(false);
        } else {
            console.log("Família não encontrada na lista.");
            setIsLoading(false);
        }
    }, [id, listaFamiliasBusca]);

    const handleBuscarId = (e: React.FormEvent) => {
        e.preventDefault();
        if (idBusca) {
            navigate(`/editar-familia/${idBusca}`);
        }
    };

    const handleCardClick = (idSelecionado: string) => {
        navigate(`/editar-familia/${idSelecionado}`);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome) return alert("O nome é obrigatório!");

        try {
            const dadosUpdate = {
                tabelaNome: "familia_instrumento", 
                id: id,
                nome: nome,
                descricao: descricao,
                referencia: null 
            };

            console.log("Enviando Update:", dadosUpdate);

            const response = await fetch('http://localhost:5000/atualizarGenericoPut', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUpdate)
            });

            if (response.ok) {
                alert(`Família "${nome}" atualizada com sucesso!`);
                setListaFamiliasBusca(prev => prev.map(item => String(item.id) === String(id) ? { ...item, nome, descricao } : item));
            } else {
                alert("Erro ao atualizar família.");
            }

        } catch (error) {
            console.error(error);
            alert("Erro de conexão ao salvar.");
        }
    };

    return (
        <div className={styles.div}>
            <Header ActiveButton={2} /> 
            
            <div className={styles.contentWrapper}>
                
                <div style={{marginBottom: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                    
                    <form onSubmit={handleBuscarId} style={{display: 'flex', gap: '10px', alignItems: 'end', marginBottom: '20px'}}>
                        <label className={styles.label} style={{flex: 1}}>
                            Buscar por ID:
                            <input className={styles.input} type="text" placeholder="Ex: FAM2025..." 
                                value={idBusca} onChange={e => setIdBusca(e.target.value)} />
                        </label>
                        <button type="submit" className={styles.buttonSecondary} style={{marginBottom: '0', height: 'fit-content'}}>🔍 Buscar</button>
                    </form>

                    <div className={styles.listaID}>
                        <h3 style={{color:'white'}}>Ou selecione na lista:</h3>
                        <div className={styles.listaIDScroll}>
                            {listaFamiliasBusca.length > 0 ? (
                                listaFamiliasBusca.map((info) => (
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
                                        <div className={styles.listaIDScrollCardDescricao}>
                                            <p className={styles.fontColorGradiant}>Descrição:</p>
                                            <p className={styles.scrollVertical}>{info.descricao || "Sem descrição"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{color:'white'}}>Carregando lista...</p>
                            )}
                        </div>
                    </div>
                </div>

                {id ? (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <main className={styles.main}>
                            <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                Editar Família #{id}
                                {isLoading && <span style={{fontSize: '0.5em', color: 'yellow', opacity: 0.8}}>(Carregando...)</span>}
                            </h1>
                            

                            <label className={styles.label}>
                                Nome da Família:
                                <input 
                                    className={styles.input} 
                                    type="text" 
                                    value={nome} 
                                    onChange={e => setNome(e.target.value)} 
                                />
                            </label>

                            <label className={styles.label}>
                                Descrição:
                                <textarea 
                                    className={styles.input} 
                                    value={descricao} 
                                    onChange={e => setDescricao(e.target.value)} 
                                />
                            </label>

                            <button className={styles.submit} type="submit">Salvar Alterações</button>
                        </main>
                    </form>
                ) : (
                    <div style={{textAlign: 'center', color: '#aaa', padding: '20px'}}>
                        <h2>Selecione uma família na lista acima para editar.</h2>
                    </div>
                )}
            </div>
        </div>
    );
}