import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

api.updateName = async (user, setUser, name) => {
    let hasError
    let missingName = false

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

            if (err.response.data.message === "name can't be empty")
                missingName = true

            if (err.response.data.message === "Failed to authenticate token") {
                localStorage.clear('user')
                setUser(null)
            }

            hasError = true
        }

        return hasError? {missingName}:false
}


api.getMessagesFromRoom = async (token, roomCode) => {
    let res
    try {
        res = await api.get(`/room/${roomCode}/message`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        res = res.data.map(
            message => {
                return {
                    id: message.id,
                    message: message.message,
                    hour: message.hour,
                    senderName: message.Sender.name,
                    senderId: message.Sender.id
                }
            }
        )
    }
    catch (err) {
        const message = err.response.data.message
        res = {hasError:true, message} 
    }
    finally {
        return res
    }
}

export default api