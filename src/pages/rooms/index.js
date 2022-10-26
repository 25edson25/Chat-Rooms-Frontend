import NavBar from "../../components/navbar"
import Footer from "../../components/footer"
import s from "./style.module.scss"

function Rooms () {
    return (
        <div className={s["container"]}>
            <nav><NavBar page='rooms'/></nav>
            <div className={s['left']}>
                
            </div>
            <main className={s['main']}>
                
            </main>
            <footer><Footer/></footer>
        </div>
    )
}

export default Rooms