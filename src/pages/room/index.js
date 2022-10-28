import { useContext, useState } from "react"
import { useParams } from "react-router-dom"
import Footer from "../../components/footer"
import NavBar from "../../components/navbar"
import UserContext from "../../context/user"
import s from "./style.module.scss"

function Room () {

    const {roomCode} = useParams()
    const [message, setMessage] = useState("")
    const {user, setUser} = useContext(UserContext)

    function sendMessage(e) {
        e.preventDefault()
        console.log('mensagem')
        setMessage("")
    }

    function leaveRoom(e) {
        e.preventDefault()
        user.socket.disconnect()
        setUser({token: user.token, person: user.person})
    }

    return (
        <div className={s['room']}>
            <nav className={s['nav']}><NavBar/></nav>
            <main className={s['main']}>
                <div className={s['header']}>
                    <span className={s['leave']} onClick={leaveRoom}> &lt; Sair</span>
                    <span className={s['room-code']}>{roomCode}</span>
                    <span className={s['empty']}/>
                </div>
                <div className={s['chat']}>
                    
                </div>
                <form
                    className={s['input']}
                    onSubmit={sendMessage}
                >
                        <input
                            onChange={(e)=>{setMessage(e.target.value)}}
                            value={message}    
                        />
                        <button>Enviar</button>
                </form>
            </main>
            <footer><Footer/></footer>
        </div>
    )
}

export default Room