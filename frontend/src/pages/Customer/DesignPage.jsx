import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Topbar from '../../features/design-tool/components/Topbar';
import ControlPanel from '../../features/design-tool/components/ControlPanel';
import DesignCanvas from '../../features/design-tool/components/DesignCanvas';
import QuickGuide from '../../features/design-tool/components/QuickGuide';
import { useAuth } from '../../context/AuthContext';
import { designService } from '../../api';
import { trackRecentView } from '../../utils/recentViews';

/**
 * DesignPage Component
 * 
 * The primary interface for customers to create custom T-shirt designs.
 * Captures design layers (images/text) and transitions to the product configuration flow 
 * by passing the 'Blueprint JSON' and 'Preview' via location state.
 */
const DesignPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [side, setSide] = useState('front');
  const [shirtStyle, setShirtStyle] = useState('crew');
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [canvas, setCanvas] = useState(null);
  const [designs, setDesigns] = useState({
    frontJSON: null,
    backJSON: null,
    frontPreview: null,
    backPreview: null
  });

  useEffect(() => {
    if (user) {
      trackRecentView(user.id, {
        id: 'new-design-' + Date.now(),
        name: 'New Custom Design',
        image: '/design/hero-shirt.png'
      });
    }
  }, [user]);

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

        <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '12px' }}>
          <button
            className="btn btnGhost"
            style={{ padding: '12px 24px', border: '1px solid var(--stroke)', background: 'var(--card)' }}
            disabled={saving}
            onClick={async () => {
              if (!canvas || !user) return;
              setSaving(true);
              try {
                canvas.discardActiveObject();
                canvas.renderAll();

                // Get current states
                const designObjs = canvas.getObjects().filter(o => o.selectable !== false);
                const currentJsonString = JSON.stringify(designObjs.map(o => o.toObject()));
                const currentPreview = canvas.toDataURL({ format: 'png', quality: 1.0 });

                const finalDesigns = {
                  ...designs,
                  [`${side}JSON`]: currentJsonString,
                  [`${side}Preview`]: currentPreview
                };

                const designData = {
                  name: `Design ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                  frontPreviewUrl: finalDesigns.frontPreview || (side === 'front' ? currentPreview : null),
                  backPreviewUrl: finalDesigns.backPreview || (side === 'back' ? currentPreview : null),
                  designJson: JSON.stringify({
                    front: finalDesigns.frontJSON ? JSON.parse(finalDesigns.frontJSON) : (side === 'front' ? JSON.parse(currentJsonString) : []),
                    back: finalDesigns.backJSON ? JSON.parse(finalDesigns.backJSON) : (side === 'back' ? JSON.parse(currentJsonString) : [])
                  })
                };

                await designService.saveDesign(user.id, designData);
                trackRecentView(user.id, {
                  id: 'saved-design-' + Date.now(),
                  name: designData.name,
                  image: designData.frontPreviewUrl || designData.backPreviewUrl
                });
                alert("🎨 Design saved successfully to 'My Designs'!");
              } catch (err) {
                console.error("Save failed:", err);
                alert("Failed to save design.");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? 'Saving...' : 'Save to My Designs'}
          </button>

          <button
            onClick={() => {
              if (canvas) {
                // Export current side before proceeding
                canvas.discardActiveObject();
                canvas.renderAll();
                const designObjs = canvas.getObjects().filter(o => o.selectable !== false);
                const currentJson = JSON.stringify(designObjs.map(o => o.toObject()));
                const currentPreview = canvas.toDataURL({ format: 'png', quality: 1.0 });

                const finalDesigns = {
                  ...designs,
                  [`${side}JSON`]: currentJson,
                  [`${side}Preview`]: currentPreview
                };

                const designSummary = {
                  frontPreview: finalDesigns.frontPreview || null,
                  backPreview: finalDesigns.backPreview || null,
                  designJSON: JSON.stringify({
                    front: finalDesigns.frontJSON ? JSON.parse(finalDesigns.frontJSON) : [],
                    back: finalDesigns.backJSON ? JSON.parse(finalDesigns.backJSON) : []
                  })
                };
                navigate('/config', { state: { designs: designSummary } });
              }
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