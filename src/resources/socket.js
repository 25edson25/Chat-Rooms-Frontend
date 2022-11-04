import { io } from "socket.io-client"

function connect (token, query) {
    return io(process.env.REACT_APP_API_URL, {
        auth: {
            token: "Bearer " + token
        },
        query
    })
}

export default connect