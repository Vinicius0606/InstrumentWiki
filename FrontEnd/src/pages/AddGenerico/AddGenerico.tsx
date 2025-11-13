import styles from "../AddInstrument/AddInstrument.module.css"; // Reutilizando o CSS padrão
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import type { Generico, Usuario } from "../../types";
import { useNavigate, useParams } from "react-router-dom";

type InstrumentoSimples = {
    info: {
        id: string;
        nome: string;
    }
};

export default function AddGenerico() {
    
    const [nome, setNome] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    const [afinacao, setAfinacao] = useState<string>("");
    const [contexto, setContexto] = useState<string>("");
    const [usuario, setUsuario] = useState<Usuario>();
    const { nomeTabela, id } = useParams();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome && !id) return alert("Selecione um nome!");
        if(nomeTabela === "Afinação" && !afinacao) return alert("A afinação é obrigatória!");

        try {

            let dados: {};

            if(nomeTabela === "Afinação"){

                dados = {
                    nome: nome,
                    descricao: descricao,
                    nomeTabela: nomeTabela,
                }
            
            }else{

                dados = {
                    nome: nome,
                    descricao: descricao,
                    referencia: afinacao,
                    contexto: contexto,
                    nomeTabela: nomeTabela,
                }
            }

            if(id){

                const res = await fetch(`http://localhost:5000/retornarIDsGenerico?nomeTabela=${nomeTabela}`, {
                    credentials: "include",
                });

                if(res.status != 200){
                    alert("Erro ao carregar IDs existentes.");
                    return;
                }

                const dadosExistentes: Generico[] = await res.json();

                const itemExistente = dadosExistentes.find(item => item.id === id);

                const dadosParaEnviar = {

                    nome: nome ?? itemExistente?.nome,
                    descricao: descricao ?? itemExistente?.descricao,
                    nomeTabela: nomeTabela,
                    id: id,
                };

                const response = await fetch('http://localhost:5000/atualizarGenericoPut', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(dadosParaEnviar)
                });

                const resultado = await response.json();

                if (resultado.status === 200) {

                    alert(`${nomeTabela} atualizado com sucesso!`);

                    navigate("/", { replace: true });

                } else {
                    alert(`Erro ao atualizar ${nomeTabela} no banco.`);

                }

                return;

            }

            console.log("Enviando Dados:", dados);

            const response = await fetch('http://localhost:5000/inserirGenericoPost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dados)
            });


            if (response.status === 200) {

                alert(`${nomeTabela} adicionado com sucesso!`);

                navigate("/", { replace: true });

            } else {
                alert(`Erro ao salvar ${nomeTabela} no banco.`);

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
                    <h1>Adicionar {nomeTabela}</h1>
                    
                    <label className={styles.label}>
                        Nome:
                        <input 
                            className={styles.input} required
                            type="text" placeholder="Exemplo: Violão Clássico" name="Nome"
                            onChange={e => setNome(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        Descrição:
                        <input 
                            className={styles.input} 
                            type="text" 
                            onChange={e => setDescricao(e.target.value)}
                        />
                    </label>

                    <fieldset disabled={nomeTabela !== "Afinação"? true : false} >
                        <label className={styles.label} style={{display: nomeTabela === "Afinação" ? "flex" : "none"}}>
                            Referencia:
                            <input className={styles.input} type="text" placeholder="Ex: Corda Solta, Escala Maior"  
                                value={afinacao} onChange={e => setAfinacao(e.target.value)} />
                        </label>
                    </fieldset>

                    <fieldset disabled={nomeTabela !== "Afinação"? true : false} >
                        <label className={styles.label} style={{display: nomeTabela === "Afinação" ? "flex" : "none"}}>
                            Contexto:
                            <input className={styles.input} type="text" placeholder="Ex: Corda Solta, Escala Maior"  required
                                value={contexto} onChange={e => setContexto(e.target.value)} name="Contexto"/>
                        </label>
                    </fieldset>

                    <button className={styles.submit} type="submit">Salvar {nomeTabela}</button>
                </main>
            </form>
        </div>
    );
}