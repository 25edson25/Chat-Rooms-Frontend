import s from "./style.module.scss"
import UserContext from "../../context/user"
import { useContext } from "react"

function Message ({children: msg}) {

    const {user} = useContext(UserContext)

    return (
        <div className={
            (msg.senderId === user.person.id)?
                s['sender']
            :
                s['receiver']
        }>
            <span className={s['name']}>{msg.senderName}</span>
            <span className={s['text']}>{msg.message}</span>
        </div>
    )
}

export default Message