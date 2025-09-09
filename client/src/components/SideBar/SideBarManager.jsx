import DropDown from "./Dropdown"
import InfoBar from "./InfoBar"
import { getImage, getEvents } from "../../services/api"
import { useEffect, useState } from "react"
import LoaderSimple from "../LoadingSimple"
import FilterTab from './FilterTab';


function SideBarManager({
    LandMarks = [],
    selectedNode = null,
    setSelectedNode,
    setSelectedNodeByName,
}) {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        setLoading(true);

        if (!selectedNode?.name) {
            setLoading(false);
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
        }).finally(() => {
                setLoading(false);
        });

        return () => {
            isCancelled = true;
        };

    }, [selectedNode?.name]);

    console.log('selectedNode:', selectedNode);

    return (
        <>
            {/* <FilterTab /> */}
            <DropDown
                choices={LandMarks.map(landmark => landmark.name)}
                setSelectedNodeByName={setSelectedNodeByName}
                setSelectedNode={setSelectedNode} />
            {selectedNode && (<InfoBar
                Name={selectedNode?.name ?? "Landmark Name"}
                LandmarkType={selectedNode?.type ?? "Landmark Type"}
                Image={image}
                setSelectedNode={setSelectedNode}
                selectedNode={selectedNode}
                imageLoading={loading}
                />
            )}
        </>

    )
} export default SideBarManager