import NavBar from "../../components/navbar"
import Footer from "../../components/footer"
import ErrorMessage from "../../components/errorMessage"
import s from "./style.module.scss"
import UserContext from "../../context/user"
import { useContext, useEffect, useState } from "react"
import api from "../../resources/api"
import Room from "../../components/room"
import { useNavigate } from "react-router-dom"
import LoadingMessage from "../../components/loadingMessage"
import io from "../../resources/socket"
import disableClick from "../../utils/disableClick"


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
            if (err.response.data.message === "Failed to authenticate token") {
                localStorage.clear('user')
                setUser(null)
            }
        })
    },[user.token, setUser, refresh])

    function handleClick(room) {
        return async (e) => {
            e.preventDefault()
            setDisabled(true)
            const button = document.getElementsByClassName(s['button'])[0].children[0]
            const div = document.getElementsByClassName(s['rooms'])[0]
            disableClick(button, div, true)

            const hasError = await api.updateName(user, setUser, name)
            console.log("atualizou o nome, retorno: ")
            console.log(hasError)
            if (hasError) {
                setMissingName(hasError.missingName)

                setDisabled(false)
                disableClick(button, div, false)
                return;
            }
            setMissingName(false)
            console.log("conectar")
            let socket
            if (!room)
                socket = io.connect(user.token,
                    roomPassword? {
                        name: roomName,
                        password: roomPassword
                    }
                    : {
                        name: roomName
                    }
                )
            else 
                socket = io.connect(user.token, {
                    code: room.code,
                    password: roomPassword || null
                })
            
            console.log("adicionando os handlers")
            io.addHandlers(socket, [
                io.hasEntered(socket, user, setUser, navigate, {
                    name, roomPassword
                }),
                io.connectError(socket, {
                    setMissingRoomName,
                    setRoomNotFound,
                    setWrongPassword,
                    setDisabled,
                    button, div
                })
            ])
        }
    }

    return (
        <div className={s["container"]}>
            <nav className={s['nav']}><NavBar page='rooms'/></nav>
            <div className={s['left']}></div>
            <main className={s['main']}>
                <form className={s['form']}>
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
                        <button onClick={handleClick()}>Criar Sala</button>
                    </div>
                </form>
                <div className={s["loading"]}>
                    <LoadingMessage visible={disabled}>
                                Carregando...
                    </LoadingMessage>
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
                                onClick={handleClick(room)}
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