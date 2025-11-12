import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../components/input/input";
import { Button } from "../../components/button/button";
import styles from "./Login.module.css";
import NotaMusical from "../../assets/notaMusical.png"

export default function Login() {
  // const location = useLocation();
  // const state = location.state as { message?: string };

  // if(state?.message){
  //   alert(state.message);
  // }

  const navigate = useNavigate();

  return(
    <form action="" onSubmit={async (e) => {

      if(!e.currentTarget.checkValidity()){
        e.preventDefault();
        
        e.currentTarget.reportValidity();
    
        return;
      }

      e.preventDefault();

      const formInfo = new FormData(e.currentTarget);
      const nick = String(formInfo.get("username") || "");
      const password = String(formInfo.get("password") || "");

      if(!nick || !password) return;

      try{

        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nick, password }),
        });

        if(res.status == 200){

          console.log("Login realizado com sucesso!");
          alert("Login realizado com sucesso!");
          navigate("/Chats", { replace: true });
          return;
        }

        const data = await res.json();
        const msg = data.error || data.erro || data.acesso || "Erro ao logar.";

        if(/usuário|senha/i.test(msg)){
          
          const inputError = document.getElementById("username") as HTMLInputElement | null;
          
          inputError?.setCustomValidity(msg);
          inputError?.reportValidity();

        }else{

          alert(msg ?? "Erro ao registrar.");
        }

      } catch(err){

        alert("Falha de conexão. Tente novamente.");
      }
    }}>
      <main className={styles.body}>
        <div className={styles.div}>
          <div className={styles.divPageInfo}>
            <div className={styles.headerLogo}>
                <img src={NotaMusical} alt="Logo" className={styles.logoImage} />
                <h1 className={styles.textLogo}>InstrumentsWiki</h1>
            </div>
            <h1 className={styles.textLogo}>Sign In</h1>
          </div>
          <div className={styles.divInfoInputs}>
            <Input text="Username" type="text" name="username" id="username" autoComplete="username" 
              spellCheck={false} minLength={3} maxLength={32} onKeyDown= {(e) => {
              if(e.key === " "){
                e.preventDefault();
              }
              }} onInput={(e) => {e.currentTarget.setCustomValidity("");}} ></Input>

              <Input text="Password" type="password" name="password" id="password" autoComplete="current-password" 
              spellCheck={false} onInput={(e) => {e.currentTarget.setCustomValidity("");}} ></Input>
          </div>
          <Button text="Login" type="submit"></Button>
        </div>
      </main>
    </form>
  );
}