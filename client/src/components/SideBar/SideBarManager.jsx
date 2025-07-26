import DropDown from "./Dropdown"

function SideBarManager({
    LandMarks = [],
}) {
    return (
        <DropDown choices={LandMarks.map(landmark => landmark.name)}/>
    )
} export default SideBarManager