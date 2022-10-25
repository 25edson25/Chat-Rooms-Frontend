import NavBar from "../../components/navbar"
import Footer from "../../components/footer"
import ErrorMessage from "../../components/errorMessage"
import s from "./style.module.scss"
import api from "../../resources/api"
import { useState } from "react"


function Login () {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [wrongPassword, setWrongPassword] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [unknownError, setUnknownError] = useState(false)

    function onSubmit (e) {
        e.preventDefault()
        setWrongPassword(false)
        setNotFound(false)
        setUnknownError(false)

        api.post('/login', {email, password})
        .then((e)=>{
            console.log(e.data)
        })
        .catch((err)=>{
            const message = err.response.data.message

            if (message === "user not found")
                setNotFound(true)
            
            if (message === "incorrect password")
                setWrongPassword(true)
            
            setUnknownError(true)
        })

        setEmail("")
        setPassword("")
    }

    return (
        <div className={s["container"]}>
            <nav><NavBar page='login'/></nav>
            <div className={s['banner']}></div>
            <form onSubmit={onSubmit}>
                <span className={[s['label'], s['text']].join(' ')}>
                    Login
                </span>
                <div className={s['label']}>
                    <ErrorMessage visible={notFound}>
                        Usuário não encontrado
                    </ErrorMessage>
                    <label>Email:</label>
                    <input
                        type="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className={s['label']}>
                    <ErrorMessage visible={wrongPassword}>
                        Senha Incorreta
                    </ErrorMessage>
                    <label>Senha:</label>
                    <input
                        type="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button>Entrar</button>
            </form>
            <footer><Footer/></footer>
        </div>
    )
}

export default Login