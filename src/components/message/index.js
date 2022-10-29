import s from "./style.module.scss"

function Message ({children: msg}) {
    return (
        <div className={s['message']}>
            <span className={s['sender']}>{msg.senderName}</span>
            <span className={s['text']}>{msg.message}</span>
        </div>
    )
}

export default Message