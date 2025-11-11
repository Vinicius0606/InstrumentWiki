import styles from "./Header.module.css"
import NotaMusical from "../../assets/notaMusical.png"
import { Link } from "react-router-dom"

type HeaderProps = {
    ActiveButton: number;
}

export default function Header({ ActiveButton }: HeaderProps) {

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

                <Link to={"/adicionar"} 
                    className={`${styles.navigationButton} ${ActiveButton === 2 ? styles.active : ''}`}>
                    <p>Adicionar</p>
                </Link>

                <button className={`${styles.navigationButton} ${ActiveButton === 3 ? styles.active : ''}`}>
                    <p>Remover</p>
                </button>

                <button className={`${styles.navigationButton} ${ActiveButton === 4 ? styles.active : ''}`}>
                    <p>Editar</p>
                </button>

                <button className={`${styles.navigationButton} ${ActiveButton === 5 ? styles.active : ''}`}>
                    <p>Perfil</p>
                </button>
            </div>
        </nav>
    )
}