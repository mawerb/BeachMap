import { Marker, useMap } from 'react-leaflet';
import pointImg from '../../assets/point.png';



function NodeMarker({
    name,
    node,
    index,
    coords,
    setSelectedNode,
}) {

    const pointIcon = L.icon({
        iconUrl: pointImg,
        iconSize: [8, 8],
    });

    const curr_map = useMap();
    return (
        <Marker
            key={index}
            icon={pointIcon}
            title={name}
            id={name}
            position={coords}
            eventHandlers={{
                click: () => {
                    setSelectedNode(null);
                    setSelectedNode(node);
                },
            }}
        />
    );
} export default NodeMarker;