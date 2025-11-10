import styles from "./InstrumentsList.module.css";
import Header from "../../components/Header/Header";
import type { Instrumento } from "../../types";
import { useState } from "react";

export default function InstrumentsList(){

    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [instrumentoAtivo, setInstrumentoAtivo] = useState<number>(-1);

    useState(()=>{
        setInstrumentos(() =>{

            const instrumentos: Instrumento[] = [];
           
            for(let i = 0; i < 10; i++){
                instrumentos.push({
                
                info: {
                    id: 1,
                    nome: "Piano",
                    descricao: "Um instrumento de teclado."
                },
                familia_instrumento:{
                    id: 1,
                    nome: "Cordas",
                    descricao: "Instrumentos de cordas."
                },
                afinacao: { info: {
                        id: 1,
                        nome: "Piano Afinado",
                        descricao: "Afinacao padrao do piano."  
                    },
                    referencia: "A440",
                    contexto: "Concerto" 
                },
                historia: "O piano foi inventado no século XVIII...",
                classificacao_sonoridade: "Cordofoneaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                imagem: "/piano.png",
                apelidos: ["Teclado", "Pianoforte"],
                audios: null,
                partesMateriais: null,
                alcances: [
                    {
                        tipo: "Completo",
                        nota_min: "A0",
                        nota_max: "C8"
                    }
                ],
                especializacoes: {
                    especializacao: "Tipo de Piano",
                    opcao1: 88,
                    opcao1Nome: "Número de Teclas",
                    opcao2: "C",
                    opcao2Nome: "Transposição",
                    opcao3: "MAO",
                    opcao3Nome: "Tocado Com"
                },
            });
            }

            return instrumentos;
        })

    });

    return(
        <div className={styles.div}>
            <Header ActiveButton={1}/>
            <main className={styles.divInfo}>
                <h1>Instrumentos:</h1>
                <div className={styles.divInfoCards}>

                    {instrumentos.map((instrumento) => {
                        let conteudo;

                        if(instrumento.info.id === instrumentoAtivo){ 
                            conteudo = (
                                <>
                                    <div className={styles.instrumentoCardExpandedDiv}>
                                        <img src={instrumento.imagem ?? ""} alt="" />
                                        <div className={styles.instrumentoCardExpandedDivInfo}>
                                            <div className={styles.instrumentoCardExpandedDivInfoNames}>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>Nome: </span> 
                                                    <span className={styles.scrollHorizontal}>{instrumento.info.nome}</span>
                                                </p>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>Apelidos: </span>
                                                    <span className={styles.scrollHorizontal}>{instrumento.apelidos?.join(", ")}</span>
                                                </p>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>Sonoridade: </span>
                                                    <span className={styles.scrollHorizontal}>{instrumento.classificacao_sonoridade}</span>
                                                </p>
                                            </div>
                                            <div className={styles.instrumentoCardExpandedDivInfoNames}>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>Família: </span> 
                                                    <span className={styles.scrollHorizontal}>{instrumento.familia_instrumento.nome}</span>
                                                </p>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>Afinação: </span>
                                                    <span className={styles.scrollHorizontal}>
                                                        {instrumento.afinacao.info.nome}
                                                        {instrumento.afinacao.referencia ? ". Com base em: " + instrumento.afinacao.referencia : ""}
                                                    </span>
                                                </p>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>Contexto Afinação: </span>
                                                    <span className={styles.scrollHorizontal}>{instrumento.afinacao.contexto}</span>
                                                </p>
                                            </div>
                                            <div className={styles.instrumentoCardExpandedDivInfoNames}>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>{instrumento.especializacoes.opcao1Nome}: </span> 
                                                    <span className={styles.scrollHorizontal}>{instrumento.especializacoes.opcao1}</span>
                                                </p>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>{instrumento.especializacoes.opcao2Nome}: </span>
                                                    <span className={styles.scrollHorizontal}> {instrumento.especializacoes.opcao2} </span>
                                                </p>
                                                <p>
                                                    <span className={styles.fontColorGradiant}>{instrumento.especializacoes.opcao3Nome}: </span>
                                                    <span className={styles.scrollHorizontal}>{instrumento.especializacoes.opcao3}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.instrumentoCardExpandedDivDescricao}>
                                        
                                    </div>
                                </>
                            )
                        }else{
                            conteudo = (
                                <>
                                    <img src={instrumento.imagem ?? ""} alt="" />
                                    <div className={styles.instrumentoCardDetails}>
                                        <div className={styles.instrumentoCardDetailsText}>
                                            <h2 style={{ maxHeight: instrumento.info.nome.length > 18 ? 'calc(1.2em * 2)' : 'calc(1.2em * 1)' }}
                                            >{instrumento.info.nome}</h2>
                                            <p>{instrumento.info.descricao}</p>
                                        </div>
                                        <button>
                                            <p>Tocar Som</p>
                                        </button>
                                    </div>
                                </>
                            )
                        }

                        return(
                        <div key={instrumento.info.id} 
                            className={`${styles.instrumentoCard} 
                            ${instrumento.info.id === instrumentoAtivo ? styles.active : ''}`}
                            onClick={() => setInstrumentoAtivo(instrumento.info.id)}>

                            {conteudo}
                            
                        </div>
                        )
                    })}

                </div>
            </main>
        </div>
    )
}