import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../../components/footer"
import NavBar from "../../components/navbar"
import Message from "../../components/message"
import UserContext from "../../context/user"
import s from "./style.module.scss"
import api from "../../resources/api"
import io from "../../resources/socket"


function Room () {

    const {roomCode} = useParams()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const {user, setUser} = useContext(UserContext)
    const [socket, setSocket] = useState(user.socket)
    const hasReconnected = useRef(false)
    const navigate = useNavigate()
    
    useEffect(()=>{
        if (socket) {
            if (messages.length || (socket._callbacks && !socket._callbacks.$response))
                io.addHandlers(socket, [
                    io.messageResponse({
                        messages, setMessages
                    })
                ])

            if (hasReconnected.current) {
                socket.emit('reconnected', user.person)
                hasReconnected.current = false
            }

            return;
        }

        if(roomCode === user.room.code) {
            setSocket(
                io.connect(user.token, {
                    code: user.room.code,
                    password: user.room.password || null
                })
            )
            hasReconnected.current = true
        }

    }, [user, socket, messages, roomCode, setUser, navigate])

    useEffect(()=>{
        (async () => {
            const res = await api.getMessagesFromRoom(user.token, roomCode)

            if(res.hasError)
                return navigate('/rooms');

            setMessages(res)
        })()
    }, [roomCode, user.token, navigate])

    function sendMessage(e) {
        e.preventDefault()
        socket.send(message)
        setMessage("")
    }

    function leaveRoom(e) {
        e.preventDefault()
        socket.disconnect()

        const newUser = {token: user.token, person: user.person}
        setUser(newUser)   
        localStorage.setItem('user', JSON.stringify(newUser))
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
                    {messages.slice(0).reverse().map((msg) => {
                        return (
                            <div
                                key={msg.id}
                                className={s['message']}
                            >
                                <Message>
                                    {msg}
                                </Message>
                            </div>
                        )
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