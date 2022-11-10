import { useEffect, useState } from "react"

function Teste () {
    const [obj2, setObj2] = useState({b:2})
    const [obj, setObj] = useState({a:1, obj2})
    const [text, setText] = useState("a")
    console.log("Renderizando de novo")
    console.log("obj1:")
    console.log(obj) 
    console.log("obj2:")
    console.log(obj2)

    useEffect(()=>{
        console.log("obj1 mudou:")
        console.log(obj)
    }, [obj])

    useEffect(()=>{
        console.log("obj2 mudou:")
        console.log(obj2)
    }, [obj2])

    return (
        <div>
            <h1>Teste</h1>
            <span>{text}</span>
            <button onClick={(e) => {
                e.preventDefault()
                obj.novo = "novo"
                setObj({...obj, obj2})
            }}>
                Adiciona obj2 em obj1
            </button>
            <button onClick={(e => {
                e.preventDefault()
                setObj2({b: obj2.b+"2"})
            })}>
                Muda obj2
            </button>
            <button onClick={(e)=>{
                e.preventDefault()
                setText(text+'a')
            }}>
                Atualizar
            </button>
        </div>
    )
}

export default Teste