
import './App.css'
import React, { useEffect, useState } from "react";

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,apparent_temperature,wind_speed_10m,precipitation,relative_humidity_2m&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,precipitation_probability")
            .then(response => response.json())
            .then(json => setData(json));
    }, []);
console.log(data);
  return (
    <>
        <section>
            <header>
                <h1>How's the sky looking today</h1>
                <input type="search" />
                <button>Search</button>
            </header>
            <main>
                <section>
                    <div>
                        <h2>Berlin,germany</h2>
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
                    <div>
                        <h2>Tue</h2>
                        <div>
                            <span>20 </span>
                            <span>14 </span>
                        </div>

                    </div>
                    <div>
                        <h2>Wed</h2>
                        <div>
                            <span>20 </span>
                            <span>14 </span>
                        </div>

                    </div>
                    <div>
                        <h2>Tuu</h2>
                        <div>
                            <span>20 </span>
                            <span>14 </span>
                        </div>

                    </div>
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
