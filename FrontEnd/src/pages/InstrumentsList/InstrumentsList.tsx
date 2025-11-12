import styles from "./InstrumentsList.module.css";
import Header from "../../components/Header/Header";
import type { Instrumento, AudioTipo } from "../../types";
import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function InstrumentsList() {

    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [instrumentoAtivo, setInstrumentoAtivo] = useState<string>("-1");
    const [audioDoMenuAtivo, setAudioDoMenuAtivo] = useState<AudioTipo | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const tocarAudio = (audio: AudioTipo | null | undefined) => {

        if (!audio) return;

        if(!audioRef.current){
            
            const audioPronto = new Audio(audio.audio);
            audioRef.current = audioPronto;

            audioPronto.play();

            audioPronto.onended = () => {
                audioRef.current = null;
            }
        }
    }

    useState(() => {
        setInstrumentos(() => {

            const instrumentos: Instrumento[] = [];

            for (let i = 0; i < 10; i++) {
                instrumentos.push({

                    info: {
                        id: "teste",
                        nome: "Piano",
                        descricao: "Um instrumento de teclado."
                    },
                    familia_instrumento: {
                        id: "1",
                        nome: "Cordas",
                        descricao: "Instrumentos de cordas."
                    },
                    afinacao: {
                        info: {
                            id: "1",
                            nome: "Piano Afinado",
                            descricao: "Afinacao padrao do piano."
                        },
                        referencia: "A440",
                        contexto: "Concerto"
                    },
                    historia: "O piano foi inventado no século XVIII...",
                    classificacao_sonoridade: "Cordofone",
                    imagem: "/piano.png",
                    apelidos: ["Teclado", "Pianoforte"],
                    audios: [
                        {
                            info: {
                                id: "1",
                                nome: "Som do Piano",
                                descricao: "Um som suave de piano."
                            },
                            audio: "/piano.wav",
                            nota: "C4",
                            oitava: 4,
                            bpm: null,
                            creditos: "Gravado por Fulano"
                        }],
                    partesMateriais: [
                        {
                            parteNome: "Teclado",
                            parteDescricao: "Parte do piano onde as teclas estão localizadas.",
                            materialId: 1,
                            materialNome: "Madeira",
                            materialDescricao: "Madeira de alta qualidade usada para o teclado."
                        },
                        {
                            parteNome: "Cordas",
                            parteDescricao: "Cordas do piano que produzem som quando as teclas são pressionadas.",
                            materialId: 2,
                            materialNome: "Aço",
                            materialDescricao: "Cordas de aço usadas para produzir som no piano."
                        },
                        {
                            parteNome: "Martelo",
                            parteDescricao: "Parte do piano que bate nas cordas para produzir som.",
                            materialId: 3,
                            materialNome: "Feltro",
                            materialDescricao: "Feltro usado para cobrir o martelo."
                        },
                        {
                            parteNome: "Pedal",
                            parteDescricao: "Pedal do piano usado para sustentar as notas.",
                            materialId: 4,
                            materialNome: "Metal",
                            materialDescricao: "Metal usado para fabricar o pedal."
                        }
                    ],
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

    return (
        <div className={styles.div}>
            <Header ActiveButton={1}/>
            <main className={styles.divInfo}>
                <h1>Instrumentos:</h1>
                <div className={styles.divInfoCards}>

                    {instrumentos.map((instrumento) => {
                        let conteudo;

                        if (instrumento.info.id === instrumentoAtivo) {
                            conteudo = (
                                <>
                                    <div className={styles.instrumentoCardExpandedDivImage}>
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
                                                <IoMdClose className={styles.closeIcon}
                                                    onClick={() => setInstrumentoAtivo("-1")} />
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
                                        <div className={styles.instrumentoCardExpandedDivDescricaoDiv}>
                                            <div className={styles.instrumentoCardExpandedDivDescricaoDivSection}>
                                                <p className={styles.fontColorGradiant}>
                                                    Descrição:
                                                </p>
                                                <p className={styles.scrollVertical}>
                                                    {instrumento.info.descricao}
                                                </p>
                                            </div>
                                            <div className={styles.instrumentoCardExpandedDivDescricaoDivSection}>
                                                <p className={styles.fontColorGradiant}>
                                                    História:
                                                </p>
                                                <p className={styles.scrollVertical}>
                                                    {instrumento.historia}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.instrumentoCardExpandedDivDescricaoDiv}>
                                            <div className={styles.instrumentoCardExpandedDivDescricaoDivSection}>
                                                <p className={styles.fontColorGradiant}>
                                                    Áudios(s):
                                                </p>
                                                <div className={styles.instrumentoCardExpandedDivDescricaoDivSectionAudios}>
                                                    {
                                                        instrumento.audios ? instrumento.audios.map((audio) => {
                                                            return (
                                                                <div className={styles.instrumentoCardExpandedDivDescricaoDivSectionAudiosCard} key={audio.info.id}>
                                                                    <button onClick={() => tocarAudio(audio)}>
                                                                        {audio.info.nome}
                                                                    </button>
                                                                    <button onClick={() => setAudioDoMenuAtivo(audio)}>
                                                                        Ver Mais
                                                                    </button>
                                                                </div>
                                                            )
                                                        })
                                                            :
                                                            ""
                                                    }
                                                </div>
                                            </div>
                                            <div className={styles.instrumentoCardExpandedDivDescricaoDivSection}>
                                                <p className={styles.fontColorGradiant}>
                                                    Partes e Materiais:
                                                </p>
                                                <p className={styles.scrollVertical}>
                                                    {instrumento.partesMateriais ? instrumento.partesMateriais.map((parte) => {


                                                        return (parte.parteNome + " feito de " + parte.materialNome)
                                                    }).join("\n") : "N/A"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.instrumentoCardExpandedDivDescricaoDiv}>
                                            <div className={styles.instrumentoCardExpandedDivDescricaoDivSection}>
                                                <p className={styles.fontColorGradiant}>
                                                    Descrição da Afinação:
                                                </p>
                                                <p className={styles.scrollVertical}>
                                                    {instrumento.afinacao.info.descricao}
                                                </p>
                                            </div>
                                            <div className={styles.instrumentoCardExpandedDivDescricaoDivSection}>
                                                <p className={styles.fontColorGradiant}>
                                                    Alcance(s) do Instrumento:
                                                </p>
                                                <p className={styles.scrollVertical}>
                                                    {instrumento.alcances ? instrumento.alcances.map((alcance) => {


                                                        return (alcance.tipo + ": " + alcance.nota_min + " -> " + alcance.nota_max)
                                                    }).join("\n") : "N/A"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else {
                            conteudo = (
                                <>
                                    <img src={instrumento.imagem ?? ""} alt="" onClick={() => {
                                        if (instrumento.info.id !== instrumentoAtivo) setInstrumentoAtivo(instrumento.info.id)
                                    }}/>
                                    <div className={styles.instrumentoCardDetails}>
                                        <div className={styles.instrumentoCardDetailsText}
                                        onClick={() => {
                                            if (instrumento.info.id !== instrumentoAtivo) setInstrumentoAtivo(instrumento.info.id)
                                        }} >
                                            <h2 style={{ maxHeight: instrumento.info.nome.length > 18 ? 'calc(1.2em * 2)' : 'calc(1.2em * 1)' }}
                                            >{instrumento.info.nome}</h2>
                                            <p>{instrumento.info.descricao}</p>
                                        </div>
                                        <button onClick={() => 
                                            tocarAudio(instrumento.audios ? instrumento.audios.at(0) : null)}>
                                            <p>Tocar Som</p>
                                        </button>
                                    </div>
                                </>
                            )
                        }

                        return (
                            <div key={instrumento.info.id}
                                className={`${styles.instrumentoCard} 
                            ${instrumento.info.id === instrumentoAtivo ? styles.active : ''}`}>

                                {conteudo}

                            </div>
                        )
                    })}

                </div>

                <div className={`${styles.menuAudio} ${audioDoMenuAtivo ? '' : styles.desativado}`}>
                    <div className={styles.menuAudioInfoRow}>
                        <p>
                            <span className={styles.fontColorGradiant}>Nome: </span>
                            <span className={styles.scrollHorizontal}>{audioDoMenuAtivo?.info.nome}</span>
                        </p>/
                        <p>
                            <span className={styles.fontColorGradiant}>Bpm: </span>
                            <span className={styles.scrollHorizontal}>{audioDoMenuAtivo?.bpm}</span>
                        </p>
                    </div>
                    <div className={styles.menuAudioInfoColumn}>
                        <p className={styles.fontColorGradiant}>
                            Descrição:
                        </p>
                        <p className={styles.scrollVertical}>
                            {audioDoMenuAtivo?.info.descricao}
                        </p>
                    </div>
                    <div className={styles.menuAudioInfoRow}>
                        <p>
                            <span className={styles.fontColorGradiant}>Nota: </span>
                            <span className={styles.scrollHorizontal}>{audioDoMenuAtivo?.nota}</span>
                        </p>
                        <p>
                            <span className={styles.fontColorGradiant}>Oitava: </span>
                            <span className={styles.scrollHorizontal}>{audioDoMenuAtivo?.oitava}</span>
                        </p>
                    </div>
                    <p>
                        <span className={styles.fontColorGradiant}>Creditos: </span>
                        <span className={styles.scrollHorizontal}>{audioDoMenuAtivo?.creditos}</span>
                    </p>
                    <div className={styles.menuAudioInfoBotoes}>
                        <button onClick={() => tocarAudio(audioDoMenuAtivo!)} >
                            {audioDoMenuAtivo?.info.nome}
                        </button>
                        <button onClick={() => setAudioDoMenuAtivo(null)}>
                            Fechar
                        </button>
                    </div>

                </div>
            </main>
        </div>
    )
}