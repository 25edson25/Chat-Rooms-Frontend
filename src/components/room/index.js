import s from "./style.module.scss"

function Room ({password, room}) {

    return (
        <div className={s['room']}>
            <span className={s['code']}>{room.code}</span>
            <span className={s['name']}>{room.name}</span>
        </div>
    )
}

export default Room