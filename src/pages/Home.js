import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { apiKey } from '../Constantes'

function Home() {
    useEffect(() => {
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
                    var cosos = []
                    const tftTacticianRes = await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/es_MX/tft-tactician.json')
                    const tftTactician = await tftTacticianRes.json()
                    matches.map(async m => {
                        const matchDataResult = await fetch(`https://${routingRegion}.api.riotgames.com/tft/match/v1/matches/${m}?api_key=${apiKey}`)
                        const matchData = await matchDataResult.json()
                        matchData.info.participants.map(p => {
                            if (p.puuid === summonerData.puuid) {
                                const tacticianUrl = tftTactician.data[p.companion.item_ID].image.full
                                const newData = [...cosos]
                                newData.push({ matchId: m, data: p, img: tacticianUrl })
                                cosos = newData
                            }
                            return (cosos)
                        })
                        localStorage.setItem('MatchesData', JSON.stringify(cosos))
                    })
                }
            }
            fetchData()
        }
        return () => {

        }
    }, [])

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
                localStorage.getItem('MatchesData') ? JSON.parse(localStorage.getItem('MatchesData')).map(m => {
                    return (
                        <div key={m.matchId}>
                            <h3>Lugar: {m.data.placement} Nivel: {m.data.level} Tiempo Jugado: {formatTime(m.data.time_eliminated)}</h3>
                            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/tft-tactician/${m.img}`} alt="" />
                            {m.data.traits.map(t => {
                                return (
                                    <img key={t.name + t.num_units + m.matchId} src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/tft-trait/Trait_Icon_${traitFormat(t.name)}.png`} alt="" className='trait' />
                                )
                            })}
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

const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds) % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

const traitFormat = (str) => {
    const parts = str.split("_");
    var trait = parts[parts.length - 1]
    switch (trait) {
        case 'Brawler':
            trait = '3_Brawler'
            break;
        case 'StarGuardian':
            trait = '3_StarGuardian'
            break;
        case 'Duelist':
            trait = '4_Duelist'
            break;
        case 'UndergroundThe':
            trait = '8_Underground'
            break;
        default:
            const trait2 = trait
            trait = `8_${trait2}`
            console.log(trait)
            break;
    }
    return trait
}

export default Home