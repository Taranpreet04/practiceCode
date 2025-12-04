import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text, Transformer, Image } from "react-konva";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

const Editor = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();

  // Convert Canvas Barcode into Image
  const createBarcode = (text, callback) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE128" });
    callback(canvas.toDataURL());
  };

  // Generate QR Code → Image URL
  const createQR = async (text) => {
    return await QRCode.toDataURL(text);
  };

  // Add TEXT
  const addText = () => {
    setShapes([
      ...shapes,
      {
        id: "text_" + Date.now(),
        type: "text",
        x: 50,
        y: 50,
        text: "Your Text",
        fontSize: 24,
        fill: "black",
      },
    ]);
  };

  // Add RECTANGLE
  const addRect = () => {
    setShapes([
      ...shapes,
      {
        id: "rect_" + Date.now(),
        type: "rect",
        x: 100,
        y: 100,
        width: 150,
        height: 80,
        fill: "skyblue",
      },
    ]);
  };

  // Add CIRCLE
  const addCircle = () => {
    setShapes([
      ...shapes,
      {
        id: "circle_" + Date.now(),
        type: "circle",
        x: 200,
        y: 200,
        radius: 50,
        fill: "pink",
      },
    ]);
  };

  // Add QR CODE
  const addQRCode = async () => {
    const url = await createQR("Hello QR");
    setShapes([
      ...shapes,
      {
        id: "qr_" + Date.now(),
        type: "image",
        x: 150,
        y: 150,
        width: 120,
        height: 120,
        src: url,
      },
    ]);
  };

  // Add BARCODE
  const addBarcode = () => {
    createBarcode("123456789", (url) => {
      setShapes([
        ...shapes,
        {
          id: "barcode_" + Date.now(),
          type: "image",
          x: 150,
          y: 150,
          width: 250,
          height: 80,
          src: url,
        },
      ]);
    });
  };

  // Delete selected
  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes(shapes.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  // EXPORT PNG
  const exportPNG = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = uri;
    link.click();
  };

  // EXPORT JSON
  const exportJSON = () => {
    const json = JSON.stringify(shapes);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.download = "canvas.json";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const ShapeComponent = ({ shape }) => {
    const shapeRef = useRef();
    const trRef = useRef();
    const [img] = useState(() => new window.Image());

    useEffect(() => {
      if (shape.type === "image") {
        img.src = shape.src;
        img.onload = () => {
          shapeRef.current.getLayer().batchDraw();
        };
      }
    }, [shape]);

    useEffect(() => {
      if (selectedId === shape.id) {
        trRef.current?.nodes([shapeRef.current]);
        trRef.current?.getLayer().batchDraw();
      }
    }, [selectedId]);

    const commonProps = {
      ref: shapeRef,
      id: shape.id,
      draggable: true,
      onClick: () => setSelectedId(shape.id),
      onTap: () => setSelectedId(shape.id),

      onDragEnd: (e) => {
        setShapes((prev) =>
          prev.map((s) =>
            s.id === shape.id
              ? { ...s, x: e.target.x(), y: e.target.y() }
              : s
          )
        );
      },

      onTransformEnd: () => {
        const node = shapeRef.current;

        setShapes((prev) =>
          prev.map((s) => {
            if (s.id === shape.id) {
              return {
                ...s,
                x: node.x(),
                y: node.y(),
                scaleX: node.scaleX(),
                scaleY: node.scaleY(),
                width: node.width(),
                height: node.height(),
              };
            }
            return s;
          })
        );
      },
    };

    return (
      <>
        {shape.type === "rect" && <Rect {...shape} {...commonProps} />}
        {shape.type === "circle" && <Circle {...shape} {...commonProps} />}
        {shape.type === "text" && <Text {...shape} {...commonProps} />}
        {shape.type === "image" && <Image {...shape} image={img} {...commonProps} />}

        {selectedId === shape.id && (
          <Transformer
            ref={trRef}
            rotateEnabled={true}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
          />
        )}
      </>
    );
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 200 }}>
        <h3>Tools</h3>
        <button onClick={addText}>Add Text</button><br /><br />
        <button onClick={addRect}>Add Rectangle</button><br /><br />
        <button onClick={addCircle}>Add Circle</button><br /><br />
        <button onClick={addQRCode}>Add QR Code</button><br /><br />
        <button onClick={addBarcode}>Add Barcode</button><br /><br />
        <button onClick={deleteSelected}>Delete Selected</button><br /><br />
        <button onClick={exportPNG}>Download PNG</button><br /><br />
        <button onClick={exportJSON}>Download JSON</button>
      </div>

      <Stage
        width={900}
        height={550}
        ref={stageRef}
        style={{ border: "1px solid #aaa" }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) setSelectedId(null);
        }}
      >
        <Layer>
          {shapes.map((shape) => (
            <ShapeComponent key={shape.id} shape={shape} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Editor;
