import { useState } from 'react'
import placeholder from '../../assets/InfoBar/placeholder-image.jpg'
import Overview from './Overview'
import EventsTab from './EventsTab'

function InfoBar({
    Name = "Landmark Name",
    LandmarkType = "Landmark Type(building, lawn, etc..)",
    Image = placeholder,
    OverviewText = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`
    ,
    Events = ["poop", "fire"],
    setSelectedNode,
}) {

    const [selected, setSelected] = useState("events")

    const handleClicks = (e) => {
        if (e.currentTarget.value !== selected) {
            setSelected(e.currentTarget.value)
            return
        }
    }

    console.log("CURRENT IMAGE:", Image)

    return (
        <div className="absolute top-10 h-[calc(100%-2.5rem)] z-[1099]">
            <div className="relative h-full w-[21.7rem] bg-white">
                <button
                    onClick={() => setSelectedNode(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg font-bold z-10">
                    ×
                </button>
                <img src={Image} className="h-[30%] w-full" />
                <div className="ml-4">
                    <h1 className="text-2xl font-medium">{Name}</h1>
                    <h2 className="text-sm font-light text-gray-500">{LandmarkType}</h2>
                </div>
                <div className="flex border-b border-[#ECAA01] justify-around mt-5">
                    <button className="hover:bg-gray-200 w-full relative" value="overview" onClick={handleClicks}>
                        <h2 className="text-gray-500">Overview</h2>
                        {selected === "overview" && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                        h-[1px] w-[35px] border-[#ECAA01] border-1 rounded-t-full" />
                        )}
                    </button>
                    <button className="hover:bg-gray-200 w-full relative" value="events" onClick={handleClicks}>
                        <h2 className="text-gray-500">Events</h2>
                        {selected === "events" && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                        h-[1px] w-[35px] border-[#ECAA01] border-1 rounded-t-full" />
                        )}
                    </button>
                </div>
                {selected === "overview" && (<Overview text={OverviewText} />)}
                {selected === "events" && (
                    <div className="h-[57%] max-h-screen p-2 overflow-y-auto">
                        <EventsTab events={Events} />
                    </div>
                )}
            </div>
        </div>
    )

}

export default InfoBar