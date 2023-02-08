import React, { useState } from 'react'

function Navbar() {

    const [summonerName, setSummonerName] = useState("")
    const [region, setRegion] = useState("")

    const handleClick = () => {
        localStorage.clear()
        localStorage.setItem('SummonerName', summonerName)
        localStorage.setItem('Region', region ? region : 'la1')
        window.location.reload()
    }

    const handleChange = (e) => {
        setSummonerName(e.target.value)
    }

    const handleRegionChange = (e) => {
        setRegion(e.target.value)
    }

    return (
        <header>
            <nav>
                <div>
                    <a href="/">
                        <img alt="logo" />
                    </a>
                </div>
                <div>
                    <input type="text" value={summonerName} onChange={handleChange} placeholder="Buscar..." />
                    <select value={region} onChange={handleRegionChange}>
                        <option value="la1">LAN</option>
                        <option value="la2">LAS</option>
                        <option value="br1">BR</option>
                        <option value="eun1">EUNE</option>
                        <option value="euw1">EUW</option>
                        <option value="jp1">JP</option>
                        <option value="kr">KR</option>
                        <option value="na1">NA</option>
                        <option value="oc1">OCE</option>
                        <option value="tr1">TR</option>
                        <option value="ru">RU</option>
                    </select>
                    <button onClick={handleClick}>Buscar</button>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;