import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import servicesCountries from './services/countries'
import Countries from './Components/Countries'

function App() {
  const [countries, setCountries] = useState([])
  const [countriesFind, setCountriesFind] = useState('')
  const [countriesFound, setCountriesFound] = useState([])


  useEffect(()=>{
    servicesCountries
      .getAll()
      .then(countriesData=>{
        // setCountries(countryData)
        setCountries(countriesData.map(c=>c.name.common))
        console.log('promise fulfilled')
      })

      
  },[])

  const handleChangeCountriesFind = event =>{
    setCountriesFind(event.target.value)
    setCountriesFound(countries.filter(c => c.toLowerCase().indexOf(countriesFind)>-1))

    // if(countriesFind.trim() === ''){
    //   setCountriesFound([])
    // }
    // console.log(countriesFound)
    // if(countriesFound.length === 1){
    //   servicesCountries
    //       .getByName(countriesFound[0])
    //       .then(countryReturned =>{
    //           const langArr = Object.entries(countryReturned.languages).map(([k,v])=>v)
    //           const countryObj = {
    //               name: countryReturned.name.common,
    //               capital: countryReturned.capital[0],
    //               area: countryReturned.area,
    //               languages: langArr,
    //               flags: {
    //                   src: countryReturned.flags.png,
    //                   alt: countryReturned.flags.alt
    //               }
    //           }
    //           setCountryShown(countryObj)
    //           // countryShown.languages.map((lang, id)=>{console.log(lang, id)})
    //         })
            
    //       }
          // setCountryShown(null)
          
          
  }

    const setCountryId = id=>{
            setCountriesFound([countriesFound[id]])
            // console.log(countriesFound)
            
        }

  return (
    <>
      find countries <input value={countriesFind} onChange={handleChangeCountriesFind}/>
      <Countries search = {countriesFind} countriesFound={countriesFound}  setCountryId={setCountryId} />
      {/* <Countries countryShown={countryShown} search = {countriesFind} countriesFound={countriesFound}/> */}
    </>
  )
}

export default App
