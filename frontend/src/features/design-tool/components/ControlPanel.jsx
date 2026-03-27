import React from 'react';
import axios from 'axios';
import * as fabricModule from 'fabric';

// Handle both ESM and CJS import styles
const fabric = fabricModule.fabric || fabricModule;

const ControlPanel = ({
    side,
    setSide,
    shirtStyle,
    setShirtStyle,
    shirtColor,
    setShirtColor,
    canvas,
    designs,
    setDesigns
}) => {

    const handleTextAdd = () => {
        if (!canvas) return;
        const text = new fabric.Textbox('Your Text', {
            left: 150,
            top: 240,
            width: 220,
            fontSize: 34,
            fill: '#000000',
            fontWeight: 'bold'
        });
        canvas.add(text);
        text.bringToFront();
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const handleTextColor = (e) => {
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj && (obj.type === 'textbox' || obj.type === 'text')) {
            obj.set('fill', e.target.value);
            canvas.renderAll();
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !canvas) return;

        const removeBg = document.getElementById("removeBgChk").checked;

        if (removeBg) {
            try {
                const formData = new FormData();
                formData.append("image", file);
                const response = await axios.post("/api/bg-remove", formData, {
                    responseType: 'blob'
                });

                const imageURL = URL.createObjectURL(response.data);
                addImgToCanvas(imageURL);
            } catch (err) {
                alert("AI Background Removal failed: " + err.message);
            }
        } else {
            const reader = new FileReader();
            reader.onload = (event) => addImgToCanvas(event.target.result);
            reader.readAsDataURL(file);
        }
        e.target.value = "";
    };

    const addImgToCanvas = (url) => {
        fabric.Image.fromURL(url, (img) => {
            img.scaleToWidth(150);
            img.set({ left: 185, top: 200 });
            canvas.add(img);
            img.bringToFront();
            canvas.setActiveObject(img);
            canvas.renderAll();
        });
    };

    const handleDelete = () => {
        const obj = canvas?.getActiveObject();
        if (obj && (obj.type !== 'image' || obj.selectable !== false)) {
            canvas.remove(obj);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    };

    const handleExport = () => {
        if (!canvas) return;
        canvas.discardActiveObject();
        canvas.renderAll();
        const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `tshirt-${shirtStyle}-${side}.png`;
        a.click();
    };

    const handleSideSwitch = (newSide) => {
        if (newSide === side) return;

        // Save current
        const designObjs = canvas.getObjects().filter(o => o.selectable !== false);
        const json = JSON.stringify(designObjs.map(o => o.toObject()));
        setDesigns(prev => ({ ...prev, [side]: json }));

        setSide(newSide);
    };

    return (
        <div className="card leftPanel">
            <div className="cardHeader">
                <h2>Controls</h2>
                <span className="pill">React Version</span>
            </div>
            <div className="cardBody">
                <div className="groupTitle">Shirt</div>
                <label style={{ fontSize: '13px', color: '#e5e7eb', marginBottom: '6px', fontWeight: 700 }}>T-shirt Style</label>
                <select
                    id="shirtStyle"
                    className="field"
                    value={shirtStyle}
                    onChange={(e) => setShirtStyle(e.target.value)}
                >
                    <option value="crew">No Collar (Crew Neck)</option>
                    <option value="polo">Collar (Polo)</option>
                </select>
                <div className="hint">Switch between collar and no-collar shirt template.</div>

                <div className="grid2">
                    <button className={`btn btnGhost ${side === 'front' ? 'active' : ''}`} onClick={() => handleSideSwitch('front')}>Front Side</button>
                    <button className={`btn btnGhost ${side === 'back' ? 'active' : ''}`} onClick={() => handleSideSwitch('back')}>Back Side</button>
                </div>

                <div className="row">
                    <label>
                        Shirt Tint
                        <span>Applies to whole shirt</span>
                    </label>
                    <input type="color" value={shirtColor} onChange={(e) => setShirtColor(e.target.value)} />
                </div>

                <div className="groupTitle">Design</div>
                <button className="btn" onClick={handleTextAdd}>+ Add Text</button>

                <div className="row">
                    <label>
                        Text Color
                        <span>Select text first</span>
                    </label>
                    <input type="color" defaultValue="#000000" onChange={handleTextColor} />
                </div>

                <label style={{ fontSize: '13px', color: '#e5e7eb', marginTop: '10px', display: 'block', fontWeight: 700 }}>Add Logo (PNG/JPG)</label>
                <input className="field" type="file" accept="image/*" onChange={handleFileUpload} />

                <div className="toggle">
                    <input type="checkbox" id="removeBgChk" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#f3f4f6' }}>AI Remove Background</div>
                        <div className="hint" style={{ margin: 0 }}>Integrated with Spring Boot API.</div>
                    </div>
                </div>

                <div className="grid2" style={{ marginTop: '10px' }}>
                    <button className="btn btnWarn" onClick={handleDelete}>Delete Selected</button>
                    <button className="btn btnGood" onClick={handleExport}>Export PNG</button>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
