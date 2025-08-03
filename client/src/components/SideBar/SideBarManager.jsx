import DropDown from "./Dropdown"
import InfoBar from "./InfoBar"
import { getImage } from "../../services/api"
import { useEffect, useState } from "react"


function SideBarManager({
    LandMarks = [],
    selectedNode = null,
    setSelectedNode,
    setSelectedNodeByName,
}) {
    const [image, setImage] = useState(null);

    const loadImage = async (name) => {
        console.log('hello!', name)
        if (!name) return null;
        try {
            const image = await getImage(name);
            return image;
        } catch (err) {
            console.error('Error loading image:', err);
            return null;
        }
    }

    useEffect(() => {

        const handleImageLoading = async (name) => {
            if (!name) return null;
            const image = await loadImage(name);
            if (image) {
                console.log('loaded image:', image)
                setImage(image);
                return;
            } else {
                console.error(`Image for ${name} not found.`);
                return null;
            }
        }
        handleImageLoading(selectedNode?.name);

    }, [selectedNode?.name])

    console.log(selectedNode)
    return (
        <>
            <DropDown
                choices={LandMarks.map(landmark => landmark.name)}
                setSelectedNodeByName={setSelectedNodeByName} />
            {selectedNode && (<InfoBar
                Name={selectedNode?.name ?? "Landmark Name"}
                Image={image}
                setSelectedNode={setSelectedNode} />
            )}
        </>

    )
} export default SideBarManager