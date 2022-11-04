import s from "./style.module.scss"

function LoadingMessage ({visible, children}) {

    if (visible)
        return (
            <span className={s["message"]}>
                {children}
            </span>
        )
}

export default LoadingMessage