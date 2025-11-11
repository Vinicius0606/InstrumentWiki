import styles from "./AddInstrument.module.css";
import Header from "../../components/Header/Header";
import type { Instrumento } from "../../types";
import { useRef, useState } from "react";

export default function AddInstrument() {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [historia, setHistoria] = useState("");
    const [familia, setFamilia] = useState("");
    const [numeroCordas, setNumeroCordas] = useState("");

    return (
        <div className={styles.div}>
            <Header ActiveButton={2} />

            <main className={styles.main}>
                <h1>Adicionar Instrumento</h1>
                <form className={styles.form}>

                    <label className={styles.label}>
                        Nome do Instrumento:
                        <input className={styles.input}
                            type="text"
                            name="nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        Família:
                        <input className={styles.input}
                            type="text"
                            name="familia"
                            value={familia}
                            onChange={e => setFamilia(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        Descrição:
                        <textarea className={styles.input}
                            name="descricao"
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        História:
                        <textarea className={styles.input}
                            name="historia"
                            value={historia}
                            onChange={e => setHistoria(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        Número de Cordas (se aplicável):
                        <input className={styles.input}
                            type="number"
                            name="numeroCordas"
                            value={numeroCordas}
                            onChange={e => setNumeroCordas(e.target.value)}
                        />
                    </label>

                    <label className={styles.label}>
                        Afinação:
                        <div className={styles.afinacao}>
                            Nome:
                            <input className={styles.input}
                                type="text"
                                name="afinacao"
                            />
                            Referência:
                            <input className={styles.input}
                                type="text"
                                name="afinacao"
                            />
                            Contexto:
                            <input className={styles.input}
                                type="text"
                                name="afinacao"
                            />
                        </div>
                    </label>

                    <button className={styles.submit} type="submit">Adicionar Instrumento</button>
                </form>
            </main>
        </div>
    )
}