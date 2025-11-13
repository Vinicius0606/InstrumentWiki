import styles from "./EdiMaterial.module.css"
import Header from "../../components/Header/Header"
import { useEffect, useRef, useState } from "react";
import type { Usuario, Generico } from "../../types";
import { useParams, useNavigate } from "react-router-dom";

export default function editarMaterial(){

    const [id, setId] = useState<string>("");
    const [listaIds, setListaIds] = useState<Generico[] | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [tipoEspecializacao, setTipoEspecializacao] = useState<string>("Harmônico");
    const [usuario, setUsuario] = useState<Usuario>();

    const navigate = useNavigate();
    
    async function carregarIds() {

        try{
            const res = await fetch(`http://localhost:5000/retornarIDsGenerico?nomeTabela=material`, {
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

        carregarIds();

    //    verificarToken();

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
            
            try{
                navigate("/adicionarGenerico/Material/" + idFormatado, { replace: true });

            } catch(erro){

                alert("Erro no sistema!");
                console.log(erro);
                
                return;
            }
            
        }
    }

    return(
        <div className={styles.div}>
            <Header ActiveButton={3} usuario={usuario}></Header>

            <form action="" className={styles.form} onSubmit={handleSubmit}>
                <main className={styles.main}>
                    <h1>Material:</h1>

                    <label className={styles.label}>
                        ID do(a) Material:
                        <input className={styles.input}
                            type="text"
                            onChange={(e) => {setId(e.target.value); e.currentTarget.setCustomValidity("")}}
                            required
                            ref={inputRef}
                            value={id}
                        />
                    </label>

                    <div className={styles.listaID}>
                        <h1>Lista de Ids da tabela material</h1>
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