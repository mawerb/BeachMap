import CheckBoxElement from "./CheckBoxElement";
import { useState, useRef, useEffect } from 'react';
import Button from '../Button/Button';

function PropCheckbox({
  NodeName,
  Property,
  handleChangeProp,
}) {
    const [newProperties, setNewProperties] = useState(Property);
    const formRef = useRef(null);
    
    useEffect(() => {
      L.DomEvent.disableClickPropagation(formRef.current);
    }, []);

    return (
    // This component renders a checkbox for a specific property
        <form ref={formRef} id='manager_popup' className="pointer-events-auto fixed z-1000 top-16 left-4 bg-white p-2 shadow-lg 
                        border-none rounded inline-block max-w-60" 
                        onPointerDown={(e) => e.stopPropagation()}
                        onSubmit={(e) => {e.preventDefault() ; handleChangeProp(Property)}}>
          <h2 className="text-lg font-bold">NodeManager</h2>
          <div className='border-t-1'>
          <h3 className='text-base font-medium mb-0 truncate'>{NodeName}</h3>
          {Object.entries(newProperties).map(([key,value]) => (
            <CheckBoxElement
              title={key}
              onClick = {() => {setNewProperties({...newProperties, [key]: !value})} }
            />
          ))}
          </div>
          <Button type='submit' loading={false}/>
        </form>
    );
  }
  

export default PropCheckbox;