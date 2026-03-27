import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const DesignCanvas = ({
    side,
    shirtStyle,
    shirtColor,
    onCanvasReady,
    designs
}) => {
    const canvasRef = useRef(null);
    const canvasInstance = useRef(null);
    const shirtImgRef = useRef(null);

    const CANVAS_W = 520;
    const CANVAS_H = 640;

    // ✅ INIT CANVAS
    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: CANVAS_W,
            height: CANVAS_H,
            backgroundColor: '#f3f4f6'
        });

        canvasInstance.current = canvas;
        onCanvasReady(canvas);

        return () => canvas.dispose();
    }, []);

    // ✅ LOAD SHIRT WHEN CHANGE
    useEffect(() => {
        if (!canvasInstance.current) return;
        loadShirt();
    }, [side, shirtStyle]);

    // ✅ APPLY COLOR
    useEffect(() => {
        applyTint();
    }, [shirtColor]);

    // ✅ IMAGE PATH
    const getShirtFile = () => {
        if (shirtStyle === 'crew') {
            return side === 'front'
                ? '/design/crew-front.png'
                : '/design/crew-back.png';
        }
        return side === 'front'
            ? '/design/polo-front.png'
            : '/design/polo-back.png';
    };

    // 🔥 FIXED IMAGE LOADER
    const loadShirt = () => {
        const canvas = canvasInstance.current;
        if (!canvas) return;

        const url = getShirtFile();
        console.log("🔥 Loading:", url);

        fabric.Image.fromURL(
            url,
            (img) => {
                const currentCanvas = canvasInstance.current;
                if (!img || !currentCanvas) {
                    console.warn("⚠️ Image loaded but canvas is null or disposed");
                    return;
                }

                try {
                    currentCanvas.clear();
                } catch (e) {
                    console.error("❌ Failed to clear canvas (likely disposed):", e);
                    return;
                }

                img.set({
                    selectable: false,
                    evented: false
                });

                // ✅ SCALE FIX
                const scale = Math.min(
                    CANVAS_W / img.width,
                    CANVAS_H / img.height
                );

                img.scale(scale);

                // ✅ CENTER FIX
                img.set({
                    left: (CANVAS_W - img.getScaledWidth()) / 2,
                    top: (CANVAS_H - img.getScaledHeight()) / 2
                });

                shirtImgRef.current = img;

                currentCanvas.add(img);
                currentCanvas.sendToBack(img);

                console.log("✅ Image loaded successfully");

                applyTint(); // applyTint already uses canvasInstance.current
                restoreDesign(); // restoreDesign already uses canvasInstance.current

                currentCanvas.renderAll();
            },
            {
                crossOrigin: 'anonymous' // 🔥 IMPORTANT
            }
        );
    };

    // ✅ COLOR APPLY
    const applyTint = () => {
        const canvas = canvasInstance.current;
        const img = shirtImgRef.current;

        if (!canvas || !img) return;

        if (shirtColor.toLowerCase() === '#ffffff') {
            img.filters = [];
        } else {
            img.filters = [
                new fabric.Image.filters.BlendColor({
                    color: shirtColor,
                    mode: 'multiply',
                    alpha: 0.8
                })
            ];
        }

        img.applyFilters();
        canvas.renderAll();
    };

    // ✅ RESTORE DESIGN
    const restoreDesign = () => {
        const canvas = canvasInstance.current;
        const json = designs?.[side];

        if (!json || !canvas) return;

        const objs = JSON.parse(json);

        fabric.util.enlivenObjects(objs, (objects) => {
            objects.forEach(obj => {
                canvas.add(obj);
                obj.bringToFront();
            });
            canvas.renderAll();
        });
    };

    return (
        <div className="card canvasPanel">
            <div className="cardHeader">
                <h2>Canvas</h2>
            </div>

            <canvas ref={canvasRef} />
        </div>
    );
};

export default DesignCanvas;