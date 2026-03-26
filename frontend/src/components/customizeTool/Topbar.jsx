import React from 'react';

const Topbar = ({ side, shirtStyle }) => {
    return (
        <div className="topbar">
            <div className="brand">
                <div className="logoDot"></div>
                <div className="titleWrap">
                    <h1>T-Shirt Design Studio</h1>
                    <p>React • Fabric.js • Spring Boot AI</p>
                </div>
            </div>

            <div className="badges">
                <div className="badge">View <span className="pill">{side.toUpperCase()}</span></div>
                <div className="badge">Style <span className="pill">{shirtStyle === "crew" ? "NO COLLAR" : "COLLAR"}</span></div>
                <div className="badge mini">Tip <span className="kbd">Select</span> object before color / delete</div>
            </div>
        </div>
    );
};

export default Topbar;
