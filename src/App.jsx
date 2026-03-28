import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Info from "./Info";
import Days from "./Days";
import "./App.css";

function App() {
    const [data, setData] = useState(null); // données météo
    const [city, setCity] = useState("");    // texte input ville
    const [cityDisplay, setCityDisplay] = useState(""); // nom de ville affiché

    const weatherImages = {
        0: "/assets/images/icon-sunny.webp",
        1: "/assets/images/icon-partly-cloudy.webp",
        2: "/icons/cloudy.png",
        3: "/assets/images/icon-overcast.webp",
        45: "/assets/images/icon-fog.webp",
        48: "/assets/images/icon-fog.webp",
        51: "/assets/images/icon-drizzle.webp",
        53: "/assets/images/icon-drizzle.webp",
        55: "/assets/images/icon-drizzle.webp",
        61: "/assets/images/icon-rain.webp",
        63: "/assets/images/icon-rain.webp",
        65: "/assets/images/icon-rain.webp",
        71: "/assets/images/icon-snow.webp",
        73: "/assets/images/icon-snow.webp",
        75: "/assets/images/icon-snow.webp",
        80: "/icons/showers.png",
        81: "/icons/showers.png",
        82: "/icons/showers.png",
        95: "/assets/images/icon-storm.webp",
        96: "/assets/images/icon-storm.webp",
        99: "/assets/images/icon-storm.webp",
    };
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
    // Récupération météo
    const getWeather = (lat, lon) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=apparent_temperature,relativehumidity_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const now = new Date();
                const currentHour = now.toISOString().slice(0, 13);
                const hourIndex = data.hourly.time.findIndex(t => t.startsWith(currentHour));
                const i = hourIndex !== -1 ? hourIndex : 0;

                data.current_weather.apparent_temperature = data.hourly.apparent_temperature[i] + "°C";
                data.current_weather.windspeed = data.hourly.windspeed_10m[i] + " km/h";
                data.current_weather.humidity = data.hourly.relativehumidity_2m[i] + "%";
                data.current_weather.precipitation = data.hourly.precipitation[i] + " mm";

                setData({...data});
            })
            .catch(err => console.error("Erreur météo :", err));
    };

    // Recherche ville
    const handleSearch = () => {
        const encodedCity = encodeURIComponent(city);
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=fr`)
            .then(res => res.json())
            .then(result => {
                if (result.results && result.results.length > 0) {
                    const r = result.results[0];
                    setCityDisplay(`${r.name}, ${r.country}`);
                    getWeather(r.latitude, r.longitude);
                } else {
                    setCityDisplay("Ville non trouvée");
                }
            })
            .catch(err => {
                console.error("Erreur géocoding :", err);
                setCityDisplay("Erreur de recherche");
            });
    };

    return (
        <div >
            <section className="container">
                <header className="row justify-content-center text-center">
                    <h1 className="text-primary">
                        How's the sky looking today
                    </h1>

                    <div className="col-12 d-flex justify-content-center">
                        <div className="search-bar d-flex">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Search for a place..."
                            />
                            <button onClick={handleSearch}>🔍</button>
                        </div>
                    </div>
                </header>

                <main className="row">
                    <div className="col-12">
                        {/* Current weather */}
                        <section className="container-fluid">
                            {/* Bloc Current */}
                            <div className="current col-9 d-flex flex-column align-items-start mb-4">
                                <h2 className="text-white mb-3">{cityDisplay || "Aucune ville sélectionnée"}</h2>

                                {data?.current_weather ? (
                                    <div className="info-weather d-flex align-items-center mb-3">
                                        {data.current_weather.weather_code != null &&
                                            weatherImages[data.current_weather.weather_code] && (
                                                <img
                                                    src={weatherImages[data.current_weather.weather_code]}
                                                    alt="Weather icon"
                                                    style={{ width: "50px", height: "50px", marginRight: "10px" }}
                                                />
                                            )}
                                        <span>{data.current_weather.temperature}°C</span>
                                    </div>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </div>

                            {/* Bloc Info-Cards */}
                            <div className="info-cards-container col-9 w-100">
                                <div className="info-cards d-flex  ">
                                    <Info value={data?.current_weather?.apparent_temperature ?? "—"} title="Feels like" />
                                    <Info value={data?.current_weather?.windspeed ?? "—"} title="Wind" />
                                    <Info value={data?.current_weather?.humidity ?? "—"} title="Humidity" />
                                    <Info value={data?.current_weather?.precipitation ?? "—"} title="Precipitation" />
                                </div>
                            </div>
                        </section>

                        {/* Daily forecast */}
                        <section className="daily-forecast mt-4 container-fluid">

                            <div className="row">
                                <h2 className="fs-5 text-start">Prévisions quotidiennes</h2>
                            </div>

                            <div className="row">
                                <div className="col-12 p-0">
                                    <div className="d-flex flex-nowrap gap-1 overflow-auto pb-2">
                                        {data?.daily?.time ? (
                                            data.daily.time.map((day, index) => {
                                                const dateObj = new Date(day + "T00:00:00");
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex-shrink-0 text-white previsions"
                                                        style={{ width: "90px", minWidth: "90px", maxWidth: "90px" }}
                                                    >
                                                        <h6
                                                            className=" mb-1"
                                                            style={{ fontSize: "0.65rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",textAlign:"center" }}
                                                        >
                                                            {dateObj.toLocaleDateString("fr-FR", {
                                                                weekday: "short",
                                                                day: "numeric",
                                                                month: "short",
                                                            })}
                                                        </h6>
                                                        <Days
                                                            index={index}
                                                            data={data}
                                                            weatherImages={weatherImages}
                                                        />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p>Recherchez une ville pour voir les prévisions.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </section>
                    </div>
                </main>

            </section>
        </div>
    );
}

export default App;