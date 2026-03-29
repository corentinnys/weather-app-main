import React from "react";

function Days({ index, data, weatherImages }) {
    return (
        <div className="jours col-4" >
            {weatherImages?.[data?.daily?.weathercode?.[index]] && (
                <img
                    src={weatherImages[data.daily.weathercode[index]]}
                    alt="Weather icon"
                    style={{ width: "50px", height: "50px", marginLeft: "10px" }}
                />
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "nowrap",justifyContent:"space-between" }}>
        <span style={{ whiteSpace: "nowrap",fontSize:"0.5rem" }}>
            {data?.daily?.temperature_2m_max?.[index]}°C
        </span>
                <span style={{ whiteSpace: "nowrap" }}>
            {data?.daily?.temperature_2m_min?.[index]}°C
        </span>
            </div>
        </div>
    );
}

export default Days;