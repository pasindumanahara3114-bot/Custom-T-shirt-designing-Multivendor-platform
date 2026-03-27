import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/customizeTool/Topbar';
import ControlPanel from '../components/customizeTool/ControlPanel';
import DesignCanvas from '../components/customizeTool/DesignCanvas';
import QuickGuide from '../components/customizeTool/QuickGuide';

const DesignPage = () => {
  const navigate = useNavigate();

  const [side, setSide] = useState('front');
  const [shirtStyle, setShirtStyle] = useState('crew');
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [canvas, setCanvas] = useState(null);
  const [designs, setDesigns] = useState({
    front: null,
    back: null
  });

  return (
    <div className="app-container">
      <Topbar side={side} shirtStyle={shirtStyle} />

      <div className="layout">
        <ControlPanel
          side={side}
          setSide={setSide}
          shirtStyle={shirtStyle}
          setShirtStyle={setShirtStyle}
          shirtColor={shirtColor}
          setShirtColor={setShirtColor}
          canvas={canvas}
          designs={designs}
          setDesigns={setDesigns}
        />

        <DesignCanvas
          side={side}
          shirtStyle={shirtStyle}
          shirtColor={shirtColor}
          onCanvasReady={setCanvas}
          designs={designs}
          setDesigns={setDesigns}
        />

        <QuickGuide />
      </div>

      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <button onClick={() => navigate('/config')} style={{ padding: '10px 20px' }}>
          Next: Configure Product →
        </button>
      </div>
    </div>
  );
};

export default DesignPage;