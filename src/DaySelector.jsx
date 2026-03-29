import { useState } from "react";

export default function DaySelector({ days, groupedByDay, images, selectedDay, setSelectedDay }) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: "relative"}}>

            {/* Bouton */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    background: "#25253F",
                    color: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                }}
            >
                {selectedDay || "Choisir un jour"}
            </div>

            {/* Liste */}
            {open && (
                <ul
                    style={{
                        position: "absolute",
                        top: "110%",
                        width: "100%",
                        background: "#25253F",
                        borderRadius: "10px",
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        overflow: "hidden",
                        zIndex: 10,
                        color: "white",
                    }}
                >
                    {days.map((day) => {
                        const firstHour = groupedByDay[day][0];
                        const icon = images?.[firstHour?.weatherCode];

                        return (
                            <li
                                key={day}
                                onClick={() => {
                                    setSelectedDay(day);
                                    setOpen(false);
                                }}
                                style={{
                                    padding: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                {icon && (
                                    <img
                                        src={icon}
                                        alt=""
                                        style={{ width: "25px", height: "25px" }}
                                    />
                                )}
                                <span>{day}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}