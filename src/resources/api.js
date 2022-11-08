import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

api.updateName = async (user, setUser, name) => {
    let hasError
    let missingName = false

        try {
            const res = await api.put(`/person/${user.person.id}`, {name}, {
                    headers: {
                        Authorization: 'Bearer ' + user.token    
                    }
            })
            setUser({...user, person:{...user.person, name: res.data.name}})
            localStorage.setItem('user', JSON.stringify(user))
            hasError = false
        }
        catch (err) {

            if (err.response.data.message === "name can't be empty")
                missingName = true

            if (err.response.data.message === "Failed to authenticate token") {
                localStorage.clear('user')
                setUser(null)
            }

            hasError = true
        }

        return hasError? {missingName}:false
}

export default api