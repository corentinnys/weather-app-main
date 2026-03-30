import { useState } from "react";

// Fichier utilitaire / images : vérifie le nom exact du fichier
import images from "./weatherImages.js"; // ✅ si le fichier s'appelle exactement WeatherImages.js

// Composant React pour la sélection du jour : majuscule + extension .jsx
import DaySelector from "./DaySelector.jsx"; // ✅ si le fichier s'appelle DaySelector.jsx


export default function Hours({ data }) {
    const [selectedDay, setSelectedDay] = useState(null);

    function getWeatherImage(code, images) {
        if (code == null || !images) return null;

        // Convertir code en string pour matcher les clés
        const key = String(code);
        if (images[key]) return images[key];

        // Fallback : chercher le code le plus proche en dessous
        const keys = Object.keys(images).map(Number).sort((a, b) => a - b);
        const num = Number(code);
        const closest = keys.filter(k => k <= num).pop();
        return closest != null ? images[String(closest)] : null;
    }


    // 1️⃣ Grouper les heures par jour
    const groupedByDay = {};
    if (data?.hourly?.time && data?.hourly?.temperature_2m) {
        data.hourly.time.forEach((time, index) => {
            const date = new Date(time);
            const day = date.toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
            });

            if (!groupedByDay[day]) groupedByDay[day] = [];

            groupedByDay[day].push({
                hour: date.getHours(),
                temp: data.hourly.temperature_2m[index],
                weathercode: data.hourly.weathercode?.[index], // ✅ important
            });

        });
        console.log( groupedByDay);
    }

    const days = Object.keys(groupedByDay);



    return (
        <section>
            {/* 2️⃣ Liste des jours */}
            <DaySelector
                days={days}
                groupedByDay={groupedByDay}
                images={images}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
            />

            {/* 3️⃣ Heures du jour sélectionné */}
            {groupedByDay[selectedDay] && (
                <ul
                    style={{
                        padding: 0,
                        margin: 0,
                        listStyle: "none",

                    }}
                >
                    {groupedByDay[selectedDay].map((h, i) => {
                        const icon = images?.[h.weathercode] ?? null;

                        return (
                            <li
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%", // 👈 TRÈS IMPORTANT
                                    padding: "12px 0",
                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                    backgroundColor: "#25253F",
                                    borderRadius: "10px",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    color: "white",
                                }}
                            >
                                {/* Gauche : icône + heure */}
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {icon && (
                                        <img
                                            src={icon}
                                            alt=""
                                            style={{ width: "60px", height: "60px" }}
                                        />
                                    )}
                                    <span>{h.hour}h</span>
                                </div>

                                {/* Droite : température */}
                                <span>{h.temp}°C</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}