import NavBar from "../../components/navbar"
import Footer from "../../components/footer"
import s from "./style.module.scss"

function Login () {
    return (
        <div className={s["container"]}>
            <nav><NavBar page='login'/></nav>
            <main>
                <div className={s['banner']}></div>
                <div className={s['login']}>
                    <span className={[s['label'], s['text']].join(' ')}>
                        Login
                    </span>
                    <div className={s['label']}>
                        <label>Email:</label>
                        <input type="email"/>
                    </div>
                    <div className={s['label']}>
                        <label>Senha:</label>
                        <input type="password"/>
                    </div>
                    <button>Login</button>
                </div>
            </main>
            <footer><Footer/></footer>
        </div>
    )
}

export default Login