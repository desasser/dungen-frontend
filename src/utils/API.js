const axios = require("axios")
//local url communication
const URL_PREFIX = "http://localhost:3030"
//When ready, the deployed site will use the following:
// const URL_PREFIX = "https://quiet-caverns-20153.herokuapp.com"


const API = {

    signup: newUser => {
        // console.log(newUser)
        return axios.post(`${URL_PREFIX}/api/newUser`, newUser)
    },
    login: userData => {
        // console.log(userData)
        return axios.post(`${URL_PREFIX}/login`, userData)
    },
    getAuthToken: token => {
        // console.log(token)
        return axios.get(`${URL_PREFIX}/auth`, {
            headers: {
                authorization: `Bearer: ${token}`
            }
        })
    },
    getTiles: tiles => {
        // console.log(tiles)
        return axios.get(`${URL_PREFIX}/api/tiles`)
    },
    getTilesByEnvironment: environment => {
      return axios.get(`${URL_PREFIX}/api/tiles/${environment}`)
  },
    getEnvironments: () => {
      // console.log(tiles)
      return axios.get(`${URL_PREFIX}/api/Environments`)
    },
    // add USER ID into the query
    getUserMaps: userId => {
        // console.log(userId);
        return axios.get(`${URL_PREFIX}/api/usermaps/${userId}`)
    },
    getSingleMap: mapId => {
        // console.log(mapId);
        return axios.get(`${URL_PREFIX}/api/map/${mapId}`)
    },
    saveMap: title => {
        // console.log(map);
        return axios.post(`${URL_PREFIX}/api/newMap`, title)
    },
    saveMapTile: tile => {
        // console.log(tile);
        return axios.post(`${URL_PREFIX}/api/maptile`, tile)
    },
    updateMap: map => {
        return axios.put(`${URL_PREFIX}/api/updateMap`, map);
    },
    updateMapTile: tile => {
        return axios.put(`${URL_PREFIX}/api/maptile}`, tile)
    },
    deleteMap: mapId => {
        // console.log(URL_PREFIX);
        return axios.delete(`${URL_PREFIX}/api/deleteMap/${mapId}`)
    },
    deleteMapTile: tileId => {
        return axios.delete(`${URL_PREFIX}/api/maptile/${tileId}`)
    }
}

export default API
