import CheckBoxElement from "./CheckBoxElement";
import { useState, useRef, useEffect } from 'react';
import Button from '../Button/Button';

function NodePropertyEditor({
  nodeName,
  property,
  image = null,
  handlePropChange,
  handleUpdateGraph,
}) {
  const [selectedImage, setSelectedImage] = useState(image);
  const [newProperties, setNewProperties] = useState(property);
  const [newImage, setNewImage] = useState(null);
  const [updated, setUpdated] = useState(true);
  const formRef = useRef(null);

  useEffect(() => {
    L.DomEvent.disableClickPropagation(formRef.current);
  }, []);

  const toggleProperty = (key) => {
    setUpdated(false);
    setNewProperties(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!newProperties.isLandmark && selectedImage) {
      setSelectedImage(null);
      setNewImage(null);
    }
  }, [newProperties.isLandmark]);

  return (
    // This component renders a checkbox for a specific property
    <form ref={formRef} id='manager_popup' className="pointer-events-auto fixed z-1000 top-16 left-4 bg-white p-2 shadow-lg 
                        border-none rounded inline-block max-w-60"
      onPointerDown={(e) => e.stopPropagation()}
      onSubmit={async (e) => { 
        e.preventDefault(); 
        if(updated) return;
        setUpdated(true); 
        await handleUpdateGraph(); 
        handlePropChange(nodeName, newProperties, newImage
        ) }}>
      <h2 className="text-lg font-bold">NodeManager</h2>
      <div className='border-t-1'>
        <h3 className='text-base font-medium mb-0 truncate'>{nodeName}</h3>
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
            <label className="font-semibold rounded shadow" htmlFor="nodeImage">Upload Image</label>
            <input type="file" id="nodeImage" accept="image/png, image/gif, image/jpeg" className="opacity-0 z-[-1] absolute"
              onChange={(e) => {
                setUpdated(false);
                setNewImage(e.target.files[0]);
                setSelectedImage(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {selectedImage && (<img src={selectedImage} className="w-20 h-20 rounded-full" />)}
          </>
        }
      </div>

      {!updated && (<Button type='submit' loading={false} />)}
    </form>
  );
}


export default NodePropertyEditor;