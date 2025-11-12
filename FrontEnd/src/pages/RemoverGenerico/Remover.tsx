import styles from "./Remover.module.css"
import Header from "../../components/Header/Header"
import { useEffect, useRef, useState } from "react";
import type { Generico } from "../../types";
import { useParams, useNavigate } from "react-router-dom";


export default function RemoverGenerico(){

    const [id, setId] = useState<string>("");
    const [listaIds, setListaIds] = useState<Generico[] | null>(null);
    const { nomeTabela, especializacao } = useParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const [tipoEspecializacao, setTipoEspecializacao] = useState<string>("Harmônico");

    const navigate = useNavigate();
    
    async function carregarIds() {

        const res = await fetch(`http://localhost:5000/retornarIDsGenerico?nomeTabela=${nomeTabela}`, {
            credentials: "omit",
        })

        if(res.status != 200){
            
            navigate("/", { replace: true});

            return;
        }

        const dado = await res.json();
        
        setListaIds(dado);

        console.log(dado);
    }

    useEffect(() => {

        carregarIds();

    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        inputRef.current?.setCustomValidity("");

        const idFormatado = id.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

        if(idFormatado.length !== 12){
            
            if(inputRef.current){

                inputRef.current.setCustomValidity("O ID deve ter 12 caracteres de tamanho");

                inputRef.current.reportValidity();

                e.preventDefault();

            }
        }else{
            
            const res = await fetch(`http://localhost:5000/verificarExistenciaGet?nomeTabela=${nomeTabela}&id=${idFormatado}`, {
                credentials: "omit",
            })

            if(res.status !== 200){

                navigate("/", { replace: true });
                alert("Erro ao deletar o dado");

                return;
            }

            const dado = await res.json();

            console.log(dado);

            if(!dado["Exists"]){

                inputRef.current?.setCustomValidity("Não existe nenhum dado com esse ID!");

                inputRef.current?.reportValidity();

                e.preventDefault();

                return;
            }

            const resDelete = await fetch(`http://localhost:5000/deletar?nomeTabela=${nomeTabela}&id=${idFormatado}&especializacao=${tipoEspecializacao}`, {
                method: "DELETE",
                credentials: "omit",
            })

            if(resDelete.status === 404){

                inputRef.current?.setCustomValidity("Existe um áudio relacionado com esse dado, apague ele primeiro!");

                inputRef.current?.reportValidity();

                e.preventDefault();
                
                return
            } else if (resDelete.status != 200){
                
                navigate("/", { replace: true });
                alert("Erro ao deletar o dado");

                return;
            }

            alert("Dado deletado com sucesso!!");

            navigate("/", { replace: true });
            
        }
    }

    return(
        <div className={styles.div}>
            <Header ActiveButton={3} ></Header>

            <form action="" className={styles.form} onSubmit={handleSubmit}>
                <main className={styles.main}>
                    <h1>{nomeTabela}:</h1>

                    <label className={styles.label}>
                        ID do(a) {nomeTabela}:
                        <input className={styles.input}
                            type="text"
                            onChange={(e) => {setId(e.target.value); e.currentTarget.setCustomValidity("")}}
                            required
                            ref={inputRef}
                            value={id}
                        />
                    </label>

                    <div className={styles.radioGroup} style={{display: nomeTabela === "Instrumento" ? "flex" : "none"}}>
                        <label>
                            <input
                                type="radio"
                                name="tipoEspecializacao"
                                value="Harmônico"
                                checked={tipoEspecializacao === "Harmônico"}
                                onChange={e => setTipoEspecializacao(e.target.value)}
                            />
                            Harmônico
                        </label>
                        <br />
                        <label>
                            <input
                                type="radio"
                                name="tipoEspecializacao"
                                value="Melódico"
                                checked={tipoEspecializacao === "Melódico"}
                                onChange={e => setTipoEspecializacao(e.target.value)}
                            />
                            Melódico
                        </label>
                        <br />
                        <label>
                            <input
                                type="radio"
                                name="tipoEspecializacao"
                                value="Rítmico"
                                checked={tipoEspecializacao === "Rítmico"}
                                onChange={e => setTipoEspecializacao(e.target.value)}
                            />
                            Rítmico
                        </label>
                    </div>

                    <div className={styles.listaID}>
                        <h1>Lista de Ids da tabela {nomeTabela}</h1>
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
                    <button className={styles.submit} type="submit">Adicionar Instrumento</button>
                </main>
            </form>
        </div>
    )
}