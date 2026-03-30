import React from "react";

function  Info({ value,title }) {
    return (
        <div className="p-3 info text-center" style={{ width: "150px", height: "120px" }}>
            <h2 className="fs-6 text-white">{title}</h2>
            <span className="text-white fs-4">{value}</span>
        </div>
    );
}

export default Info;