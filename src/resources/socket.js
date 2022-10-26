import { io } from "socket.io-client"

function connect (token, query) {
    return io("http://localhost:3001", {
        auth: {
            token: "Bearer " + token
        },
        query
    })
}

export default connect