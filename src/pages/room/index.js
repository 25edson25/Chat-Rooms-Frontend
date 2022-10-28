import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../../components/footer"
import NavBar from "../../components/navbar"
import UserContext from "../../context/user"
import s from "./style.module.scss"
import api from "../../resources/api"

function Room () {

    const {roomCode} = useParams()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    function sendMessage(e) {
        e.preventDefault()
        user.socket.send(message)
        setMessage("")
    }

    user.socket.on('response', (res) => {
        setMessages([...messages, res])
    })

    function leaveRoom(e) {
        e.preventDefault()
        user.socket.disconnect()
        setUser({token: user.token, person: user.person})
    }

    useEffect(()=>{
        api.get(`/room/${roomCode}/message`, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        .then((res) => {
            setMessages(res.data)
        })
        .catch((err) => {
            const message = err.response.data.message

            if (message === "unauthorized" || message === "person not in a room")
                return navigate('/rooms')
        })
    }, [roomCode, user.token, navigate])

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
                    {messages.map((msg) => {
                        return <span key={msg.id}>{msg.message}</span>
                    })}                    
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