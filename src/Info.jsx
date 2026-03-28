import React from "react";

function Info({ value,title }) {
    return (
        <div className="col-2 p-2 info height-100">
            <h2 className="fs-6  text-white">{title}</h2>
            <span className="text-white">{value}`</span>
        </div>
    );
}

export default Info;