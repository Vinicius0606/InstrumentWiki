import styles from "./AddInstrument.module.css";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import type { Instrumento, Usuario, Generico } from "../../types";
import { AfinacaoTransposicao, CategoriaPercussao, TocadoCom } from "../../types";
import { useNavigate } from "react-router-dom";

export default function AddInstrument() {

    const [usuario, setUsuario] = useState<Usuario>();
    const [listaIds, setListaIds] = useState<Generico[] | null>(null);
    const [instrumento, setInstrumento] = useState<Instrumento>(
                {
                    "info": {
 
                        "id": "",
                        "nome": "",
                        "descricao": ""
                    },
 
                    "familia_instrumento": {
 
                        "id": "",
                        "nome": "",
                        "descricao": "",
                    },
 
                    "historia": "",
 
                    "classificacao_sonoridade": "",

                    "imagem": "",

                    "apelidos": [],

                    "audios": [
                        {
                            "info": {
                                "id": "",
                                "nome": "",
                                "descricao": "",
                            },
                            "audio": "",
                            "bpm": 0,
                            "creditos": "",
                            "oitava": 0,
                            "nota": ""
                        }
                    ],
                    
                    "partesMateriais": [{
                        "parteNome": "",
                        "parteDescricao": "",
                        "materialNome": "",
                        "materialDescricao": "",
                        "materialId": "",
                    }],
 
                    "alcances": [{
                        "tipo": "",
                        "nota_min": "",
                        "nota_max": ""
                    }],
 
                    "afinacao": {
                        "info": {
                            "id": "",
                            "nome": "",
                            "descricao": "",
                        },
                        "referencia": "",
                        "contexto": ""
                    },
 
                    "especializacoes": {
 
                        "especializacao": "",
                        "opcao1": 0,
                        "opcao1Nome": "",
                        "opcao2": false,
                        "opcao2Nome": "",
                        "opcao3": false,
                        "opcao3Nome": ""
                    }
                });
    
    const navigate = useNavigate();

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

        //verificarToken();

    }, []);

    const handleSend = async () => {

        try{

            const verificarID = await fetch(`http://localhost:5000/verificarExistenciaGet?nomeTabela=familia&id=${instrumento.familia_instrumento.id}`, {
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

            if(!instrumento.info.nome){

                alert("O nome do instrumento é obrigatório!");
                
                return;
            }

            if(!instrumento.classificacao_sonoridade){

                alert("A classificação de sonoridade é obrigatória!");
                
                return;
            }

            if(!instrumento.especializacoes.especializacao){

                alert("A especialização do instrumento é obrigatória!");
                
                return;
            }

            if(!instrumento.familia_instrumento.id){

                alert("O id da família de instrumento é obrigatório!");
                
                return;
            }

            const mandarInstrumento = {

                familia_id: instrumento.familia_instrumento.id,
                nome: instrumento.info.nome,
                descricao: instrumento.info.descricao ?? "",
                historia: instrumento.historia ?? "",
                classificacao_sonoridade: instrumento.classificacao_sonoridade,
            }

            const res = await fetch(`http://localhost:5000/inserirInstrumentoPost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mandarInstrumento),
                credentials: "include",
            })

            const dado = await res.json();

            if(res.status != 200){

                alert("Erro ao adicionar instrumento!");

                navigate("/", { replace: true});

                console.log(dado["Erro: "]);

                return;
            }

            alert("Instrumento adicionado com sucesso!");

            navigate("/", { replace: true});

        } catch(erro){

            alert("Erro no sistema!");
            console.log(erro);
            
            return;
        }
    }

    async function carregarIds() {

        try{
            const res = await fetch(`http://localhost:5000/retornarIDsGenerico?nomeTabela=familia`, {
            credentials: "include",
            })

            if(res.status != 200){
                
                navigate("/", { replace: true});

                return;
            }

            const dado = await res.json();
            
            setListaIds(dado);
        
        }catch(erro){
            
            alert("Erro no sistema!");
            console.log(erro);
            
            return;
        }
        
    }

    useEffect(() => {
        carregarIds();
    }, []);

    return (
        <div className={styles.div}>
            <Header ActiveButton={2} usuario={usuario}/>
            <form className={styles.form} onSubmit={(e) => {
                e.preventDefault();

                handleSend();
            }}>
                <main className={styles.main}>
                    <h1>Adicionar Instrumento</h1>

                    <label className={styles.label}>Nome do Instrumento:
                        <input className={styles.input} type="text" required 
                            value={instrumento.info.nome} 
                            onChange={e => setInstrumento(prev => ({ ...prev, info: { ...prev.info, nome: e.target.value } }))} 
                        />
                    </label>

                    <label className={styles.label}>Família:
                        <input className={styles.input} required
                            value={instrumento.familia_instrumento.id}
                            onChange={e => { setInstrumento(prev => ({ ...prev, familia_instrumento: { ...prev.familia_instrumento, id: e.target.value } }))}}>
                        </input>
                    </label>

                    <div className={styles.listaID}>
                        <h1>Lista de Ids das Famílias</h1>
                        <div className={styles.listaIDScroll}>
                            {
                                listaIds ?

                                listaIds.map((info) => {

                                    return(
                                        <div className={styles.listaIDScrollCard} key={info.id}>
                                            <div className={styles.listaIDScrollCardNomeID}>
                                                <p className={styles.fontColorGradiant}>Nome: </p>
                                                <p><span className={styles.fontColorGradiant}>ID: </span> {info.id}</p>
                                            </div>
                                            <p className={styles.scrollVertical}>{info.nome}</p>
                                            <div className={styles.listaIDScrollCardDescricao}>
                                                <p className={styles.fontColorGradiant}>Descrição:</p>
                                                <p className={styles.scrollVertical}>{info.descricao}</p>
                                            </div>
                                        </div>
                                    )
                                })

                                : ""
                            }
                        </div>
                    </div>

                    <label className={styles.label}>Apelidos:
                        <input className={styles.input} type="text" placeholder="Separe por vírgula"
                            onBlur={e => {
                                const lista = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                                setInstrumento(prev => ({ ...prev, apelidos: lista }));
                            }}
                        />
                    </label>

                    <label className={styles.label}>Descrição:
                        <textarea className={styles.input} value={instrumento.info.descricao || ""} 
                        onChange={e => setInstrumento(prev => ({ ...prev, info: { ...prev.info, descricao: e.target.value } }))} />
                    </label>
                    <label className={styles.label}>História:
                        <textarea className={styles.input} value={instrumento.historia ?? ""} 
                        onChange={e => setInstrumento(prev => ({ ...prev, historia: e.target.value }))} />
                    </label>

                    <label className={styles.label}>Sonoridade:
                        <div className={styles.horizontalGroup}>
                            {[CategoriaPercussao.MEMBRANOFONE, CategoriaPercussao.IDIOFONE, CategoriaPercussao.ELECTROFONE, CategoriaPercussao.AEROFONE, CategoriaPercussao.CORDOFONE].map(cat => (
                                <label key={cat}>
                                    <input type="radio" name="sonoridade" value={cat} required
                                        checked={instrumento.classificacao_sonoridade === cat}
                                        onChange={e => setInstrumento(prev => ({ ...prev, classificacao_sonoridade: e.target.value }))}
                                    /> {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </label>
                            ))}
                        </div>
                    </label>

                    <label className={styles.label}>Tipo de Especialização: required
                        <div className={styles.horizontalGroup}>
                            {["Harmônico", "Melódico", "Rítmico"].map(tipo => (
                                <label key={tipo}>
                                    <input type="radio" name="tipoEsp" value={tipo}
                                        checked={instrumento.especializacoes.especializacao === tipo}
                                        onChange={e => setInstrumento(prev => 
                                            ({ ...prev, especializacoes: { ...prev.especializacoes, especializacao: e.target.value } }))}
                                    /> {tipo}
                                </label>
                            ))}
                        </div>
                    </label>

                    {instrumento.especializacoes.especializacao === "Harmônico" && (
                        <>
                        <label className={styles.label}>Polifonia (Número de notas simultâneas):
                            <input className={styles.input} type="number" required
                                value={Number(instrumento.especializacoes.opcao1)}
                                onChange={e => setInstrumento(prev => ({
                                    ...prev, especializacoes: { ...prev.especializacoes, opcao1: Number(e.target.value) }
                                }))}
                            />
                        </label>

                        <label className={styles.label}> Possui pedal de sustentação?
                            <div className={styles.horizontalGroup}>
                                {["False", "True"].map(pedal => (
                                    <label key={pedal}>
                                        <input type="radio" name="pedal" value={pedal} required
                                            checked={instrumento.especializacoes.opcao2 === pedal}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao2: e.target.value as any }
                                            }))}
                                        /> {pedal}
                                    </label>
                                ))}
                            </div>
                        </label>

                        <label className={styles.label}> suporta acordes?
                            <div className={styles.horizontalGroup}>
                                {["False ", "True "].map(acordes => (
                                    <label key={acordes + "acordes"}> 
                                        <input type="radio" name="suportaAcordes" value={acordes} required
                                            checked={instrumento.especializacoes.opcao3 === acordes}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao3: e.target.value as any }
                                            }))}
                                        /> {acordes}
                                    </label>
                                ))}
                            </div>
                        </label>
                        </>
                    )}

                    {instrumento.especializacoes.especializacao === "Rítmico" && (
                        <>
                        <label className={styles.label}> Altura Definida?
                            <div className={styles.horizontalGroup}>
                                {["False ", "True "].map(acordes => (
                                    <label key={acordes + "acordes"}>
                                        <input type="radio" name="alturaDefinida" value={acordes} required
                                            checked={String(instrumento.especializacoes.opcao1) === acordes}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao1: e.target.value as any }
                                            }))}
                                        /> {acordes}
                                    </label>
                                ))}
                            </div>
                        </label>

                        <label className={styles.label}>Categoria de Percussão:
                            <div className={styles.horizontalGroup}>
                                {[CategoriaPercussao.MEMBRANOFONE, CategoriaPercussao.IDIOFONE, CategoriaPercussao.ELECTROFONE, CategoriaPercussao.AEROFONE, CategoriaPercussao.CORDOFONE].map(cat => (
                                    <label key={cat}>
                                        <input type="radio" name="categoriaPercussao" value={cat} required
                                            checked={instrumento.especializacoes.opcao2=== cat}
                                            onChange={e => setInstrumento(prev => ({ ...prev, especializacoes: { ...prev.especializacoes, opcao2: e.target.value as any } }))}
                                        /> {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                    </label>
                                ))}
                            </div>
                        </label>

                        <label className={styles.label}>Tocado Com:
                            <div className={styles.horizontalGroup}>
                                {[TocadoCom.BAQUETAS, TocadoCom.HIBRIDO, TocadoCom.MAO, TocadoCom.OUTRO].map(cat => (
                                    <label key={cat}>
                                        <input type="radio" name="TocadoCom" value={cat} required
                                            checked={instrumento.especializacoes.opcao3 === cat}
                                            onChange={e => setInstrumento(prev => ({ ...prev, especializacoes: { ...prev.especializacoes, opcao3: e.target.value as any } }))}
                                        /> {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                    </label>
                                ))}
                            </div>
                        </label>

                        </>
                    )}

                    {instrumento.especializacoes.especializacao === "Melódico" && (

                        <>

                        <label className={styles.label}> transpositor?
                            <div className={styles.horizontalGroup}>
                                {["False", "True"].map(pedal => (
                                    <label key={pedal}>
                                        <input type="radio" name="transpositor" value={pedal} required
                                            checked={String(instrumento.especializacoes.opcao1) === pedal}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao1: e.target.value as any }
                                            }))}
                                        /> {pedal}
                                    </label>
                                ))}
                            </div>
                        </label>

                        <label className={styles.label}> Afinação Transposição:
                            <div className={styles.horizontalGroup}>
                                {[AfinacaoTransposicao.C, AfinacaoTransposicao.Bb, AfinacaoTransposicao.Eb, AfinacaoTransposicao.F, AfinacaoTransposicao.OUTRO].map(tr => (
                                    <label key={tr}>
                                        <input type="radio" name="transposicao" value={tr} required
                                            checked={instrumento.especializacoes.opcao2 === tr}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao2: e.target.value as any }
                                            }))}
                                        /> {tr}
                                    </label>
                                ))}
                            </div>
                        </label>
                                
                        
                        <label className={styles.label}> Microtonalidade Suportada?
                            <div className={styles.horizontalGroup}>
                                {["False ", "True "].map(acordes => (
                                    <label key={acordes + "acordes"}>
                                        <input type="radio" name="microtonalidade" value={acordes} required
                                            checked={instrumento.especializacoes.opcao3 === acordes}
                                            onChange={e => setInstrumento(prev => ({
                                                ...prev, especializacoes: { ...prev.especializacoes, opcao3: e.target.value as any }
                                            }))}
                                        /> {acordes}
                                    </label>
                                ))}
                            </div>
                        </label>
                        </>
                    )}

                    <button className={styles.submit} type="submit">Adicionar Instrumento</button>
                </main>
            </form>
        </div>
    );
}