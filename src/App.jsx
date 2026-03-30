import React, { useState,useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Info from "./Info";
import Days from "./Days";
import Hours from "./Hours";
import "./App.css";
import weatherImages from "./weatherImages.js";
function App() {
    const [data, setData] = useState(null); // données météo
    const [city, setCity] = useState("");    // texte input ville
    const [cityDisplay, setCityDisplay] = useState(""); // nom de ville affiché


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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`;
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


    const getUserLocation = () => {
        if (!navigator.geolocation) {
            console.error("Géolocalisation non supportée");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // météo
                getWeather(lat, lon);

                try {
                    const res = await fetch(
                         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`
                    );

                    const data = await res.json();

                    setCityDisplay(`${data.city}, ${data.countryName}`);

                } catch (err) {
                    console.error("Erreur reverse geocoding :", err);
                    setCityDisplay("Erreur localisation");
                }
            },
            (error) => {
                console.error("Erreur géolocalisation :", error);
                setCityDisplay("Permission refusée");
            }
        );
    };
    useEffect(() => {
        getUserLocation();
    }, []);



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
    const today = new Date();

    const date = today.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div >
            <section className="container">
                <header className="row justify-content-center text-center">
                    <h1 className="text-white fs-1 mb-4">
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
                    <div className="col-lg-8 ">
                        {/* Current weather */}
                        <section className="container-fluid">
                            {/* Bloc Current */}
                            <div className="current d-flex flex-row  justify-content-around align-items-center mb-4">
                                <div className="d-flex flex-column">
                                    <h2 className="text-white mb-3 city fs-5">
                                        {cityDisplay || "Aucune ville sélectionnée"}
                                    </h2>
                                    <span className="fs-6 text-white d-block">{date}</span>
                                </div>

                                {data?.current_weather ? (
                                    <div className="info-weather d-flex align-items-center mb-3">
                                        {data.current_weather.weathercode != null &&
                                            weatherImages[data.current_weather.weathercode] && (
                                                <img
                                                    src={weatherImages[data.current_weather.weathercode]}
                                                    alt="Weather icon"
                                                    style={{ width: "50px", height: "50px", marginRight: "10px" }}
                                                />
                                            )}
                                        <span className="fs-1 text-white">{data.current_weather.temperature}°C</span>
                                    </div>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </div>

                            {/* Bloc Info-Cards */}
                            <div className="info-cards-container w-100">
                                <div className="info-cards d-flex gap-2 justify-content-between  ">
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
                                    <div className="d-flex  gap-2 overflow-auto justify-content-around">
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
                    <div className="col-lg-3 col-12">
                        <div className="scroll-box">
                            <Hours data={data} />
                        </div>
                       {/* <div style={{ height: "500px", overflow: "auto" }}>
                            <Hours data={data}  />
                        </div>*/}

                    </div>
                </main>
            </section>
        </div>
    );
}

export default App;