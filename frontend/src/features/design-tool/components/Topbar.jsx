import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Topbar = ({ side, shirtStyle }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="topbar">
            <div className="brand">
                <div className="logoDot"></div>
                <div className="titleWrap">
                    <h1>T-Shirt Design Studio</h1>
                    <p>React • Fabric.js • Spring Boot AI</p>
                </div>
            </div>

            <div className="badges" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                    <div className="theme-toggle-icons">
                        <Moon size={14} />
                        <Sun size={14} />
                    </div>
                    <div className="theme-toggle-thumb">
                        {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                    </div>
                </div>

                <div className="badge">View <span className="pill">{side.toUpperCase()}</span></div>
                <div className="badge">Style <span className="pill">{shirtStyle === "crew" ? "NO COLLAR" : "COLLAR"}</span></div>
                <div className="badge mini">Tip <span className="kbd">Select</span> object before color / delete</div>
            </div>
        </div>
    );
};

export default Topbar;
