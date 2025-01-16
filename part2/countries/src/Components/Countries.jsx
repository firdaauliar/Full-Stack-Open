import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
// import countries from '../services/countries'
import servicesCountries from '../services/countries'

const Countries = (props) => {
    const [countryShown, setCountryShown] = useState(null)
    // const countryShown = props.countryShown
    const countriesFound = props.countriesFound
    const search = props.search
    console.log(countriesFound)
    
    // console.log(countryShown)
    useEffect(()=>{
        if(countriesFound.length === 1){
            servicesCountries
                .getByName(countriesFound[0])
                .then(countryReturned =>{
                    const langArr = Object.entries(countryReturned.languages).map(([k,v])=>v)
                    const countryObj = {
                        name: countryReturned.name.common,
                        capital: countryReturned.capital[0],
                        area: countryReturned.area,
                        languages: langArr,
                        flags: {
                            src: countryReturned.flags.png,
                            alt: countryReturned.flags.alt
                        }
                    }
                    setCountryShown(countryObj)
                    // countryShown.languages.map((lang, id)=>{console.log(lang, id)})
                })
                  
            }
            // }else if(countriesFound.length ===)
        if(search.length === 0){
            setCountryShown(null)
        }
    },[search, countriesFound])
                
    // console.log(search)
    const handleDisplayCountry = (id) =>{
        props.setCountryId(id)
        
    }


    if(countriesFound.length > 1 && countriesFound.length <= 5){

        

        return(
            <div>
                {countriesFound.map((country,id)=>
                    <p key={id}>
                        {country} 
                        <button onClick={()=>handleDisplayCountry(id)} >show</button>
                    </p>
                )}
            </div>
        )
    }else if(countriesFound.length > 5 && search.length>0){
        return(
            <p>Too many matches, specify another letter </p>
        )
    }

        return(
            <div>
                {search && countryShown?
                    <div>
                    <h1>{countryShown.name}</h1>
                    <p>capital {countryShown.capital}</p>
                    <p>area {countryShown.area}</p>
                    <p><b>languages:  </b>
                        <ul>{
                                countryShown.languages.map((lang, id)=><li key={id}>{lang}</li>)
                            }
                        </ul>
                    </p>
                    <img src={countryShown.flags.src} alt={countryShown.flags.alt}></img>
                </div> :
                <p></p>
                }
            </div>
        )
    }
    


export default Countries