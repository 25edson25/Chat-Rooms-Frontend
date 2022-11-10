function disableClick (button, div, value) {
    button.disabled = value
    div.style["pointer-events"] = value? "none":"auto"
}

export default disableClick