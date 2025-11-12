import styles from "./AddInstrument.module.css";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import type { Afinacao, Generico, Instrumento, InstrumentoEspecializacao } from "../../types";
import { AfinacaoTransposicao, CategoriaPercussao, TocadoCom } from "../../types";

const familiasMockadas: Generico[] = [
    { id: 1, nome: "Cordas", descricao: "Instrumentos que produzem som por cordas." },
    { id: 2, nome: "Metais", descricao: "Instrumentos de sopro feitos de metal." },
    { id: 3, nome: "Madeiras", descricao: "Instrumentos de sopro originalmente de madeira." },
    { id: 4, nome: "Percussão", descricao: "Instrumentos tocados por impacto." },
];

export default function AddInstrument() {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [apelidos, setApelidos] = useState<string[]>([]);
    const [apelidosInput, setApelidosInput] = useState("");
    const [historia, setHistoria] = useState("");
    const [familia, setFamilia] = useState("");
    const [numeroCordas, setNumeroCordas] = useState<number | "">("");
    const [afinacaoNome, setAfinacaoNome] = useState("");
    const [afinacaoReferencia, setAfinacaoReferencia] = useState("");
    const [afinacaoContexto, setAfinacaoContexto] = useState("");
    const [afinacaoDescricao, setAfinacaoDescricao] = useState("");
    const [afinacaoTransposicao, setAfinacaoTransposicao] = useState("");
    const [sonoridade, setSonoridade] = useState("");
    const [tocadoCom, setTocadoCom] = useState("");
    const [tipoEspecializacao, setTipoEspecializacao] = useState("Harmônico");
    const [listaFamilias, setListaFamilias] = useState<Generico[]>([]);
    const [familiaId, setFamiliaId] = useState<number | "">("");

    useEffect(() => {
        // Simula uma chamada de API
        setListaFamilias(familiasMockadas);
    }, []);

    return (
        <div className={styles.div}>
            <Header ActiveButton={2} />
            <form
                className={styles.form}
                onSubmit={e => {
                    e.preventDefault();
                    // Lógica para enviar os dados do formulário
                }}
            >
                <main className={styles.main}>
                    <h1>Adicionar Instrumento</h1>
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
                        <select
                            className={styles.input}
                            value={familiaId}
                            onChange={e => {
                                const idSelecionado = Number(e.target.value);
                                const familiaSelecionada = listaFamilias.find(f => f.id === idSelecionado);

                                if (familiaSelecionada) {
                                    setFamiliaId(familiaSelecionada.id);
                                    setFamilia(familiaSelecionada.nome);
                                } else {
                                    setFamiliaId("");
                                    setFamilia("");
                                }
                            }}
                        >
                            <option value="">Selecione uma família...</option>
                            {listaFamilias.map(familia => (
                                <option key={familia.id} value={familia.id}>
                                    {familia.nome}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className={styles.label}>
                        Apelidos:
                        <input className={styles.input}
                            type="text"
                            name="apelidos"
                            placeholder="Separe os apelidos por vírgula"
                            value={apelidosInput}
                            onChange={e => setApelidosInput(e.target.value)}
                            onBlur={() => {
                                const listaLimpa = apelidosInput
                                    .split(",")
                                    .map(a => a.trim())
                                    .filter(a => a.length > 0);
                                setApelidos(listaLimpa);
                                setApelidosInput(listaLimpa.join(", "));
                            }}

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

                    {/* --- SELETOR DE ESPECIALIZAÇÃO --- */}
                    <label className={styles.label}>
                        Tipo de Especialização:
                        <div className={styles.radioGroup}>
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
                    </label>

                    {/* --- CAMPOS CONDICIONAIS --- */}

                    {/* MOSTRAR SE FOR "Harmônico" */}
                    {tipoEspecializacao === "Harmônico" && (
                        <label className={styles.label}>
                            Número de Cordas:
                            <input className={styles.input}
                                type="number"
                                name="numeroCordas"
                                value={numeroCordas}
                                onChange={e => {
                                    const value = e.target.value;
                                    setNumeroCordas(value === "" ? "" : Number(value));
                                }}
                            />
                        </label>
                    )}

                    {/* MOSTRAR SE FOR "Rítmico" */}
                    {tipoEspecializacao === "Rítmico" && (
                        <>
                            {/* --- SONORIDADE --- */}
                            <label className={styles.label}>
                                Sonoridade:
                                <div className={styles.radioGroup}>
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="sonoridade"
                                            value={CategoriaPercussao.MEMBRANOFONE}
                                            checked={sonoridade === CategoriaPercussao.MEMBRANOFONE}
                                            onChange={e => setSonoridade(e.target.value)}
                                        />
                                        Membranofone
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="sonoridade"
                                            value={CategoriaPercussao.IDIOFONE}
                                            checked={sonoridade === CategoriaPercussao.IDIOFONE}
                                            onChange={e => setSonoridade(e.target.value)}
                                        />
                                        Idiofone
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="sonoridade"
                                            value={CategoriaPercussao.ELECTROFONE}
                                            checked={sonoridade === CategoriaPercussao.ELECTROFONE}
                                            onChange={e => setSonoridade(e.target.value)}
                                        />
                                        Electrofone
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="sonoridade"
                                            value={CategoriaPercussao.AEROFONE}
                                            checked={sonoridade === CategoriaPercussao.AEROFONE}
                                            onChange={e => setSonoridade(e.target.value)}
                                        />
                                        Aerofone
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="sonoridade"
                                            value={CategoriaPercussao.CORDOFONE}
                                            checked={sonoridade === CategoriaPercussao.CORDOFONE}
                                            onChange={e => setSonoridade(e.target.value)}
                                        />
                                        Cordofone
                                    </label>
                                </div>
                            </label>

                            {/* --- TOCADO COM --- */}
                            <label className={styles.label}>
                                Tocado com:
                                <div className={styles.radioGroup}>
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="tocadoCom"
                                            value={TocadoCom.BAQUETAS}
                                            checked={tocadoCom === TocadoCom.BAQUETAS}
                                            onChange={e => setTocadoCom(e.target.value)}
                                        />
                                        Baquetas
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="tocadoCom"
                                            value={TocadoCom.MAO}
                                            checked={tocadoCom === TocadoCom.MAO}
                                            onChange={e => setTocadoCom(e.target.value)}
                                        />
                                        Mão
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="tocadoCom"
                                            value={TocadoCom.HIBRIDO}
                                            checked={tocadoCom === TocadoCom.HIBRIDO}
                                            onChange={e => setTocadoCom(e.target.value)}
                                        />
                                        Híbrido
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            className={styles.input}
                                            type="radio"
                                            name="tocadoCom"
                                            value={TocadoCom.OUTRO}
                                            checked={tocadoCom === TocadoCom.OUTRO}
                                            onChange={e => setTocadoCom(e.target.value)}
                                        />
                                        Outro
                                    </label>
                                </div>
                            </label>
                        </>
                    )}

                    {/* MOSTRAR SE FOR "Melódico" */}
                    {tipoEspecializacao === "Melódico" && (
                        <label className={styles.label}>
                            Transposição:
                            <div className={styles.radioGroup}>
                                <label>
                                    <input
                                        className={styles.input}
                                        type="radio"
                                        name="afinacaoTransposicao"
                                        value={AfinacaoTransposicao.C}
                                        checked={afinacaoTransposicao === AfinacaoTransposicao.C}
                                        onChange={e => setAfinacaoTransposicao(e.target.value)}
                                    />
                                    C
                                </label>
                                <br />
                                <label>
                                    <input
                                        className={styles.input}
                                        type="radio"
                                        name="afinacaoTransposicao"
                                        value={AfinacaoTransposicao.Bb}
                                        checked={afinacaoTransposicao === AfinacaoTransposicao.Bb}
                                        onChange={e => setAfinacaoTransposicao(e.target.value)}
                                    />
                                    Bb
                                </label>
                                <br />
                                <label>
                                    <input
                                        className={styles.input}
                                        type="radio"
                                        name="afinacaoTransposicao"
                                        value={AfinacaoTransposicao.Eb}
                                        checked={afinacaoTransposicao === AfinacaoTransposicao.Eb}
                                        onChange={e => setAfinacaoTransposicao(e.target.value)}
                                    />
                                    Eb
                                </label>
                                <br />
                                <label>
                                    <input
                                        className={styles.input}
                                        type="radio"
                                        name="afinacaoTransposicao"
                                        value={AfinacaoTransposicao.F}
                                        checked={afinacaoTransposicao === AfinacaoTransposicao.F}
                                        onChange={e => setAfinacaoTransposicao(e.target.value)}
                                    />
                                    F
                                </label>
                                <br />
                                <label>
                                    <input
                                        className={styles.input}
                                        type="radio"
                                        name="afinacaoTransposicao"
                                        value={AfinacaoTransposicao.OUTRO}
                                        checked={afinacaoTransposicao === AfinacaoTransposicao.OUTRO}
                                        onChange={e => setAfinacaoTransposicao(e.target.value)}
                                    />
                                    OUTRO
                                </label>
                                <br />
                            </div>
                        </label>
                    )}

                    {/* --- AFINAÇÃO (Campos Globais) --- */}
                    <label className={styles.label}>
                        Afinação:
                        <div className={styles.afinacao}>
                            Nome:
                            <input
                                className={styles.input}
                                type="text"
                                name="afinacaoNome"
                                value={afinacaoNome}
                                onChange={e => setAfinacaoNome(e.target.value)}
                            />
                            Referência:
                            <input
                                className={styles.input}
                                type="text"
                                name="afinacaoReferencia"
                                value={afinacaoReferencia}
                                onChange={e => setAfinacaoReferencia(e.target.value)}
                            />
                            Contexto:
                            <input
                                className={styles.input}
                                type="text"
                                name="afinacaoContexto"
                                value={afinacaoContexto}
                                onChange={e => setAfinacaoContexto(e.target.value)}
                            />
                            Descrição:
                            <input
                                className={styles.input}
                                type="text"
                                name="afinacaoDescricao"
                                value={afinacaoDescricao}
                                onChange={e => setAfinacaoDescricao(e.target.value)}
                            />
                        </div>
                    </label>

                    <button className={styles.submit} type="submit">Adicionar Instrumento</button>
                </main>
            </form>
        </div>
    );
}