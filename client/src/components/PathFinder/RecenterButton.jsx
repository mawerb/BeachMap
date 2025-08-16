import recenterIcon from "../../assets/recenter-icon.png"
import { useMap } from "react-leaflet"

function RecenterButton() {
    const map = useMap();
    
    return (
        <button
            className="flex justify-center items-center absolute h-12 w-12 bottom-6.5 right-15.5 border-2 border-gray-600/30 rounded-md z-[1000] bg-white hover:bg-gray-50"
            onClick={() => {
                map.flyTo([33.78184042460368, -118.11463594436647], 16);
            }}
        >
            <img src={recenterIcon} className="w-[75%] h-[75%]"/>
        </button>
    );
} export default RecenterButton