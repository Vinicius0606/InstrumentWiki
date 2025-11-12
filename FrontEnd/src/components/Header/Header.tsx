import styles from "./Header.module.css"
import NotaMusical from "../../assets/notaMusical.png"
import { Link } from "react-router-dom"
import { useRef, useState } from "react"

type HeaderProps = {
    ActiveButton: number;
}

export default function Header({ ActiveButton }: HeaderProps) {
    
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({ display: "none", });
    const [opcaoMenu, setOpcaoMenu] = useState<String>("");

    function handlerMenu(e: React.MouseEvent<HTMLButtonElement>){

        if(menuStyle.display === "none"){
            const posicao = e.currentTarget.getBoundingClientRect();

            setMenuStyle({

                display: "flex",
                position: "absolute",
                top: posicao.bottom + window.scrollY + 10 + "px",
                left: `calc(${posicao.left}px - 2.5dvw)`,

            })   
        } else{

            setMenuStyle({
                display: "none",
            })
        }
    }

    return (
        <nav className={styles.header}>
            <div className={styles.headerLogo}>
                <img src={NotaMusical} alt="Logo" className={styles.logoImage} />
                <h1 className={styles.textLogo}>InstrumentsWiki</h1>
            </div>

            <div className={styles.headerLinks}>

                <Link to={"/"}
                    className={`${styles.navigationButton} ${ActiveButton === 1 ? styles.active : ''}`}>
                    <p>Instrumentos</p>
                </Link>

                <button onClick={(e) => {handlerMenu(e); setOpcaoMenu("adicionar");}}
                    className={`${styles.navigationButton} ${ActiveButton === 2 ? styles.active : ''}`}>
                    <p>Adicionar</p>
                </button>

                <button onClick={(e) => {handlerMenu(e); setOpcaoMenu("remover");}}
                    className={`${styles.navigationButton} ${ActiveButton === 3 ? styles.active : ''}`}>
                    <p>Remover</p>
                </button>

                <button onClick={(e) => {handlerMenu(e); setOpcaoMenu("editar");}}
                    className={`${styles.navigationButton} ${ActiveButton === 4 ? styles.active : ''}`}>
                    <p>Editar</p>
                </button>

                <button className={`${styles.navigationButton} ${ActiveButton === 5 ? styles.active : ''}`}>
                    <p>Perfil</p>
                </button>

                <div className={styles.menu} style={menuStyle}>
                    <Link to={`${opcaoMenu}Generico`} className={styles.link}>
                        <p>Família Instrumento</p>
                    </Link>
                    <Link to={`${opcaoMenu}Instrumento`} className={styles.link}>
                        <p>Instrumento</p>
                    </Link>
                    <Link to={`${opcaoMenu}Audio`} className={styles.link}>
                        <p>Áudio</p>
                    </Link>
                    <Link to={`${opcaoMenu}Generico`} className={styles.link}>
                        <p>Afinação</p>
                    </Link>
                    <Link to={`${opcaoMenu}Generico`} className={styles.link}>
                        <p>Material</p>
                    </Link>
                    <Link to={`${opcaoMenu}Generico`} className={styles.link}>
                        <p>Técnica</p>
                    </Link>
                </div>
            </div>
        </nav>
    )
}