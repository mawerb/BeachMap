import CheckBoxElement from "./CheckBoxElement";
import { useState, useRef, useEffect } from 'react';
import Button from '../Button/Button';
import { useNodeManager } from "../../context/NodeManager";

function NodePropertyEditor({
  nodeName,
  property,
  landmarkType = null,
  overview,
  image = null,
  handlePropChange,
  setShowPropEditor,
}) {
  const [selectedImage, setSelectedImage] = useState(image);
  const [selectedType, setSelectedType] = useState(landmarkType || 'default');
  const [newProperties, setNewProperties] = useState(property);
  const [newOverview, setNewOverview] = useState(overview);
  const [newImage, setNewImage] = useState(null);

  const formRef = useRef(null);

  const {
    updated,
    setUpdated,
  } = useNodeManager()

  useEffect(() => {
    L.DomEvent.disableClickPropagation(formRef.current);
  }, []);

  const toggleProperty = (key) => {
    setUpdated(false);
    setNewProperties(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateOverview = (e) => {
    setNewOverview(e.target.value)
    setUpdated(false)
  }

  useEffect(() => {
    if (!newProperties.isLandmark && selectedImage) {
      setSelectedImage(null);
      setNewImage(null);
    }
  }, [newProperties.isLandmark]);

  return (
    // This component renders a checkbox for a specific property
    <form ref={formRef} id='manager_popup'
      className="pointer-events-auto fixed z-1000
                  top-16 left-4 bg-gray-200/80 backdrop-blur-sm drop-shadow-lg p-2 shadow-lg 
                  border-none rounded inline-block max-w-60"
      onPointerDown={(e) => e.stopPropagation()}
      onSubmit={async (e) => {
        e.preventDefault();
        if (updated) return;
        await new Promise(resolve => setTimeout(resolve, 0))
        handlePropChange(nodeName, newProperties, newImage, selectedType, newOverview
        )
      }}>
      <button
        onClick={() => setShowPropEditor(false)}
        className="absolute top-0 right-2 text-gray-500 hover:text-black text-lg font-bold z-10">
        ×
      </button>
      <h2 className="text-lg font-bold">
        NodeManager
      </h2>
      <div className='border-t-1'>
        <h3 className='text-base font-medium mb-0 truncate'>
          {nodeName}
        </h3>

        <select
          className="border"
          value={selectedType}
          onChange={(e) => { setSelectedType(e.target.value); setUpdated(false); }}
        >
          <option value="default" className="" disabled selected>
            Landmark Type
          </option>
          <option value="Building">
            Building
          </option>
          <option value="Lawn">
            Lawn
          </option>
          <option value="Parking">
            Parking
          </option>
          <option value="Study Zone">
            Study Zone
          </option>
          <option value="Food Spot">
            Food Spot
          </option>
          <option value="Dorm">
            Dorm
          </option>
          <option value="Sports Stadium">
            Sports Stadium
          </option>
          <option value="Recreation">
            Recreation
          </option>
          <option value="Services">
            Services
          </option>

        </select>

        <div className="mt-2">
          <h3 className="font-semibold">Overview:</h3>
          <textarea
            value={newOverview}
            onChange={(e) => { updateOverview(e); }}
            id="overview"
            className="border block"
            rows="4"
            cols="19">
          </textarea>
        </div>
        {Object.entries(newProperties).map(([key, value]) => (
          <CheckBoxElement
            title={key}
            key={key}
            onClick={() => toggleProperty(key)}
            checked={value}
          />
        ))}
        {newProperties.isLandmark &&
          <>
            <label
              className="font-semibold rounded shadow"
              htmlFor="nodeImage">
              Upload Image
            </label>
            <input
              type="file"
              id="nodeImage"
              accept="image/png, image/gif, image/jpeg"
              className="opacity-0 z-[-1] absolute"
              onChange={(e) => {
                setUpdated(false);
                setNewImage(e.target.files[0]);
                setSelectedImage(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {selectedImage && (
              <img
                src={selectedImage}
                className="w-20 h-20 rounded-full"
              />)}
          </>
        }
      </div>

      {!updated && (
        <Button
          type='submit'
          loading={false}
        />)}
    </form>
  );
}


export default NodePropertyEditor;