import { useParams } from "react-router-dom"
import Footer from "../../components/footer"
import NavBar from "../../components/navbar"
import s from "./style.module.scss"

function Room () {

    const {roomCode} = useParams()

    return (
        <div className={s['room']}>
            <nav className={s['nav']}><NavBar/></nav>
            <main className={s['main']}>
                <h1>main</h1>
            </main>
            <footer><Footer/></footer>
        </div>
    )
}

export default Room