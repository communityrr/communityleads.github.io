import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const roofMaterials = [
  { name: 'Asphalt Shingles', color: '#8B4513' },
  { name: 'Metal Roof', color: '#C0C0C0' },
  { name: 'Clay Tiles', color: '#D2691E' },
  { name: 'Slate', color: '#2F4F4F' },
];

export function RoofVisualizer() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(roofMaterials[0]);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
    });
    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
          canvas.clear();
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyRoofMaterial = () => {
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: selectedMaterial.color,
      opacity: 0.7,
    });

    canvas.add(rect);
    canvas.renderAll();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Roof Visualizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <canvas ref={canvasRef} />
        <div className="mt-4">
          <Select
            value={selectedMaterial.name}
            onValueChange={(value) => setSelectedMaterial(roofMaterials.find(m => m.name === value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select roof material" />
            </SelectTrigger>
            <SelectContent>
              {roofMaterials.map((material) => (
                <SelectItem key={material.name} value={material.name}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={applyRoofMaterial}>Apply Material</Button>
      </CardFooter>
    </Card>
  );
}
