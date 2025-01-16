import axios from "axios";


const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"

const getAll = () =>{
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

const getByName = (CountryName)=>{
    const request = axios.get(`${baseUrl}/name/${CountryName}`)
    return request.then(response=>response.data)
}

export default {getAll, getByName}