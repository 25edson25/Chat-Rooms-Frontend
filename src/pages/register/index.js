import Footer from "../../components/footer"
import NavBar from "../../components/navbar"
import s from "./style.module.scss"
import api from "../../resources/api"
import { useState } from "react"
import ErrorMessage from "../../components/errorMessage"

function Register () {
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [missingName, setMissingName] = useState(false)
    const [duplicatedEmail, setDuplicatedEmail] = useState(false)
    const [missingEmail, setMissingEmail] = useState(false)
    const [missingPassword, setMissingPassword] = useState(false)

    function onSubmit (e) {
        e.preventDefault()
        setMissingEmail(false)
        setMissingName(false)
        setMissingPassword(false)
        setDuplicatedEmail(false)

        api.post('/person', {name, email, password})
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => {
            const message = err.response.data.message

            if (message === "name is required")
                return setMissingName(true)
            if (message === "email is required")
                return setMissingEmail(true)
            if (message === "password is required")
                return setMissingPassword(true)
            if (message === "email already in use")
                return setDuplicatedEmail(true)
        })
        
        setName("")
        setEmail("")
        setPassword("")
    }

    return (
        <div className={s['container']}>
            <nav><NavBar page="register"/></nav>
            <div className={s['banner']}></div>
            <form onSubmit={onSubmit}>
                <span className={[s['label'], s['text']].join(' ')}>
                    Registre-se
                </span>
                <div className={s['label']}>
                    <ErrorMessage visible={missingName}>
                        Campo obrigatório
                    </ErrorMessage>
                    <label>Nome de Usuário:</label>
                    <input 
                        type="text"
                        onChange={(e)=>setName(e.target.value)}
                        value={name}
                    />
                </div>
                <div className={s['label']}>
                    <ErrorMessage visible={missingEmail}>
                        Campo obrigatório
                    </ErrorMessage>
                    <ErrorMessage visible={duplicatedEmail}>
                        Email já em uso
                    </ErrorMessage>
                    <label>Email:</label>
                    <input
                        type="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className={s['label']}>
                   <ErrorMessage visible={missingPassword}>
                        Campo obrigatório
                    </ErrorMessage>
                    <label>Senha:</label>
                    <input
                        type="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button>Cadastrar</button>
            </form>
            <footer><Footer/></footer>
        </div>
    )
}

export default Register