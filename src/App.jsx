
import './App.css'
import React, { useEffect, useState } from "react";

function App() {
    const [data, setData] = useState([]);


    const getCoordinates = (city) => {
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
    };
    const getWeather = (lat, lon) => {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,precipitation,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&language=fr`)
            .then(res => res.json())
            .then(data => setData(data));
    };
   /* const handleSearch = () => {
       // const city = document.querySelector("input").value;

        getCoordinates(city)
            .then(coords => {
                getWeather(coords.latitude, coords.longitude);
            })
            .catch(err => console.error(err));
    };*/

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
    return (
    <>
        <section className="container">
            <header>
                <h1>How's the sky looking today</h1>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Tapez une ville..."
                />

                <button onClick={handleSearch}>Search</button>
            </header>
            <main>
                <section>
                    <div>
                        <h2>{cityDisplay || "Aucune ville sélectionnée"}</h2>
                        {data.current ? (
                            <span>{data.current.temperature_2m}°C</span>
                        ) : (
                            <span>Loading...</span>
                        )}
                    </div>
                    <div>
                       <div>
                           <h2>feel like</h2>
                           <span>
        {data.current ? `${data.current.apparent_temperature}°C` : "Loading..."}
    </span>
                       </div>
                        <div>
                            <h2>humidity</h2>
                            <span>
        {data.current ? `${data.current.relative_humidity_2m}%` : "Loading..."}
    </span>
                        </div>
                        <div>
                            <h2>Wind</h2>
                            <span>
        {data.current ? `${data.current.wind_speed_10m} km/h` : "Loading..."}
    </span>
                        </div>
                        <div>
                            <h2>Precipitation</h2>
                            {data.current ? (
                                <span>{data.current.precipitation}</span>
                            ) : (
                                <span>Loading...</span>
                            )}
                        </div>
                    </div>
                </section>
                <h2>Daily forecast</h2>
                <section>
                    {data.daily ? data.daily.time.map((day, index) => (
                        <div key={day}>
                            <h2> {new Date(day).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" })}   </h2>
                            <div>
                                <span>{data.daily.temperature_2m_max[index]}°C </span>
                                <span>{data.daily.temperature_2m_min[index]}°C</span>
                            </div>
                        </div>
                    )) : "Loading..."}
                </section>
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

    </>
  )
}

export default App
