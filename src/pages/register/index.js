import Footer from "../../components/footer"
import NavBar from "../../components/navbar"
import s from "./style.module.scss"

function Register () {

    return (
        <div className={s['container']}>
            <nav><NavBar page="register"/></nav>
            <div className={s['banner']}></div>
            <main>
                <div className={s['register']}>
                    <span className={[s['label'], s['text']].join(' ')}>
                        Registre-se
                    </span>
                    <div className={s['label']}>
                        <label>Nome de Usuário:</label>
                        <input type="text"/>
                    </div>
                    <div className={s['label']}>
                        <label>Email:</label>
                        <input type="email"/>
                    </div>
                    <div className={s['label']}>
                        <label>Senha:</label>
                        <input type="password"/>
                    </div>
                    <button>Cadastrar</button>
                </div>
            </main>
            <footer><Footer/></footer>
        </div>
    )
}

export default Register