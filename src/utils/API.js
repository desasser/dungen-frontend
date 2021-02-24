const axios = require ("axios")

// import axios from "axios"

//new token-oriented route
// const API = {
//     login:newUser=>{
//         returnaxios.post(`http:localhost:3030/`, newUser)
//     }
// }

export default {
    saveUser: function(newUser) {
        console.log(newUser)
        return axios.post("http://localhost:3030/api/newUser", newUser)
    }

}
