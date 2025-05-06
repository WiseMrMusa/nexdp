"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResizableBox } from "react-resizable";
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import "react-resizable/css/styles.css";
import { ChevronDown, ChevronRight, Image, Type, GripVertical, Trash2, Upload, Save, Eye, EyeOff, Layers, Settings, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConfigArea {
  id: string;
  type: "image" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
}

function DraggableArea({ area, onDragEnd }: { area: ConfigArea; onDragEnd: (id: string, x: number, y: number) => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: area.id,
    data: area,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: area.x,
        top: area.y,
        ...style,
      }}
      {...listeners}
      {...attributes}
    >
      <ResizableBox
        width={area.width}
        height={area.height}
        minConstraints={[100, 100]}
        maxConstraints={[800, 800]}
        resizeHandles={["se", "sw", "ne", "nw"]}
      >
        <div className="w-full h-full bg-blue-500/20 flex items-center justify-center cursor-move">
          <span className="text-sm text-blue-700">
            {area.type === "image" ? "Image Area" : "Text Area"}
          </span>
        </div>
      </ResizableBox>
    </div>
  );
}

export default function TemplateConfigPage() {
  const router = useRouter();
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [configAreas, setConfigAreas] = useState<ConfigArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplateImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddConfigArea = (type: "image" | "text") => {
    const newArea = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 0,
      y: 0,
      width: 200,
      height: 200,
    };
    setConfigAreas([...configAreas, newArea]);
    setSelectedArea(newArea.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    const area = configAreas.find(a => a.id === active.id);
    if (area) {
      const newAreas = configAreas.map(a =>
        a.id === active.id
          ? { ...a, x: a.x + delta.x, y: a.y + delta.y }
          : a
      );
      setConfigAreas(newAreas);
    }
  };

  const handleResizeStop = useCallback((id: string, size: { width: number; height: number }) => {
    setConfigAreas(areas =>
      areas.map(area =>
        area.id === id ? { ...area, width: size.width, height: size.height } : area
      )
    );
  }, []);

  const handleAreaClick = (id: string) => {
    setSelectedArea(id);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="h-12 border-b bg-white flex items-center px-4 gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        <div className="h-6 w-px bg-gray-200 mx-2" />
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <div className="h-6 w-px bg-gray-200 mx-2" />
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Layers Panel */}
        <div className="w-64 border-r bg-white flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="font-medium">Layers</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddConfigArea("image")}
                className="h-8 w-8 p-0"
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddConfigArea("text")}
                className="h-8 w-8 p-0"
              >
                <Type className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {configAreas.map((area) => (
                <div
                  key={area.id}
                  className={`group flex items-center gap-2 p-2 rounded-md transition-colors ${
                    selectedArea === area.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleAreaClick(area.id)}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  {area.type === "image" ? (
                    <Image className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Type className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="flex-1 text-sm font-medium truncate">
                    {area.type === "image" ? "Image Area" : "Text Area"}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfigAreas(areas => areas.filter(a => a.id !== area.id));
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            <Card className="p-6 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-upload">Upload Template Image</Label>
                  <Input
                    id="template-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                </div>
                
                {templateImage && (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={templateImage}
                      alt="Template"
                      className="w-full h-auto"
                    />
                    <DndContext
                      sensors={sensors}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToParentElement]}
                    >
                      {configAreas.map((area) => (
                        <DraggableArea
                          key={area.id}
                          area={area}
                          onDragEnd={handleDragEnd}
                        />
                      ))}
                    </DndContext>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-l bg-white flex flex-col">
          <div className="p-3 border-b flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="font-medium">Properties</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedArea ? (
              <div className="space-y-4">
                {configAreas.map((area) => (
                  area.id === selectedArea && (
                    <>
                      <div>
                        <Label>Position</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Input
                              type="number"
                              value={area.x}
                              onChange={(e) => {
                                const newAreas = configAreas.map((a) =>
                                  a.id === area.id
                                    ? { ...a, x: parseInt(e.target.value) }
                                    : a
                                );
                                setConfigAreas(newAreas);
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={area.y}
                              onChange={(e) => {
                                const newAreas = configAreas.map((a) =>
                                  a.id === area.id
                                    ? { ...a, y: parseInt(e.target.value) }
                                    : a
                                );
                                setConfigAreas(newAreas);
                              }}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Size</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Input
                              type="number"
                              value={area.width}
                              onChange={(e) => {
                                const newAreas = configAreas.map((a) =>
                                  a.id === area.id
                                    ? { ...a, width: parseInt(e.target.value) }
                                    : a
                                );
                                setConfigAreas(newAreas);
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={area.height}
                              onChange={(e) => {
                                const newAreas = configAreas.map((a) =>
                                  a.id === area.id
                                    ? { ...a, height: parseInt(e.target.value) }
                                    : a
                                );
                                setConfigAreas(newAreas);
                              }}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-8">
                Select a layer to view properties
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 