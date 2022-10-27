import { useParams } from "react-router-dom"

function Room () {

    const {roomCode} = useParams()
    console.log(roomCode)
    return (
        <div>
            <h1>Room</h1>
        </div>
    )
}

export default Room