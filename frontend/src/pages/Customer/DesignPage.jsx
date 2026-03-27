import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Topbar from '../../features/design-tool/components/Topbar';
import ControlPanel from '../../features/design-tool/components/ControlPanel';
import DesignCanvas from '../../features/design-tool/components/DesignCanvas';
import QuickGuide from '../../features/design-tool/components/QuickGuide';

/**
 * DesignPage Component
 * 
 * The primary interface for customers to create custom T-shirt designs.
 * Captures design layers (images/text) and transitions to the product configuration flow 
 * by passing the 'Blueprint JSON' and 'Preview' via location state.
 */
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
    <MainLayout>
      <div className="design-page-content">
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
          <button
            onClick={() => {
              // Extract design summary for the order flow
              const designSummary = {
                frontPreview: designs.front || shirtColor, // Fallback to color if no design
                backPreview: designs.back,
                designJSON: JSON.stringify({
                  elements: [
                    { type: 'image', src: designs.front, printArea: 'Front', dpi: 300 },
                    { type: 'text', text: 'Custom Text', fontFamily: 'Arial', fontSize: 24, printArea: 'Front' }
                  ]
                })
              };
              navigate('/config', { state: { designs: designSummary } });
            }}
            className="primaryBtn"
            style={{ padding: '12px 24px' }}
          >
            Next: Configure Product →
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default DesignPage;