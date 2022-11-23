import { io } from "socket.io-client"
import disableClick from "../utils/disableClick"

function connect(token, query) {
    console.log("chamando função connect: ")
    console.log({token, query})
    return io(process.env.REACT_APP_API_URL, {
        auth: {
            token: "Bearer " + token
        },
        query
    })
}

function hasEntered(socket, user, setUser, navigate, states) {
    console.log("adiciona handler hasEntered")
    return function has_entered (res) {
        console.log("entrou na função hasEntered")
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
    }
}

function connectError(socket, states) {
    console.log("adiciona handler connectError")
    return function connect_error (err) {
        console.log("entrou na connect_error, mensagem: " + err.message)
        socket.disconnect()
        states.setDisabled(false)
        disableClick(states.button, states.div, false)

        if (err.message === "room name is required")
            return states.setMissingRoomName(true)
        if (err.message === "room not found")
            return states.setRoomNotFound(true)
        if (err.message === "incorrect password")
            return states.setWrongPassword(true)
    }
}

function messageResponse(states) {
    console.log("adiciona handler messageResponse")
    return function response (res) {
        console.log("entrou na função messageResponse")
        const newMessages = [...states.messages, res]
        states.setMessages(newMessages)
    }
}

function addHandlers(socket, handlers) {
    console.log("entrou na função addHandlers")
    for (let handler of handlers)
        socket.once(handler.name, handler)
}

const functions = {
    connect,
    hasEntered,
    connectError,
    messageResponse,
    addHandlers
}

export default functions