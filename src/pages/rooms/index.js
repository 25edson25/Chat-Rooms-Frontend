import NavBar from "../../components/navbar"
import Footer from "../../components/footer"
import ErrorMessage from "../../components/errorMessage"
import s from "./style.module.scss"
import UserContext from "../../context/user"
import { useContext, useEffect, useState } from "react"
import api from "../../resources/api"
import Room from "../../components/room"
import connect from "../../resources/socket"
import { useNavigate } from "react-router-dom"

function Rooms () {
    const {user, setUser} = useContext(UserContext)
    const [roomPassword, setRoomPassword] = useState("")
    const [roomName, setRoomName] = useState("")
    const [rooms, setRooms] = useState([])
    const [missingName, setMissingName] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [roomNotFound, setRoomNotFound] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        api.get('/room', {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        .then((res)=>{
            setRooms(res.data)
        })
        .catch((err)=>{
            const message = err.response.data.message
            if (message === "Failed to authenticate token") {
                localStorage.clear('user')
                setUser(null)
            }
        })
    },[user.token, setUser])

    async function updateName() {
        let unauthorized

        try {
            await api.put(`/person/${user.person.id}`, {
                    name: user.person.name
                }, {
                    headers: {
                        Authorization: 'Bearer ' + user.token    
                    }
            })
            unauthorized = false
        }
        catch (err) {
            if (err.response.data.message === "Failed to authenticate token")
                unauthorized = true
            else
                unauthorized = false
        }

        return unauthorized
    }

    async function createRoom() {
        
        const unauthorized = await updateName()

        if (unauthorized) {
            localStorage.clear('user')
            return setUser(null)
        }

        const socket = connect(user.token,
            roomPassword? {
                name: roomName,
                password: roomPassword
            }
            : {
                name: roomName
            })
        socket.on('connect_error', (err) => {
            socket.disconnect()

            if (err.message === "room name is required")
                return setMissingName(true)

        })
        socket.on('has_entered', (message)=>{
            setUser({...user, socket})
            return navigate(`/room/${message.roomCode}`)
        })
    }

    function enterRoom(room) {
        return async () => {
            const unauthorized = await updateName()

            if (unauthorized) {
                localStorage.clear('user')
                return setUser(null)
            }

            const socket = connect(user.token, {
                code: room.code,
                password: roomPassword || null
            })

            socket.on('connect_error', (err) => {
                if (err.message === "room not found")
                    return setRoomNotFound(true)
                if (err.message === "incorrect password")
                    return setWrongPassword(true)
            })
            socket.on('has_entered', (message) => {
                setUser({...user, socket})
                return navigate(`/room/${message.roomCode}`)
            })
        }
    }

    return (
        <div className={s["container"]}>
            <nav><NavBar page='rooms'/></nav>
            <div className={s['left']}></div>
            <main className={s['main']}>
                <div className={s['form']}>
                    <div className={s['label']}>
                        <label>Nome de usuário</label>
                        <input
                            onChange={(e)=>{
                                setUser({
                                    token:user.token, 
                                    person: {...user.person, name: e.target.value}
                                })
                                localStorage.setItem('user', JSON.stringify(user))
                            }}
                            value={user.person.name}
                            className={s['input']}
                        />
                    </div>
                    <div className={s['label']}>
                        <ErrorMessage visible={missingName}>
                            Campo obrigatório
                        </ErrorMessage>
                        <label>Nome da Sala</label>
                        <input
                            className={s['input']}
                            onChange={(e)=>{
                                setRoomName(e.target.value)
                            }}
                            value={roomName}
                        />
                    </div>
                    <div className={s['label']}>
                        <ErrorMessage visible={wrongPassword}>
                            Senha Incorreta
                        </ErrorMessage>
                        <label>Senha da Sala</label>
                        <input
                            className={s['input']}
                            onChange={(e)=>{
                                setRoomPassword(e.target.value)
                            }}
                            value={roomPassword}
                            type="password"
                        />
                    </div>
                    <div className={s['button']}>
                        <button onClick={createRoom}>Criar Sala</button>
                    </div>
                </div>
                <div className={s['rooms']}>
                    {rooms.map((room) => {
                        return (
                            <div
                                key={room.code}
                                onClick={enterRoom(room)}
                                className={s['room']}
                            >
                                <ErrorMessage visible={roomNotFound}>
                                    Sala não encontrada
                                </ErrorMessage>
                                <Room
                                    password={roomPassword}
                                    room={room}
                                />
                            </div>
                        )
                    })}
                </div>
            </main>
            <footer><Footer/></footer>
        </div>
    )
}

export default Rooms