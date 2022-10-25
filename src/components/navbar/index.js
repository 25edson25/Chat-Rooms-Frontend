import { Link } from "react-router-dom"
import s from "./style.module.scss"

function NavBar ({page}) {

    function link() {
        if (page === 'login')
            return <Link to="/register" className={s['link']}>Cadastre-se</Link>
        
        if (page === 'register')
            return <Link to="/login" className={s['link']}>Login</Link>
    }

    return (
        <div className={s['navbar']}>
            <div id={s['empty']}></div>
            <h1 id={s['title']}>Chat Rooms</h1>
            <span id={s['link']}>{link()}</span>
        </div>
    )
}

export default NavBar