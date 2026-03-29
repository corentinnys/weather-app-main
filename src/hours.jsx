import { useState } from "react";
import images from "./weatherImages.js";

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
            <select
                className="form-select mb-3"
                value={selectedDay || ""}
                onChange={(e) => setSelectedDay(e.target.value)}
            >
                <option value="">Choisir un jour</option>

                {days.map((day) => (
                    <option key={day} value={day}>
                        {day}
                    </option>
                ))}
            </select>

            {/* 3️⃣ Heures du jour sélectionné */}
            {groupedByDay[selectedDay]?.map((h, i) => {

                // Calculer l'icône avant le return JSX
                const icon = images?.[h.weathercode] ?? null;
                return (
                    <div
                        key={i}
                        style={{
                            minWidth: "60px",
                            padding: "8px",
                            borderRadius: "10px",
                        }}
                    >
                        <p className="mb-1">{h.hour}h</p>

                        {/* Affichage conditionnel de l'icône */}
                        {icon && (
                            <img
                                src={icon}
                                alt={`Weather ${h.weathercode}`}
                                style={{ width: "20px", height: "20px", margin: "2px" }}
                            />
                        )}

                        <p className="mb-0">{h.temp}°C</p>
                    </div>
                );
            })}
        </section>
    );
}