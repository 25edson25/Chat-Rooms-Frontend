import { io } from "socket.io-client"

function connect(token, query) {
    return io(process.env.REACT_APP_API_URL, {
        auth: {
            token: "Bearer " + token
        },
        query
    })
}

function addHandlers(socket, user, setUser, navigate, states) {

    socket.on('has_entered', (res)=>{
        const newUser = {
            token: user.token,
            person: {...user.person, name: states.name},
            room: {code: res.roomCode, password: states.roomPassword}
        }
   
        localStorage.setItem('user', JSON.stringify(newUser))
        
        setUser({
            ...newUser,
            socket,
        })

        return navigate(`/room/${res.roomCode}`)
    })
    
    socket.on('connect_error', (err) => {
        socket.disconnect()

        if (err.message === "room name is required")
            return states.setMissingRoomName(true)
        if (err.message === "room not found")
            return states.setRoomNotFound(true)
        if (err.message === "incorrect password")
            return states.setWrongPassword(true)
    })
}

const functions = {addHandlers, connect}

export default functions