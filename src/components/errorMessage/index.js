import s from "./style.module.scss"

function ErrorMessage ({visible, children}) {

    if (visible)
        return (
            <span className={s["message"]}>
                {children}
            </span>
        )
}

export default ErrorMessage