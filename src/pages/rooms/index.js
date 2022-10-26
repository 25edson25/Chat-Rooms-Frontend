import NavBar from "../../components/navbar"
import Footer from "../../components/footer"
import s from "./style.module.scss"
import UserContext from "../../context/user"
import { useContext, useEffect, useState } from "react"
import api from "../../resources/api"
import Room from "../../components/room"


function Rooms () {
    const {user, setUser} = useContext(UserContext)
    const [roomPassword, setRoomPassword] = useState("")
    const [roomName, setRoomName] = useState("")
    const [rooms, setRooms] = useState([])

    useEffect(()=>{
        console.log(user.token)
        api.get('/room', {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        .then((res)=>{
            setRooms(res.data)
        })
        .catch((err)=>{
            console.log("deu erro")
            console.log(err)
        })
    },[user.token])


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
                        <button>Criar Sala</button>
                    </div>
                </div>
                <div className={s['rooms']}>
                    {rooms.map((room) => {
                        return <Room key={room.code} room={room}/>
                    })}
                </div>
            </main>
            <footer><Footer/></footer>
        </div>
    )
}

export default Rooms