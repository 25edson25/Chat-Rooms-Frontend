import s from "./style.module.scss"

function NavBar ({page}) {

    function link() {
        if (page === 'login')
            return 'Cadastre-se'
        
        if (page === 'register')
            return 'Login'
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