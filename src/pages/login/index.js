import NavBar from "../../components/navbar"
import Footer from "../../components/footer"
import ErrorMessage from "../../components/errorMessage"
import s from "./style.module.scss"
import api from "../../resources/api"
import { useContext, useState } from "react"
import UserContext from "../../context/user"
import LoadingMessage from "../../components/loadingMessage"


function Login () {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [wrongPassword, setWrongPassword] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [unknownError, setUnknownError] = useState(false)
    const [disabled, setDisbled] = useState(false)
    const {setUser} = useContext(UserContext)

    function onSubmit (e) {
        const button = e.currentTarget.getElementsByClassName(s['button'])[0]
        button.disabled = true
        setDisbled(true)

        e.preventDefault()
        setWrongPassword(false)
        setNotFound(false)
        setUnknownError(false)

        api.post('/login', {email, password})
        .then((res)=>{
            localStorage.setItem('user', JSON.stringify(res.data))
            setUser(res.data)
        })
        .catch((err)=>{
            const status = err.response.status
            if (status === 404)
                return setNotFound(true)
            
            const message = err.response.data.message
            if (message === "incorrect password")
                return setWrongPassword(true)
            
            setUnknownError(true)
        })
        .finally(()=>{
            setEmail("")
            setPassword("")
            button.disabled = false
            setDisbled(false)
        })
    }

    return (
        <div className={s["container"]}>
            <nav className={s['nav']}><NavBar page='login'/></nav>
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
                <div className={s['confirm']}>
                    <ErrorMessage visible={unknownError}>
                        Erro Desconhecido
                    </ErrorMessage>
                    <LoadingMessage visible={disabled}>
                        Carregando...
                    </LoadingMessage>
                    <button
                        className={s['button']}
                    >
                        Entrar
                    </button>
                </div>
            </form>
            <footer className={s['footer']}><Footer/></footer>
        </div>
    )
}

export default Login