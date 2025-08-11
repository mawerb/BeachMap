import DropDown from "./Dropdown"
import InfoBar from "./InfoBar"
import { getImage, getEvents  } from "../../services/api"
import { useEffect, useState } from "react"


function SideBarManager({
    LandMarks = [],
    selectedNode = null,
    setSelectedNode,
    setSelectedNodeByName,
}) {
    const [image, setImage] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        let isCancelled = false;

        if (!selectedNode?.name) {
            setEvents([]);
            return;
        }
        console.log('Fetching events for node:', selectedNode.name);
        getEvents(selectedNode.name, 0, 10).then((data) => {
            if (isCancelled) return;
            console.log('Fetched events:', data);
            setEvents(data);
        }).catch((err) => {
            if (isCancelled) return;
            console.error('Error fetching events:', err);
        })

        return () => {
            isCancelled = true;
        };
    }, [selectedNode?.name]);

    useEffect(() => {
        let isCancelled = false;
        
        if (!selectedNode?.name) {
            setImage(null);
            return;
        }

        getImage(selectedNode?.name).then((image) => {
            if (!isCancelled) {
                console.log('loaded image:', image);
                setImage(image);
            }
        }).catch((err) => {
            if (!isCancelled) {
                console.error('Error loading image:', err);
                setImage(null);
            }
        });

        return () => {
            isCancelled = true;
        };

    }, [selectedNode?.name]);

    return (
        <>
            <DropDown
                choices={LandMarks.map(landmark => landmark.name)}
                setSelectedNodeByName={setSelectedNodeByName} 
                setSelectedNode={setSelectedNode}/>
            {selectedNode && (<InfoBar
                Name={selectedNode?.name ?? "Landmark Name"}
                Image={image}
                setSelectedNode={setSelectedNode}
                events={events} />
            )}
        </>

    )
} export default SideBarManager