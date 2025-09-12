import { useState, useEffect } from 'react'
import placeholder from '../../assets/InfoBar/placeholder-image.jpg'
import Overview from './Overview'
import EventsTab from './EventsTab'
import { getEvents } from '../../services/api'
import LoaderSimple from '../LoadingSimple'

function InfoBar({
    Name = "Landmark Name",
    LandmarkType = "Landmark Type(building, lawn, etc..)",
    Image = placeholder,
    selectedNode = null,
    setSelectedNode,
    imageLoading,
}) {

    const [selected, setSelected] = useState("events")
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const take = 6;
    const [events, setEvents] = useState([]);

    useEffect(() => {
        let isCancelled = false;

        setHasMore(true);
        setEvents([]);
        setSkip(0);

        if (!selectedNode?.name) {
            setEvents([]);
            return;
        }
        console.log('Fetching events for node:', selectedNode.name);

        getEvents(selectedNode.name, 0, take).then((data) => {
            if (isCancelled) return;
            console.log('Fetched events:', data);
            setEvents(data);

            setSkip(data.length);

            if (data.length < take) {
                setHasMore(false);
            }

        }).catch((err) => {
            if (isCancelled) return;
            console.error('Error fetching events:', err);
        })

        return () => {
            isCancelled = true;
        };
    }, [selectedNode?.name]);

    const fetchNodes = async (skipCount, takeCount) => {
        if (loading) return;
        setLoading(true);
        try {
            const data = await getEvents(selectedNode.name, skipCount, takeCount);
            setEvents((prevEvents) => [...prevEvents, ...data]);

            setSkip(prevSkip => prevSkip + data.length)

            if (data.length < takeCount) setHasMore(false)
        } catch (err) {
            console.error('Fetch error:', err)
        } finally {
            setLoading(false);
        }
    }

    const handleScroll = async (e) => {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
            if (loading || !hasMore) return;

            fetchNodes(skip, take);
        }
    }
    console.log("Current Node:", selectedNode)

    const handleClicks = (e) => {
        if (e.currentTarget.value !== selected) {
            setSelected(e.currentTarget.value)
            return
        }
    }

    console.log("CURRENT IMAGE:", Image)

    return (
        <div className="absolute top-9 md:top-11 left-0 bottom-0 z-[1099]">
            <div className="relative h-full w-screen md:w-[21.7rem]  bg-white flex flex-col">
                {loading && (
                    <div className="absolute inset-0">
                        <LoaderSimple
                            text={"Loading events..."}
                            style={"h-full w-full"}
                            useAbsolute={true}
                        />
                    </div>
                )
                }
                {!loading && imageLoading && (
                    <div className="absolute inset-0">
                        <LoaderSimple
                            text={"Loading image..."}
                            style={"h-full w-full"}
                            useAbsolute={true}
                            />
                    </div>
                )}
                <button
                    onClick={() => setSelectedNode(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black 
                    text-5xl sm:text-3xl font-bold z-10">
                    ×
                </button>
                <img src={Image} className="w-full h-[30%] object-cover md:w-full md:max-w-full" />
                <div className="ml-4 flex-shrink-0">
                    <h1 className="text-xl lg:text-2xl font-medium line-clamp-2">{Name}</h1>
                    <h2 className="text-sm font-light text-gray-500">{LandmarkType}</h2>
                </div>
                <div className="flex border-b border-[#ECAA01] justify-around mt-5 flex-shrink-0">
                    <button className="hover:bg-gray-100 w-full relative" value="events" onClick={handleClicks}>
                        <h2 className="text-gray-500">Events</h2>
                        {selected === "events" && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                        h-[1px] w-[35px] border-[#ECAA01] border-1 rounded-t-full" />
                        )}
                    </button>
                    <button className="hover:bg-gray-100 w-full relative" value="overview" onClick={handleClicks}>
                        <h2 className="text-gray-500">Overview</h2>
                        {selected === "overview" && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                        h-[1px] w-[35px] border-[#ECAA01] border-1 rounded-t-full" />
                        )}
                    </button>
                </div>
                {selected === "overview" && (
                    <div className="flex-1 max-h-screen overflow-y-auto">
                        <Overview overview={selectedNode.overview} />
                    </div>
                )}
                {selected === "events" && (
                    <div className="flex-1 max-h-screen overflow-y-auto relative" onScroll={handleScroll}>
                        <EventsTab events={events} selectedNode={selectedNode} />
                    </div>
                )}
            </div>
        </div>
    )

}

export default InfoBar