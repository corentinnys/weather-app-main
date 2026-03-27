import React from "react";

function Info({ value,title }) {
    return (
        <div className=" col-3">
            <h2 className="fs-4">{title}</h2>
            <span>{value}`</span>
        </div>
    );
}

export default Info;