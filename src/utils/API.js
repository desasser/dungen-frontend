const axios = require("axios")


const API = {

    signup: newUser => {
        console.log(newUser)
        return axios.post("http://localhost:3030/api/newUser", newUser)
    },
    login: userData => {
        console.log(userData)
        return axios.post("http://localhost:3030/login", userData)
    },
    getAuthToken: token => {
        return axios.get("http://localhost:3030/auth", {
            headers: {
                authorization: `Bearer: ${token}`
            }
        })
    },
    getTiles: tiles => {
        console.log(tiles)
        return axios.get("http://localhost:3030/api/tiles")
    }
}

export default API
