import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { apiKey } from '../Constantes'

function Home() {

    const [matchesData, setMatchesData] = useState([
        {
            matchId: '',
            data: {}
        }
    ])

    const summonerName = localStorage.getItem('SummonerName')
    const region = localStorage.getItem('Region')
    var routingRegion = ''
    if (summonerName && region !== '' && !localStorage.getItem('SummonerData')) {
        switch (region) {
            case 'na1':
            case 'la1':
            case 'la2':
            case 'br1':
                routingRegion = 'americas'
                break;
            case 'kr':
            case 'jp1':
                routingRegion = 'asia'
                break;
            case 'eun1':
            case 'euw1':
            case 'tr1':
            case 'ru':
                routingRegion = 'europe'
                break;
            case 'oc1':
                routingRegion = 'sea'
                break;
            default:
                break;
        }

        const fetchData = async () => {
            const response = await fetch(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${summonerName}?api_key=${apiKey}`)
            const summonerData = await response.json()
            localStorage.setItem('SummonerData', JSON.stringify(summonerData))
            if (summonerData && routingRegion !== '') {
                const matchesResult = await fetch(`https://${routingRegion}.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerData.puuid}/ids?start=0&count=20&api_key=${apiKey}`)
                const matches = await matchesResult.json()
                localStorage.setItem('Matches', JSON.stringify(matches))
                matches.map(async m => {
                    const matchDataResult = await fetch(`https://${routingRegion}.api.riotgames.com/tft/match/v1/matches/${m}?api_key=${apiKey}`)
                    const matchData = await matchDataResult.json()
                    matchData.info.participants.map(p => {
                        if (p.puuid === summonerData.puuid) {
                            const newData = [...matchesData]
                            newData.push({ matchId: m, data: p })
                            setMatchesData(newData)
                        }
                    })
                    console.log(matchesData)
                })
            }
        }

        fetchData()
    }

    return (
        <>
            <Navbar />
            {
                localStorage.getItem('SummonerData') ? <SummonerData /> : <NotSummonerData />
            }
        </>
    )

}

function SummonerData() {
    return (
        <>
            {
                localStorage.getItem('Matches') ? JSON.parse(localStorage.getItem('Matches')).map(m => {
                    return (
                        <div key={m}>
                            {m}
                        </div>
                    )
                })
                    :
                    <div>No se encontraron partidas.</div>
            }
        </>
    )
}

function NotSummonerData() {
    return (
        <>
            Buscar invocador
        </>
    )
}

export default Home