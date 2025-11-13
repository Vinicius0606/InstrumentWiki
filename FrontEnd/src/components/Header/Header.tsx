import styles from "./Header.module.css"
import NotaMusical from "../../assets/notaMusical.png"
import { Link, useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import type { Usuario } from "../../types"

type HeaderProps = {
    ActiveButton: number;
    usuario: Usuario | undefined
}

export default function Header({ ActiveButton }: HeaderProps) {
    
    //if(usuario === undefined) return;

    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({ display: "none", });
    const [menuPerfilStyle, setMenuPerfilStyle] = useState<React.CSSProperties>({ display: "none", });
    const [opcaoMenu, setOpcaoMenu] = useState<String>("");

    const [usuario, setUsuario] = useState<Usuario>({
        nick: "Admin",
        tipo: "Administrador",
        adicionar: true,
        remover: true,
        editar: true,
        modificar_permissao: true,
    });
    const navigate = useNavigate();


    function handlerMenu(e: React.MouseEvent<HTMLButtonElement>, perfil: boolean){

        if(menuStyle.display === "none" && !perfil){
            const posicao = e.currentTarget.getBoundingClientRect();

            setMenuStyle({
                display: "flex",
                position: "absolute",
                top: posicao.bottom + window.scrollY + 10 + "px",
                left: `calc(${posicao.left}px - 2.5dvw)`,
            });

            setMenuPerfilStyle({display: "none"});
            
        } else{

            setMenuStyle({
                display: "none",
            })
        }

        if(menuPerfilStyle.display === "none" && perfil){
            const posicao = e.currentTarget.getBoundingClientRect();

            setMenuPerfilStyle({
                display: "flex",
                position: "absolute",
                top: posicao.bottom + window.scrollY + 10 + "px",
                left: `calc(${posicao.left}px - 1dvw)`,
            });
            
        } else{

            setMenuPerfilStyle({
                display: "none",
            })
        }
    }

    const handlerLogout = async () => {


        try{
            
            const res = await fetch(`http://localhost:5000/logout`, {
                method: "POST",
                credentials: "include",
            })

            if(res.status === 200) navigate("/login", { replace: true })

        } catch(erro){

            alert("Erro ao fazer logout");
            console.log(erro)

            return;
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

                <button onClick={(e) => {handlerMenu(e, false); setOpcaoMenu("adicionar");}} 
                    style={{display: usuario.adicionar? "flex" : "none"}}
                    className={`${styles.navigationButton} ${ActiveButton === 2 ? styles.active : ''}`}>
                    <p>Adicionar</p>
                </button>

                <button onClick={(e) => {handlerMenu(e, false); setOpcaoMenu("remover");}}
                    style={{display: usuario.remover? "flex" : "none"}}
                    className={`${styles.navigationButton} ${ActiveButton === 3 ? styles.active : ''}`}>
                    <p>Remover</p>
                </button>

                <button onClick={(e) => {handlerMenu(e, false); setOpcaoMenu("editar");}}
                    style={{display: usuario.editar? "flex" : "none"}}
                    className={`${styles.navigationButton} ${ActiveButton === 4 ? styles.active : ''}`}>
                    <p>Editar</p>
                </button>

                <Link to={"/"}
                    style={{display: usuario.modificar_permissao? "flex" : "none"}}
                    className={`${styles.navigationButton} ${ActiveButton === 5 ? styles.active : ''}`}>
                    <p>Usuarios</p>
                </Link>

                <button onClick={(e) => {handlerMenu(e, true); setOpcaoMenu("editar");}}
                    style={{display: usuario.modificar_permissao? "flex" : "none", cursor: "pointer"}}
                    className={`${styles.navigationButton} ${ActiveButton === 6 ? styles.active : ''}`}>
                    <p>Perfil</p>
                </button>

                <div className={styles.menu} style={menuStyle}>
                    <Link to={`/${opcaoMenu}Generico/Família`} className={styles.link}>
                        <p>Família Instrumento</p>
                    </Link>
                    <Link to={opcaoMenu !== "remover"? `/${opcaoMenu}Instrumento` : 
                        `/${opcaoMenu}Generico/Instrumento`} className={styles.link}>
                        <p>Instrumento</p>
                    </Link>
                    <Link to={opcaoMenu !== "remover" ? `/${opcaoMenu}Áudio` : 
                        `/${opcaoMenu}Generico/Áudio`} className={styles.link}>
                        <p>Áudio</p>
                    </Link>
                    <Link to={`/${opcaoMenu}Generico/Afinação`} className={styles.link}>
                        <p>Afinação</p>
                    </Link>
                    <Link to={`/${opcaoMenu}Generico/Material`} className={styles.link}>
                        <p>Material</p>
                    </Link>
                    <Link to={`/${opcaoMenu}Generico/Técnica`} className={styles.link}>
                        <p>Técnica</p>
                    </Link>
                </div>

                <div className={styles.menu} style={menuPerfilStyle}>
                    <p className={styles.informacaoMenu}>{usuario.nick}</p>
                    <p className={styles.informacaoMenu}>{usuario.tipo}</p>
                    <button style={{cursor: "pointer"}} onClick={handlerLogout}>
                        <p className={styles.link}>Logout</p>
                    </button>
                </div>
            </div>
        </nav>
    )
}