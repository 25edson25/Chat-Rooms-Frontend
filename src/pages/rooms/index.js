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
import LoadingMessage from "../../components/loadingMessage"

function Rooms () {
    const {user, setUser} = useContext(UserContext)
    const [name, setName] = useState(user.person.name)
    const [roomPassword, setRoomPassword] = useState("")
    const [roomName, setRoomName] = useState("")
    const [rooms, setRooms] = useState([])
    const [missingName, setMissingName] = useState(false)
    const [missingRoomName, setMissingRoomName] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [roomNotFound, setRoomNotFound] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        api.get('/room', {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        .then((res)=>{
            setRoomNotFound(false)
            setRooms(res.data)
        })
        .catch((err)=>{
            const message = err.response.data.message
            if (message === "Failed to authenticate token") {
                localStorage.clear('user')
                setUser(null)
            }
        })
    },[user.token, setUser, refresh])

    async function updateName() {
        let hasError

        try {
            const res = await api.put(`/person/${user.person.id}`, {name}, {
                    headers: {
                        Authorization: 'Bearer ' + user.token    
                    }
            })
            setUser({...user, person:{...user.person, name: res.data.name}})
            localStorage.setItem('user', JSON.stringify(user))
            hasError = false
        }
        catch (err) {
            console.log(err)
            if (err.response.data.message === "name can't be empty")
                setMissingName(true)

            if (err.response.data.message === "Failed to authenticate token") {
                localStorage.clear('user')
                setUser(null)
            }

            hasError = true
        }

        return hasError
    }

    async function createRoom(e) {
        const button = e.currentTarget
        button.disabled = true
        setDisabled(true)

        e.preventDefault()

        const hasError = await updateName()

        if (hasError) {
            e.currentTarget.disabled = false
            setDisabled(false)
            return hasError
        }

        const socket = connect(user.token,
            roomPassword? {
                name: roomName,
                password: roomPassword
            }
            : {
                name: roomName
            }
        )
        socket.on('connect_error', (err) => {
            socket.disconnect()

            if (err.message === "room name is required")
                return setMissingRoomName(true)

        })
        socket.on('has_entered', (res)=>{
            const newUser = {
                token: user.token,
                person: {...user.person, name},
                room: {code: res.roomCode, password: roomPassword}
            }
            localStorage.setItem('user', JSON.stringify(newUser))
            
            setUser({
                ...newUser,
                socket,
            })

            return navigate(`/room/${res.roomCode}`)
        })

        button.disabled = false
        setDisabled(false)
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
            socket.on('has_entered', (res) => {
                const newUser = {
                    token: user.token,
                    person: {...user.person, name},
                    room: {code: res.roomCode, password: roomPassword}
                }
                localStorage.setItem('user', JSON.stringify(newUser))
                
                setUser({
                    ...newUser,
                    socket,
                })

                return navigate(`/room/${res.roomCode}`)
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
                        <ErrorMessage visible={missingName}>
                            Campo obrigatório
                        </ErrorMessage>
                        <label>Nome de usuário</label>
                        <input
                            onChange={(e)=>{setName(e.target.value)}}
                            value={name}
                            className={s['input']}
                        />
                    </div>
                    <div className={s['label']}>
                        <ErrorMessage visible={missingRoomName}>
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
                        <LoadingMessage visible={disabled}>
                            Carregando...
                        </LoadingMessage>
                        <button onClick={createRoom}>Criar Sala</button>
                    </div>
                </div>
                <div className={s['header']}>
                    <ErrorMessage visible={roomNotFound}>
                        Sala não encontrada
                    </ErrorMessage>
                    <span 
                        className={s['refresh']}
                        onClick={(e) => {   
                            e.preventDefault()
                            setRefresh((refresh + 1) % 2)
                        }}
                    >    
                        Atualizar
                    </span>
                </div>
                <div className={s['rooms']}>
                    {rooms.map((room) => {
                        return (
                            <div
                                key={room.code}
                                onClick={enterRoom(room)}
                                className={s['room']}
                            >
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