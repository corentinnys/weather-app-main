

import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Info from "./Info";
function App() {
    const [data, setData] = useState([]);


    /*const getCoordinates = (city) => {
        return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    return {
                        latitude: data.results[0].latitude,
                        longitude: data.results[0].longitude
                    };
                } else {
                    throw new Error("City not found");
                }
            });
    };*/



    const getWeather = (lat, lon) => {
        fetch(`https://api.open-meteo.com/v1/forecast?
latitude=${lat}&longitude=${lon}&
current=temperature_2m,apparent_temperature,wind_speed_10m,precipitation,relative_humidity_2m,weathercode&
daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weathercode&
timezone=auto&language=fr&hourly=temperature_2m`)
            .then(res => res.json())
            .then(data => setData(data));

    };


    const handleSearch = () => {
        const encodedCity = encodeURIComponent(city);

        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=fr`)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const result = data.results[0];

                    // Met à jour la ville pour l'affichage
                    setCityDisplay(`${result.name}, ${result.country}`);

                    // Ici tu peux aussi récupérer lat/lon pour la météo
                    const lat = result.latitude;
                    const lon = result.longitude;

                    getWeather(lat, lon); // ta fonction pour fetch météo
                } else {
                    setCityDisplay("Ville non trouvée");
                }
            })
            .catch(err => {
                console.error(err);
                setCityDisplay("Erreur de recherche");
            });
    };
    const [city, setCity] = useState("");
    const [cityDisplay, setCityDisplay] = useState("");
    const weatherImages = {
        0: "/assets/images/icon-sunny.webp",                // Clair
        1: "assets/images/icon-partly-cloudy.webp",       // Partiellement nuageux
        2: "/icons/cloudy.png",              // Nuageux
        3: "/assets/images/icon-overcast.webp",            // Couvert
        45: "/assets/images/icon-fog.webp",                // Brouillard
        48: "/assets/images/icon-fog.webp",
        51: "/assets/images/icon-drizzle.webp",            // Pluie légère
        53: "/assets/images/icon-drizzle.webp",
        55: "/assets/images/icon-drizzle.webp",
        61: "/assets/images/icon-rain.webp",               // Pluie
        63: "/assets/images/icon-rain.webp",
        65: "/assets/images/icon-rain.webp",
        71: "/assets/images/icon-snow.webp",               // Neige
        73: "/assets/images/icon-snow.webp",
        75: "/assets/images/icon-snow.webp",
        80: "/icons/showers.png",            // Averses
        81: "/icons/showers.png",
        82: "/icons/showers.png",
        95: "/assets/images/icon-storm.webp",       // Orage
        96: "/assets/images/icon-storm.webp",
        99: "/assets/images/icon-storm.webp",
    };
    return (
    <div className="bg-light">
        <section className="container">

            <header className="row">
                <h1 className="text-primary">How's the sky looking today</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Search for a place..."
                    />
                    <button onClick={handleSearch}>
                        🔍
                    </button>
                </div>
            </header>
            <main className='row'>
                <div className="col-12">
                    <section className="container-fluid">
                    <div className="current col-9">
                        <h2>{cityDisplay || "Aucune ville sélectionnée"}</h2>

                        {data.current ? (
                            <div className="info-weather">
                                {weatherImages[data.current.weathercode] && (
                                    <img
                                        src={weatherImages[data.current.weathercode]}
                                        alt="Weather icon"
                                        style={{ width: "50px", height: "50px", marginLeft: "10px" }}
                                    />
                                )}
                                <span>{data.current.temperature_2m}°C</span>

                            </div>
                        ) : (
                            <span>Loading...</span>
                        )}
                    </div>
                    <div className="container-fluid col-6">
                        <div className="row">
                                    <Info value={data?.current?.apparent_temperature}  title={"feels like"} />
                                    <Info value={data?.current?.relative_humidity_2m}  title={"Humidity"} />
                                    <Info value={data?.current?.wind_speed_10m} title={"wind"}/>
                                    <Info value={data?.current?.precipitation} title={"precipitation"} />
                        </div>

                    </div>
                </section>
                <h2 className="title-daily">Daily forecast</h2>
                <section className="daily-forecast">
                    {data.daily ? data.daily.time.map((day, index) => (
                        <div key={day} className="day">
                            <h2> {new Date(day).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" })}   </h2>

                            {weatherImages[data.daily.weathercode[index]] && (
                                <img
                                    src={weatherImages[data.daily.weathercode[index]]}
                                    alt="Weather icon"
                                    style={{ width: "50px", height: "50px", marginLeft: "10px" }}
                                />
                            )}

                            <div className="temperature">
                                <span>{data.daily.temperature_2m_max[index]}°C </span>
                                <span>{data.daily.temperature_2m_min[index]}°C</span>
                            </div>
                        </div>
                    )) : "Loading..."}
                </section>
                </div>
                <aside>
                    <div>
                        <h2> Hourly forecast</h2>
                        <label htmlFor="day">Jour :</label>
                        <input type="text" id="day" list="day-list" placeholder="Tapez un jours..."/>

                        <datalist id="day-list">
                            <option value="Thuesday"></option>
                            <option value="Wednesday"></option>
                            <option value="Thurday"></option>
                            <option value="Friday"></option>
                            <option value="Saterday"></option>
                            <option value="Sunday"></option>
                        </datalist>
                    </div>
                    <ul>
                        <li></li>
                    </ul>
                </aside>
            </main>
        </section>

    </div>
  )
}

export default App
