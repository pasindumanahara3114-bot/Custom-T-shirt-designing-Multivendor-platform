import React from 'react';

const QuickGuide = () => {
    return (
        <div className="card rightPanel">
            <div className="cardHeader">
                <h2>Quick Guide</h2>
                <span className="pill">Innovation</span>
            </div>
            <div className="cardBody">
                <div className="hint">
                    How to use:
                </div>

                <div className="row" style={{ marginTop: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 800 }}>✅ React Transition</div>
                        <div className="hint" style={{ margin: 0 }}>Full SPA with modular components.</div>
                    </div>
                </div>

                <div className="row">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 800 }}>✅ Front / Back Editing</div>
                        <div className="hint" style={{ margin: 0 }}>Separate designs persisted in React state.</div>
                    </div>
                </div>

                <div className="row">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 800 }}>⭐ AI Background Removal</div>
                        <div className="hint" style={{ margin: 0 }}>
                            Integrated with backend Clipdrop API proxy.
                        </div>
                    </div>
                </div>

                <div className="hint" style={{ marginTop: '12px' }}>
                    Assets:
                    <br />• Crew Front/Back
                    <br />• Polo Front/Back
                </div>
            </div>
        </div>
    );
};

export default QuickGuide;
